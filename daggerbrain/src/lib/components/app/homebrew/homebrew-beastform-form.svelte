<script lang="ts">
	import type {
		DamageTypes,
		Feature,
		Ranges,
		TraitIds,
		Beastform
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import DicePicker from '$lib/components/app/dice/dice-picker.svelte';
	import HomebrewFeatureForm from './features/feature-form.svelte';
	import Dropdown from '../leveling/dropdown.svelte';

	let { beastform = $bindable() }: { beastform: Beastform } = $props();

	// Form state - initialized from beastform prop
	let formName = $state('');
	let formCategory = $state('');
	let formTier = $state('');
	let formCharacterTrait = $state<TraitIds>('agility');
	let formCharacterTraitBonus = $state('');
	let formAttackRange = $state<Ranges>('Melee');
	let formAttackTrait = $state<TraitIds>('agility');
	let formAttackDamageDice = $state('');
	let formAttackDamageBonus = $state('');
	let formAttackDamageType = $state<DamageTypes>('phy');
	let formAdvantages = $state<string[]>([]);
	let formEvasionBonus = $state('');
	let formFeatures = $state<Feature[]>([]);

	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

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

	// Check if form has changes compared to the beastform prop
	let hasChanges = $derived.by(() => {
		if (!beastform) return false;

		const nameMatch = formName.trim() === beastform.name;
		const categoryMatch = formCategory.trim() === beastform.category;

		// Compare tier/level
		const formLevelRequirement = formTier ? tierToMinLevel(Number(formTier)) : 1;
		const tierMatch = formLevelRequirement === beastform.level_requirement;

		// Compare character trait
		const formCharacterTraitBonusNum = formCharacterTraitBonus === '' ? 0 : Number(formCharacterTraitBonus);
		const characterTraitMatch =
			formCharacterTrait === beastform.character_trait.trait &&
			formCharacterTraitBonusNum === beastform.character_trait.bonus;

		// Compare attack
		const formAttackDamageBonusNum = formAttackDamageBonus === '' ? 0 : Number(formAttackDamageBonus);
		const attackMatch =
			formAttackRange === beastform.attack.range &&
			formAttackTrait === beastform.attack.trait &&
			formAttackDamageDice === beastform.attack.damage_dice &&
			formAttackDamageBonusNum === beastform.attack.damage_bonus &&
			formAttackDamageType === beastform.attack.damage_type;

		// Compare advantages
		const sortedFormAdvantages = [...formAdvantages].sort();
		const sortedBeastformAdvantages = [...beastform.advantages].sort();
		const advantagesMatch =
			JSON.stringify(sortedFormAdvantages) === JSON.stringify(sortedBeastformAdvantages);

		// Compare evasion bonus
		const formEvasionBonusNum = formEvasionBonus === '' ? 0 : Number(formEvasionBonus);
		const evasionMatch = formEvasionBonusNum === beastform.evasion_bonus;

		// Compare features (deep comparison)
		const featuresMatch =
			JSON.stringify(formFeatures) === JSON.stringify(beastform.features);

		return !(
			nameMatch &&
			categoryMatch &&
			tierMatch &&
			characterTraitMatch &&
			attackMatch &&
			advantagesMatch &&
			evasionMatch &&
			featuresMatch
		);
	});

	// Sync form state when beastform prop changes
	$effect(() => {
		if (beastform) {
			formName = beastform.name;
			formCategory = beastform.category;
			formTier = String(levelToTier(beastform.level_requirement));
			formCharacterTrait = beastform.character_trait.trait;
			formCharacterTraitBonus = beastform.character_trait.bonus === 0 ? '' : String(beastform.character_trait.bonus);
			formAttackRange = beastform.attack.range;
			formAttackTrait = beastform.attack.trait;
			formAttackDamageDice = beastform.attack.damage_dice;
			formAttackDamageBonus = beastform.attack.damage_bonus === 0 ? '' : String(beastform.attack.damage_bonus);
			formAttackDamageType = beastform.attack.damage_type;
			formAdvantages = [...beastform.advantages];
			formEvasionBonus = beastform.evasion_bonus === 0 ? '' : String(beastform.evasion_bonus);
			formFeatures = JSON.parse(JSON.stringify(beastform.features));
		}
	});

	function handleSave() {
		if (!beastform) return;

		// Update the beastform prop with form values
		beastform = {
			...beastform,
			name: formName.trim(),
			category: formCategory.trim(),
			level_requirement: formTier ? tierToMinLevel(Number(formTier)) : 1,
			character_trait: {
				trait: formCharacterTrait,
				bonus: formCharacterTraitBonus === '' ? 0 : Number(formCharacterTraitBonus)
			},
			attack: {
				range: formAttackRange,
				trait: formAttackTrait,
				damage_dice: formAttackDamageDice,
				damage_bonus: formAttackDamageBonus === '' ? 0 : Number(formAttackDamageBonus),
				damage_type: formAttackDamageType
			},
			advantages: [...formAdvantages],
			evasion_bonus: formEvasionBonus === '' ? 0 : Number(formEvasionBonus),
			features: JSON.parse(JSON.stringify(formFeatures))
		};
	}

	function handleReset() {
		if (!beastform) return;
		// Re-sync form from beastform prop
		formName = beastform.name;
		formCategory = beastform.category;
		formTier = String(levelToTier(beastform.level_requirement));
		formCharacterTrait = beastform.character_trait.trait;
		formCharacterTraitBonus = beastform.character_trait.bonus === 0 ? '' : String(beastform.character_trait.bonus);
		formAttackRange = beastform.attack.range;
		formAttackTrait = beastform.attack.trait;
		formAttackDamageDice = beastform.attack.damage_dice;
		formAttackDamageBonus = beastform.attack.damage_bonus === 0 ? '' : String(beastform.attack.damage_bonus);
		formAttackDamageType = beastform.attack.damage_type;
		formAdvantages = [...beastform.advantages];
		formEvasionBonus = beastform.evasion_bonus === 0 ? '' : String(beastform.evasion_bonus);
		formFeatures = JSON.parse(JSON.stringify(beastform.features));
	}

	function addAdvantage() {
		formAdvantages = [...formAdvantages, ''];
	}

	function removeAdvantage(index: number) {
		formAdvantages = formAdvantages.filter((_, i) => i !== index);
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
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Name -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-name" class="text-xs font-medium text-muted-foreground">Name</label>
		<Input id="hb-beastform-name" bind:value={formName} placeholder="Beastform name" />
	</div>

	<!-- Category -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-category" class="text-xs font-medium text-muted-foreground">Category</label>
		<Input id="hb-beastform-category" bind:value={formCategory} placeholder="e.g., Fox, Mouse, Weasel, etc." />
	</div>

	<!-- Tier -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
		<Select.Root type="single" bind:value={formTier}>
			<Select.Trigger id="hb-beastform-tier" class="w-full">
				<p class="truncate">{formTier || 'Select tier'}</p>
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="1">1</Select.Item>
				<Select.Item value="2">2</Select.Item>
				<Select.Item value="3">3</Select.Item>
				<Select.Item value="4">4</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Character Trait -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-beastform-character-trait" class="text-xs font-medium text-muted-foreground"
				>Character Trait</label
			>
			<Select.Root type="single" bind:value={formCharacterTrait}>
				<Select.Trigger id="hb-beastform-character-trait" class="w-full">
					<p class="truncate">{capitalize(formCharacterTrait)}</p>
				</Select.Trigger>
				<Select.Content>
					{#each traitOptions as trait}
						<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-beastform-character-trait-bonus" class="text-xs font-medium text-muted-foreground"
				>Character Trait Bonus</label
			>
			<Input
				id="hb-beastform-character-trait-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formCharacterTraitBonus}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Evasion Bonus -->
	<div class="flex flex-col gap-1">
		<label for="hb-beastform-evasion-bonus" class="text-xs font-medium text-muted-foreground"
			>Evasion Bonus</label
		>
		<Input
			id="hb-beastform-evasion-bonus"
			type="number"
			inputmode="numeric"
			bind:value={formEvasionBonus}
			placeholder="0"
		/>
	</div>

	<!-- Attack Section -->
	<div class="flex flex-col gap-2 rounded-lg border bg-primary/5 p-3">
		<p class="text-xs font-medium text-muted-foreground">Attack</p>

		<!-- Attack Range & Trait Row -->
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label for="hb-beastform-attack-range" class="text-xs font-medium text-muted-foreground"
					>Range</label
				>
				<Select.Root type="single" bind:value={formAttackRange}>
					<Select.Trigger id="hb-beastform-attack-range" class="w-full">
						<p class="truncate">{formAttackRange}</p>
					</Select.Trigger>
					<Select.Content>
						{#each rangeOptions as range}
							<Select.Item value={range}>{range}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label for="hb-beastform-attack-trait" class="text-xs font-medium text-muted-foreground"
					>Attack Trait</label
				>
				<Select.Root type="single" bind:value={formAttackTrait}>
					<Select.Trigger id="hb-beastform-attack-trait" class="w-full">
						<p class="truncate">{capitalize(formAttackTrait)}</p>
					</Select.Trigger>
					<Select.Content>
						{#each traitOptions as trait}
							<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<!-- Damage Dice -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<label for="hb-beastform-attack-damage-dice" class="text-xs font-medium text-muted-foreground"
						>Damage Dice</label
					>
					{#if formAttackDamageDice}
						<span class="text-xs text-muted-foreground">({formAttackDamageDice})</span>
					{/if}
				</div>
				<button
					type="button"
					disabled={formAttackDamageDice === ''}
					class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
					onclick={() => (formAttackDamageDice = '')}
					title="Reset damage dice"
				>
					Reset
					<RotateCcw class="size-3.5" />
				</button>
			</div>
			<DicePicker value={formAttackDamageDice} onChange={(v) => (formAttackDamageDice = v)} />
		</div>

		<!-- Damage Bonus & Damage Type Row -->
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1">
				<label for="hb-beastform-attack-damage-bonus" class="text-xs font-medium text-muted-foreground"
					>Damage Bonus</label
				>
				<Input
					id="hb-beastform-attack-damage-bonus"
					type="number"
					inputmode="numeric"
					bind:value={formAttackDamageBonus}
					placeholder="0"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label for="hb-beastform-attack-damage-type" class="text-xs font-medium text-muted-foreground"
					>Damage Type</label
				>
				<Select.Root type="single" bind:value={formAttackDamageType}>
					<Select.Trigger id="hb-beastform-attack-damage-type" class="w-full">
						<p class="truncate">{damageTypeMap[formAttackDamageType]}</p>
					</Select.Trigger>
					<Select.Content>
						{#each damageTypeOptions as type}
							<Select.Item value={type}>{damageTypeMap[type]}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>

	<!-- Advantages -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Advantages</p>
			<Button size="sm" variant="outline" onclick={addAdvantage}>
				<Plus class="size-3.5" />
				Add Advantage
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formAdvantages as advantage, index}
				<div class="flex items-center gap-2">
					<Input
						bind:value={formAdvantages[index]}
						placeholder="e.g., deceive, locate, sneak"
						class="flex-1"
					/>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => removeAdvantage(index)}
						class="text-destructive"
					>
						<X class="size-3.5" />
					</Button>
				</div>
			{:else}
				<p class="text-xs text-muted-foreground italic">No advantages added</p>
			{/each}
		</div>
	</div>

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Features</p>
			<Button size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index}
				<Dropdown
					title={feature.title || `Unnamed feature`}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						onRemove={() => removeFeature(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs text-muted-foreground italic">No features added</p>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button size="sm" onclick={handleSave} disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button size="sm" variant="link" onclick={handleReset}>Discard changes</Button>
		{/if}
	</div>
</div>

