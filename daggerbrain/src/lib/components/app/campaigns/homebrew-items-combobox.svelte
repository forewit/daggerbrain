<script lang="ts">
	import { tick } from 'svelte';
	import { cn } from '$lib/utils';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Select from '$lib/components/ui/select';
	import type { HomebrewType } from '@shared/types/homebrew.types';
	import Swords from '@lucide/svelte/icons/swords';
	import Shield from '@lucide/svelte/icons/shield';
	import PawPrint from '@lucide/svelte/icons/paw-print';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import BookOpen from '@lucide/svelte/icons/book-open';

	let {
		value = $bindable(''),
		disabled = false,
		excludeItems = []
	}: {
		value?: string;
		disabled?: boolean;
		excludeItems?: Array<{ homebrew_type: HomebrewType; homebrew_id: string }>;
	} = $props();

	const homebrew = getHomebrewContext();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	// Configuration for homebrew types
	const HOMEBREW_TYPE_CONFIG: Record<
		HomebrewType,
		{
			name: string;
			getItems: (
				homebrew: ReturnType<typeof getHomebrewContext>
			) => Array<{ id: string; name: string }>;
			icon: typeof Swords;
		}
	> = {
		weapon: {
			name: 'Weapon',
			getItems: (h) => [
				...Object.entries(h.primary_weapons).map(([id, item]) => ({ id, name: item.title })),
				...Object.entries(h.secondary_weapons).map(([id, item]) => ({ id, name: item.title }))
			],
			icon: Swords
		},
		armor: {
			name: 'Armor',
			getItems: (h) => Object.entries(h.armor).map(([id, item]) => ({ id, name: item.title })),
			icon: Shield
		},
		loot: {
			name: 'Loot',
			getItems: (h) => Object.entries(h.loot).map(([id, item]) => ({ id, name: item.title })),
			icon: null as any // Will use lootIcon snippet
		},
		consumable: {
			name: 'Consumable',
			getItems: (h) =>
				Object.entries(h.consumables).map(([id, item]) => ({ id, name: item.title })),
			icon: FlaskConical
		},
		beastform: {
			name: 'Beastform',
			getItems: (h) => Object.entries(h.beastforms).map(([id, item]) => ({ id, name: item.name })),
			icon: PawPrint
		},
		class: {
			name: 'Class',
			getItems: (h) => Object.entries(h.classes).map(([id, item]) => ({ id, name: item.name })),
			icon: GraduationCap
		},
		subclass: {
			name: 'Subclass',
			getItems: (h) => Object.entries(h.subclasses).map(([id, item]) => ({ id, name: item.name })),
			icon: BookOpen
		},
		'domain-cards': {
			name: 'Domain Card',
			getItems: (h) =>
				Object.values(h.domain_cards)
					.flatMap((domain) => Object.entries(domain))
					.map(([id, item]) => ({ id, name: item.title })),
			icon: null as any // Will use cardIcon snippet
		},
		'ancestry-cards': {
			name: 'Ancestry Card',
			getItems: (h) =>
				Object.entries(h.ancestry_cards).map(([id, item]) => ({ id, name: item.title })),
			icon: null as any // Will use cardIcon snippet
		},
		'community-cards': {
			name: 'Community Card',
			getItems: (h) =>
				Object.entries(h.community_cards).map(([id, item]) => ({ id, name: item.title })),
			icon: null as any // Will use cardIcon snippet
		},
		'transformation-cards': {
			name: 'Transformation Card',
			getItems: (h) =>
				Object.entries(h.transformation_cards).map(([id, item]) => ({ id, name: item.title })),
			icon: null as any // Will use cardIcon snippet
		}
	};

	type HomebrewItem = {
		id: string;
		name: string;
		type: HomebrewType;
	};

	type GroupedItems = {
		groups: Array<{ heading: string; items: HomebrewItem[]; type: HomebrewType }>;
		flat: HomebrewItem[];
	};

	const groupedItems = $derived.by((): GroupedItems => {
		const groups: Array<{ heading: string; items: HomebrewItem[]; type: HomebrewType }> = [];
		const flat: HomebrewItem[] = [];

		// Create a Set for fast lookup of excluded items
		const excludedSet = new Set(
			excludeItems.map((item) => `${item.homebrew_type}:${item.homebrew_id}`)
		);

		for (const [type, config] of Object.entries(HOMEBREW_TYPE_CONFIG) as [
			HomebrewType,
			(typeof HOMEBREW_TYPE_CONFIG)[HomebrewType]
		][]) {
			const items = config
				.getItems(homebrew)
				.map((item) => ({
					...item,
					type
				}))
				.filter((item) => !excludedSet.has(`${item.type}:${item.id}`));

			if (items.length > 0) {
				// Sort items alphabetically within each group
				items.sort((a, b) => a.name.localeCompare(b.name));
				groups.push({
					heading: config.name,
					items,
					type
				});
				flat.push(...items);
			}
		}

		return { groups, flat };
	});

	const selectedLabel = $derived.by(() => {
		if (!value) return 'Select item...';
		const [type, id] = value.split(':');
		if (!type || !id) return 'Select item...';
		const item = groupedItems.flat.find((i) => i.type === type && i.id === id);
		return item?.name || 'Select item...';
	});

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}
</script>

