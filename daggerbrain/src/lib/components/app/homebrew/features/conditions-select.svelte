<script lang="ts">
	import type { CharacterCondition, DomainIds } from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	let { conditions = $bindable([]) }: { conditions?: CharacterCondition[] } = $props();

	const compendium = getCompendiumContext();

	// Condition type options with display labels
	const conditionOptions = [
		{ value: 'armor_equipped_true', label: 'Armor must be equipped' },
		{ value: 'armor_equipped_false', label: 'Armor must not be equipped' },
		{ value: 'level', label: 'Minimum level requirement' },
		{ value: 'min_loadout_cards_from_domain', label: 'Minimum cards from a domain in your loadout' }
	] as const;

	// Domain options
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

	// Get selected condition types from the conditions array
	let selectedTypes = $derived(
		conditions.map((cond) => {
			if (cond.type === 'armor_equipped') {
				return cond.value ? 'armor_equipped_true' : 'armor_equipped_false';
			}
			return cond.type;
		})
	);

	// Get condition values for display/editing
	let levelCondition = $derived(
		conditions.find((c) => c.type === 'level') as
			| { type: 'level'; min_level: number; max_level: number }
			| undefined
	);

	let loadoutCondition = $derived(
		conditions.find((c) => c.type === 'min_loadout_cards_from_domain') as
			| { type: 'min_loadout_cards_from_domain'; domain_id: DomainIds; min_cards: number }
			| undefined
	);

	// Get domain name helper
	function getDomainName(domainId: DomainIds): string {
		return (
			compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1)
		);
	}

	// Update conditions when selected types change
	function handleTypesChange(newTypes: string[]) {
		// Handle clear selection
		if (newTypes.includes('__clear_selection__')) {
			conditions = [];
			return;
		}

		// Filter out the clear selection option
		const filteredTypes = newTypes.filter((t) => t !== '__clear_selection__');

		const newConditions: CharacterCondition[] = [];
		let armorValue: boolean | null = null;

		// Handle armor conditions - only one can be selected at a time
		// If both are in filteredTypes, use the last one
		if (
			filteredTypes.includes('armor_equipped_true') ||
			filteredTypes.includes('armor_equipped_false')
		) {
			// Check which one appears last (or if only one is selected)
			const lastArmorType = filteredTypes
				.filter((t) => t === 'armor_equipped_true' || t === 'armor_equipped_false')
				.pop();
			if (lastArmorType === 'armor_equipped_true') {
				armorValue = true;
			} else if (lastArmorType === 'armor_equipped_false') {
				armorValue = false;
			}
		}

		// Add armor condition if one was selected
		if (armorValue !== null) {
			newConditions.push({ type: 'armor_equipped', value: armorValue });
		}

		// Handle other condition types
		for (const type of filteredTypes) {
			if (type === 'armor_equipped_true' || type === 'armor_equipped_false') {
				// Already handled above
				continue;
			} else if (type === 'level') {
				// Preserve existing level condition if it exists, otherwise create new one
				const existing = levelCondition;
				if (existing) {
					newConditions.push(existing);
				} else {
					newConditions.push({ type: 'level', min_level: 1, max_level: 10 });
				}
			} else if (type === 'min_loadout_cards_from_domain') {
				// Preserve existing loadout condition if it exists, otherwise create new one
				const existing = loadoutCondition;
				if (existing) {
					newConditions.push(existing);
				} else {
					newConditions.push({
						type: 'min_loadout_cards_from_domain',
						domain_id: 'arcana',
						min_cards: 1
					});
				}
			}
		}

		conditions = newConditions;
	}

	// Update level condition
	function updateLevelCondition(minLevel: number) {
		const newConditions = conditions.map((cond) => {
			if (cond.type === 'level') {
				return { type: 'level' as const, min_level: minLevel, max_level: 10 };
			}
			return cond;
		});
		conditions = newConditions;
	}

	// Update loadout condition domain
	function updateLoadoutDomain(domainId: DomainIds) {
		const newConditions = conditions.map((cond) => {
			if (cond.type === 'min_loadout_cards_from_domain') {
				return { ...cond, domain_id: domainId };
			}
			return cond;
		});
		conditions = newConditions;
	}

	// Update loadout condition min cards
	function updateLoadoutMinCards(minCards: number) {
		const newConditions = conditions.map((cond) => {
			if (cond.type === 'min_loadout_cards_from_domain') {
				return { ...cond, min_cards: minCards };
			}
			return cond;
		});
		conditions = newConditions;
	}
</script>

<div>
	<!-- Condition Type Selector -->
	<div class="flex flex-col gap-1">
		<Select.Root type="multiple" value={selectedTypes} onValueChange={handleTypesChange}>
			<Select.Trigger id="condition-types-select" class="w-full">
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
		<div class="mx-3 flex flex-col gap-3 border-l-2 border-dotted border-primary pt-3 pl-2">
			<!-- Condition-specific fields -->
			{#if selectedTypes.includes('armor_equipped_true') || selectedTypes.includes('armor_equipped_false')}
				<p class="text-xs text-muted-foreground">
					{selectedTypes.includes('armor_equipped_true')
						? 'Armor must be equipped'
						: 'Armor must not be equipped'}
				</p>
			{/if}

			{#if selectedTypes.includes('level')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Minimum level requirement</p>
					<Input
						id="level-input"
						type="number"
						value={levelCondition ? String(levelCondition.min_level) : '1'}
						oninput={(e) => {
							const level = Number(e.currentTarget.value);
							if (level >= 1 && level <= 10) {
								updateLevelCondition(level);
							}
						}}
						min="1"
						max="10"
					/>
				</div>
			{/if}

			{#if selectedTypes.includes('min_loadout_cards_from_domain')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Minimum cards from a domain in your loadout</p>

					<div class="flex gap-2">
						<Select.Root
							type="single"
							value={loadoutCondition?.domain_id || 'arcana'}
							onValueChange={(value) => {
								if (value) {
									updateLoadoutDomain(value as DomainIds);
								}
							}}
						>
							<Select.Trigger id="loadout-domain-select" class="w-full">
								<p class="truncate">
									{loadoutCondition ? getDomainName(loadoutCondition.domain_id) : 'Select domain'}
								</p>
							</Select.Trigger>
							<Select.Content>
								{#each domainOptions as domainId}
									<Select.Item value={domainId}>{getDomainName(domainId)}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						<Input
							id="min-cards-input"
							type="number"
							value={loadoutCondition ? String(loadoutCondition.min_cards) : '1'}
							oninput={(e) => {
								const cards = Number(e.currentTarget.value);
								if (cards > 0) {
									updateLoadoutMinCards(cards);
								}
							}}
							min="1"
						/>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
