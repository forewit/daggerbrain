import { command, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { getDb } from '$lib/server/db';
import { listCharacters } from '$lib/server/db/repositories/characters';

function getAuthContext() {
	const event = getRequestEvent();
	if (!event) {
		throw new Error('No request event');
	}
	const auth = event.locals.auth?.();
	if (!auth?.userId) {
		throw new Error('Unauthorized');
	}
	return { event, auth };
}

const uploadImageSchema = z.object({
	characterId: z.string(),
	imageData: z.string() // base64 data URL
});

export const uploadCharacterImage = command(uploadImageSchema, async ({ characterId, imageData }) => {
	const { event, auth } = getAuthContext();
	
	// Verify character belongs to user
	const db = getDb(event);
	const characters = await listCharacters(db, auth.userId);
	const character = characters.find(c => c.uid === characterId);
	if (!character) {
		throw new Error('Character not found or does not belong to user');
	}
	
	// Get R2 bucket
	const r2 = event.platform?.env?.R2;
	if (!r2) {
		throw new Error('R2 bucket not configured');
	}
	
	// Parse base64 data URL
	const base64Data = imageData.split(',')[1];
	if (!base64Data) {
		throw new Error('Invalid image data');
	}
	
	const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
	
	// Determine content type from data URL
	const mimeMatch = imageData.match(/data:([^;]+);/);
	const contentType = mimeMatch ? mimeMatch[1] : 'image/png';
	
	// Generate unique filename
	const extension = contentType.split('/')[1] || 'png';
	const filename = `characters/${auth.userId}/${characterId}-${Date.now()}.${extension}`;
	
	// Upload to R2
	await r2.put(filename, imageBuffer, {
		httpMetadata: {
			contentType
		},
		customMetadata: {
			userId: auth.userId,
			characterId
		}
	});
	
	// Return public URL via our API route
	const publicUrl = `/api/images/${filename}`;
	
	return { url: publicUrl };
});