{#snippet lootIcon(sizeClass = 'size-4')}
	<svg viewBox="0 0 24 24" class="{sizeClass} fill-current" aria-hidden="true">
		<path
			d="M18,0H6C2.691,0,0,2.691,0,6V24H24V6c0-3.309-2.691-6-6-6Zm4,6v3h-2V2.556c1.19,.694,2,1.97,2,3.444Zm-4-4v7h-3c0-1.654-1.346-3-3-3s-3,1.346-3,3h-3V2h12Zm-5,7v4h-2v-4c0-.551,.448-1,1-1s1,.449,1,1ZM4,2.556v6.444H2v-3c0-1.474,.81-2.75,2-3.444ZM20,22V13h-2v9H6V13h-2v9H2V11h7v4h6v-4h7v11h-2Z"
		/>
	</svg>
{/snippet}

{#snippet cardIcon(sizeClass = 'size-4')}
	<svg
		class={sizeClass}
		width="800px"
		height="800px"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M1 4C1 2.34315 2.34315 1 4 1H14C15.1323 1 16.1181 1.62732 16.6288 2.55337L20.839 3.68148C22.4394 4.11031 23.3891 5.75532 22.9603 7.35572L19.3368 20.8787C18.908 22.4791 17.263 23.4288 15.6626 23L8.19849 21H4C2.34315 21 1 19.6569 1 18V4ZM17 18V4.72339L20.3213 5.61334C20.8548 5.75628 21.1714 6.30461 21.0284 6.83808L17.405 20.361C17.262 20.8945 16.7137 21.2111 16.1802 21.0681L15.1198 20.784C16.222 20.3403 17 19.261 17 18ZM4 3C3.44772 3 3 3.44772 3 4V18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18V4C15 3.44772 14.5523 3 14 3H4Z"
			fill="currentColor"
		/>
	</svg>
{/snippet}

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
		<span class="truncate">{selectedLabel}</span>
	</Select.Trigger>
	<Select.Content collisionPadding={10} avoidCollisions={false} side="bottom" align="start" class="w-full p-0">
		<Command.Root>
			<Command.Input placeholder="Search..." />
			<Command.List class="max-h-auto">
				<Command.Empty>No items found.</Command.Empty>
				{#each groupedItems.groups as group (group.type)}
					<Command.Group class="p-0">
						<div
							class="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground"
						>
							{#if group.type === 'loot'}
								{@render lootIcon('size-4')}
							{:else if ['domain-cards', 'ancestry-cards', 'community-cards', 'transformation-cards'].includes(group.type)}
								{@render cardIcon('size-4')}
							{:else}
								{@const Icon = HOMEBREW_TYPE_CONFIG[group.type].icon}
								{#if Icon}
									<Icon class="size-4" />
								{/if}
							{/if}
							<span>{group.heading}</span>
						</div>
						{#each group.items as item (item.id)}
							<Command.Item
								value={`${item.type}:${item.id}`}
								keywords={[item.name, group.heading]}
								class="!bg-transparent !p-0 hover:!bg-transparent aria-selected:!bg-transparent"
							>
								<Select.Item value={`${item.type}:${item.id}`} class="cursor-pointer pl-4">
									{item.name}
								</Select.Item>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Select.Content>
</Select.Root>
