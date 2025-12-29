<script lang="ts">
	import type {
		CharacterClass,
		Feature,
		DomainIds,
		Traits,
		TraitIds,
		AdventuringGear,
		Subclass
	} from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { cn, capitalize } from '$lib/utils';
	import HomebrewFeatureForm from './features/feature-form.svelte';
	import Dropdown from '../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import ImageUrlInput from './image-url-input.svelte';
	import {
		ClassFormSchema,
		FeatureSchema,
		extractFieldErrors,
		type ClassFormErrors
	} from './form-schemas';
	import { SvelteMap } from 'svelte/reactivity';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';

	let {
		characterClass = $bindable()
	}: {
		characterClass: CharacterClass;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// Reference to image input component
	let imageInput: { uploadPendingFile: () => Promise<string | null> } | null = $state(null);

	// Form state - initialized from characterClass prop
	let formName = $state('');
	let formDescriptionHtml = $state('');
	let formImageUrl = $state('');
	let formStartingEvasion = $state('');
	let formStartingMaxHp = $state('');
	let formPrimaryDomainId = $state<DomainIds>('arcana');
	let formSecondaryDomainId = $state<DomainIds>('arcana');
	let formHopeFeature = $state<Feature | null>(null);
	let formClassFeatures = $state<Feature[]>([]);
	let formSubclassIds = $state<string[]>([]);
	let formSuggestedTraits = $state<Traits>({
		agility: null,
		strength: null,
		finesse: null,
		instinct: null,
		presence: null,
		knowledge: null
	});
	let formSuggestedPrimaryWeaponId = $state<string | null>(null);
	let formSuggestedSecondaryWeaponId = $state<string | null>(null);
	let formSuggestedArmorId = $state<string | null>(null);
	let formGoldCoins = $state('');
	let formFreeGear = $state<AdventuringGear[]>([]);
	let formLootOrConsumableOptions = $state<string[]>([]);
	let formClassGearOptions = $state<AdventuringGear[]>([]);
	let formSpellbookPrompt = $state('');
	let formBackgroundQuestions = $state<string[]>([]);
	let formConnectionQuestions = $state<string[]>([]);
	let formClothes = $state('');
	let formEyes = $state('');
	let formBody = $state('');
	let formSkin = $state('');
	let formAttitude = $state('');

	// Validation errors state
	let errors = $state<ClassFormErrors>({});

	// Feature validation state
	const featureErrors = new SvelteMap<number, boolean>();
	let hopeFeatureError = $state(false);

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

	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	// Get all available subclasses (compendium + homebrew)
	let availableSubclasses = $derived.by(() => {
		const subclasses: Array<{ id: string; name: string; source: 'compendium' | 'homebrew' }> = [];
		// Add compendium subclasses
		for (const [id, subclass] of Object.entries(compendium.subclasses)) {
			subclasses.push({ id, name: subclass.name, source: 'compendium' });
		}
		// Add homebrew subclasses
		for (const [id, subclass] of Object.entries(homebrew.subclasses)) {
			subclasses.push({ id, name: subclass.name, source: 'homebrew' });
		}
		return subclasses.sort((a, b) => a.name.localeCompare(b.name));
	});

	// Get all available weapons and armor (compendium + homebrew)
	let availablePrimaryWeapons = $derived.by(() => {
		const weapons: Array<{ id: string; title: string; source: 'compendium' | 'homebrew' }> = [];
		for (const [id, weapon] of Object.entries(compendium.primary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'compendium' });
		}
		for (const [id, weapon] of Object.entries(homebrew.primary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'homebrew' });
		}
		return weapons.sort((a, b) => a.title.localeCompare(b.title));
	});

	let availableSecondaryWeapons = $derived.by(() => {
		const weapons: Array<{ id: string; title: string; source: 'compendium' | 'homebrew' }> = [];
		for (const [id, weapon] of Object.entries(compendium.secondary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'compendium' });
		}
		for (const [id, weapon] of Object.entries(homebrew.secondary_weapons)) {
			weapons.push({ id, title: weapon.title, source: 'homebrew' });
		}
		return weapons.sort((a, b) => a.title.localeCompare(b.title));
	});

	let availableArmor = $derived.by(() => {
		const armor: Array<{ id: string; title: string; source: 'compendium' | 'homebrew' }> = [];
		for (const [id, item] of Object.entries(compendium.armor)) {
			armor.push({ id, title: item.title, source: 'compendium' });
		}
		for (const [id, item] of Object.entries(homebrew.armor)) {
			armor.push({ id, title: item.title, source: 'homebrew' });
		}
		return armor.sort((a, b) => a.title.localeCompare(b.title));
	});

	// Check if form has changes
	let hasChanges = $derived.by(() => {
		if (!characterClass) return false;
		// This is complex - we'll do a deep comparison
		const current = JSON.stringify(buildFormData());
		const original = JSON.stringify(characterClass);
		return current !== original;
	});

	// Sync form state when characterClass prop changes
	$effect(() => {
		if (characterClass) {
			formName = characterClass.name;
			formDescriptionHtml = characterClass.description_html;
			formImageUrl = characterClass.image_url;
			formStartingEvasion = String(characterClass.starting_evasion);
			formStartingMaxHp = String(characterClass.starting_max_hp);
			formPrimaryDomainId = characterClass.primary_domain_id;
			formSecondaryDomainId = characterClass.secondary_domain_id;
			formHopeFeature = JSON.parse(JSON.stringify(characterClass.hope_feature));
			formClassFeatures = JSON.parse(JSON.stringify(characterClass.class_features));
			formSubclassIds = [...characterClass.subclass_ids];
			formSuggestedTraits = JSON.parse(JSON.stringify(characterClass.suggested_traits));
			formSuggestedPrimaryWeaponId = characterClass.suggested_primary_weapon_id;
			formSuggestedSecondaryWeaponId = characterClass.suggested_secondary_weapon_id;
			formSuggestedArmorId = characterClass.suggested_armor_id;
			formGoldCoins = String(characterClass.starting_inventory.gold_coins);
			formFreeGear = JSON.parse(JSON.stringify(characterClass.starting_inventory.free_gear));
			formLootOrConsumableOptions = [
				...characterClass.starting_inventory.loot_or_consumable_options
			];
			formClassGearOptions = JSON.parse(
				JSON.stringify(characterClass.starting_inventory.class_gear_options)
			);
			formSpellbookPrompt = characterClass.starting_inventory.spellbook_prompt || '';
			formBackgroundQuestions = [...characterClass.background_questions];
			formConnectionQuestions = [...characterClass.connection_questions];
			formClothes = characterClass.character_description_suggestions.clothes;
			formEyes = characterClass.character_description_suggestions.eyes;
			formBody = characterClass.character_description_suggestions.body;
			formSkin = characterClass.character_description_suggestions.skin;
			formAttitude = characterClass.character_description_suggestions.attitude;
			// Clear errors
			errors = {};
			featureErrors.clear();
			hopeFeatureError = false;
		}
	});

	function buildFormData() {
		return {
			name: formName.trim(),
			description_html: formDescriptionHtml,
			image_url: formImageUrl,
			starting_evasion: Number(formStartingEvasion),
			starting_max_hp: Number(formStartingMaxHp),
			hope_feature: formHopeFeature ? JSON.parse(JSON.stringify(formHopeFeature)) : null,
			primary_domain_id: formPrimaryDomainId,
			secondary_domain_id: formSecondaryDomainId,
			class_features: JSON.parse(JSON.stringify(formClassFeatures)),
			subclass_ids: [...formSubclassIds],
			suggested_traits: JSON.parse(JSON.stringify(formSuggestedTraits)),
			suggested_primary_weapon_id: formSuggestedPrimaryWeaponId,
			suggested_secondary_weapon_id: formSuggestedSecondaryWeaponId,
			suggested_armor_id: formSuggestedArmorId,
			starting_inventory: {
				gold_coins: Number(formGoldCoins),
				free_gear: JSON.parse(JSON.stringify(formFreeGear)),
				loot_or_consumable_options: [...formLootOrConsumableOptions],
				class_gear_options: JSON.parse(JSON.stringify(formClassGearOptions)),
				spellbook_prompt: formSpellbookPrompt || null
			},
			background_questions: [...formBackgroundQuestions],
			connection_questions: [...formConnectionQuestions],
			character_description_suggestions: {
				clothes: formClothes,
				eyes: formEyes,
				body: formBody,
				skin: formSkin,
				attitude: formAttitude
			}
		};
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!characterClass) return;

		// Clear previous errors
		errors = {};
		featureErrors.clear();
		hopeFeatureError = false;

		// Upload pending image if there is one
		if (imageInput) {
			try {
				const uploadedUrl = await imageInput.uploadPendingFile();
				if (uploadedUrl) {
					formImageUrl = uploadedUrl;
				}
			} catch (error) {
				console.error('Failed to upload image:', error);
				alert('Failed to upload image. Please try again.');
				return;
			}
		}

		// Validate hope feature
		if (formHopeFeature) {
			const result = FeatureSchema.safeParse(formHopeFeature);
			if (!result.success) {
				hopeFeatureError = true;
			}
		}

		// Validate all class features
		let allFeaturesValid = true;
		for (let i = 0; i < formClassFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formClassFeatures[i]);
			if (!result.success) {
				allFeaturesValid = false;
				featureErrors.set(i, true);
			}
		}

		// Build form data
		const formData = buildFormData();

		// Validate with Zod
		const result = ClassFormSchema.safeParse(formData);

		if (!result.success) {
			errors = extractFieldErrors(result.error);
			return;
		}

		if (!allFeaturesValid || hopeFeatureError) {
			errors = { ...errors, class_features: 'One or more features have validation errors' };
			return;
		}

		// Update the characterClass prop with validated form values
		characterClass = {
			...characterClass,
			...result.data
		};

		// Clear errors on success
		errors = {};
		featureErrors.clear();
		hopeFeatureError = false;
	}

	function handleReset() {
		if (!characterClass) return;
		// Re-sync form from characterClass prop
		formName = characterClass.name;
		formDescriptionHtml = characterClass.description_html;
		formImageUrl = characterClass.image_url;
		formStartingEvasion = String(characterClass.starting_evasion);
		formStartingMaxHp = String(characterClass.starting_max_hp);
		formPrimaryDomainId = characterClass.primary_domain_id;
		formSecondaryDomainId = characterClass.secondary_domain_id;
		formHopeFeature = JSON.parse(JSON.stringify(characterClass.hope_feature));
		formClassFeatures = JSON.parse(JSON.stringify(characterClass.class_features));
		formSubclassIds = [...characterClass.subclass_ids];
		formSuggestedTraits = JSON.parse(JSON.stringify(characterClass.suggested_traits));
		formSuggestedPrimaryWeaponId = characterClass.suggested_primary_weapon_id;
		formSuggestedSecondaryWeaponId = characterClass.suggested_secondary_weapon_id;
		formSuggestedArmorId = characterClass.suggested_armor_id;
		formGoldCoins = String(characterClass.starting_inventory.gold_coins);
		formFreeGear = JSON.parse(JSON.stringify(characterClass.starting_inventory.free_gear));
		formLootOrConsumableOptions = [...characterClass.starting_inventory.loot_or_consumable_options];
		formClassGearOptions = JSON.parse(
			JSON.stringify(characterClass.starting_inventory.class_gear_options)
		);
		formSpellbookPrompt = characterClass.starting_inventory.spellbook_prompt || '';
		formBackgroundQuestions = [...characterClass.background_questions];
		formConnectionQuestions = [...characterClass.connection_questions];
		formClothes = characterClass.character_description_suggestions.clothes;
		formEyes = characterClass.character_description_suggestions.eyes;
		formBody = characterClass.character_description_suggestions.body;
		formSkin = characterClass.character_description_suggestions.skin;
		formAttitude = characterClass.character_description_suggestions.attitude;
		// Clear errors
		errors = {};
		featureErrors.clear();
		hopeFeatureError = false;
	}

	function addClassFeature() {
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formClassFeatures = [...formClassFeatures, newFeature];
	}

	function removeClassFeature(index: number) {
		formClassFeatures = formClassFeatures.filter((_, i) => i !== index);
		featureErrors.delete(index);
		const errorsToReindex: [number, boolean][] = [];
		for (const [i, hasError] of featureErrors) {
			if (i > index) {
				errorsToReindex.push([i, hasError]);
			}
		}
		for (const [i] of errorsToReindex) {
			featureErrors.delete(i);
		}
		for (const [i, hasError] of errorsToReindex) {
			featureErrors.set(i - 1, hasError);
		}
	}

	function toggleSubclass(id: string) {
		if (formSubclassIds.includes(id)) {
			formSubclassIds = formSubclassIds.filter((sid) => sid !== id);
		} else {
			formSubclassIds = [...formSubclassIds, id];
		}
	}

	function addFreeGear() {
		formFreeGear = [...formFreeGear, { title: '' }];
	}

	function removeFreeGear(index: number) {
		formFreeGear = formFreeGear.filter((_, i) => i !== index);
	}

	function addClassGear() {
		formClassGearOptions = [...formClassGearOptions, { title: '' }];
	}

	function removeClassGear(index: number) {
		formClassGearOptions = formClassGearOptions.filter((_, i) => i !== index);
	}

	function addLootOrConsumableOption() {
		formLootOrConsumableOptions = [...formLootOrConsumableOptions, ''];
	}

	function removeLootOrConsumableOption(index: number) {
		formLootOrConsumableOptions = formLootOrConsumableOptions.filter((_, i) => i !== index);
	}

	function addBackgroundQuestion() {
		formBackgroundQuestions = [...formBackgroundQuestions, ''];
	}

	function removeBackgroundQuestion(index: number) {
		formBackgroundQuestions = formBackgroundQuestions.filter((_, i) => i !== index);
	}

	function addConnectionQuestion() {
		formConnectionQuestions = [...formConnectionQuestions, ''];
	}

	function removeConnectionQuestion(index: number) {
		formConnectionQuestions = formConnectionQuestions.filter((_, i) => i !== index);
	}
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
	<!-- Name -->
	<div class="flex flex-col gap-1">
		<label
			for="hb-class-name"
			class={cn('text-xs font-medium text-muted-foreground', errors.name && 'text-destructive')}
			>Name</label
		>
		<Input
			id="hb-class-name"
			bind:value={formName}
			placeholder="Class name"
			aria-invalid={!!errors.name}
		/>
		{#if errors.name}
			<p class="text-xs text-destructive">{errors.name}</p>
		{/if}
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-class-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-class-description"
			bind:value={formDescriptionHtml}
			placeholder="Class description"
			rows={3}
		/>
	</div>

	<!-- Image -->
	<div class="flex flex-col gap-1">
		<label for="hb-class-image-url" class="text-xs font-medium text-muted-foreground">Image</label>
		<ImageUrlInput
			bind:this={imageInput}
			id="hb-class-image-url"
			bind:value={formImageUrl}
			alt="Class image"
		/>
	</div>

	<!-- Starting Stats -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-class-starting-evasion" class="text-xs font-medium text-muted-foreground"
				>Starting Evasion</label
			>
			<Input
				id="hb-class-starting-evasion"
				type="number"
				inputmode="numeric"
				bind:value={formStartingEvasion}
				placeholder="0"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-class-starting-max-hp" class="text-xs font-medium text-muted-foreground"
				>Starting Max HP</label
			>
			<Input
				id="hb-class-starting-max-hp"
				type="number"
				inputmode="numeric"
				bind:value={formStartingMaxHp}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Domains -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-class-primary-domain" class="text-xs font-medium text-muted-foreground"
				>Primary Domain</label
			>
			<Select.Root type="single" bind:value={formPrimaryDomainId}>
				<Select.Trigger id="hb-class-primary-domain" class="w-full">
					<p class="truncate">{formPrimaryDomainId}</p>
				</Select.Trigger>
				<Select.Content>
					{#each domainOptions as domain}
						<Select.Item value={domain}>{domain}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-class-secondary-domain" class="text-xs font-medium text-muted-foreground"
				>Secondary Domain</label
			>
			<Select.Root type="single" bind:value={formSecondaryDomainId}>
				<Select.Trigger id="hb-class-secondary-domain" class="w-full">
					<p class="truncate">{formSecondaryDomainId}</p>
				</Select.Trigger>
				<Select.Content>
					{#each domainOptions as domain}
						<Select.Item value={domain}>{domain}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Hope Feature -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					errors.hope_feature && 'text-destructive'
				)}
			>
				Hope Feature
			</p>
		</div>
		{#if errors.hope_feature}
			<p class="text-xs text-destructive">{errors.hope_feature}</p>
		{/if}
		{#if formHopeFeature}
			<Dropdown
				title={formHopeFeature.title || 'Hope Feature'}
				class={hopeFeatureError ? 'border-destructive' : ''}
			>
				<HomebrewFeatureForm bind:feature={formHopeFeature} />
			</Dropdown>
		{:else}
			<Button
				type="button"
				size="sm"
				variant="outline"
				onclick={() => {
					formHopeFeature = {
						title: '',
						description_html: '',
						character_modifiers: [],
						weapon_modifiers: []
					};
				}}
			>
				<Plus class="size-3.5" />
				Add Hope Feature
			</Button>
		{/if}
	</div>

	<!-- Class Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p
				class={cn(
					'text-xs font-medium text-muted-foreground',
					errors.class_features && 'text-destructive'
				)}
			>
				Class Features
			</p>
			<Button type="button" size="sm" variant="outline" onclick={addClassFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		{#if errors.class_features}
			<p class="text-xs text-destructive">{errors.class_features}</p>
		{/if}
		<div class="flex flex-col gap-2">
			{#each formClassFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.get(index) ? 'border-destructive' : ''}
				>
					<HomebrewFeatureForm
						bind:feature={formClassFeatures[index]}
						onRemove={() => removeClassFeature(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No class features added</p>
			{/each}
		</div>
	</div>

	<!-- Subclasses -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Subclasses</p>
		<div class="flex flex-wrap gap-2">
			{#each availableSubclasses as subclass}
				<label class="flex items-center gap-2 text-xs">
					<input
						type="checkbox"
						checked={formSubclassIds.includes(subclass.id)}
						onchange={() => toggleSubclass(subclass.id)}
						class="accent-accent"
					/>
					{subclass.name} ({subclass.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
				</label>
			{/each}
		</div>
	</div>

	<!-- Suggested Traits -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Suggested Traits</p>
		<div class="grid grid-cols-2 gap-3">
			{#each traitOptions as trait}
				<div class="flex flex-col gap-1">
					<label for="class-suggested-trait-{trait}" class="text-xs text-muted-foreground"
						>{capitalize(trait)}</label
					>
					<Input
						id="class-suggested-trait-{trait}"
						type="number"
						value={formSuggestedTraits[trait] === null ? '' : String(formSuggestedTraits[trait])}
						oninput={(e) => {
							const value = e.currentTarget.value;
							formSuggestedTraits = {
								...formSuggestedTraits,
								[trait]: value === '' ? null : Number(value)
							};
						}}
						placeholder="null"
					/>
				</div>
			{/each}
		</div>
	</div>

	<!-- Suggested Equipment -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Suggested Equipment</p>
		<div class="grid grid-cols-3 gap-3">
			<div class="flex flex-col gap-1">
				<label for="class-primary-weapon" class="text-xs text-muted-foreground"
					>Primary Weapon</label
				>
				<Select.Root
					type="single"
					value={formSuggestedPrimaryWeaponId || undefined}
					onValueChange={(v) => (formSuggestedPrimaryWeaponId = v || null)}
				>
					<Select.Trigger id="class-primary-weapon" class="w-full">
						<p class="truncate">
							{formSuggestedPrimaryWeaponId
								? availablePrimaryWeapons.find((w) => w.id === formSuggestedPrimaryWeaponId)
										?.title || 'Unknown'
								: 'None'}
						</p>
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each availablePrimaryWeapons as weapon}
							<Select.Item value={weapon.id}>
								{weapon.title} ({weapon.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-secondary-weapon" class="text-xs text-muted-foreground"
					>Secondary Weapon</label
				>
				<Select.Root
					type="single"
					value={formSuggestedSecondaryWeaponId || undefined}
					onValueChange={(v) => (formSuggestedSecondaryWeaponId = v || null)}
				>
					<Select.Trigger id="class-secondary-weapon" class="w-full">
						<p class="truncate">
							{formSuggestedSecondaryWeaponId
								? availableSecondaryWeapons.find((w) => w.id === formSuggestedSecondaryWeaponId)
										?.title || 'Unknown'
								: 'None'}
						</p>
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each availableSecondaryWeapons as weapon}
							<Select.Item value={weapon.id}>
								{weapon.title} ({weapon.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-armor" class="text-xs text-muted-foreground">Armor</label>
				<Select.Root
					type="single"
					value={formSuggestedArmorId || undefined}
					onValueChange={(v) => (formSuggestedArmorId = v || null)}
				>
					<Select.Trigger id="class-armor" class="w-full">
						<p class="truncate">
							{formSuggestedArmorId
								? availableArmor.find((a) => a.id === formSuggestedArmorId)?.title || 'Unknown'
								: 'None'}
						</p>
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">None</Select.Item>
						{#each availableArmor as item}
							<Select.Item value={item.id}>
								{item.title} ({item.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>

	<!-- Starting Inventory -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Starting Inventory</p>
		<div class="space-y-3 rounded-lg border bg-muted p-3">
			<!-- Gold Coins -->
			<div class="flex flex-col gap-1">
				<label for="class-gold-coins" class="text-xs text-muted-foreground">Gold Coins</label>
				<Input
					id="class-gold-coins"
					type="number"
					bind:value={formGoldCoins}
					placeholder="0"
					min="0"
				/>
			</div>

			<!-- Free Gear -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">Free Gear</p>
					<Button type="button" size="sm" variant="outline" onclick={addFreeGear}>
						<Plus class="size-3.5" />
						Add
					</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#each formFreeGear as gear, index (index)}
						<div class="flex items-center gap-2">
							<Input
								bind:value={formFreeGear[index].title}
								placeholder="Gear name"
								class="flex-1"
							/>
							<Button type="button" size="sm" variant="ghost" onclick={() => removeFreeGear(index)}>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Loot or Consumable Options -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">Loot or Consumable Options</p>
					<Button type="button" size="sm" variant="outline" onclick={addLootOrConsumableOption}>
						<Plus class="size-3.5" />
						Add
					</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#each formLootOrConsumableOptions as option, index (index)}
						<div class="flex items-center gap-2">
							<Input
								bind:value={formLootOrConsumableOptions[index]}
								placeholder="Item ID"
								class="flex-1"
							/>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								onclick={() => removeLootOrConsumableOption(index)}
							>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Class Gear Options -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">Class Gear Options</p>
					<Button type="button" size="sm" variant="outline" onclick={addClassGear}>
						<Plus class="size-3.5" />
						Add
					</Button>
				</div>
				<div class="flex flex-col gap-2">
					{#each formClassGearOptions as gear, index (index)}
						<div class="flex items-center gap-2">
							<Input
								bind:value={formClassGearOptions[index].title}
								placeholder="Gear name"
								class="flex-1"
							/>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								onclick={() => removeClassGear(index)}
							>
								<X class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Spellbook Prompt -->
			<div class="flex flex-col gap-1">
				<label for="class-spellbook-prompt" class="text-xs text-muted-foreground"
					>Spellbook Prompt (Optional)</label
				>
				<Input
					id="class-spellbook-prompt"
					bind:value={formSpellbookPrompt}
					placeholder="Spellbook prompt"
				/>
			</div>
		</div>
	</div>

	<!-- Background Questions -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Background Questions</p>
			<Button type="button" size="sm" variant="outline" onclick={addBackgroundQuestion}>
				<Plus class="size-3.5" />
				Add Question
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formBackgroundQuestions as question, index (index)}
				<div class="flex items-center gap-2">
					<Textarea
						bind:value={formBackgroundQuestions[index]}
						placeholder="Question"
						rows={2}
						class="flex-1"
					/>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onclick={() => removeBackgroundQuestion(index)}
					>
						<X class="size-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Connection Questions -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Connection Questions</p>
			<Button type="button" size="sm" variant="outline" onclick={addConnectionQuestion}>
				<Plus class="size-3.5" />
				Add Question
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formConnectionQuestions as question, index (index)}
				<div class="flex items-center gap-2">
					<Textarea
						bind:value={formConnectionQuestions[index]}
						placeholder="Question"
						rows={2}
						class="flex-1"
					/>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onclick={() => removeConnectionQuestion(index)}
					>
						<X class="size-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Character Description Suggestions -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Character Description Suggestions</p>
		<div class="space-y-3 rounded-lg border bg-muted p-3">
			<div class="flex flex-col gap-1">
				<label for="class-clothes" class="text-xs text-muted-foreground">Clothes</label>
				<Input id="class-clothes" bind:value={formClothes} placeholder="Clothes suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-eyes" class="text-xs text-muted-foreground">Eyes</label>
				<Input id="class-eyes" bind:value={formEyes} placeholder="Eyes suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-body" class="text-xs text-muted-foreground">Body</label>
				<Input id="class-body" bind:value={formBody} placeholder="Body suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-skin" class="text-xs text-muted-foreground">Skin</label>
				<Input id="class-skin" bind:value={formSkin} placeholder="Skin suggestion" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="class-attitude" class="text-xs text-muted-foreground">Attitude</label>
				<Input id="class-attitude" bind:value={formAttitude} placeholder="Attitude suggestion" />
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button type="submit" size="sm" disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button type="button" size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</form>
