<script lang="ts">
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Select from '$lib/components/ui/select';
	import DomainIcon from '$lib/components/decorations/domain-icon.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import { level_to_tier } from '$lib/utils';
	import type { CompendiumContent } from '@convex/schemas/compendium';
	import type { SourceKey } from '@convex/schemas/rules';

	type CreateHomebrewType =
		| 'primary-weapon'
		| 'secondary-weapon'
		| 'armor'
		| 'beastform'
		| 'loot'
		| 'consumable'
		| 'class'
		| 'subclass'
		| 'domain'
		| 'domain-cards'
		| 'ancestry-cards'
		| 'community-cards'
		| 'transformation-cards'
		| 'adversary'
		| 'environment';

	type TemplateOption = {
		id: string;
		name: string;
		source_key: SourceKey;
		domainId?: string;
		level?: number;
		cardTitle?: string;
	};

	type GroupedTemplates = {
		groups: Array<{ heading: string; items: TemplateOption[] }>;
		flat: TemplateOption[];
	};

	let {
		homebrewType,
		compendium,
		value = $bindable(''),
		disabled = false
	}: {
		homebrewType: CreateHomebrewType | undefined;
		compendium: CompendiumContent;
		value?: string;
		disabled?: boolean;
	} = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	function getDomainName(domainId: string | undefined): string {
		if (!domainId) return 'Unknown Domain';
		return compendium.domains[domainId]?.title || domainId;
	}

	function getSelectedLabel(val: string, type: CreateHomebrewType | undefined): string | null {
		if (!val || !type) return null;

		switch (type) {
			case 'primary-weapon':
				return compendium.primary_weapons[val]?.title ?? null;
			case 'secondary-weapon':
				return compendium.secondary_weapons[val]?.title ?? null;
			case 'armor':
				return compendium.armor[val]?.title ?? null;
			case 'beastform':
				return compendium.beastforms[val]?.title ?? null;
			case 'loot':
				return compendium.loot[val]?.title ?? null;
			case 'consumable':
				return compendium.consumables[val]?.title ?? null;
			case 'class':
				return compendium.classes[val]?.title ?? null;
			case 'subclass':
				return compendium.subclasses[val]?.title ?? null;
			case 'domain':
				return compendium.domains[val]?.title ?? null;
			case 'domain-cards': {
				const card = compendium.domain_cards[val];
				if (!card) return null;
				return `${getDomainName(card.domain_id)} ${card.level_requirement} ${card.title}`;
			}
			case 'ancestry-cards':
				return compendium.ancestry_cards[val]?.title ?? null;
			case 'community-cards':
				return compendium.community_cards[val]?.title ?? null;
			case 'transformation-cards':
				return compendium.transformation_cards[val]?.title ?? null;
			case 'adversary':
				return compendium.adversaries[val]?.title ?? null;
			case 'environment':
				return compendium.environments[val]?.title ?? null;
			default:
				return null;
		}
	}

	function getSelectedDomainCardInfo(
		val: string,
		type: CreateHomebrewType | undefined
	): { domainId: string; level: number; cardTitle: string } | null {
		if (!val || type !== 'domain-cards') return null;
		const card = compendium.domain_cards[val];
		if (!card || !card.domain_id) return null;
		return {
			domainId: card.domain_id,
			level: card.level_requirement,
			cardTitle: card.title
		};
	}

	const templateOptions = $derived.by((): GroupedTemplates => {
		if (!open || !homebrewType) return { groups: [], flat: [] };

		switch (homebrewType) {
			case 'primary-weapon': {
				const byTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };

				for (const [id, item] of Object.entries(compendium.primary_weapons)) {
					byTier[level_to_tier(item.level_requirement)].push({
						id,
						name: item.title,
						source_key: item.source_key
					});
				}

				for (const tier of [1, 2, 3, 4]) {
					byTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}

				return {
					groups: ([1, 2, 3, 4] as const)
						.filter((tier) => byTier[tier].length > 0)
						.map((tier) => ({ heading: `Tier ${tier}`, items: byTier[tier] })),
					flat: Object.values(byTier).flat()
				};
			}
			case 'secondary-weapon': {
				const byTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };

				for (const [id, item] of Object.entries(compendium.secondary_weapons)) {
					byTier[level_to_tier(item.level_requirement)].push({
						id,
						name: item.title,
						source_key: item.source_key
					});
				}

				for (const tier of [1, 2, 3, 4]) {
					byTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}

				return {
					groups: ([1, 2, 3, 4] as const)
						.filter((tier) => byTier[tier].length > 0)
						.map((tier) => ({ heading: `Tier ${tier}`, items: byTier[tier] })),
					flat: Object.values(byTier).flat()
				};
			}
			case 'armor': {
				const byTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };
				for (const [id, item] of Object.entries(compendium.armor)) {
					byTier[level_to_tier(item.level_requirement)].push({
						id,
						name: item.title,
						source_key: item.source_key
					});
				}
				for (const tier of [1, 2, 3, 4]) {
					byTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}
				return {
					groups: ([1, 2, 3, 4] as const)
						.filter((tier) => byTier[tier].length > 0)
						.map((tier) => ({ heading: `Tier ${tier}`, items: byTier[tier] })),
					flat: Object.values(byTier).flat()
				};
			}
			case 'beastform': {
				const byTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };
				for (const [id, item] of Object.entries(compendium.beastforms)) {
					byTier[level_to_tier(item.level_requirement)].push({
						id,
						name: item.title,
						source_key: item.source_key
					});
				}
				for (const tier of [1, 2, 3, 4]) {
					byTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}
				return {
					groups: ([1, 2, 3, 4] as const)
						.filter((tier) => byTier[tier].length > 0)
						.map((tier) => ({ heading: `Tier ${tier}`, items: byTier[tier] })),
					flat: Object.values(byTier).flat()
				};
			}
			case 'loot': {
				const items = Object.entries(compendium.loot)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Loot', items }], flat: items };
			}
			case 'consumable': {
				const items = Object.entries(compendium.consumables)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Consumables', items }], flat: items };
			}
			case 'class': {
				const items = Object.entries(compendium.classes)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Classes', items }], flat: items };
			}
			case 'subclass': {
				const grouped: Record<string, TemplateOption[]> = {};
				for (const [id, item] of Object.entries(compendium.subclasses)) {
					const classKey = item.class_id ?? 'unknown';
					grouped[classKey] ??= [];
					grouped[classKey].push({ id, name: item.title, source_key: item.source_key });
				}
				for (const items of Object.values(grouped)) {
					items.sort((a, b) => a.name.localeCompare(b.name));
				}
				const groups = Object.entries(grouped)
					.map(([classId, items]) => ({
						heading: compendium.classes[classId]?.title ?? 'Unassigned Class',
						items
					}))
					.sort((a, b) => a.heading.localeCompare(b.heading));
				return { groups, flat: Object.values(grouped).flat() };
			}
			case 'domain': {
				const items = Object.entries(compendium.domains)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Domains', items }], flat: items };
			}
			case 'domain-cards': {
				const grouped: Record<string, TemplateOption[]> = {};
				for (const [id, item] of Object.entries(compendium.domain_cards)) {
					const domainId = item.domain_id ?? 'unknown';
					grouped[domainId] ??= [];
					grouped[domainId].push({
						id,
						name: `${getDomainName(item.domain_id)} ${item.level_requirement} ${item.title}`,
						source_key: item.source_key,
						domainId: item.domain_id,
						level: item.level_requirement,
						cardTitle: item.title
					});
				}
				for (const items of Object.values(grouped)) {
					items.sort((a, b) => {
						if (a.level !== b.level) return (a.level ?? 0) - (b.level ?? 0);
						return a.name.localeCompare(b.name);
					});
				}
				const groups = Object.entries(grouped)
					.map(([domainId, items]) => ({
						heading: getDomainName(domainId === 'unknown' ? undefined : domainId),
						items
					}))
					.sort((a, b) => a.heading.localeCompare(b.heading));
				return { groups, flat: Object.values(grouped).flat() };
			}
			case 'ancestry-cards': {
				const items = Object.entries(compendium.ancestry_cards)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Ancestry Cards', items }], flat: items };
			}
			case 'community-cards': {
				const items = Object.entries(compendium.community_cards)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Community Cards', items }], flat: items };
			}
			case 'transformation-cards': {
				const items = Object.entries(compendium.transformation_cards)
					.map(([id, item]) => ({ id, name: item.title, source_key: item.source_key }))
					.sort((a, b) => a.name.localeCompare(b.name));
				return { groups: [{ heading: 'Transformation Cards', items }], flat: items };
			}
			case 'adversary': {
				const byTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };
				for (const [id, item] of Object.entries(compendium.adversaries)) {
					byTier[item.tier].push({ id, name: item.title, source_key: item.source_key });
				}
				for (const tier of [1, 2, 3, 4]) {
					byTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}
				return {
					groups: ([1, 2, 3, 4] as const)
						.filter((tier) => byTier[tier].length > 0)
						.map((tier) => ({ heading: `Tier ${tier}`, items: byTier[tier] })),
					flat: Object.values(byTier).flat()
				};
			}
			case 'environment': {
				const byTier: Record<number, TemplateOption[]> = { 1: [], 2: [], 3: [], 4: [] };
				for (const [id, item] of Object.entries(compendium.environments)) {
					byTier[item.tier].push({ id, name: item.title, source_key: item.source_key });
				}
				for (const tier of [1, 2, 3, 4]) {
					byTier[tier].sort((a, b) => a.name.localeCompare(b.name));
				}
				return {
					groups: ([1, 2, 3, 4] as const)
						.filter((tier) => byTier[tier].length > 0)
						.map((tier) => ({ heading: `Tier ${tier}`, items: byTier[tier] })),
					flat: Object.values(byTier).flat()
				};
			}
			default:
				return { groups: [], flat: [] };
		}
	});

	const selectedLabel = $derived(getSelectedLabel(value, homebrewType) ?? 'Start from scratch');

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => triggerRef?.focus());
	}
