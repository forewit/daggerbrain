import { command, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { get_r2_usercontent, get_userId } from './utils';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const imageFileSchema = z
	.instanceof(File, {
		message: 'Invalid file provided'
	})
	.refine((file) => file.size <= MAX_IMAGE_SIZE, {
		message: `Image size must be less than or equal to ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
	})
	.refine((file) => file.type.startsWith('image/'), {
		message: 'File must be an image'
	});

export const save_user_image = command(imageFileSchema, async (file) => {
	console.log('save_image');

	const event = getRequestEvent();
	const userId = get_userId(event);
	const r2 = get_r2_usercontent(event);

	// Generate a unique key for the image
	// Format: {userId}/{uuid}.{extension}
	const fileExtension = file.name.split('.').pop() || 'bin';
	const imageKey = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

	// Convert File to ArrayBuffer for R2 upload
	const arrayBuffer = await file.arrayBuffer();

	// Upload to R2 usercontent bucket
	await r2.put(imageKey, arrayBuffer, {
		httpMetadata: {
			contentType: file.type
		}
	});

	// Generate the URL for the image (served from usercontent route)
	const url = new URL(`/api/usercontent/images/${imageKey}`, event.url.origin);

	return url.toString();
});
