<script lang="ts">
	import { getUserContext } from '$lib/state/user.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { cn } from '$lib/utils';

	let {
		value = $bindable(),
		hasPendingFile = $bindable(false),
		id,
		alt = 'Image preview',
		class: className = ''
	}: {
		value: string;
		hasPendingFile?: boolean;
		id?: string;
		alt?: string;
		class?: string;
	} = $props();

	const user = getUserContext();

	let fileInput: HTMLInputElement | null = $state(null);
	let pendingFile: File | null = $state(null);
	let previewUrl: string | null = $state(null);
	let uploading = $state(false);

	// Handle file selection - store file and create preview, but don't upload yet
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Store the file for later upload
		pendingFile = file;
		hasPendingFile = true;

		// Create preview URL from the file
		const reader = new FileReader();
		reader.onload = () => {
			previewUrl = reader.result as string;
		};
		reader.readAsDataURL(file);

		// Reset the input so the same file can be selected again
		target.value = '';
	}

	function triggerImageUpload() {
		fileInput?.click();
	}

	// Method to get the current preview URL (if a file is pending)
	// Returns the preview URL if available, otherwise null
	export function getPreviewUrl(): string | null {
		return previewUrl;
	}

	// Method to clear the pending file and preview URL
	// This should be called when resetting/discarding changes
	export function clearPendingFile(): void {
		pendingFile = null;
		previewUrl = null;
	}

	// Reactive effect: clear internal state when hasPendingFile becomes false
	$effect(() => {
		if (!hasPendingFile && (pendingFile || previewUrl)) {
			// Parent set hasPendingFile to false, clear internal state
			pendingFile = null;
			previewUrl = null;
		}
	});

	// Method to upload the pending file and return the URL
	// This should be called by the parent form on save
	export async function uploadPendingFile(): Promise<string | null> {
		if (!pendingFile) {
			// No pending file, return current value
			return value || null;
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

			const url = await user.upload_user_image({
				data: base64,
				name: pendingFile.name,
				type: pendingFile.type
			});

			// Update the value and clear pending file
			value = url;
			pendingFile = null;
			previewUrl = null;
			hasPendingFile = false;

			return url;
		} catch (error) {
			console.error('Failed to upload image:', error);
			throw error;
		} finally {
			uploading = false;
		}
	}

	// Default placeholder image if no image URL is set
	const placeholderImage = '/images/art/placeholder-art.webp';
	const imageUrl = $derived(previewUrl || value || placeholderImage);
</script>

<div class={cn('flex flex-col gap-1', className)}>
	<!-- Hidden file input for image upload -->
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		onchange={handleFileSelect}
		class="hidden"
		{id}
	/>

	<!-- Clickable image preview -->
	<button
		type="button"
		class="group aspect-square w-full max-w-[200px] cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
		onclick={triggerImageUpload}
		disabled={uploading}
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
</div>
