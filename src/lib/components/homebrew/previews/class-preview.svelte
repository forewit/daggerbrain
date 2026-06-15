<script lang="ts">
	import type { CharacterClass } from '@convex/schemas/compendium';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ClassBanner from '$lib/components/decorations/class-banner.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { capitalize, cn, merge_compendium_content, renderMarkdown } from '$lib/utils';

	let { characterClass }: { characterClass: CharacterClass } = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();
	const previewCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);

	const traitIds = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'] as const;
	let subclassesOpen = $state(false);
	let suggestedTraitsOpen = $state(false);
	let suggestedEquipmentOpen = $state(false);
	let startingInventoryOpen = $state(false);
	let backgroundQuestionsOpen = $state(false);
	let connectionQuestionsOpen = $state(false);
	let characterDescriptionOpen = $state(false);

	function isHomebrewItem(item: { source_key?: string } | undefined) {
		return item?.source_key === 'Homebrew';
	}

	function getDomain(domainId: string | undefined) {
		return domainId ? previewCompendium.domains[domainId] : undefined;
	}

	function isHomebrewDomain(domainId: string | undefined) {
		return isHomebrewItem(getDomain(domainId));
	}

	function domainTitle(domainId: string | undefined) {
		if (!domainId) return 'Unknown';
		return previewCompendium.domains[domainId]?.title ?? 'Unknown';
	}

	function getSubclass(subclassId: string | undefined) {
		return subclassId ? previewCompendium.subclasses[subclassId] : undefined;
	}

	function subclassTitle(subclassId: string) {
		return previewCompendium.subclasses[subclassId]?.title ?? 'Unknown';
	}

	function getWeapon(table: 'primary' | 'secondary', itemId: string | undefined) {
		if (!itemId) return undefined;
		return table === 'primary'
			? previewCompendium.primary_weapons[itemId]
			: previewCompendium.secondary_weapons[itemId];
	}

	function primaryWeaponTitle(itemId: string | undefined) {
		if (!itemId) return 'Unknown';
		return previewCompendium.primary_weapons[itemId]?.title ?? 'Unknown';
	}

	function secondaryWeaponTitle(itemId: string | undefined) {
		if (!itemId) return 'Unknown';
		return previewCompendium.secondary_weapons[itemId]?.title ?? 'Unknown';
	}

	function armorTitle(itemId: string | undefined) {
		if (!itemId) return 'Unknown';
		return previewCompendium.armor[itemId]?.title ?? 'Unknown';
	}

	function getArmor(itemId: string | undefined) {
		return itemId ? previewCompendium.armor[itemId] : undefined;
	}

	function getLootOrConsumable(
		option: CharacterClass['starting_inventory']['loot_or_consumable_options'][number] | undefined
	) {
		if (!option) return undefined;
		return option.type === 'loot'
			? previewCompendium.loot[option.id]
			: previewCompendium.consumables[option.id];
	}

	function lootOrConsumableTitle(
		option: CharacterClass['starting_inventory']['loot_or_consumable_options'][number]
	) {
		return option.type === 'loot'
			? (previewCompendium.loot[option.id]?.title ?? 'Unknown')
			: (previewCompendium.consumables[option.id]?.title ?? 'Unknown');
	}
</script>

<div
	class="flex max-w-[500px] min-w-[300px] flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm"
