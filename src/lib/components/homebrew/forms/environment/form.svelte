<script lang="ts">
	import { EnvironmentSchema, type Adversary, type Environment } from '@convex/schemas/compendium';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import UserImageUploader from '$lib/components/utility/user-image-uploader.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import { cn, merge_compendium_content } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { intProxy, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import {
		environmentFormDataToItem,
		environmentToFormData,
		normalizeEnvironment
	} from './normalize';
	import { summarizeEnvironmentFormErrors } from './errors';

	type EnvironmentFeature = Environment['features'][number];
	const environmentTypes: Environment['type'][] = ['Exploration', 'Social', 'Traversal', 'Event'];
	const featureTypes: EnvironmentFeature['type'][] = ['Action', 'Reaction', 'Passive'];

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Environment | null>(null),
		saving = $bindable(false),
		onSubmit,
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Environment;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Environment | null;
		saving?: boolean;
		onSubmit?: ((item: Environment) => Promise<void> | void) | undefined;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const environmentForm = superForm<Environment>(environmentToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(EnvironmentSchema),
		resetForm: false,
		taintedMessage: false
	});
	const { form, allErrors, tainted } = environmentForm;
	const difficulty = intProxy(environmentForm, 'difficulty', { empty: 'zero' });
	const sources = getSourcesContext();
	const fullCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);
	const adversaryEntries = $derived.by(() =>
		Object.entries(fullCompendium.adversaries).sort((a, b) => a[1].title.localeCompare(b[1].title))
	);

	let imageInput: {
		upload: () => Promise<void>;
		clear: () => Promise<void>;
	} | null = $state(null);

	let hasPendingImageFile = $state(false);
	let uploadedImageUrl: string | undefined = $state(undefined);
	let imagePreviewUrl = $state(item.image_url ?? '');
	let lastSavedImageUrl: string | null = $state(null);
	let adversaryToAdd = $state('');

	function buildFormData(formData = $form): Environment {
		return environmentFormDataToItem(formData);
	}

	function isHomebrewItem(value: { source_key?: string } | undefined) {
		return value?.source_key === 'Homebrew';
	}

	function addAdversary(adversaryId: string) {
		if (!adversaryId || $form.potential_adversaries_ids.includes(adversaryId)) return;
		$form.potential_adversaries_ids = [...$form.potential_adversaries_ids, adversaryId];
		adversaryToAdd = '';
	}

	function removeAdversary(adversaryId: string) {
		$form.potential_adversaries_ids = $form.potential_adversaries_ids.filter(
			(id) => id !== adversaryId
		);
	}

	function addFeature() {
		$form.features = [
			...$form.features,
			{
				type: 'Passive',
				name: '',
				description_html: '',
				questions: ''
			}
		];
	}

	function updateFeature(index: number, nextFeature: EnvironmentFeature) {
		$form.features = $form.features.map((feature, current) =>
			current === index ? nextFeature : feature
		);
	}

	function removeFeature(index: number) {
		$form.features = $form.features.filter((_, current) => current !== index);
	}

	function addRelativeStrengthFeature() {
		if ($form.features.some((feature) => feature.name === 'Relative Strength')) return;
		$form.features = [
			...$form.features,
			{
				type: 'Passive',
				name: 'Relative Strength',
				description_html:
					'The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
				questions: ''
			}
		];
	}

	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const allErrorMessages = $derived(summarizeEnvironmentFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted) || hasPendingImageFile);
	const titleError = $derived($allErrors.find((error) => error.path === 'title')?.messages[0]);
	const difficultyError = $derived(
		$allErrors.find((error) => error.path === 'difficulty')?.messages[0]
	);

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
		environmentForm.reset({ data: environmentToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		adversaryToAdd = '';
		hasPendingImageFile = false;
		imagePreviewUrl = item.image_url ?? '';
		void imageInput?.clear();
	});

	$effect(() => {
		if ($form.relative_strength) addRelativeStrengthFeature();
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

	export async function handleSubmit(event?: SubmitEvent) {
		event?.preventDefault();
		saving = true;
		try {
			const validatedForm = await environmentForm.validateForm({ update: true });
			if (!validatedForm.valid) {
				hasErrors = true;
				return;
			}
			if (hasPendingImageFile && imageInput) {
				await imageInput.upload();
			}

			const nextItem = normalizeEnvironment(
				buildFormData(uploadedImageUrl ? { ...$form, image_url: uploadedImageUrl } : undefined)
			);
			if (onSubmit) {
				await onSubmit(nextItem);
			} else {
				await homebrew.updateItem({ type: 'environments', id: itemId as never, item: nextItem });
			}
			item = nextItem;
			environmentForm.reset({ data: environmentToFormData(nextItem) });
			form.update((formData) => formData, { taint: 'untaint-all' });
			await tick();
			hasPendingImageFile = false;
			imagePreviewUrl = nextItem.image_url ?? '';
			lastSavedImageUrl = nextItem.image_url ?? '';
			uploadedImageUrl = undefined;
			await imageInput?.clear();
			hasErrors = false;
			onSaveSuccess?.();
		} catch (error) {
			onSaveError?.();
			throw error;
		} finally {
			saving = false;
		}
	}

	export function handleReset() {
		adversaryToAdd = '';
		environmentForm.reset({ data: environmentToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasPendingImageFile = false;
		imagePreviewUrl = item.image_url ?? '';
		uploadedImageUrl = undefined;
		void imageInput?.clear();
		hasErrors = false;
	}
</script>

<form id={formId} onsubmit={handleSubmit} onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex gap-3">
		<div class="flex min-w-0 flex-1 flex-col gap-1">
			<label
				class={cn('text-xs font-medium text-muted-foreground', titleError && 'text-destructive')}
				for="environment-name">Name</label
			>
			<Input
				id="environment-name"
				bind:value={$form.title}
				placeholder="Environment name"
				aria-invalid={Boolean(titleError)}
			/>
			{#if titleError}
				<p class="text-xs text-destructive">{titleError}</p>
			{/if}
		</div>
		<div class="flex w-20 shrink-0 flex-col gap-1">
			<label
				class={cn(
					'text-xs font-medium text-muted-foreground',
					difficultyError && 'text-destructive'
				)}
				for="environment-difficulty">Difficulty</label
			>
			<Input
				id="environment-difficulty"
				type="number"
				min="1"
				bind:value={$difficulty}
				disabled={$form.relative_strength}
				aria-invalid={Boolean(difficultyError)}
			/>
		</div>
	</div>

	<div class="-my-2 flex items-center justify-end gap-2">
		<label class="text-xs text-muted-foreground" for="environment-relative-strength"
			>Relative strength</label
		>
		<Checkbox id="environment-relative-strength" bind:checked={$form.relative_strength} />
	</div>

	<div class="flex gap-3">
		<div class="flex flex-1 flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="environment-type">Type</label>
			<Select.Root type="single" bind:value={$form.type}>
				<Select.Trigger id="environment-type" class="w-full">{$form.type}</Select.Trigger>
				<Select.Content>
					{#each environmentTypes as type}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-1 flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="environment-tier">Tier</label>
			<Select.Root
				type="single"
				value={String($form.tier)}
				onValueChange={(value) => ($form.tier = Number(value || '1') as Environment['tier'])}
			>
				<Select.Trigger id="environment-tier" class="w-full">Tier {$form.tier}</Select.Trigger>
				<Select.Content>
					<Select.Item value="1">Tier 1</Select.Item>
					<Select.Item value="2">Tier 2</Select.Item>
					<Select.Item value="3">Tier 3</Select.Item>
					<Select.Item value="4">Tier 4</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="environment-description"
			>Description</label
		>
		<Textarea
			id="environment-description"
			bind:value={$form.description}
			placeholder="Environment description"
			rows={2}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="environment-impulses"
			>Impulses</label
		>
		<Input
			id="environment-impulses"
			bind:value={$form.impulses}
			placeholder="Draw in the curious, echo the past..."
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
				alt="Environment artwork"
				class="w-26"
			/>
		</div>

		<div class="flex grow flex-col gap-1">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="environment-artist"
					>Artist</label
				>
				<Input id="environment-artist" bind:value={$form.artist_name} placeholder="Name" />
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
				}}
			>
				Remove image
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="environment-potential-adversaries"
			>Potential Adversaries Description</label
		>
		<Input
			id="environment-potential-adversaries"
			bind:value={$form.potential_adversaries}
			placeholder="Beasts, guards, spirits..."
		/>
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Potential Adversaries</p>
		</div>

		<div class="grid grid-cols-[1fr_auto] gap-2">
			<Select.Root
				type="single"
				value={adversaryToAdd}
				onValueChange={(value) => {
					adversaryToAdd = value || '';
					if (value) addAdversary(value);
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">Add adversary</p>
				</Select.Trigger>
				<Select.Content>
					{#each adversaryEntries as [adversaryId, adversary]}
						<Select.Item
							value={adversaryId}
							disabled={$form.potential_adversaries_ids.includes(adversaryId)}
						>
							<div class="flex items-center gap-1.5">
								<span>{adversary.title}</span>
								{#if isHomebrewItem(adversary)}
									<HomebrewBadge />
								{/if}
							</div>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Button
				type="button"
				size="sm"
				variant="outline"
				disabled={!adversaryToAdd}
				onclick={() => addAdversary(adversaryToAdd)}
			>
				<Plus class="size-3.5" />
				Add
			</Button>
		</div>

		{#if $form.potential_adversaries_ids.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each $form.potential_adversaries_ids as adversaryId (adversaryId)}
					{@const adversary = fullCompendium.adversaries[adversaryId]}
					<div class="flex items-center gap-2 rounded-lg border bg-muted pl-3">
						{#if isHomebrewItem(adversary)}
							<HomebrewBadge />
						{/if}
						<span class="text-xs">{adversary?.title ?? adversaryId}</span>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							class="size-8 p-0"
							onclick={() => removeAdversary(adversaryId)}
						>
							<X class="size-4" />
						</Button>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-xs text-muted-foreground italic">No adversaries linked</p>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Features</p>
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>

		<div class="flex flex-col gap-2">
			{#each $form.features as feature, index (index)}
				<Dropdown title={feature.name || 'Unnamed feature'}>
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<label
								class="text-xs font-medium text-muted-foreground"
								for={`environment-feature-name-${index}`}>Name</label
							>
							<Input
								id={`environment-feature-name-${index}`}
								value={feature.name}
								placeholder="Feature name"
								oninput={(event) =>
									updateFeature(index, { ...feature, name: event.currentTarget.value })}
							/>
						</div>

						<div class="flex flex-col gap-1">
							<label
								class="text-xs font-medium text-muted-foreground"
								for={`environment-feature-type-${index}`}>Type</label
							>
							<Select.Root
								type="single"
								value={feature.type}
								onValueChange={(value) =>
									value &&
									updateFeature(index, { ...feature, type: value as EnvironmentFeature['type'] })}
							>
								<Select.Trigger id={`environment-feature-type-${index}`} class="w-full">
									{feature.type}
								</Select.Trigger>
								<Select.Content>
									{#each featureTypes as type}
										<Select.Item value={type}>{type}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div class="flex flex-col gap-1">
							<label
								class="text-xs font-medium text-muted-foreground"
								for={`environment-feature-description-${index}`}>Description</label
							>
							<Textarea
								id={`environment-feature-description-${index}`}
								value={feature.description_html}
								rows={4}
								placeholder="Feature description"
								oninput={(event) =>
									updateFeature(index, { ...feature, description_html: event.currentTarget.value })}
							/>
						</div>

						<div class="flex flex-col gap-1">
							<label
								class="text-xs font-medium text-muted-foreground"
								for={`environment-feature-questions-${index}`}>Questions</label
							>
							<Textarea
								id={`environment-feature-questions-${index}`}
								value={feature.questions}
								rows={3}
								placeholder="Optional prompts or questions"
								oninput={(event) =>
									updateFeature(index, { ...feature, questions: event.currentTarget.value })}
							/>
						</div>

						<div class="flex justify-end">
							<Button
								type="button"
								size="sm"
								variant="link"
								class="text-destructive"
								onclick={() => removeFeature(index)}
							>
								Delete Feature
							</Button>
						</div>
					</div>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No features added</p>
			{/each}
		</div>
	</div>

	{#if allErrorMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each allErrorMessages as error}
				<li class="text-xs text-destructive">{error}</li>
			{/each}
		</ul>
	{/if}
</form>
