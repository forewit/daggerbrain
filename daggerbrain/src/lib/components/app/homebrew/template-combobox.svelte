<script lang="ts">
	import { tick } from 'svelte';
	import { cn, level_to_tier } from '$lib/utils';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import type { DomainIds, Weapon } from '$lib/types/compendium-types';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import * as Select from '$lib/components/ui/select';
	import type { HomebrewType } from '$lib/types/homebrew-types';

	let {
		homebrewType,
		value = $bindable(''),
		disabled = false
	}: {
		homebrewType: HomebrewType | undefined;
		value?: string;
		disabled?: boolean;
	} = $props();

	const compendium = getCompendiumContext();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	// Derive template options based on the selected homebrew type
	type TemplateOption = { id: string; name: string };
	type GroupedTemplates = {
		groups: Array<{ heading: string; items: TemplateOption[] }>;
		flat: TemplateOption[];
	};

	const templateOptions = $derived.by((): GroupedTemplates => {
		if (!homebrewType) return { groups: [], flat: [] };

		switch (homebrewType) {
			case 'weapon': {
				// Group weapons by primary/secondary and tier
				const primaryByTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };
				const secondaryByTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };

				for (const [id, w] of Object.entries(compendium.primary_weapons)) {
					const tier = level_to_tier(w.level_requirement);
					primaryByTier[tier].push({ id, name: w.title });
				}

				for (const [id, w] of Object.entries(compendium.secondary_weapons)) {
					const tier = level_to_tier(w.level_requirement);
					secondaryByTier[tier].push({ id, name: w.title });
				}

				// Sort each tier group
				for (const tier of [1, 2, 3, 4]) {
					primaryByTier[tier].sort((a, b) => a.name.localeCompare(b.name));
					secondaryByTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}

				const groups: Array<{ heading: string; items: TemplateOption[] }> = [];

				// Primary Weapons groups by tier
				for (const tier of [1, 2, 3, 4]) {
					if (primaryByTier[tier].length > 0) {
						groups.push({
							heading: `Primary Weapons - Tier ${tier}`,
							items: primaryByTier[tier]
						});
					}
				}

				// Secondary Weapons groups by tier
				for (const tier of [1, 2, 3, 4]) {
					if (secondaryByTier[tier].length > 0) {
						groups.push({
							heading: `Secondary Weapons - Tier ${tier}`,
							items: secondaryByTier[tier]
						});
					}
				}

				const flat = [
					...Object.values(primaryByTier).flat(),
					...Object.values(secondaryByTier).flat()
				];

				return { groups, flat };
			}
			case 'armor': {
				// Group armor by tier
				const armorByTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };

				for (const [id, a] of Object.entries(compendium.armor)) {
					const tier = level_to_tier(a.level_requirement);
					armorByTier[tier].push({ id, name: a.title });
				}

				// Sort each tier group
				for (const tier of [1, 2, 3, 4]) {
					armorByTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}

				const groups: Array<{ heading: string; items: TemplateOption[] }> = [];
				for (const tier of [1, 2, 3, 4]) {
					if (armorByTier[tier].length > 0) {
						groups.push({
							heading: `Armor - Tier ${tier}`,
							items: armorByTier[tier]
						});
					}
				}

				const flat = Object.values(armorByTier).flat();
				return { groups, flat };
			}
			case 'beastform': {
				// Group beastforms by tier
				const beastformsByTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };

				for (const [id, b] of Object.entries(compendium.beastforms)) {
					const tier = level_to_tier(b.level_requirement);
					beastformsByTier[tier].push({ id, name: b.name });
				}

				// Sort each tier group
				for (const tier of [1, 2, 3, 4]) {
					beastformsByTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}

				const groups: Array<{ heading: string; items: TemplateOption[] }> = [];
				for (const tier of [1, 2, 3, 4]) {
					if (beastformsByTier[tier].length > 0) {
						groups.push({
							heading: `Beastforms - Tier ${tier}`,
							items: beastformsByTier[tier]
						});
					}
				}

				const flat = Object.values(beastformsByTier).flat();
				return { groups, flat };
			}
			case 'loot': {
				const items = Object.entries(compendium.loot)
					.map(([id, l]) => ({ id, name: l.title }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Loot', items }], flat: items };
			}
			case 'consumable': {
				const items = Object.entries(compendium.consumables)
					.map(([id, c]) => ({ id, name: c.title }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Consumables', items }], flat: items };
			}
			case 'class': {
				const items = Object.entries(compendium.classes)
					.map(([id, c]) => ({ id, name: c.name }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Classes', items }], flat: items };
			}
			case 'subclass': {
				const items = Object.entries(compendium.subclasses)
					.map(([id, s]) => ({ id, name: s.name }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Subclasses', items }], flat: items };
			}
			case 'domain-cards': {
				// Group domain cards by level
				const domainIds: DomainIds[] = [
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
				const cardsByLevel: Record<number, TemplateOption[]> = {};

				for (const domainId of domainIds) {
					const cards = compendium.domain_cards[domainId] || {};
					for (const [id, card] of Object.entries(cards)) {
						const level = card.level_requirement;
						if (!cardsByLevel[level]) {
							cardsByLevel[level] = [];
						}
						cardsByLevel[level].push({ id, name: card.title });
					}
				}

				// Sort each level group
				for (const level of Object.keys(cardsByLevel)) {
					cardsByLevel[Number(level)].sort((a, b) => a.name.localeCompare(b.name));
				}

				const groups: Array<{ heading: string; items: TemplateOption[] }> = [];
				// Sort levels ascending for display
				const sortedLevels = Object.keys(cardsByLevel)
					.map(Number)
					.sort((a, b) => a - b);

				for (const level of sortedLevels) {
					groups.push({
						heading: `Domain Cards - Level ${level}`,
						items: cardsByLevel[level]
					});
				}

				const flat = Object.values(cardsByLevel).flat();
				return { groups, flat };
			}
			case 'ancestry-cards': {
				const items = Object.entries(compendium.ancestry_cards)
					.map(([id, a]) => ({ id, name: a.title }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Ancestry Cards', items }], flat: items };
			}
			case 'community-cards': {
				const items = Object.entries(compendium.community_cards)
					.map(([id, c]) => ({ id, name: c.title }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Community Cards', items }], flat: items };
			}
			case 'transformation-cards': {
				const items = Object.entries(compendium.transformation_cards)
					.map(([id, t]) => ({ id, name: t.title }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Transformation Cards', items }], flat: items };
			}
			default:
				return { groups: [], flat: [] };
		}
	});

	const selectedLabel = $derived(
		value ? templateOptions.flat.find((t) => t.id === value)?.name : 'Start from scratch'
	);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}
</script>

<Select.Root 
	type="single" 
	bind:open 
	disabled={disabled}
	value={value || undefined}
	onValueChange={(newValue) => {
		if (newValue !== undefined) {
			value = newValue;
			closeAndFocusTrigger();
		}
	}}
>
	<Select.Trigger
		bind:ref={triggerRef}
		class="w-full"
	>
		{#if selectedLabel !== 'Start from scratch'}
			<span class="truncate">{selectedLabel}</span>
		{:else}
			<span class="truncate text-muted-foreground">Start from scratch</span>
		{/if}
	</Select.Trigger>
	<Select.Content avoidCollisions={false} side="bottom" align="start" class="w-full p-0">
		<Command.Root>
			<Command.Input placeholder="Search..."/>
			<Command.List class="max-h-auto">
				<Command.Empty>No templates found.</Command.Empty>
				<!-- Start from scratch group -->
				<Command.Group class="p-0">
					<Select.Item value="" class="cursor-pointer justify-center">
						<Command.Item
							value=""
							keywords={['start', 'scratch', 'blank', 'empty', 'new']}
							class="!p-0 !bg-transparent hover:!bg-transparent aria-selected:!bg-transparent"
						>
							<span class="text-muted-foreground">-- Start from scratch --</span>
						</Command.Item>
					</Select.Item>
				</Command.Group>
				<!-- Template groups -->
				{#each templateOptions.groups as group (group.heading)}
					<Command.Group heading={group.heading} class="p-0">
						{#each group.items as template (template.id)}
							<Select.Item value={template.id} class="pl-4 cursor-pointer">
								<Command.Item
									value={template.id}
									keywords={[template.name]}
									class="!p-0 !bg-transparent hover:!bg-transparent aria-selected:!bg-transparent"
								>
									{template.name}
								</Command.Item>
							</Select.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Select.Content>
</Select.Root>