>
	<div class="flex gap-3 text-left">
		{#if characterClass.image_url && characterClass.image_url !== '/images/art/placeholder-art.webp'}
			<div class="max-w-[120px] min-w-[72px] overflow-hidden rounded-lg">
				<img src={characterClass.image_url} alt="art" class="h-full object-cover" />
			</div>
		{/if}

		<div class="min-w-0 flex-1">
			<p class="text-lg font-medium">{characterClass.title || 'Unnamed class'}</p>
			<p class="-mt-1 text-xs text-muted-foreground italic">
				{@html renderMarkdown(characterClass.description_html || '')}
			</p>

			<div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
				<div class="flex flex-wrap items-center gap-1.5">
					<b class="text-foreground">Domains:</b>
					<span class="inline-flex items-center gap-1.5">
						<span>{domainTitle(characterClass.primary_domain_id)}</span>
						{#if isHomebrewDomain(characterClass.primary_domain_id)}
							<HomebrewBadge />
						{/if}
					</span>
					<span>/</span>
					<span class="inline-flex items-center gap-1.5">
						<span>{domainTitle(characterClass.secondary_domain_id)}</span>
						{#if isHomebrewDomain(characterClass.secondary_domain_id)}
							<HomebrewBadge />
						{/if}
					</span>
				</div>
				<p><b class="text-foreground">Evasion:</b> {characterClass.starting_evasion}</p>
				<p><b class="text-foreground">HP:</b> {characterClass.starting_max_hp}</p>
			</div>
		</div>

		<ClassBanner
			compendium={previewCompendium}
			character_class={characterClass}
			class="-mt-2 shrink-0"
		/>
	</div>

	<div class="flex flex-col gap-3 border-t pt-4">
		<div class="flex flex-col gap-1">
			<p class="text-sm font-medium">{characterClass.hope_feature.title || 'Hope Feature'}</p>
			<div class="text-xs text-muted-foreground">
				{@html renderMarkdown(characterClass.hope_feature.description_html || '')}
			</div>
		</div>

		{#each characterClass.class_features as feature}
			<div class="flex flex-col gap-1">
				<p class="text-sm font-medium">{feature.title || 'Unnamed feature'}</p>
				<div class="text-xs text-muted-foreground">
					{@html renderMarkdown(feature.description_html || '')}
				</div>
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-4 border-t pt-4">
		<Collapsible.Root bind:open={subclassesOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', subclassesOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium text-muted-foreground">Subclasses</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				{#if characterClass.subclass_ids.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each characterClass.subclass_ids as subclassId}
							{@const subclass = getSubclass(subclassId)}
							<span
								class="inline-flex items-center gap-1.5 rounded-full border bg-muted px-2 py-1 text-xs"
							>
								<span>{subclassTitle(subclassId)}</span>
								{#if isHomebrewItem(subclass)}
									<HomebrewBadge />
								{/if}
							</span>
						{/each}
					</div>
				{:else}
					<p class="text-xs text-muted-foreground italic">No subclasses linked</p>
				{/if}
			</Collapsible.Content>
		</Collapsible.Root>

		<Collapsible.Root bind:open={suggestedTraitsOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', suggestedTraitsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium text-muted-foreground">Suggested Traits</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class="flex flex-wrap gap-2">
					{#each traitIds as trait}
						{#if characterClass.suggested_traits[trait] !== undefined}
							<span class="rounded-full border bg-muted px-2 py-1 text-xs">
								{characterClass.suggested_traits[trait]! > 0
									? '+' + characterClass.suggested_traits[trait]!
									: characterClass.suggested_traits[trait]}
								{capitalize(trait)}
							</span>
						{/if}
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>

		<Collapsible.Root bind:open={suggestedEquipmentOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', suggestedEquipmentOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium text-muted-foreground">Suggested Equipment</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
					<div class="flex flex-wrap items-center gap-1.5">
						<b class="text-foreground">Primary:</b>
						{#if characterClass.suggested_primary_weapon_id}
							{@const primaryWeapon = getWeapon(
								'primary',
								characterClass.suggested_primary_weapon_id
							)}
							<span class="inline-flex items-center gap-1.5">
								<span>{primaryWeaponTitle(characterClass.suggested_primary_weapon_id)}</span>
								{#if isHomebrewItem(primaryWeapon)}
									<HomebrewBadge />
								{/if}
							</span>
						{:else}
							<span>None</span>
						{/if}
					</div>
					<div class="flex flex-wrap items-center gap-1.5">
						<b class="text-foreground">Secondary:</b>
						{#if characterClass.suggested_secondary_weapon_id}
							{@const secondaryWeapon = getWeapon(
								'secondary',
								characterClass.suggested_secondary_weapon_id
							)}
							<span class="inline-flex items-center gap-1.5">
								<span>{secondaryWeaponTitle(characterClass.suggested_secondary_weapon_id)}</span>
								{#if isHomebrewItem(secondaryWeapon)}
									<HomebrewBadge />
								{/if}
							</span>
						{:else}
							<span>None</span>
						{/if}
					</div>
					<div class="flex flex-wrap items-center gap-1.5">
						<b class="text-foreground">Armor:</b>
						{#if characterClass.suggested_armor_id}
							{@const armor = getArmor(characterClass.suggested_armor_id)}
							<span class="inline-flex items-center gap-1.5">
								<span>{armorTitle(characterClass.suggested_armor_id)}</span>
								{#if isHomebrewItem(armor)}
									<HomebrewBadge />
								{/if}
							</span>
						{:else}
							<span>None</span>
						{/if}
					</div>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>

		<Collapsible.Root bind:open={startingInventoryOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', startingInventoryOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium text-muted-foreground">Starting Inventory</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
					<p><b class="text-foreground">Gold:</b> {characterClass.starting_inventory.gold_coins}</p>
					<p>
						<b class="text-foreground">Free Gear:</b>
						{characterClass.starting_inventory.free_gear.length > 0
							? characterClass.starting_inventory.free_gear.join(', ')
							: 'None'}
					</p>
					<div class="flex flex-wrap items-center gap-1.5">
						<b class="text-foreground">Loot/Consumable Options:</b>
						{#if characterClass.starting_inventory.loot_or_consumable_options.length > 0}
							{#each characterClass.starting_inventory.loot_or_consumable_options as option, index}
								{@const linkedItem = getLootOrConsumable(option)}
								{#if index > 0}
									<span>,</span>
								{/if}
								<span class="inline-flex items-center gap-1.5">
									<span>{lootOrConsumableTitle(option)}</span>
									{#if isHomebrewItem(linkedItem)}
										<HomebrewBadge />
									{/if}
								</span>
							{/each}
						{:else}
							<span>None</span>
						{/if}
					</div>
					<p>
						<b class="text-foreground">Class Gear Options:</b>
						{characterClass.starting_inventory.class_gear_options.length > 0
							? characterClass.starting_inventory.class_gear_options.join(', ')
							: 'None'}
					</p>
					<p>
						<b class="text-foreground">Spellbook Prompt:</b>
						{characterClass.starting_inventory.spellbook_prompt || 'None'}
					</p>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>

		<Collapsible.Root bind:open={backgroundQuestionsOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', backgroundQuestionsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium text-muted-foreground">Background Questions</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				{#if characterClass.background_questions.length > 0}
					<ul class="list-inside list-disc space-y-1 text-xs text-muted-foreground">
						{#each characterClass.background_questions as question}
							<li>{question}</li>
						{/each}
					</ul>
				{:else}
					<p class="text-xs text-muted-foreground italic">No background questions</p>
				{/if}
			</Collapsible.Content>
		</Collapsible.Root>

		<Collapsible.Root bind:open={connectionQuestionsOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', connectionQuestionsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium text-muted-foreground">Connection Questions</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				{#if characterClass.connection_questions.length > 0}
					<ul class="list-inside list-disc space-y-1 text-xs text-muted-foreground">
						{#each characterClass.connection_questions as question}
							<li>{question}</li>
						{/each}
					</ul>
				{:else}
					<p class="text-xs text-muted-foreground italic">No connection questions</p>
				{/if}
			</Collapsible.Content>
		</Collapsible.Root>

		<Collapsible.Root bind:open={characterDescriptionOpen} class="flex flex-col gap-2">
			<Collapsible.Trigger class="flex w-full items-center gap-1.5 text-left">
				<ChevronRight
					class={cn(
						'size-4 shrink-0 transition-transform',
						characterDescriptionOpen && 'rotate-90'
					)}
				/>
				<p class="text-sm font-medium text-muted-foreground">Character Description Suggestions</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2">
				<div class="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
					<p>
						<b class="text-foreground">Clothes:</b>
						{characterClass.character_description_suggestions.clothes || 'None'}
					</p>
					<p>
						<b class="text-foreground">Eyes:</b>
						{characterClass.character_description_suggestions.eyes || 'None'}
					</p>
					<p>
						<b class="text-foreground">Body:</b>
						{characterClass.character_description_suggestions.body || 'None'}
					</p>
					<p>
						<b class="text-foreground">Skin:</b>
						{characterClass.character_description_suggestions.skin || 'None'}
					</p>
					<p>
						<b class="text-foreground">Attitude:</b>
						{characterClass.character_description_suggestions.attitude || 'None'}
					</p>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
</div>
