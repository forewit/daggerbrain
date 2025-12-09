import { command, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { get_r2_usercontent, get_auth } from './utils';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const imageDataSchema = z
	.object({
		data: z.string(), // base64 encoded image data
		name: z.string(),
		type: z.string()
	})
	.refine(
		(obj) => {
			// Validate size (base64 is ~33% larger than binary)
			const sizeInBytes = (obj.data.length * 3) / 4;
			return sizeInBytes <= MAX_IMAGE_SIZE;
		},
		{
			message: `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
		}
	)
	.refine((obj) => obj.type.startsWith('image/'), {
		message: 'File must be an image'
	});

export const upload_user_image = command(imageDataSchema, async ({ data, name, type }) => {
	console.log('uploadImage');

	const event = getRequestEvent();
	const { userId } = get_auth(event);
	const r2 = get_r2_usercontent(event);

	// Decode base64 to ArrayBuffer
	const binaryString = atob(data);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	// Generate a unique key for the image
	const fileExtension = name.split('.').pop() || 'bin';
	const imageKey = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

	// Upload to R2 usercontent bucket
	await r2.put(imageKey, bytes.buffer, {
		httpMetadata: {
			contentType: type
		}
	});

	// Generate the URL for the image
	const url = new URL(`/api/usercontent/images/${imageKey}`, event.url.origin);

	return url.toString();
});
