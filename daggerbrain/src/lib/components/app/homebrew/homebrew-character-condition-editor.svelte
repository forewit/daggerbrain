<script lang="ts">
	import type { CharacterCondition, DomainIds, TraitIds, Weapon } from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { cn, capitalize } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';

	let { condition = $bindable() }: { condition: CharacterCondition } = $props();

	const compendium = getCompendiumContext();

	// Condition type options
	const conditionTypes = [
		'armor_equipped',
		'level',
		'domain_card_choice',
		'ancestry_card_choice',
		'loot_choice',
		'min_loadout_cards_from_domain',
		'primary_weapon_equipped',
		'secondary_weapon_equipped'
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

	// Local state for condition type
	let conditionType = $state<string>('armor_equipped');
	let isOpen = $state(false);

	// Search states for compendium lookups
	let domainCardSearch = $state('');
	let ancestryCardSearch = $state('');
	let lootSearch = $state('');
	let weaponSearch = $state('');

	// Initialize condition type from prop
	$effect(() => {
		if (condition) {
			if ('type' in condition) {
				conditionType = condition.type;
			}
		} else {
			// Initialize with default condition
			condition = { type: 'armor_equipped', value: false };
			conditionType = 'armor_equipped';
		}
	});

	// Helper to strip HTML for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper to check if item matches search
	function matchesSearch(item: { title: string; description_html?: string }, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = item.title.toLowerCase().includes(searchLower);
		const descMatch = item.description_html
			? stripHtml(item.description_html).toLowerCase().includes(searchLower)
			: false;
		return titleMatch || descMatch;
	}

	// Get all domain cards flattened
	let allDomainCards = $derived(
		Object.values(compendium.domain_cards).flatMap((domainCards) => Object.values(domainCards))
	);

	// Filtered domain cards
	let filteredDomainCards = $derived(
		allDomainCards.filter((card) => matchesSearch(card, domainCardSearch))
	);

	// Filtered ancestry cards
	let filteredAncestryCards = $derived(
		Object.values(compendium.ancestry_cards).filter((card) => matchesSearch(card, ancestryCardSearch))
	);

	// Filtered loot
	let filteredLoot = $derived(
		Object.values(compendium.loot).filter((item) => matchesSearch(item, lootSearch))
	);

	// All weapons (primary + secondary)
	let allWeapons = $derived([
		...Object.values(compendium.primary_weapons),
		...Object.values(compendium.secondary_weapons)
	]);

	// Filtered weapons
	let filteredWeapons = $derived(
		allWeapons.filter((weapon) => matchesSearch(weapon, weaponSearch))
	);

	// Update condition when type changes
	function updateConditionType(newType: string) {
		conditionType = newType;

		// Create new condition based on type
		switch (newType) {
			case 'armor_equipped':
				condition = { type: 'armor_equipped', value: false };
				break;
			case 'level':
				condition = { type: 'level', min_level: 1, max_level: 10 };
				break;
			case 'domain_card_choice':
				condition = {
					type: 'domain_card_choice',
					domain_card_id: '',
					choice_id: '',
					selection_id: ''
				};
				break;
			case 'ancestry_card_choice':
				condition = {
					type: 'ancestry_card_choice',
					ancestry_card_id: '',
					choice_id: '',
					selection_id: ''
				};
				break;
			case 'loot_choice':
				condition = { type: 'loot_choice', loot_id: '', choice_id: '', selection_id: '' };
				break;
			case 'min_loadout_cards_from_domain':
				condition = { type: 'min_loadout_cards_from_domain', domain_id: 'arcana', min_cards: 1 };
				break;
			case 'primary_weapon_equipped':
				condition = { type: 'primary_weapon_equipped', weapon_id: null };
				break;
			case 'secondary_weapon_equipped':
				condition = { type: 'secondary_weapon_equipped', weapon_id: null };
				break;
		}
	}

	// Get domain name helper
	function getDomainName(domainId: DomainIds): string {
		return (
			compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1)
		);
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
			{#if condition}
				{condition.type === 'armor_equipped' && 'Armor Equipped'}
				{condition.type === 'level' && 'Level Range'}
				{condition.type === 'domain_card_choice' && 'Domain Card Choice'}
				{condition.type === 'ancestry_card_choice' && 'Ancestry Card Choice'}
				{condition.type === 'loot_choice' && 'Loot Choice'}
				{condition.type === 'min_loadout_cards_from_domain' && 'Min Loadout Cards from Domain'}
				{(condition.type === 'primary_weapon_equipped' ||
					condition.type === 'secondary_weapon_equipped') &&
					'Weapon Equipped'}
			{:else}
				Select Condition Type
			{/if}
		</span>
		<ChevronLeft class={cn('size-4 transition-transform', isOpen && '-rotate-90')} />
	</Collapsible.Trigger>
	<Collapsible.Content class="flex flex-col gap-3 rounded-b-md border bg-card/50 p-3">
		<!-- Condition Type Selector -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Condition Type</label>
			<Select.Root type="single" value={conditionType} onValueChange={updateConditionType}>
				<Select.Trigger class="w-full">
					<p class="truncate">{conditionType || 'Select type'}</p>
				</Select.Trigger>
				<Select.Content>
					{#each conditionTypes as type}
						<Select.Item value={type}>{type.replace(/_/g, ' ')}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Condition-specific fields -->
		{#if conditionType === 'armor_equipped'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Armor Equipped</label>
				<label class="flex items-center gap-2 text-xs">
					<input
						type="checkbox"
						checked={condition.value}
						onchange={(e) => {
							condition = { ...condition, value: e.currentTarget.checked };
						}}
						class="accent-accent"
					/>
					Armor must be equipped
				</label>
			</div>
		{:else if conditionType === 'level'}
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1">
					<label class="text-xs font-medium text-muted-foreground">Min Level</label>
					<Input
						type="number"
						value={String(condition.min_level)}
						oninput={(e) => {
							condition = {
								...condition,
								min_level: Number(e.currentTarget.value)
							};
						}}
						min="1"
						max="10"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-medium text-muted-foreground">Max Level</label>
					<Input
						type="number"
						value={String(condition.max_level)}
						oninput={(e) => {
							condition = {
								...condition,
								max_level: Number(e.currentTarget.value)
							};
						}}
						min="1"
						max="10"
					/>
				</div>
			</div>
		{:else if conditionType === 'domain_card_choice'}
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium text-muted-foreground">Domain Card</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						bind:value={domainCardSearch}
						placeholder="Search domain cards..."
						class="pl-9"
					/>
				</div>
				<Select.Root
					type="single"
					value={condition.domain_card_id || undefined}
					onValueChange={(value) => {
						if (value) {
							condition = { ...condition, domain_card_id: value };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{condition.domain_card_id
								? filteredDomainCards.find((c) => c.compendium_id === condition.domain_card_id)
										?.title || condition.domain_card_id
								: 'Select domain card'}
						</p>
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						{#each filteredDomainCards.slice(0, 50) as card}
							<Select.Item value={card.compendium_id}>{card.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Choice ID</label>
				<Input
					value={condition.choice_id}
					oninput={(e) => {
						condition = { ...condition, choice_id: e.currentTarget.value };
					}}
					placeholder="choice_id"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Selection ID</label>
				<Input
					value={condition.selection_id}
					oninput={(e) => {
						condition = { ...condition, selection_id: e.currentTarget.value };
					}}
					placeholder="selection_id"
				/>
			</div>
		{:else if conditionType === 'ancestry_card_choice'}
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium text-muted-foreground">Ancestry Card</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						bind:value={ancestryCardSearch}
						placeholder="Search ancestry cards..."
						class="pl-9"
					/>
				</div>
				<Select.Root
					type="single"
					value={condition.ancestry_card_id || undefined}
					onValueChange={(value) => {
						if (value) {
							condition = { ...condition, ancestry_card_id: value };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{condition.ancestry_card_id
								? filteredAncestryCards.find((c) => c.compendium_id === condition.ancestry_card_id)
										?.title || condition.ancestry_card_id
								: 'Select ancestry card'}
						</p>
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						{#each filteredAncestryCards.slice(0, 50) as card}
							<Select.Item value={card.compendium_id}>{card.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Choice ID</label>
				<Input
					value={condition.choice_id}
					oninput={(e) => {
						condition = { ...condition, choice_id: e.currentTarget.value };
					}}
					placeholder="choice_id"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Selection ID</label>
				<Input
					value={condition.selection_id}
					oninput={(e) => {
						condition = { ...condition, selection_id: e.currentTarget.value };
					}}
					placeholder="selection_id"
				/>
			</div>
		{:else if conditionType === 'loot_choice'}
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium text-muted-foreground">Loot</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input bind:value={lootSearch} placeholder="Search loot..." class="pl-9" />
				</div>
				<Select.Root
					type="single"
					value={condition.loot_id || undefined}
					onValueChange={(value) => {
						if (value) {
							condition = { ...condition, loot_id: value };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{condition.loot_id
								? filteredLoot.find((l) => l.compendium_id === condition.loot_id)?.title ||
									condition.loot_id
								: 'Select loot'}
						</p>
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						{#each filteredLoot.slice(0, 50) as loot}
							<Select.Item value={loot.compendium_id}>{loot.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Choice ID</label>
				<Input
					value={condition.choice_id}
					oninput={(e) => {
						condition = { ...condition, choice_id: e.currentTarget.value };
					}}
					placeholder="choice_id"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Selection ID</label>
				<Input
					value={condition.selection_id}
					oninput={(e) => {
						condition = { ...condition, selection_id: e.currentTarget.value };
					}}
					placeholder="selection_id"
				/>
			</div>
		{:else if conditionType === 'min_loadout_cards_from_domain'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Domain</label>
				<Select.Root
					type="single"
					value={condition.domain_id}
					onValueChange={(value) => {
						if (value) {
							condition = { ...condition, domain_id: value as DomainIds };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">{getDomainName(condition.domain_id)}</p>
					</Select.Trigger>
					<Select.Content>
						{#each domainOptions as domainId}
							<Select.Item value={domainId}>{getDomainName(domainId)}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Min Cards</label>
				<Input
					type="number"
					value={String(condition.min_cards)}
					oninput={(e) => {
						condition = { ...condition, min_cards: Number(e.currentTarget.value) };
					}}
					min="1"
				/>
			</div>
		{:else if conditionType === 'primary_weapon_equipped' || conditionType === 'secondary_weapon_equipped'}
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium text-muted-foreground">Weapon</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input bind:value={weaponSearch} placeholder="Search weapons..." class="pl-9" />
				</div>
				<Select.Root
					type="single"
					value={condition.weapon_id || undefined}
					onValueChange={(value) => {
						condition = { ...condition, weapon_id: value || null };
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{condition.weapon_id
								? filteredWeapons.find((w) => w.compendium_id === condition.weapon_id)?.title ||
									condition.weapon_id
								: 'Select weapon (optional)'}
						</p>
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						<Select.Item value="">None (any weapon)</Select.Item>
						{#each filteredWeapons.slice(0, 50) as weapon}
							<Select.Item value={weapon.compendium_id}>{weapon.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
	</Collapsible.Content>
</Collapsible.Root>
