<script lang="ts">
	import type {
		WeaponModifier,
		CharacterCondition,
		Ranges,
		DamageTypes,
		TraitIds
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import HomebrewCharacterConditionEditor from './homebrew-character-condition-editor.svelte';
	import DicePicker from '../dice/dice-picker.svelte';
	import { cn, capitalize } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';

	let { modifier = $bindable() }: { modifier: WeaponModifier } = $props();

	// Behaviour options
	const behaviourOptions = ['bonus', 'base', 'override'] as const;

	// Target weapon options
	const targetWeaponOptions = ['primary', 'secondary', 'unarmed', 'all'] as const;

	// Target stat options
	const targetStatOptions = [
		'attack_roll',
		'damage_bonus',
		'damage_dice',
		'damage_type',
		'range',
		'trait'
	] as const;

	// Range options
	const rangeOptions: Ranges[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];

	// Damage type options
	const damageTypeOptions: DamageTypes[] = ['phy', 'mag'];

	// Trait options
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

	let isOpen = $state(false);

	// Get current target stat
	let currentTargetStat = $derived(modifier.target_stat || 'attack_roll');

	// Initialize modifier if needed
	$effect(() => {
		if (!modifier) {
			modifier = {
				behaviour: 'bonus',
				character_conditions: [],
				target_weapon: 'all',
				target_stat: 'attack_roll',
				value: 0
			};
		}
	});

	// Update target stat
	function updateTargetStat(newTargetStat: string) {
		// Preserve base properties
		const baseProps = {
			behaviour: modifier.behaviour,
			character_conditions: modifier.character_conditions,
			target_weapon: modifier.target_weapon
		};

		// Set target stat-specific properties
		if (newTargetStat === 'attack_roll' || newTargetStat === 'damage_bonus') {
			modifier = {
				...baseProps,
				target_stat: newTargetStat,
				value: 0
			} as WeaponModifier;
		} else if (newTargetStat === 'damage_dice') {
			modifier = {
				...baseProps,
				target_stat: 'damage_dice',
				dice: ''
			} as WeaponModifier;
		} else if (newTargetStat === 'damage_type') {
			modifier = {
				...baseProps,
				target_stat: 'damage_type',
				damage_type: 'phy'
			} as WeaponModifier;
		} else if (newTargetStat === 'range') {
			modifier = {
				...baseProps,
				target_stat: 'range',
				range: 'Melee'
			} as WeaponModifier;
		} else if (newTargetStat === 'trait') {
			modifier = {
				...baseProps,
				target_stat: 'trait',
				trait: 'agility'
			} as WeaponModifier;
		}
	}

	// Add condition
	function addCondition() {
		const newCondition: CharacterCondition = {
			type: 'armor_equipped',
			value: false
		};
		modifier = {
			...modifier,
			character_conditions: [...modifier.character_conditions, newCondition]
		};
	}

	// Remove condition
	function removeCondition(index: number) {
		modifier = {
			...modifier,
			character_conditions: modifier.character_conditions.filter((_, i) => i !== index)
		};
	}
</script>

<Collapsible.Root bind:open={isOpen}>
	<Collapsible.Trigger
		class={cn(
			'flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm',
			isOpen && 'rounded-b-none'
		)}
	>
		<span>
			Weapon Modifier ({modifier.behaviour} - {modifier.target_weapon} - {modifier.target_stat})
		</span>
		<ChevronLeft class={cn('size-4 transition-transform', isOpen && '-rotate-90')} />
	</Collapsible.Trigger>
	<Collapsible.Content class="flex flex-col gap-3 rounded-b-md border bg-card/50 p-3">
		<!-- Behaviour -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Behaviour</label>
			<Select.Root
				type="single"
				value={modifier.behaviour}
				onValueChange={(value) => {
					if (value) {
						modifier = { ...modifier, behaviour: value as 'bonus' | 'base' | 'override' };
					}
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">{modifier.behaviour}</p>
				</Select.Trigger>
				<Select.Content>
					{#each behaviourOptions as behaviour}
						<Select.Item value={behaviour}>{capitalize(behaviour)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Target Weapon -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Target Weapon</label>
			<Select.Root
				type="single"
				value={modifier.target_weapon}
				onValueChange={(value) => {
					if (value) {
						modifier = {
							...modifier,
							target_weapon: value as 'primary' | 'secondary' | 'unarmed' | 'all'
						};
					}
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">{capitalize(modifier.target_weapon)}</p>
				</Select.Trigger>
				<Select.Content>
					{#each targetWeaponOptions as weapon}
						<Select.Item value={weapon}>{capitalize(weapon)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Target Stat -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Target Stat</label>
			<Select.Root type="single" value={currentTargetStat} onValueChange={updateTargetStat}>
				<Select.Trigger class="w-full">
					<p class="truncate">{currentTargetStat.replace(/_/g, ' ')}</p>
				</Select.Trigger>
				<Select.Content>
					{#each targetStatOptions as stat}
						<Select.Item value={stat}>{stat.replace(/_/g, ' ')}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Target Stat-specific fields -->
		{#if currentTargetStat === 'attack_roll' || currentTargetStat === 'damage_bonus'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Value</label>
				<Input
					type="number"
					value={String(modifier.value)}
					oninput={(e) => {
						modifier = { ...modifier, value: Number(e.currentTarget.value) };
					}}
				/>
			</div>
		{:else if currentTargetStat === 'damage_dice'}
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium text-muted-foreground">Dice</label>
				<DicePicker
					value={modifier.dice || ''}
					onChange={(v) => {
						modifier = { ...modifier, dice: v };
					}}
				/>
			</div>
		{:else if currentTargetStat === 'damage_type'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Damage Type</label>
				<Select.Root
					type="single"
					value={modifier.damage_type}
					onValueChange={(value) => {
						if (value) {
							modifier = { ...modifier, damage_type: value as DamageTypes };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">{damageTypeMap[modifier.damage_type]}</p>
					</Select.Trigger>
					<Select.Content>
						{#each damageTypeOptions as type}
							<Select.Item value={type}>{damageTypeMap[type]}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{:else if currentTargetStat === 'range'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Range</label>
				<Select.Root
					type="single"
					value={modifier.range}
					onValueChange={(value) => {
						if (value) {
							modifier = { ...modifier, range: value as Ranges };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">{modifier.range}</p>
					</Select.Trigger>
					<Select.Content>
						{#each rangeOptions as range}
							<Select.Item value={range}>{range}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{:else if currentTargetStat === 'trait'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Trait</label>
				<Select.Root
					type="single"
					value={modifier.trait}
					onValueChange={(value) => {
						if (value) {
							modifier = { ...modifier, trait: value as TraitIds };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">{capitalize(modifier.trait)}</p>
					</Select.Trigger>
					<Select.Content>
						{#each traitOptions as trait}
							<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}

		<!-- Character Conditions -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<label class="text-xs font-medium text-muted-foreground">Character Conditions</label>
				<Button size="sm" variant="outline" onclick={addCondition}>
					<Plus class="size-3.5" />
					Add Condition
				</Button>
			</div>
			<div class="flex flex-col gap-2">
				{#each modifier.character_conditions as condition, index}
					<div class="flex items-start gap-2">
						<div class="flex-1">
							<HomebrewCharacterConditionEditor bind:condition={condition} />
						</div>
						<Button
							size="sm"
							variant="ghost"
							onclick={() => removeCondition(index)}
							class="mt-1"
						>
							<X class="size-4" />
						</Button>
					</div>
				{/each}
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
