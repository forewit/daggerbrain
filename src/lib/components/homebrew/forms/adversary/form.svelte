<script lang="ts">
	import { AdversarySchema, type Adversary } from '@convex/schemas/compendium';
	import type { DamageType, Range } from '@convex/schemas/rules';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import UserImageUploader from '$lib/components/utility/user-image-uploader.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import DicePicker from '$lib/components/dice/dice-picker.svelte';
	import { cn } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { intProxy, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import { adversaryFormDataToItem, adversaryToFormData, normalizeAdversary } from './normalize';
	import { summarizeAdversaryFormErrors } from './errors';

	type AdversaryFeature = Adversary['features'][number];

	const adversaryTypes: Adversary['type'][] = [
		'Bruiser',
		'Horde',
		'Leader',
		'Minion',
		'Ranged',
		'Skulk',
		'Social',
		'Solo',
		'Standard',
		'Support'
	];
	const rangeOptions: Range[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageType[] = ['phy', 'mag'];
	const damageTypeLabels: Record<DamageType, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};
	const featureTypes: AdversaryFeature['type'][] = ['Action', 'Reaction', 'Passive'];

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Adversary | null>(null),
		saving = $bindable(false),
		onSubmit,
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Adversary;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Adversary | null;
		saving?: boolean;
		onSubmit?: ((item: Adversary) => Promise<void> | void) | undefined;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const adversaryForm = superForm<Adversary>(adversaryToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(AdversarySchema),
		resetForm: false,
		taintedMessage: false
	});
	const { form, allErrors, tainted } = adversaryForm;
	const difficulty = intProxy(adversaryForm, 'difficulty', { empty: 'zero' });
	const thresholdMajor = intProxy(adversaryForm, 'thresholds.major', { empty: 'zero' });
	const thresholdSevere = intProxy(adversaryForm, 'thresholds.severe', { empty: 'zero' });
	const maxHp = intProxy(adversaryForm, 'max_hp', { empty: 'zero' });
	const maxStress = intProxy(adversaryForm, 'max_stress', { empty: 'zero' });
	const attackModifier = intProxy(adversaryForm, 'attack_modifier', { empty: 'zero' });
	const attackDamageBonus = intProxy(adversaryForm, 'standard_attack.damage_bonus', {
		empty: 'zero'
	});

	let imageInput: {
		upload: () => Promise<void>;
		clear: () => Promise<void>;
	} | null = $state(null);

	let hasPendingImageFile = $state(false);
	let uploadedImageUrl: string | undefined = $state(undefined);
	let imagePreviewUrl = $state(item.image_url ?? '');
	let lastSavedImageUrl: string | null = $state(null);
	function buildFormData(formData = $form): Adversary {
		return adversaryFormDataToItem(formData);
	}

	function parseInteger(value: string, fallback = 0) {
		const parsed = Number(value);
		return Number.isInteger(parsed) ? parsed : fallback;
	}

	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const allErrorMessages = $derived(summarizeAdversaryFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted) || hasPendingImageFile);
	const titleError = $derived($allErrors.find((error) => error.path === 'title')?.messages[0]);
	const difficultyError = $derived(
		$allErrors.find((error) => error.path === 'difficulty')?.messages[0]
	);
	const damageDiceError = $derived(
		$allErrors.find((error) => error.path === 'standard_attack.damage_dice')?.messages[0]
	);
	const experienceRows = $derived(
		$form.experiences.map((name, index) => ({
			name,
			modifier: String($form.experience_modifiers[index] ?? 0)
		}))
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
		adversaryForm.reset({ data: adversaryToFormData(item) });
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

	function addExperience() {
		$form.experiences = [...$form.experiences, ''];
		$form.experience_modifiers = [...$form.experience_modifiers, 0];
	}

	function updateExperienceName(index: number, value: string) {
		$form.experiences = $form.experiences.map((entry, current) =>
			current === index ? value : entry
		);
	}

	function updateExperienceModifier(index: number, value: string) {
		const parsed = Number(value);
		$form.experience_modifiers = $form.experience_modifiers.map((entry, current) =>
			current === index && Number.isInteger(parsed) ? parsed : entry
		);
	}

	function removeExperience(index: number) {
		$form.experiences = $form.experiences.filter((_, current) => current !== index);
		$form.experience_modifiers = $form.experience_modifiers.filter(
			(_, current) => current !== index
		);
	}

	function addFeature() {
		$form.features = [
			...$form.features,
			{
				type: 'Passive',
				name: '',
				max_uses: null,
				description_html: ''
			}
		];
	}

	function updateFeature(index: number, nextFeature: AdversaryFeature) {
		$form.features = $form.features.map((feature, current) =>
			current === index ? nextFeature : feature
		);
	}

	function removeFeature(index: number) {
		$form.features = $form.features.filter((_, current) => current !== index);
	}

	export async function handleSubmit(event?: SubmitEvent) {
		event?.preventDefault();
		saving = true;
		try {
			const validatedForm = await adversaryForm.validateForm({ update: true });
			if (!validatedForm.valid) {
				hasErrors = true;
				return;
			}
			if (hasPendingImageFile && imageInput) {
				await imageInput.upload();
			}

			const nextItem = normalizeAdversary(
				buildFormData(uploadedImageUrl ? { ...$form, image_url: uploadedImageUrl } : undefined)
			);
			if (onSubmit) {
				await onSubmit(nextItem);
			} else {
				await homebrew.updateItem({ type: 'adversaries', id: itemId as never, item: nextItem });
			}
			item = nextItem;
			adversaryForm.reset({ data: adversaryToFormData(nextItem) });
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
		adversaryForm.reset({ data: adversaryToFormData(item) });
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
				for="adversary-name">Name</label
			>
			<Input
				id="adversary-name"
				bind:value={$form.title}
				placeholder="Adversary name"
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
				for="adversary-difficulty">Difficulty</label
			>
			<Input
				id="adversary-difficulty"
				type="number"
				min="1"
				bind:value={$difficulty}
				aria-invalid={Boolean(difficultyError)}
			/>
		</div>
	</div>

	<div class="flex gap-3">
		<div class="flex flex-1 flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="adversary-type">Type</label>
			<Select.Root type="single" bind:value={$form.type}>
				<Select.Trigger id="adversary-type" class="w-full">{$form.type}</Select.Trigger>
				<Select.Content>
					{#each adversaryTypes as type}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-1 flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="adversary-tier">Tier</label>
			<Select.Root
				type="single"
				value={String($form.tier)}
				onValueChange={(value) => ($form.tier = Number(value || '1') as Adversary['tier'])}
			>
				<Select.Trigger id="adversary-tier" class="w-full">Tier {$form.tier}</Select.Trigger>
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
		<label class="text-xs font-medium text-muted-foreground" for="adversary-description"
			>Description</label
		>
		<Textarea
			id="adversary-description"
			bind:value={$form.description}
			placeholder="Description"
			rows={2}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="adversary-motives"
			>Motives and Tactics</label
		>
		<Input
			id="adversary-motives"
			bind:value={$form.motives_tactics}
			placeholder="Burrow, drag away, feed..."
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
				alt="Adversary artwork"
				class="w-26"
			/>
		</div>

		<div class="flex grow flex-col gap-1">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground" for="adversary-artist"
					>Artist</label
				>
				<Input id="adversary-artist" bind:value={$form.artist_name} placeholder="Name" />
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

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="flex flex-col gap-1">
			<label class="text-xs text-muted-foreground" for="adversary-max-hp">HP</label>
			<Input id="adversary-max-hp" type="number" min="0" bind:value={$maxHp} />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-muted-foreground" for="adversary-max-stress">Stress</label>
			<Input id="adversary-max-stress" type="number" min="0" bind:value={$maxStress} />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-muted-foreground" for="adversary-threshold-major"
				>Major Threshold</label
			>
			<Input id="adversary-threshold-major" type="number" min="0" bind:value={$thresholdMajor} />
		</div>
		<div class="flex flex-col gap-1">
			<label class="text-xs text-muted-foreground" for="adversary-threshold-severe"
				>Severe Threshold</label
			>
			<Input id="adversary-threshold-severe" type="number" min="0" bind:value={$thresholdSevere} />
		</div>
	</div>

	<div class="flex flex-col gap-3 rounded-lg border bg-muted p-3">
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground" for="adversary-attack-name"
				>Attack</label
			>
			<Input
				id="adversary-attack-name"
				bind:value={$form.standard_attack.name}
				placeholder="Name"
			/>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="adversary-attack-range">Range</label>
				<Select.Root type="single" bind:value={$form.standard_attack.range}>
					<Select.Trigger id="adversary-attack-range" class="w-full"
						>{$form.standard_attack.range}</Select.Trigger
					>
					<Select.Content>
						{#each rangeOptions as range}
							<Select.Item value={range}>{range}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="adversary-damage-type">Damage Type</label>
				<Select.Root type="single" bind:value={$form.standard_attack.damage_type}>
					<Select.Trigger id="adversary-damage-type" class="w-full">
						{damageTypeLabels[$form.standard_attack.damage_type]}
					</Select.Trigger>
					<Select.Content>
						{#each damageTypeOptions as damageType}
							<Select.Item value={damageType}>{damageTypeLabels[damageType]}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2 truncate">
					<p
						class={cn(
							'text-xs font-medium text-muted-foreground',
							damageDiceError && 'text-destructive'
						)}
					>
						Damage Dice
					</p>
					{#if $form.standard_attack.damage_dice}
						<span class="truncate text-xs text-muted-foreground"
							>({$form.standard_attack.damage_dice})</span
						>
					{/if}
				</div>
				<button
					type="button"
					class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
					disabled={$form.standard_attack.damage_dice === ''}
					onclick={() => ($form.standard_attack.damage_dice = '')}
				>
					Reset
					<RotateCcw class="size-3.5" />
				</button>
			</div>
			<DicePicker
				value={$form.standard_attack.damage_dice}
				onChange={(value) => ($form.standard_attack.damage_dice = value)}
			/>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="adversary-damage-bonus"
					>Damage Bonus</label
				>
				<Input id="adversary-damage-bonus" type="number" bind:value={$attackDamageBonus} />
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs text-muted-foreground" for="adversary-attack-modifier"
					>Attack Roll Modifier</label
				>
				<Input id="adversary-attack-modifier" type="number" bind:value={$attackModifier} />
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Experiences</p>
			<Button type="button" size="sm" variant="outline" onclick={addExperience}>
				<Plus class="size-3.5" />
				Add
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each experienceRows as experience, index (index)}
				<div class="grid grid-cols-[1fr_88px_auto] gap-2">
					<Input
						value={experience.name}
						placeholder="Experience name"
						oninput={(event) => updateExperienceName(index, event.currentTarget.value)}
					/>
					<Input
						value={experience.modifier}
						type="number"
						placeholder="0"
						oninput={(event) => updateExperienceModifier(index, event.currentTarget.value)}
					/>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						class="size-9 p-0"
						onclick={() => removeExperience(index)}
					>
						<X class="size-4" />
					</Button>
				</div>
			{:else}
				<p class="text-xs italic text-muted-foreground">No experiences added</p>
			{/each}
		</div>
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
								for={`adversary-feature-name-${index}`}>Name</label
							>
							<Input
								id={`adversary-feature-name-${index}`}
								value={feature.name}
								placeholder="Feature name"
								oninput={(event) =>
									updateFeature(index, { ...feature, name: event.currentTarget.value })}
							/>
						</div>

						<div class="flex flex-col gap-1">
							<label
								class="text-xs font-medium text-muted-foreground"
								for={`adversary-feature-type-${index}`}>Type</label
							>
							<Select.Root
								type="single"
								value={feature.type}
								onValueChange={(value) =>
									value &&
									updateFeature(index, { ...feature, type: value as AdversaryFeature['type'] })}
							>
								<Select.Trigger id={`adversary-feature-type-${index}`} class="w-full">
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
								for={`adversary-feature-description-${index}`}>Description</label
							>
							<Textarea
								id={`adversary-feature-description-${index}`}
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
								for={`adversary-feature-max-uses-${index}`}>Max Uses</label
							>
							<Input
								id={`adversary-feature-max-uses-${index}`}
								type="number"
								min="0"
								value={feature.max_uses === null ? '' : String(feature.max_uses)}
								placeholder="Unlimited"
								oninput={(event) =>
									updateFeature(index, {
										...feature,
										max_uses:
											event.currentTarget.value.trim() === ''
												? null
												: Math.max(0, parseInteger(event.currentTarget.value))
									})}
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
