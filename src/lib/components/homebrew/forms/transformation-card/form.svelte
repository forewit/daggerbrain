<script lang="ts">
	import { TransformationCardSchema, type TransformationCard } from '@convex/schemas/compendium';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import UserImageUploader from '$lib/components/utility/user-image-uploader.svelte';
	import CardChoicesForm from '../shared/card-choices/form.svelte';
	import FeaturesForm from '../shared/features/form.svelte';
	import { cn } from '$lib/utils';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import {
		transformationCardFormDataToItem,
		transformationCardToFormData,
		normalizeTransformationCard
	} from './normalize';
	import { summarizeTransformationCardFormErrors } from './errors';

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<TransformationCard | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: TransformationCard;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: TransformationCard | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	let imageInput: {
		upload: () => Promise<void>;
		clear: () => Promise<void>;
	} | null = $state(null);
	let hasPendingImageFile = $state(false);
	let uploadedImageUrl: string | undefined = $state(undefined);
	let imagePreviewUrl = $state(item.image_url ?? '');
	let lastSavedImageUrl: string | null = $state(null);

	const transformationCardForm = superForm<TransformationCard>(transformationCardToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(TransformationCardSchema),
		async onUpdate({ form: validatedForm }) {
			if (!validatedForm.valid) return;
			await saveTransformationCard();
		},
		resetForm: false,
		taintedMessage: false
	});

	const { form, errors, allErrors, tainted, enhance } = transformationCardForm;

	function buildFormData(formData = get(form)): TransformationCard {
		return transformationCardFormDataToItem(formData);
	}

	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const errorSummaryMessages = $derived(summarizeTransformationCardFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted) || hasPendingImageFile);
	const titleError = $derived($errors.title?.[0]);

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
		transformationCardForm.reset({ data: transformationCardToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasPendingImageFile = false;
		imagePreviewUrl = item.image_url ?? '';
		void imageInput?.clear();
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

	async function saveTransformationCard() {
		saving = true;
		try {
			if (hasPendingImageFile && imageInput) {
				await imageInput.upload();
			}
			const nextData = buildFormData(
				uploadedImageUrl ? { ...get(form), image_url: uploadedImageUrl } : undefined
			);

			const nextItem = normalizeTransformationCard(nextData);
			await homebrew.updateItem({
				type: 'transformation_cards',
				id: itemId as never,
				item: nextItem
			});
			item = nextItem;
			transformationCardForm.reset({ data: transformationCardToFormData(nextItem) });
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
		transformationCardForm.reset({ data: transformationCardToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasPendingImageFile = false;
		imagePreviewUrl = item.image_url ?? '';
		uploadedImageUrl = undefined;
		void imageInput?.clear();
	}
</script>

<form id={formId} method="POST" use:enhance onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label
			class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
			for="transformation-card-name">Name</label
		>
		<Input
			id="transformation-card-name"
			bind:value={$form.title}
			placeholder="Transformation card name"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="transformation-card-description"
			>Description</label
		>
		<Textarea
			id="transformation-card-description"
			bind:value={$form.description_html}
			placeholder="Transformation card description"
			rows={3}
		/>
	</div>

	<label
		class="flex items-center gap-2 text-xs text-muted-foreground"
		for="transformation-card-tokens"
	>
		<Checkbox id="transformation-card-tokens" bind:checked={$form.tokens_enabled} />
		Enable tokens
	</label>

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
				alt="Transformation card image"
				class="w-26"
			/>
		</div>
		<div class="flex grow flex-col gap-1">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="transformation-card-artist"
					>Artist</label
				>
				<Input id="transformation-card-artist" bind:value={$form.artist_name} placeholder="Name" />
			</div>
			<Button
				type="button"
				class="w-min px-1 text-muted-foreground"
				size="sm"
				variant="link"
				disabled={$form.image_url === '' && !hasPendingImageFile}
				onclick={() => {
					form.update((formData) => ({ ...formData, image_url: '' }));
					hasPendingImageFile = false;
					imagePreviewUrl = '';
					void imageInput?.clear();
				}}
			>
				Remove image
			</Button>
		</div>
	</div>

	<CardChoicesForm bind:options={$form.options} {errorSummary} />
	<FeaturesForm
		bind:features={$form.features}
		bind:choiceOptions={$form.options}
		choiceSourceId={itemId}
		allowChoiceConditions={true}
		allowExperienceTargets={true}
		allowAddRemove
		featureLabel="Feature"
		{errorSummary}
	/>

	{#if errorSummaryMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each errorSummaryMessages as error}
				<li class="text-xs text-destructive">{error}</li>
			{/each}
		</ul>
	{/if}
</form>