</script>

<Select.Root
	type="single"
	bind:open
	{disabled}
	value={value || undefined}
	onValueChange={(newValue) => {
		if (newValue !== undefined) {
			value = newValue;
			closeAndFocusTrigger();
		}
	}}
>
	<Select.Trigger bind:ref={triggerRef} class="w-full">
		{#if selectedLabel !== 'Start from scratch'}
			{@const domainCardInfo = getSelectedDomainCardInfo(value, homebrewType)}
			{#if domainCardInfo}
				<span class="flex items-center gap-1 truncate">
					<DomainIcon
						domain={compendium.domains[domainCardInfo.domainId]}
						class="size-4 shrink-0 text-muted-foreground"
					/>
					<span class="mr-1 text-xs font-medium text-muted-foreground">{domainCardInfo.level}</span>
					<span>{domainCardInfo.cardTitle}</span>
				</span>
			{:else}
				<span class="truncate">{selectedLabel}</span>
			{/if}
		{:else}
			<span class="truncate text-muted-foreground">Start from scratch</span>
		{/if}
	</Select.Trigger>

	<Select.Content avoidCollisions={false} side="bottom" align="start" class="w-full p-0">
		<Command.Root>
			<Command.Input placeholder="Search..." />
			<Command.List class="max-h-auto">
				<Command.Empty>No templates found.</Command.Empty>

				<Command.Group class="p-0">
					<Command.Item
						value=""
						keywords={['start', 'scratch', 'blank', 'empty', 'new']}
						class="!bg-transparent !p-0 hover:!bg-transparent aria-selected:!bg-transparent"
					>
						<Select.Item value="" class="cursor-pointer justify-center">
							<span class="text-muted-foreground">-- Start from scratch --</span>
						</Select.Item>
					</Command.Item>
				</Command.Group>

				{#each templateOptions.groups as group}
					<Command.Group heading={group.heading} class="p-0">
						{#each group.items as template (template.id)}
							<Command.Item
								value={template.id}
								keywords={[template.name, group.heading]}
								class="!bg-transparent !p-0 hover:!bg-transparent aria-selected:!bg-transparent"
							>
								<Select.Item value={template.id} class="cursor-pointer pl-4">
									{#if template.source_key === 'Homebrew'}
										<HomebrewBadge class="size-3.5" />
									{/if}
									{#if template.domainId && template.level !== undefined && template.cardTitle}
										<div class="flex items-center gap-1">
											<DomainIcon
												domain={compendium.domains[template.domainId]}
												class="size-4 shrink-0 text-muted-foreground"
											/>
											<span class="mr-1 text-xs font-medium text-muted-foreground">
												{template.level}
											</span>
											<span>{template.cardTitle}</span>
										</div>
									{:else}
										{template.name}
									{/if}
								</Select.Item>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Select.Content>
</Select.Root>
