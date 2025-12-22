<script lang="ts">
	import type { Feature, DomainCard, DomainCardChoice, DomainIds } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import HomebrewFeatureForm from './features/feature-form.svelte';
	import DomainChoicesEditor from './features/domain-choices-editor.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import {
		DomainCardFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type DomainCardFormErrors
	} from './form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';

	let { domainCard = $bindable() }: { domainCard: DomainCard } = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// Form state - initialized from domainCard prop
	let formTitle = $state('');
	let formImageUrl = $state('');
	let formArtistName = $state('');
	let formDomainId = $state<DomainIds>('arcana');
	let formLevelRequirement = $state('');
	let formRecallCost = $state('');
	let formCategory = $state<'ability' | 'spell' | 'grimoire'>('ability');
	let formTokens = $state(false);
	let formAppliesInVault = $state(false);
	let formForcedInLoadout = $state(false);
	let formForcedInVault = $state(false);
	let formFeatures = $state<Feature[]>([]);
	let formChoices = $state<DomainCardChoice[]>([]);

	// Validation errors state
	let errors = $state<DomainCardFormErrors>({});

	// Feature validation state - track which features have errors
	const featureErrors = new SvelteMap<number, boolean>();

	const domainOptions: DomainIds[] = [
		'arcana',
		'blade',
		'bone',
		'codex',
		'grace',
		'midnight',
		'sage',
		'splendor',
		'valor'
	];

	const categoryOptions: ('ability' | 'spell' | 'grimoire')[] = ['ability', 'spell', 'grimoire'];

	// Helper to convert tier to level requirement
	function tierToMinLevel(tier: number): number {
		if (tier === 1) return 1;
		if (tier === 2) return 2;
		if (tier === 3) return 5;
		if (tier === 4) return 8;
		return 1;
	}

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}

	// Check if form has changes compared to the domainCard prop
	let hasChanges = $derived.by(() => {
		if (!domainCard) return false;

		const titleMatch = formTitle.trim() === domainCard.title;
		const imageUrlMatch = formImageUrl === domainCard.image_url;
		const artistNameMatch = formArtistName === domainCard.artist_name;
		const domainMatch = formDomainId === domainCard.domain_id;
		const formLevelNum = formLevelRequirement === '' ? 0 : Number(formLevelRequirement);
		const levelMatch = formLevelNum === domainCard.level_requirement;
		const formRecallCostNum = formRecallCost === '' ? 0 : Number(formRecallCost);
		const recallCostMatch = formRecallCostNum === domainCard.recall_cost;
		const categoryMatch = formCategory === domainCard.category;
		const tokensMatch = formTokens === domainCard.tokens;
		const appliesInVaultMatch = formAppliesInVault === domainCard.applies_in_vault;
		const forcedInLoadoutMatch = formForcedInLoadout === domainCard.forced_in_loadout;
		const forcedInVaultMatch = formForcedInVault === domainCard.forced_in_vault;

		// Compare features (deep comparison)
		const featuresMatch = JSON.stringify(formFeatures) === JSON.stringify(domainCard.features);
		// Compare choices (deep comparison)
		const choicesMatch = JSON.stringify(formChoices) === JSON.stringify(domainCard.choices);

		return !(
			titleMatch &&
			imageUrlMatch &&
			artistNameMatch &&
			domainMatch &&
			levelMatch &&
			recallCostMatch &&
			categoryMatch &&
			tokensMatch &&
			appliesInVaultMatch &&
			forcedInLoadoutMatch &&
			forcedInVaultMatch &&
			featuresMatch &&
			choicesMatch
		);
	});

	// Sync form state when domainCard prop changes
	$effect(() => {
		if (domainCard) {
			formTitle = domainCard.title;
			formImageUrl = domainCard.image_url;
			formArtistName = domainCard.artist_name;
			formDomainId = domainCard.domain_id;
			formLevelRequirement = domainCard.level_requirement === 0 ? '' : String(domainCard.level_requirement);
			formRecallCost = domainCard.recall_cost === 0 ? '' : String(domainCard.recall_cost);
			formCategory = domainCard.category;
			formTokens = domainCard.tokens;
			formAppliesInVault = domainCard.applies_in_vault;
			formForcedInLoadout = domainCard.forced_in_loadout;
			formForcedInVault = domainCard.forced_in_vault;
			formFeatures = JSON.parse(JSON.stringify(domainCard.features));
			formChoices = JSON.parse(JSON.stringify(domainCard.choices));
			// Clear errors when domainCard changes
			errors = {};
			featureErrors.clear();
		}
	});

	function buildFormData() {
		return {
			card_type: 'domain' as const,
			domain_id: formDomainId,
			title: formTitle.trim(),
			image_url: formImageUrl,
			artist_name: formArtistName,
			level_requirement: formLevelRequirement === '' ? 0 : Number(formLevelRequirement),
			recall_cost: formRecallCost === '' ? 0 : Number(formRecallCost),
			category: formCategory,
			tokens: formTokens,
			applies_in_vault: formAppliesInVault,
			forced_in_loadout: formForcedInLoadout,
			forced_in_vault: formForcedInVault,
			features: JSON.parse(JSON.stringify(formFeatures)),
			choices: JSON.parse(JSON.stringify(formChoices))
		};
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!domainCard) return;

		// Clear previous errors
		errors = {};
		featureErrors.clear();

		// Validate all features directly
		let allFeaturesValid = true;
		for (let i = 0; i < formFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formFeatures[i]);
			if (!result.success) {
				allFeaturesValid = false;
				featureErrors.set(i, true);
			}
		}

		// Build form data
		const formData = buildFormData();

		// Validate with Zod
		const result = DomainCardFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid) {
			errors = { ...errors, features: 'One or more features have validation errors' };
			return;
		}

		// Update the domainCard prop with validated form values
		domainCard = {
			...domainCard,
			...result.data
		};

		// Clear errors on success
		errors = {};
		featureErrors.clear();
	}

	function handleReset() {
		if (!domainCard) return;
		// Re-sync form from domainCard prop
		formTitle = domainCard.title;
		formImageUrl = domainCard.image_url;
		formArtistName = domainCard.artist_name;
		formDomainId = domainCard.domain_id;
		formLevelRequirement = domainCard.level_requirement === 0 ? '' : String(domainCard.level_requirement);
		formRecallCost = domainCard.recall_cost === 0 ? '' : String(domainCard.recall_cost);
		formCategory = domainCard.category;
		formTokens = domainCard.tokens;
		formAppliesInVault = domainCard.applies_in_vault;
		formForcedInLoadout = domainCard.forced_in_loadout;
		formForcedInVault = domainCard.forced_in_vault;
		formFeatures = JSON.parse(JSON.stringify(domainCard.features));
		formChoices = JSON.parse(JSON.stringify(domainCard.choices));
		// Clear errors on reset
		errors = {};
		featureErrors.clear();
	}

	function addFeature() {
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formFeatures = [...formFeatures, newFeature];
	}

	function removeFeature(index: number) {
		formFeatures = formFeatures.filter((_, i) => i !== index);
		// Clean up errors and re-index for items after the removed one
		featureErrors.delete(index);

		// Collect entries that need re-indexing
		const errorsToReindex: [number, boolean][] = [];
		for (const [i, hasError] of featureErrors) {
			if (i > index) {
				errorsToReindex.push([i, hasError]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			featureErrors.delete(i);
		}
		for (const [i, hasError] of errorsToReindex) {
			featureErrors.set(i - 1, hasError);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-domain-card-title"
			class={cn('text-xs font-medium text-muted-foreground', errors.title && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-domain-card-title"
			bind:value={formTitle}
			placeholder="Domain card name"
			aria-invalid={!!errors.title}
		/>
		{#if errors.title}
			<p class="text-xs text-destructive">{errors.title}</p>
		{/if}
	</div>

	<!-- Domain & Category Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-domain" class="text-xs font-medium text-muted-foreground"
				>Domain</label
			>
			<Select.Root type="single" bind:value={formDomainId}>
				<Select.Trigger id="hb-domain-card-domain" class="w-full">
					<p class="truncate">{formDomainId}</p>
				</Select.Trigger>
				<Select.Content>
					{#each domainOptions as domain}
						<Select.Item value={domain}>{domain}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-category" class="text-xs font-medium text-muted-foreground"
				>Category</label
			>
			<Select.Root type="single" bind:value={formCategory}>
				<Select.Trigger id="hb-domain-card-category" class="w-full">
					<p class="truncate">{formCategory}</p>
				</Select.Trigger>
				<Select.Content>
					{#each categoryOptions as category}
						<Select.Item value={category}>{category}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Level Requirement & Recall Cost Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-level" class="text-xs font-medium text-muted-foreground"
				>Level Requirement</label
			>
			<Input
				id="hb-domain-card-level"
				type="number"
				inputmode="numeric"
				bind:value={formLevelRequirement}
				placeholder="1"
				min="1"
				step="1"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-domain-card-recall-cost" class="text-xs font-medium text-muted-foreground"
				>Recall Cost</label
			>
			<Input
				id="hb-domain-card-recall-cost"
				type="number"
				inputmode="numeric"
				bind:value={formRecallCost}
				placeholder="0"
				min="0"
				step="1"
			/>
		</div>
	</div>

	<!-- Image URL -->
	<div class="flex flex-col gap-1">
		<label for="hb-domain-card-image-url" class="text-xs font-medium text-muted-foreground"
			>Image URL</label
		>
		<Input
			id="hb-domain-card-image-url"
			bind:value={formImageUrl}
			placeholder="https://example.com/image.jpg"
		/>
	</div>

	<!-- Artist Name -->
	<div class="flex flex-col gap-1">
		<label for="hb-domain-card-artist-name" class="text-xs font-medium text-muted-foreground"
			>Artist Name</label
		>
		<Input
			id="hb-domain-card-artist-name"
			bind:value={formArtistName}
			placeholder="Artist name"
		/>
	</div>

	<!-- Boolean Flags -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Card Flags</p>
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<Checkbox id="hb-domain-card-tokens" bind:checked={formTokens} />
				<label for="hb-domain-card-tokens" class="text-xs text-muted-foreground">Uses Tokens</label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="hb-domain-card-applies-in-vault" bind:checked={formAppliesInVault} />
				<label for="hb-domain-card-applies-in-vault" class="text-xs text-muted-foreground"
					>Applies in Vault</label
				>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="hb-domain-card-forced-in-loadout" bind:checked={formForcedInLoadout} />
				<label for="hb-domain-card-forced-in-loadout" class="text-xs text-muted-foreground"
					>Forced in Loadout</label
				>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox id="hb-domain-card-forced-in-vault" bind:checked={formForcedInVault} />
				<label for="hb-domain-card-forced-in-vault" class="text-xs text-muted-foreground"
					>Forced in Vault</label
				>
			</div>
		</div>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					errors.features && 'text-destructive'
				)}
			>
				Features
			</p>
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		{#if errors.features}
			<p class="text-xs text-destructive">{errors.features}</p>
		{/if}
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.get(index) ? 'border-destructive' : ''}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						onRemove={() => removeFeature(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No features added</p>
			{/each}
		</div>
	</div>

	<!-- Choices -->
	<div class="flex flex-col gap-2">
		<DomainChoicesEditor bind:choices={formChoices} />
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
