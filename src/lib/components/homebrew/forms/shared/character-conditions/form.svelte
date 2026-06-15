<script lang="ts">
	import type { CardOption, CharacterCondition } from '@convex/schemas/rules';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn, merge_compendium_content } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import X from '@lucide/svelte/icons/x';
	import {
		defaultLevelCondition,
		defaultLoadoutDomainCondition,
		emptyCardChoiceCondition
	} from './defaults';

	let {
		conditions = $bindable([]),
		choiceOptions = $bindable([]),
		choiceSourceId,
		allowChoiceConditions = false,
		choiceRequiredError
	}: {
		conditions?: CharacterCondition[];
		choiceOptions?: CardOption[];
		choiceSourceId?: string;
		allowChoiceConditions?: boolean;
		choiceRequiredError?: string;
	} = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();
	const fullCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);

	type PrimaryWeaponCondition = CharacterCondition & {
		type: 'primary_weapon_equipped';
		weapon_id?: string;
	};

	type SecondaryWeaponCondition = CharacterCondition & {
		type: 'secondary_weapon_equipped';
		weapon_id?: string;
	};

	const arbitraryCardOptions = $derived(
		choiceOptions.filter((option) => option.type === 'arbitrary')
	);

	const selectedTypes = $derived.by(() => {
		const values: string[] = [];
		for (const condition of conditions) {
			if (condition.type === 'armor_equipped') {
				values.push(condition.value ? 'armor_equipped_true' : 'armor_equipped_false');
				continue;
			}
			values.push(condition.type);
		}
		return Array.from(new Set(values));
	});

	const levelCondition = $derived(
		conditions.find((condition) => condition.type === 'level') as
			| Extract<CharacterCondition, { type: 'level' }>
			| undefined
	);

	const loadoutCondition = $derived(
		conditions.find((condition) => condition.type === 'min_loadout_cards_from_domain') as
			| Extract<CharacterCondition, { type: 'min_loadout_cards_from_domain' }>
			| undefined
	);

	const primaryWeaponCondition = $derived(
		conditions.find(
			(condition): condition is PrimaryWeaponCondition =>
				condition.type === 'primary_weapon_equipped'
		) as PrimaryWeaponCondition | undefined
	);

	const secondaryWeaponCondition = $derived(
		conditions.find(
			(condition): condition is SecondaryWeaponCondition =>
				condition.type === 'secondary_weapon_equipped'
		) as SecondaryWeaponCondition | undefined
	);

	const cardChoiceConditions = $derived(
		conditions.filter((condition) => condition.type === 'card_choice') as Array<
			Extract<CharacterCondition, { type: 'card_choice' }>
		>
	);

	const selectedCardChoicesPerCondition = $derived(
		cardChoiceConditions.map((condition) =>
			arbitraryCardOptions.find((option) => option.choice_id === condition.choice_id)
		)
	);

	function createEmptyCardChoiceCondition(): Extract<CharacterCondition, { type: 'card_choice' }> {
		return emptyCardChoiceCondition(choiceSourceId ?? '');
	}

	function createCardChoiceConditionFromOption(
		option: (typeof arbitraryCardOptions)[number] | undefined
	): Extract<CharacterCondition, { type: 'card_choice' }> {
		if (!option || option.type !== 'arbitrary') {
			return createEmptyCardChoiceCondition();
		}

		return {
			type: 'card_choice',
			card_id: choiceSourceId ?? '',
			choice_id: option.choice_id,
			selection_id: option.options[0]?.selection_id ?? ''
		};
	}

	const conditionOptions = $derived.by(() => {
		const options = [
			{ value: 'armor_equipped_true', label: 'Armor must be equipped' },
			{ value: 'armor_equipped_false', label: 'Armor must not be equipped' },
			{ value: 'level', label: 'Minimum level requirement' },
			{
				value: 'min_loadout_cards_from_domain',
				label: 'Minimum cards from a domain in your loadout'
			},
			{ value: 'primary_weapon_equipped', label: 'Primary weapon must be equipped' },
			{ value: 'secondary_weapon_equipped', label: 'Secondary weapon must be equipped' }
		];

		if (allowChoiceConditions) {
			options.push({
				value: 'card_choice',
				label: 'Requires an answer to a card choice'
			});
		}

		return options;
	});

	const domainOptions = [
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

	function getDomainName(domainId: string) {
		return domainId.charAt(0).toUpperCase() + domainId.slice(1);
	}

	const primaryWeaponIds = $derived(
		Object.entries(fullCompendium.primary_weapons)
			.sort((a, b) => a[1].title.localeCompare(b[1].title))
			.map(([id]) => id)
	);

	const secondaryWeaponIds = $derived(
		Object.entries(fullCompendium.secondary_weapons)
			.sort((a, b) => a[1].title.localeCompare(b[1].title))
			.map(([id]) => id)
	);

	function isHomebrewItem(item: { source_key?: string } | undefined) {
		return item?.source_key === 'Homebrew';
	}

	function getWeapon(table: 'primary' | 'secondary', itemId: string | undefined) {
		if (!itemId) return undefined;
		return table === 'primary'
			? fullCompendium.primary_weapons[itemId]
			: fullCompendium.secondary_weapons[itemId];
	}

	function getWeaponTitle(table: 'primary' | 'secondary', itemId: string) {
		if (table === 'primary')
			return fullCompendium.primary_weapons[itemId]?.title ?? 'Unknown weapon';
		return fullCompendium.secondary_weapons[itemId]?.title ?? 'Unknown weapon';
	}

	function handleTypesChange(newTypes: string[]) {
		if (newTypes.includes('__clear_selection__')) {
			conditions = [];
			return;
		}

		const filteredTypes = newTypes.filter((type) => type !== '__clear_selection__');
		const nextConditions: CharacterCondition[] = [];

		if (
			filteredTypes.includes('armor_equipped_true') ||
			filteredTypes.includes('armor_equipped_false')
		) {
			const selectedArmor = filteredTypes.includes('armor_equipped_false')
				? 'armor_equipped_false'
				: 'armor_equipped_true';
			nextConditions.push({
				type: 'armor_equipped',
				value: selectedArmor === 'armor_equipped_true'
			});
		}

		if (filteredTypes.includes('level')) {
			nextConditions.push(levelCondition ?? defaultLevelCondition());
		}

		if (filteredTypes.includes('min_loadout_cards_from_domain')) {
			nextConditions.push(loadoutCondition ?? defaultLoadoutDomainCondition());
		}

		if (filteredTypes.includes('primary_weapon_equipped')) {
			nextConditions.push(primaryWeaponCondition ?? { type: 'primary_weapon_equipped' });
		}

		if (filteredTypes.includes('secondary_weapon_equipped')) {
			nextConditions.push(secondaryWeaponCondition ?? { type: 'secondary_weapon_equipped' });
		}

		if (allowChoiceConditions && filteredTypes.includes('card_choice')) {
			if (cardChoiceConditions.length > 0) {
				nextConditions.push(...cardChoiceConditions);
			} else {
				nextConditions.push(createCardChoiceConditionFromOption(arbitraryCardOptions[0]));
			}
		}

		conditions = nextConditions;
	}

	function updateLevelCondition(minLevel: number) {
		conditions = conditions.map((condition) =>
			condition.type === 'level'
				? {
						type: 'level',
						min_level: minLevel,
						max_level: 10
					}
				: condition
		);
	}

	function updateLoadoutDomain(domainId: string) {
		conditions = conditions.map((condition) =>
			condition.type === 'min_loadout_cards_from_domain'
				? { ...condition, domain_id: domainId }
				: condition
		);
	}

	function updateLoadoutMinCards(minCards: number) {
		conditions = conditions.map((condition) =>
			condition.type === 'min_loadout_cards_from_domain'
				? { ...condition, min_cards: Math.max(1, minCards) }
				: condition
		);
	}

	function updateWeaponCondition(
		type: 'primary_weapon_equipped' | 'secondary_weapon_equipped',
		weaponId: string
	) {
		conditions = conditions.map((condition) =>
			condition.type === type
				? { type, weapon_id: weaponId.trim() === '' ? undefined : weaponId.trim() }
				: condition
		);
	}

	function updateCardChoiceId(conditionIndex: number, choiceId: string) {
		let currentIndex = 0;
		conditions = conditions.map((condition) => {
			if (condition.type !== 'card_choice') return condition;
			if (currentIndex !== conditionIndex) {
				currentIndex += 1;
				return condition;
			}

			currentIndex += 1;
			const matchingChoice = arbitraryCardOptions.find((option) => option.choice_id === choiceId);
			return {
				type: 'card_choice',
				card_id: choiceSourceId ?? condition.card_id,
				choice_id: choiceId,
				selection_id:
					matchingChoice?.type === 'arbitrary'
						? (matchingChoice.options[0]?.selection_id ?? '')
						: ''
			};
		});
	}

	function updateCardChoiceSelection(conditionIndex: number, selectionId: string) {
		let currentIndex = 0;
		conditions = conditions.map((condition) => {
			if (condition.type !== 'card_choice') return condition;
			if (currentIndex !== conditionIndex) {
				currentIndex += 1;
				return condition;
			}

			currentIndex += 1;
			return { ...condition, selection_id: selectionId };
		});
	}

	function addCardChoiceCondition() {
		if (!allowChoiceConditions) return;
		conditions = [...conditions, createCardChoiceConditionFromOption(arbitraryCardOptions[0])];
	}

	function removeCardChoiceCondition(conditionIndex: number) {
		let currentIndex = 0;
		conditions = conditions.filter((condition) => {
			if (condition.type !== 'card_choice') return true;
			if (currentIndex !== conditionIndex) {
				currentIndex += 1;
				return true;
			}

			currentIndex += 1;
			return false;
		});
	}

	$effect(() => {
		const validChoicesById = new Map(
			arbitraryCardOptions.map((option) => [option.choice_id, option] as const)
		);
		let hasUpdates = false;

		const nextConditions = conditions.map((condition) => {
			if (condition.type !== 'card_choice') return condition;

			if (condition.choice_id.trim() === '') {
				if (condition.selection_id !== '') {
					hasUpdates = true;
					return { ...condition, selection_id: '' };
				}
				return condition;
			}

			const matchingChoice = validChoicesById.get(condition.choice_id);
			if (!matchingChoice) {
				hasUpdates = true;
				return { ...condition, choice_id: '', selection_id: '' };
			}

			const validSelectionIds = new Set(
				matchingChoice.options.map((option) => option.selection_id)
			);
			if (condition.selection_id !== '' && !validSelectionIds.has(condition.selection_id)) {
				hasUpdates = true;
				return {
					...condition,
					selection_id: matchingChoice.options[0]?.selection_id ?? ''
				};
			}

			return condition;
		});

		if (hasUpdates) {
			conditions = nextConditions;
		}
	});
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
						type="number"
						value={String(levelCondition?.min_level ?? 1)}
						min="1"
						max="10"
						oninput={(event) => updateLevelCondition(Number(event.currentTarget.value) || 1)}
					/>
				</div>
			{/if}

			{#if selectedTypes.includes('min_loadout_cards_from_domain')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Minimum cards from a domain in your loadout</p>
					<div class="flex gap-2">
						<Select.Root
							type="single"
							value={loadoutCondition?.domain_id ?? 'arcana'}
							onValueChange={(value) => value && updateLoadoutDomain(value)}
						>
							<Select.Trigger class="w-full">
								<p class="truncate">{getDomainName(loadoutCondition?.domain_id ?? 'arcana')}</p>
							</Select.Trigger>
							<Select.Content>
								{#each domainOptions as domainId}
									<Select.Item value={domainId}>{getDomainName(domainId)}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<Input
							type="number"
							value={String(loadoutCondition?.min_cards ?? 1)}
							min="1"
							oninput={(event) => updateLoadoutMinCards(Number(event.currentTarget.value) || 1)}
						/>
					</div>
				</div>
			{/if}

			{#if selectedTypes.includes('primary_weapon_equipped')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Primary weapon</p>
					<Select.Root
						type="single"
						value={primaryWeaponCondition?.weapon_id ?? ''}
						onValueChange={(value) => updateWeaponCondition('primary_weapon_equipped', value)}
					>
						<Select.Trigger class="w-full">
							{#if primaryWeaponCondition?.weapon_id}
								{@const weapon = getWeapon('primary', primaryWeaponCondition.weapon_id)}
								<div class="flex min-w-0 items-center gap-1.5">
									<p class="truncate">
										{getWeaponTitle('primary', primaryWeaponCondition.weapon_id)}
									</p>
									{#if isHomebrewItem(weapon)}
										<HomebrewBadge />
									{/if}
								</div>
							{:else}
								<p class="truncate">Any primary weapon</p>
							{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Any primary weapon</Select.Item>
							{#each primaryWeaponIds as weaponId}
								{@const weapon = getWeapon('primary', weaponId)}
								<Select.Item value={weaponId}>
									<div class="flex items-center gap-1.5">
										<span>{getWeaponTitle('primary', weaponId)}</span>
										{#if isHomebrewItem(weapon)}
											<HomebrewBadge />
										{/if}
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}

			{#if selectedTypes.includes('secondary_weapon_equipped')}
				<div class="flex flex-col gap-1">
					<p class="text-xs text-muted-foreground">Secondary weapon</p>
					<Select.Root
						type="single"
						value={secondaryWeaponCondition?.weapon_id ?? ''}
						onValueChange={(value) => updateWeaponCondition('secondary_weapon_equipped', value)}
					>
						<Select.Trigger class="w-full">
							{#if secondaryWeaponCondition?.weapon_id}
								{@const weapon = getWeapon('secondary', secondaryWeaponCondition.weapon_id)}
								<div class="flex min-w-0 items-center gap-1.5">
									<p class="truncate">
										{getWeaponTitle('secondary', secondaryWeaponCondition.weapon_id)}
									</p>
									{#if isHomebrewItem(weapon)}
										<HomebrewBadge />
									{/if}
								</div>
							{:else}
								<p class="truncate">Any secondary weapon</p>
							{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Any secondary weapon</Select.Item>
							{#each secondaryWeaponIds as weaponId}
								{@const weapon = getWeapon('secondary', weaponId)}
								<Select.Item value={weaponId}>
									<div class="flex items-center gap-1.5">
										<span>{getWeaponTitle('secondary', weaponId)}</span>
										{#if isHomebrewItem(weapon)}
											<HomebrewBadge />
										{/if}
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}

			{#if allowChoiceConditions && selectedTypes.includes('card_choice')}
				<div class="flex flex-col gap-2">
					{#each cardChoiceConditions as condition, index (index)}
						{@const availableAnswers =
							selectedCardChoicesPerCondition[index]?.type === 'arbitrary'
								? selectedCardChoicesPerCondition[index].options.filter(
										(option) => option.selection_id
									)
								: []}
						<div class="flex items-end gap-2">
							<div class="grid flex-1 grid-cols-2 gap-2">
								<div class="flex flex-col gap-1">
									{#if index === 0}
										<p
											class={cn(
												'text-xs text-muted-foreground',
												choiceRequiredError && 'text-destructive'
											)}
										>
											Choice
										</p>
									{/if}
									<Select.Root
										type="single"
										value={condition.choice_id}
										onValueChange={(value) => value && updateCardChoiceId(index, value)}
									>
										<Select.Trigger
											class={cn(
												'w-full',
												choiceRequiredError && index === 0 && 'border-destructive'
											)}
										>
											<p class="truncate">
												{arbitraryCardOptions.length > 0
													? condition.choice_id || 'Unnamed Choice'
													: 'None'}
											</p>
										</Select.Trigger>
										<Select.Content>
											{#if arbitraryCardOptions.length === 0}
												<Select.Item value="" disabled>None</Select.Item>
											{:else}
												{#each arbitraryCardOptions as option}
													<Select.Item value={option.choice_id}
														>{option.choice_id || 'Unnamed Choice'}</Select.Item
													>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								</div>
								<div class="flex flex-col gap-1">
									{#if index === 0}
										<p
											class={cn(
												'text-xs text-muted-foreground',
												choiceRequiredError && 'text-destructive'
											)}
										>
											Answer
										</p>
									{/if}
									<Select.Root
										type="single"
										value={condition.selection_id}
										onValueChange={(value) => value && updateCardChoiceSelection(index, value)}
									>
										<Select.Trigger
											class={cn(
												'w-full',
												choiceRequiredError && index === 0 && 'border-destructive'
											)}
										>
											<p class="truncate">
												{availableAnswers.length === 0
													? 'None'
													: (selectedCardChoicesPerCondition[index]?.options.find(
															(option) => option.selection_id === condition.selection_id
														)?.title ?? 'Select answer')}
											</p>
										</Select.Trigger>
										<Select.Content>
											{#if availableAnswers.length === 0}
												<Select.Item value="" disabled>None</Select.Item>
											{:else if selectedCardChoicesPerCondition[index]?.type === 'arbitrary'}
												{#each availableAnswers as option}
													<Select.Item value={option.selection_id}>{option.title}</Select.Item>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								</div>
							</div>
							{#if cardChoiceConditions.length > 1}
								<Button
									type="button"
									size="icon"
									variant="link"
									class="-mx-2 shrink-0 hover:text-accent"
									onclick={() => removeCardChoiceCondition(index)}
								>
									<X class="size-4" />
								</Button>
							{/if}
						</div>
					{/each}

					<button
						type="button"
						class="w-fit text-xs text-muted-foreground underline hover:text-foreground"
						onclick={addCardChoiceCondition}
					>
						+ Add choice requirement
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
