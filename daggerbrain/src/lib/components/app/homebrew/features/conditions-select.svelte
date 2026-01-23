<script lang="ts">
	import type { CharacterCondition, DomainIds, DomainCardChoice } from '@shared/types/compendium.types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { cn } from '$lib/utils';

	let {
		conditions = $bindable([]),
		choiceRequiredError,
		domainCardChoices,
		domainCardId
	}: {
		conditions?: CharacterCondition[];
		choiceRequiredError?: string;
		domainCardChoices?: DomainCardChoice[];
		domainCardId?: string;
	} = $props();

	const compendium = getCompendiumContext();

	// Check if domain_card_choice condition exists
	let hasDomainCardChoiceCondition = $derived(
		conditions.some((c) => c.type === 'domain_card_choice')
	);

	// Load choices from compendium if domainCardChoices prop is not provided but condition exists
	let effectiveDomainCardChoices = $derived.by(() => {
		// If domainCardChoices prop is provided, use it
		if (domainCardChoices && domainCardChoices.length > 0) {
			return domainCardChoices;
		}

		// Otherwise, try to load from compendium if condition exists
		if (domainCardChoiceCondition?.domain_card_id) {
			const cardId = domainCardChoiceCondition.domain_card_id;
			// Search through all domains to find the card
			for (const domainId of domainOptions) {
				const domainCards = compendium.domain_cards[domainId];
				if (domainCards && domainCards[cardId]) {
					return domainCards[cardId].choices;
				}
			}
		}

		return undefined;
	});

	// Condition type options with display labels
	let conditionOptions = $derived([
		{ value: 'armor_equipped_true', label: 'Armor must be equipped' },
		{ value: 'armor_equipped_false', label: 'Armor must not be equipped' },
		{ value: 'level', label: 'Minimum level requirement' },
		{ value: 'min_loadout_cards_from_domain', label: 'Minimum cards from a domain in your loadout' },
		...(domainCardChoices && domainCardChoices.length > 0 || hasDomainCardChoiceCondition
			? [{ value: 'domain_card_choice', label: 'Requires an answer to a choice' }]
			: [])
	] as const);

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

	let domainCardChoiceCondition = $derived(
		conditions.find((c) => c.type === 'domain_card_choice') as
			| { type: 'domain_card_choice'; domain_card_id: string; choice_id: string; selection_id: string }
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
			} else if (type === 'domain_card_choice') {
				// Preserve existing domain card choice condition if it exists, otherwise create new one
				const existing = domainCardChoiceCondition;
				if (existing) {
					newConditions.push(existing);
				} else {
					const firstArbitraryChoice = arbitraryChoices[0];
					newConditions.push({
						type: 'domain_card_choice',
						domain_card_id: domainCardId || '',
						choice_id: firstArbitraryChoice?.choice_id || '',
						selection_id: firstArbitraryChoice?.options[0]?.selection_id || ''
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

	// Update domain card choice condition choice_id
	function updateDomainCardChoiceId(choiceId: string) {
		const newConditions = conditions.map((cond) => {
			if (cond.type === 'domain_card_choice') {
				if (!choiceId || choiceId.trim() === '') {
					return { ...cond, choice_id: '', selection_id: '' };
				}
				const choices = effectiveDomainCardChoices || domainCardChoices;
				const selectedChoice = choices?.find((c) => c.choice_id === choiceId);
				return {
					...cond,
					choice_id: choiceId,
					selection_id:
						selectedChoice?.type === 'arbitrary'
							? selectedChoice.options[0]?.selection_id || ''
							: cond.selection_id
				};
			}
			return cond;
		});
		conditions = newConditions;
	}

	// Update domain card choice condition selection_id
	function updateDomainCardChoiceSelection(selectionId: string) {
		const newConditions = conditions.map((cond) => {
			if (cond.type === 'domain_card_choice') {
				return { ...cond, selection_id: selectionId };
			}
			return cond;
		});
		conditions = newConditions;
	}

	// Get selected choice for domain card choice condition
	let selectedChoice: DomainCardChoice | undefined = $derived.by(() => {
		if (!domainCardChoiceCondition) return undefined;
		const choices = effectiveDomainCardChoices || domainCardChoices;
		return choices?.find((c) => c.choice_id === domainCardChoiceCondition.choice_id);
	});

	// Filter choices to only show arbitrary choice types
	let arbitraryChoices = $derived.by(() => {
		const choices = effectiveDomainCardChoices || domainCardChoices;
		return choices?.filter((c) => c.type === 'arbitrary') || [];
	});

	// Remove domain_card_choice condition when the referenced choice is deleted
	$effect(() => {
		const arbitrary = arbitraryChoices;
		const choiceIds = new Set(arbitrary.map((c) => c.choice_id));
		const needsUpdate = conditions.some(
			(c) =>
				c.type === 'domain_card_choice' &&
				c.choice_id &&
				c.choice_id.trim() !== '' &&
				!choiceIds.has(c.choice_id)
		);
		if (!needsUpdate) return;
		// Remove the entire condition instead of clearing its fields
		conditions = conditions.filter(
			(cond) =>
				!(cond.type === 'domain_card_choice' &&
				cond.choice_id &&
				cond.choice_id.trim() !== '' &&
				!choiceIds.has(cond.choice_id))
		);
	});

	// Check if domain card was found in compendium
	let domainCardFound = $derived.by(() => {
		if (!domainCardChoiceCondition?.domain_card_id) return true; // No condition, assume found
		const cardId = domainCardChoiceCondition.domain_card_id;
		for (const domainId of domainOptions) {
			const domainCards = compendium.domain_cards[domainId];
			if (domainCards && domainCards[cardId]) {
				return true;
			}
		}
		return false;
	});
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
		<div class="ml-3 flex flex-col gap-3 border-l-2 border-dotted border-primary pt-3 pl-2">
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

			{#if selectedTypes.includes('domain_card_choice') && (effectiveDomainCardChoices || domainCardChoiceCondition)}
				<div class="flex flex-col gap-2">
					{#if effectiveDomainCardChoices && effectiveDomainCardChoices.length > 0}
						
					<div class="grid grid-cols-2 gap-2">
					<div class="flex flex-col gap-1">
							<label
								for="choice-id-select"
								class={cn('text-xs text-muted-foreground', choiceRequiredError && 'text-destructive')}
								>Choice</label
							>
							<Select.Root
								type="single"
								value={domainCardChoiceCondition?.choice_id ?? ''}
								onValueChange={(value) => {
									if (value === '' || value == null) {
										updateDomainCardChoiceId('');
									} else {
										updateDomainCardChoiceId(value);
									}
								}}
							>
								<Select.Trigger
									id="choice-id-select"
									class={cn('w-full', choiceRequiredError && 'border-destructive')}
								>
									<p class="truncate">
										{domainCardChoiceCondition?.choice_id || 'None'}
									</p>
								</Select.Trigger>
								<Select.Content>
									{#if arbitraryChoices.length <= 0}
									<Select.Item value="" disabled>None</Select.Item>
									{/if}
									{#each arbitraryChoices as choice}
										<Select.Item value={choice.choice_id}>{choice.choice_id}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if choiceRequiredError}
								<p class="text-xs text-destructive">{choiceRequiredError}</p>
							{/if}
						</div>
								<div class="flex flex-col gap-1">
									<label for="selection-id-select" class="text-xs text-muted-foreground"
										>Answer</label
									>
									<Select.Root
										type="single"
										disabled={!selectedChoice}
										value={domainCardChoiceCondition?.selection_id || ''}
										onValueChange={(value) => {
											if (value) {
												updateDomainCardChoiceSelection(value);
											}
										}}
									>
										<Select.Trigger id="selection-id-select" class="w-full">
											<p class="truncate">
												{domainCardChoiceCondition?.selection_id || 'Select selection'}
											</p>
										</Select.Trigger>
										<Select.Content>
											{#if selectedChoice && selectedChoice.type === 'arbitrary'}
											{#each selectedChoice.options as option}
												<Select.Item value={option.selection_id}>{option.title}</Select.Item>
											{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								</div>

					</div>
					{:else if domainCardChoiceCondition?.choice_id}
						<div class="rounded-md bg-muted p-2">
							<p class="text-xs text-muted-foreground">
								Choice ID: {domainCardChoiceCondition.choice_id}
								{#if domainCardChoiceCondition.selection_id}
									<br />Selection ID: {domainCardChoiceCondition.selection_id}
								{/if}
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
