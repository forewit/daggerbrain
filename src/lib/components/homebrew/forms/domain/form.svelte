<script lang="ts">
	import { DomainSchema, type Domain } from '@convex/schemas/compendium';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import UserImageUploader from '$lib/components/utility/user-image-uploader.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import { cn, merge_compendium_content } from '$lib/utils';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import { domainFormDataToItem, domainToFormData, normalizeDomain } from './normalize';
	import { summarizeDomainFormErrors } from './errors';

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Domain | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Domain;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Domain | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();
	const fullCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);
	let imageInput: {
		upload: () => Promise<void>;
		clear: () => Promise<void>;
	} | null = $state(null);
	let hasPendingImageFile = $state(false);
	let uploadedImageUrl: string | undefined = $state(undefined);
	let imagePreviewUrl = $state(item.image_url ?? '');
	let lastSavedImageUrl: string | null = $state(null);

	const domainForm = superForm<Domain>(domainToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(DomainSchema),
		async onUpdate({ form: validatedForm }) {
			if (!validatedForm.valid) return;
			await saveDomain();
		},
		resetForm: false,
		taintedMessage: false
	});
	const { form, errors, allErrors, tainted, enhance } = domainForm;

	function calculateForegroundColor(hexColor: string): string {
		const hex = hexColor.replace('#', '');
		if (!/^[0-9a-fA-F]{6}$/.test(hex)) return '#000000';
		const r = Number.parseInt(hex.slice(0, 2), 16);
		const g = Number.parseInt(hex.slice(2, 4), 16);
		const b = Number.parseInt(hex.slice(4, 6), 16);
		return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5 ? '#ffffff' : '#000000';
	}

	function isHomebrewItem(value: { source_key?: string } | undefined) {
		return value?.source_key === 'Homebrew';
	}

	function buildFormData(formData = get(form)): Domain {
		return domainFormDataToItem(formData);
	}

	const linkedDomainCards = $derived.by(() =>
		Object.entries(fullCompendium.domain_cards)
			.filter(([, card]) => card.domain_id === itemId)
			.sort(
				(a, b) =>
					a[1].level_requirement - b[1].level_requirement || a[1].title.localeCompare(b[1].title)
			)
	);
	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const errorSummaryMessages = $derived(summarizeDomainFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted) || hasPendingImageFile);
	const titleError = $derived($errors.title?.[0]);
	const colorError = $derived($errors.color?.[0]);
	const foregroundColorError = $derived($errors.foreground_color?.[0]);

	$effect(() => {
		if (
			lastSavedImageUrl !== null &&
			item.image_url !== lastSavedImageUrl &&
			$form.image_url === lastSavedImageUrl
		) {
			return;
		}
		if (lastSavedImageUrl !== null && item.image_url === lastSavedImageUrl) {
			lastSavedImageUrl = null;
		}
		domainForm.reset({ data: domainToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasPendingImageFile = false;
		imagePreviewUrl = item.image_url ?? '';
		void imageInput?.clear();
	});
	$effect(() => {
		if (/^#[0-9a-fA-F]{6}$/.test($form.color))
			$form.foreground_color = calculateForegroundColor($form.color);
	});
	$effect(() => {
		hasChanges = formHasChanges;
	});
	$effect(() => {
		hasErrors = $allErrors.length > 0;
	});
	$effect(() => {
		unsavedItem = buildFormData($form);
	});

	async function saveDomain() {
		saving = true;
		try {
			if (hasPendingImageFile && imageInput) {
				await imageInput.upload();
			}
			const nextData = buildFormData(
				uploadedImageUrl ? { ...get(form), image_url: uploadedImageUrl } : undefined
			);
			const nextItem = normalizeDomain(nextData);
			await homebrew.updateItem({ type: 'domains', id: itemId as never, item: nextItem });
			item = nextItem;
			domainForm.reset({ data: domainToFormData(nextItem) });
			form.update((formData) => formData, { taint: 'untaint-all' });
			hasPendingImageFile = false;
			imagePreviewUrl = nextItem.image_url ?? '';
			lastSavedImageUrl = nextItem.image_url ?? '';
			uploadedImageUrl = undefined;
			await imageInput?.clear();
			await tick();
			onSaveSuccess?.();
		} catch (error) {
			onSaveError?.();
			throw error;
		} finally {
			saving = false;
		}
	}

	function handleReset(event?: Event) {
		event?.preventDefault();
		domainForm.reset({ data: domainToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasPendingImageFile = false;
		imagePreviewUrl = item.image_url ?? '';
		uploadedImageUrl = undefined;
		void imageInput?.clear();
	}
</script>

<form id={formId} method="POST" use:enhance onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex gap-4">
		<div class="flex flex-1 flex-col gap-1">
			<label
				class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
				for="domain-name">Name</label
			>
			<Input
				id="domain-name"
				bind:value={$form.title}
				placeholder="Domain name"
				aria-invalid={Boolean(titleError)}
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label
				class={cn('text-xs font-medium text-muted-foreground', colorError && 'text-destructive')}
				for="domain-color">Color</label
			>
			<Input
				id="domain-color"
				type="color"
				bind:value={$form.color}
				class="h-9 w-20 shrink-0"
				aria-invalid={Boolean(colorError)}
			/>
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="domain-description"
			>Description</label
		>
		<Textarea
			id="domain-description"
			bind:value={$form.description_html}
			placeholder="Domain description"
			rows={4}
		/>
	</div>
	<div class="flex gap-2">
		<div class="flex flex-col gap-1">
			<p class="text-xs font-medium text-muted-foreground">Artwork</p>
			<UserImageUploader
				bind:this={imageInput}
				onSelect={() => (hasPendingImageFile = true)}
				onUpload={(url) => {
					uploadedImageUrl = url;
					imagePreviewUrl = url;
					form.update((formData) => ({ ...formData, image_url: url }));
				}}
				placeholderImage={imagePreviewUrl || '/images/art/placeholder-art.webp'}
				alt="Domain artwork"
				class="w-26"
			/>
		</div>
		<div class="flex grow flex-col gap-1">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="domain-artist">Artist</label
				><Input id="domain-artist" bind:value={$form.artist_name} placeholder="Name" />
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="domain-foreground-color"
					>Foreground</label
				><Input
					id="domain-foreground-color"
					bind:value={$form.foreground_color}
					aria-invalid={Boolean(foregroundColorError)}
				/>
			</div>
			<Button
				type="button"
				class="w-min px-1 text-muted-foreground"
				size="sm"
				variant="link"
				disabled={$form.image_url === '' && !hasPendingImageFile}
				onclick={() => {
					$form.image_url = '';
					hasPendingImageFile = false;
					imagePreviewUrl = '';
					void imageInput?.clear();
				}}>Remove image</Button
			>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Linked Domain Cards</p>
		{#if linkedDomainCards.length > 0}
			<div class="flex flex-col gap-2">
				{#each linkedDomainCards as [cardId, card] (cardId)}
					<div class="flex items-center justify-between gap-3 rounded-lg border bg-muted px-3 py-2">
						<div class="min-w-0">
							<div class="flex min-w-0 items-center gap-1.5">
								<p class="truncate text-sm font-medium">{card.title}</p>
								{#if isHomebrewItem(card)}<HomebrewBadge />{/if}
							</div>
							<p class="text-xs text-muted-foreground">
								Level {card.level_requirement} / {card.category}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-xs text-muted-foreground italic">No domain cards are linked yet</p>
		{/if}
	</div>
	{#if errorSummaryMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each errorSummaryMessages as error}<li class="text-xs text-destructive">{error}</li>{/each}
		</ul>
	{/if}
</form>
