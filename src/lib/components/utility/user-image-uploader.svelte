<script lang="ts">
	import { getUserContext } from '$lib/state/user.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { cn } from '$lib/utils';

	let {
		placeholderImage: placeholderUrl = '/images/art/placeholder-art.webp',
		autoUpload = false,
		id,
		alt = 'Image preview',
		onUpload = () => {},
		onSelect = () => {},
		disabled = false,
		class: className = ''
	}: {
		placeholderImage?: string;
		autoUpload?: boolean;
		onUpload?: (url: string) => void;
		onSelect?: (file: File) => void;
		id?: string;
		alt?: string;
		disabled?: boolean;
		class?: string;
	} = $props();

	const userContext = getUserContext();

	let previewUrl: string | null = $state(null);
	let fileInput: HTMLInputElement | null = $state(null);
	let pendingFile: File | null = $state(null);
	let uploading = $state(false);

	// method to clear the internal state
	export async function clear() {
		pendingFile = null;
		previewUrl = null;
	}

	// Method to upload the pending file and return the URL
	// This should be called by the parent form on save
	export async function upload() {
		if (!pendingFile || disabled) {
			// No pending file, return current value
			console.error('No file to upload or image uploader is disabled.');
			return;
		}

		uploading = true;

		try {
			// Convert file to base64
			const base64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					const dataUrl = reader.result as string;
					// Remove the "data:image/...;base64," prefix
					const base64 = dataUrl.split(',')[1];
					resolve(base64);
				};
				reader.onerror = reject;
				reader.readAsDataURL(pendingFile!);
			});

			const newUrl = await userContext.uploadImage({
				data: base64,
				name: pendingFile.name,
				type: pendingFile.type
			});

			// Update the value and clear pending file

			pendingFile = null;
			previewUrl = null;

			onUpload(newUrl);
		} catch (error) {
			console.error('Failed to upload image:', error);
			throw error;
		} finally {
			uploading = false;
		}
	}

	// Default placeholder image if no image URL is set
	const imageUrl = $derived(previewUrl || placeholderUrl);
</script>

<!-- Hidden file input for image upload -->
<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	{disabled}
	onchange={(event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Store the file for later upload
		pendingFile = file;
		onSelect(file);

		// Create preview URL from the file
		const reader = new FileReader();
		reader.onload = () => {
			previewUrl = reader.result as string;
		};
		reader.readAsDataURL(file);

		// Reset the input so the same file can be selected again
		target.value = '';

		if (autoUpload) {
			upload().catch((error) => {
				console.error('Failed to upload image:', error);
			});
		}
	}}
	class={cn(disabled && 'pointer-events-none', 'hidden')}
	{id}
/>

<button
	type="button"
	class={cn(
		'group aspect-square w-full max-w-[200px] cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition-colors hover:border-primary/50 disabled:cursor-not-allowed',
		disabled && 'pointer-events-none',
		className
	)}
	onclick={() => {
		fileInput?.click();
	}}
	disabled={uploading || disabled}
	title="Click to select image"
>
	{#if uploading}
		<div class="flex h-full w-full items-center justify-center rounded-md bg-muted">
			<LoaderCircle class="size-6 animate-spin text-muted-foreground" />
		</div>
	{:else}
		<img class="h-full w-full rounded-md object-cover" src={imageUrl} {alt} />
	{/if}
</button>
