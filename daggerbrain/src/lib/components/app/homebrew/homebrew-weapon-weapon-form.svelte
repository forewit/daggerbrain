<script lang="ts">
	import type {
		DamageTypes,
		Ranges,
		TraitIds,
		Weapon,
		WeaponCategories
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import DicePicker from '../dice/dice-picker.svelte';

	let { weapon = $bindable() }: { weapon: Weapon } = $props();

	// Form state - initialized from weapon prop
	let formTitle = $state('');
	let formDescriptionHtml = $state('');
	let formTier = $state('');
	let formCategory = $state<WeaponCategories>('Primary');
	let formType = $state<'Physical' | 'Magical'>('Physical');
	let formRange = $state<Ranges>('Melee');
	let formAvailableTraits = $state<TraitIds[]>([]);
	let formDamageTypes = $state<DamageTypes[]>([]);
	let formBurden = $state<'0' | '1' | '2'>('1');
	let formDamageDice = $state('');
	let formDamageBonus = $state('');
	let formAttackRollBonus = $state('');

	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];
	const categoryOptions: WeaponCategories[] = ['Primary', 'Secondary'];
	const typeOptions: ('Physical' | 'Magical')[] = ['Physical', 'Magical'];
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];
	const burdenOptions: ('0' | '1' | '2')[] = ['0', '1', '2'];

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

	// Check if form has changes compared to the weapon prop
	let hasChanges = $derived.by(() => {
		if (!weapon) return false;

		const titleMatch = formTitle.trim() === weapon.title;
		const descriptionMatch = formDescriptionHtml === weapon.description_html;

		// Compare tier/level
		const formLevelRequirement = formTier ? tierToMinLevel(Number(formTier)) : 1;
		const tierMatch = formLevelRequirement === weapon.level_requirement;

		const categoryMatch = formCategory === weapon.category;
		const typeMatch = formType === weapon.type;
		const rangeMatch = formRange === weapon.range;

		// Compare traits
		const sortedFormTraits = [...formAvailableTraits].sort();
		const sortedWeaponTraits = [...weapon.available_traits].sort();
		const traitsMatch = JSON.stringify(sortedFormTraits) === JSON.stringify(sortedWeaponTraits);

		// Compare damage types
		const sortedFormDamageTypes = [...formDamageTypes].sort();
		const sortedWeaponDamageTypes = [...weapon.available_damage_types].sort();
		const damageTypesMatch =
			JSON.stringify(sortedFormDamageTypes) === JSON.stringify(sortedWeaponDamageTypes);

		const burdenMatch = Number(formBurden) === weapon.burden;
		const damageDiceMatch = formDamageDice === weapon.damage_dice;

		const formDamageBonusNum = formDamageBonus === '' ? 0 : Number(formDamageBonus);
		const damageBonusMatch = formDamageBonusNum === weapon.damage_bonus;

		const formAttackRollBonusNum = formAttackRollBonus === '' ? 0 : Number(formAttackRollBonus);
		const attackRollBonusMatch = formAttackRollBonusNum === weapon.attack_roll_bonus;

		return !(
			titleMatch &&
			descriptionMatch &&
			tierMatch &&
			categoryMatch &&
			typeMatch &&
			rangeMatch &&
			traitsMatch &&
			damageTypesMatch &&
			burdenMatch &&
			damageDiceMatch &&
			damageBonusMatch &&
			attackRollBonusMatch
		);
	});

	// Sync form state when weapon prop changes
	$effect(() => {
		if (weapon) {
			formTitle = weapon.title;
			formDescriptionHtml = weapon.description_html;
			formTier = String(levelToTier(weapon.level_requirement));
			formCategory = weapon.category;
			formType = weapon.type;
			formRange = weapon.range;
			formAvailableTraits = [...weapon.available_traits];
			formDamageTypes = [...weapon.available_damage_types];
			formBurden = String(weapon.burden) as '0' | '1' | '2';
			formDamageDice = weapon.damage_dice;
			formDamageBonus = weapon.damage_bonus === 0 ? '' : String(weapon.damage_bonus);
			formAttackRollBonus = weapon.attack_roll_bonus === 0 ? '' : String(weapon.attack_roll_bonus);
		}
	});

	function handleSave() {
		if (!weapon) return;

		// Update the weapon prop with form values
		weapon = {
			...weapon,
			title: formTitle.trim(),
			description_html: formDescriptionHtml,
			level_requirement: formTier ? tierToMinLevel(Number(formTier)) : 1,
			category: formCategory,
			type: formType,
			range: formRange,
			available_traits: [...formAvailableTraits],
			available_damage_types: [...formDamageTypes],
			burden: Number(formBurden) as 0 | 1 | 2,
			damage_dice: formDamageDice,
			damage_bonus: formDamageBonus === '' ? 0 : Number(formDamageBonus),
			attack_roll_bonus: formAttackRollBonus === '' ? 0 : Number(formAttackRollBonus)
		};
	}

	function handleReset() {
		if (!weapon) return;
		// Re-sync form from weapon prop
		formTitle = weapon.title;
		formDescriptionHtml = weapon.description_html;
		formTier = String(levelToTier(weapon.level_requirement));
		formCategory = weapon.category;
		formType = weapon.type;
		formRange = weapon.range;
		formAvailableTraits = [...weapon.available_traits];
		formDamageTypes = [...weapon.available_damage_types];
		formBurden = String(weapon.burden) as '0' | '1' | '2';
		formDamageDice = weapon.damage_dice;
		formDamageBonus = weapon.damage_bonus === 0 ? '' : String(weapon.damage_bonus);
		formAttackRollBonus = weapon.attack_roll_bonus === 0 ? '' : String(weapon.attack_roll_bonus);
	}

	function toggleTrait(trait: TraitIds) {
		if (formAvailableTraits.includes(trait)) {
			formAvailableTraits = formAvailableTraits.filter((t) => t !== trait);
		} else {
			formAvailableTraits = [...formAvailableTraits, trait];
		}
	}

	function toggleDamageType(type: DamageTypes) {
		if (formDamageTypes.includes(type)) {
			formDamageTypes = formDamageTypes.filter((t) => t !== type);
		} else {
			formDamageTypes = [...formDamageTypes, type];
		}
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-title" class="text-xs font-medium text-muted-foreground">Name</label>
		<Input id="hb-weapon-title" bind:value={formTitle} placeholder="Weapon name" />
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-description" class="text-xs font-medium text-muted-foreground"
			>Description</label
		>
		<Textarea
			id="hb-weapon-description"
			bind:value={formDescriptionHtml}
			placeholder="Weapon description (supports HTML)"
			rows={3}
		/>
	</div>

	<!-- Category & Type Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-category" class="text-xs font-medium text-muted-foreground"
				>Category</label
			>
			<Select.Root type="single" bind:value={formCategory}>
				<Select.Trigger id="hb-weapon-category" class="w-full">
					<p class="truncate">{formCategory}</p>
				</Select.Trigger>
				<Select.Content>
					{#each categoryOptions as category}
						<Select.Item value={category}>{category}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-type" class="text-xs font-medium text-muted-foreground">Type</label>
			<Select.Root type="single" bind:value={formType}>
				<Select.Trigger id="hb-weapon-type" class="w-full">
					<p class="truncate">{formType}</p>
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as type}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Tier & Range Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
			<Select.Root type="single" bind:value={formTier}>
				<Select.Trigger id="hb-weapon-tier" class="w-full">
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
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-range" class="text-xs font-medium text-muted-foreground">Range</label>
			<Select.Root type="single" bind:value={formRange}>
				<Select.Trigger id="hb-weapon-range" class="w-full">
					<p class="truncate">{formRange}</p>
				</Select.Trigger>
				<Select.Content>
					{#each rangeOptions as range}
						<Select.Item value={range}>{range}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Available Traits -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Available Traits</p>
		<div class="flex flex-wrap gap-3">
			{#each traitOptions as trait}
				<label class="flex items-center gap-2 text-xs">
					<input
						type="checkbox"
						checked={formAvailableTraits.includes(trait)}
						onchange={() => toggleTrait(trait)}
						class="accent-accent"
					/>
					{capitalize(trait)}
				</label>
			{/each}
		</div>
	</div>

	<!-- Damage Types -->
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-muted-foreground">Damage Types</p>
		<div class="flex gap-4">
			{#each damageTypeOptions as type}
				<label class="flex items-center gap-2 text-xs">
					<input
						type="checkbox"
						checked={formDamageTypes.includes(type)}
						onchange={() => toggleDamageType(type)}
						class="accent-accent"
					/>
					{damageTypeMap[type]}
				</label>
			{/each}
		</div>
	</div>

	<!-- Burden -->
	<div class="flex flex-col gap-1">
		<label for="hb-weapon-burden" class="text-xs font-medium text-muted-foreground">Burden</label>
		<Select.Root type="single" bind:value={formBurden}>
			<Select.Trigger id="hb-weapon-burden" class="w-full">
				<p class="truncate">{formBurden}</p>
			</Select.Trigger>
			<Select.Content>
				{#each burdenOptions as burden}
					<Select.Item value={burden}>{burden}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Damage Dice -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="hb-weapon-damage-dice" class="text-xs font-medium text-muted-foreground"
				>Damage Dice</label
			>
			<button
				type="button"
				disabled={formDamageDice === ''}
				class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:hidden"
				onclick={() => (formDamageDice = '')}
				title="Reset damage dice"
			>
				Reset
				<RotateCcw class="size-3.5" />
			</button>
		</div>
		<DicePicker value={formDamageDice} onChange={(v) => (formDamageDice = v)} />
		{#if formDamageDice}
			<p class="text-xs text-muted-foreground text-center">{formDamageDice}</p>
		{/if}
	</div>

	<!-- Damage Bonus & Attack Roll Bonus Row -->
	<div class="grid grid-cols-2 gap-3">
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-damage-bonus" class="text-xs font-medium text-muted-foreground"
				>Damage Bonus</label
			>
			<Input
				id="hb-weapon-damage-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formDamageBonus}
				placeholder="0"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="hb-weapon-attack-roll-bonus" class="text-xs font-medium text-muted-foreground"
				>Attack Roll Bonus</label
			>
			<Input
				id="hb-weapon-attack-roll-bonus"
				type="number"
				inputmode="numeric"
				bind:value={formAttackRollBonus}
				placeholder="0"
			/>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-2 pt-2">
		<Button size="sm" onclick={handleSave} disabled={!hasChanges}>Save</Button>
		{#if hasChanges}
			<Button size="sm" variant="outline" onclick={handleReset}>Reset</Button>
		{/if}
	</div>
</div>
