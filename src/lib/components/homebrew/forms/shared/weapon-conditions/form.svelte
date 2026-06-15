<script lang="ts">
	import type { DamageType, Range, WeaponCondition } from '@convex/schemas/rules';
	import * as Select from '$lib/components/ui/select';
	import { defaultDamageTypeWeaponCondition, defaultRangeWeaponCondition } from './defaults';

	type RangeWeaponCondition = Extract<WeaponCondition, { type: 'range' }>;
	type DamageTypeWeaponCondition = Extract<WeaponCondition, { type: 'damage_type' }>;

	let {
		conditions = $bindable([])
	}: {
		conditions: WeaponCondition[];
	} = $props();

	const rangeOptions: Range[] = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'];
	const damageTypeOptions: DamageType[] = ['phy', 'mag'];
	const selectedTypes = $derived(conditions.map((condition) => condition.type));
	const rangeCondition = $derived(
		conditions.find((condition): condition is RangeWeaponCondition => condition.type === 'range')
	);
	const damageTypeCondition = $derived(
		conditions.find(
			(condition): condition is DamageTypeWeaponCondition => condition.type === 'damage_type'
		)
	);
	const conditionOptions = [
		{ value: 'range', label: 'Weapon must currently have one of these ranges' },
		{ value: 'damage_type', label: 'Weapon must currently use this damage type' }
	];

	function handleTypesChange(newTypes: string[]) {
		if (newTypes.includes('__clear_selection__')) {
			conditions = [];
			return;
		}

		const filteredTypes = newTypes.filter((type) => type !== '__clear_selection__');
		const nextConditions: WeaponCondition[] = [];

		if (filteredTypes.includes('range')) {
			nextConditions.push(rangeCondition ?? defaultRangeWeaponCondition());
		}

		if (filteredTypes.includes('damage_type')) {
			nextConditions.push(damageTypeCondition ?? defaultDamageTypeWeaponCondition());
		}

		conditions = nextConditions;
	}

	function updateRangeCondition(selectedRanges: string[]) {
		if (
			selectedRanges.includes('__clear_selection__') ||
			selectedRanges.filter((value) => value !== '__clear_selection__').length === 0
		) {
			conditions = conditions.filter((condition) => condition.type !== 'range');
			return;
		}

		const ranges = selectedRanges.filter(
			(value): value is Range =>
				value !== '__clear_selection__' && rangeOptions.includes(value as Range)
		);
		const nextRangeCondition: RangeWeaponCondition = { type: 'range', ranges };
		if (conditions.some((condition) => condition.type === 'range')) {
			conditions = conditions.map((condition) =>
				condition.type === 'range' ? nextRangeCondition : condition
			);
			return;
		}

		conditions = [...conditions, nextRangeCondition];
	}

	function updateDamageTypeCondition(damageType: DamageType) {
		const nextDamageTypeCondition: DamageTypeWeaponCondition = {
			type: 'damage_type',
			damage_type: damageType
		};
		if (conditions.some((condition) => condition.type === 'damage_type')) {
			conditions = conditions.map((condition) =>
				condition.type === 'damage_type' ? nextDamageTypeCondition : condition
			);
			return;
		}

		conditions = [...conditions, nextDamageTypeCondition];
	}
</script>

<div>
	<div class="flex flex-col gap-1">
		<Select.Root type="multiple" value={selectedTypes} onValueChange={handleTypesChange}>
			<Select.Trigger class="w-full">
				<p class="truncate">
					{selectedTypes.length > 0
						? `${selectedTypes.length} condition${selectedTypes.length === 1 ? '' : 's'} selected`
						: 'None selected'}
				</p>
			</Select.Trigger>
			<Select.Content>
				<Select.Item
					value="__clear_selection__"
					class="justify-center text-muted-foreground"
					disabled={selectedTypes.length === 0}
				>
					-- none selected --
				</Select.Item>
				{#each conditionOptions as option}
					<Select.Item value={option.value}>{option.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	{#if selectedTypes.length > 0}
		<div class="ml-3 flex flex-col gap-3 border-l-2 border-dotted border-primary pt-3 pl-2">
			{#if selectedTypes.includes('range')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">
						Weapon must currently have one of these ranges
					</p>
					<Select.Root
						type="multiple"
						value={rangeCondition?.ranges ?? []}
						onValueChange={updateRangeCondition}
					>
						<Select.Trigger class="w-full">
							<p class="truncate">
								{#if (rangeCondition?.ranges?.length ?? 0) > 0}
									{rangeCondition?.ranges.join(', ')}
								{:else}
									None selected
								{/if}
							</p>
						</Select.Trigger>
						<Select.Content>
							<Select.Item
								value="__clear_selection__"
								class="justify-center text-muted-foreground"
								disabled={!rangeCondition || rangeCondition.ranges.length === 0}
							>
								-- none selected --
							</Select.Item>
							{#each rangeOptions as range}
								<Select.Item value={range}>{range}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}

			{#if selectedTypes.includes('damage_type')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Weapon must currently use this damage type</p>
					<Select.Root
						type="single"
						value={damageTypeCondition?.damage_type ?? 'phy'}
						onValueChange={(value) => value && updateDamageTypeCondition(value as DamageType)}
					>
						<Select.Trigger class="w-full">
							<p class="truncate">
								{(damageTypeCondition?.damage_type ?? 'phy') === 'phy' ? 'Physical' : 'Magical'}
							</p>
						</Select.Trigger>
						<Select.Content>
							{#each damageTypeOptions as damageType}
								<Select.Item value={damageType}
									>{damageType === 'phy' ? 'Physical' : 'Magical'}</Select.Item
								>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}
		</div>
	{/if}
</div>
