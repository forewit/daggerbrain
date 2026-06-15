<script lang="ts">
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Select from '$lib/components/ui/select';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import PawPrint from '@lucide/svelte/icons/paw-print';
	import Shield from '@lucide/svelte/icons/shield';
	import Skull from '@lucide/svelte/icons/skull';
	import Swords from '@lucide/svelte/icons/swords';

	type VaultType =
		| 'primary_weapons'
		| 'secondary_weapons'
		| 'armor'
		| 'loot'
		| 'consumables'
		| 'beastforms'
		| 'classes'
		| 'subclasses'
		| 'domains'
		| 'domain_cards'
		| 'ancestry_cards'
		| 'community_cards'
		| 'transformation_cards'
		| 'adversaries'
		| 'environments';

	let {
		value = $bindable(''),
		disabled = false,
		excludeItems = []
	}: {
		value?: string;
		disabled?: boolean;
		excludeItems?: Array<{ type: VaultType; id: string }>;
	} = $props();

	const homebrew = getHomebrewContext();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const TYPE_CONFIG: Record<
		VaultType,
		{
			name: string;
			icon?: typeof Swords;
			getItems: () => Array<{ id: string; name: string }>;
		}
	> = {
		primary_weapons: {
			name: 'Primary Weapon',
			icon: Swords,
			getItems: () =>
				Object.entries(homebrew.compendium?.primary_weapons ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		secondary_weapons: {
			name: 'Secondary Weapon',
			icon: Swords,
			getItems: () =>
				Object.entries(homebrew.compendium?.secondary_weapons ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		armor: {
			name: 'Armor',
			icon: Shield,
			getItems: () =>
				Object.entries(homebrew.compendium?.armor ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		loot: {
			name: 'Loot',
			getItems: () =>
				Object.entries(homebrew.compendium?.loot ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		consumables: {
			name: 'Consumable',
			icon: FlaskConical,
			getItems: () =>
				Object.entries(homebrew.compendium?.consumables ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		beastforms: {
			name: 'Beastform',
			icon: PawPrint,
			getItems: () =>
				Object.entries(homebrew.compendium?.beastforms ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		classes: {
			name: 'Class',
			icon: GraduationCap,
			getItems: () =>
				Object.entries(homebrew.compendium?.classes ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		subclasses: {
			name: 'Subclass',
			icon: BookOpen,
			getItems: () =>
				Object.entries(homebrew.compendium?.subclasses ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		domains: {
			name: 'Domain',
			getItems: () =>
				Object.entries(homebrew.compendium?.domains ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		domain_cards: {
			name: 'Domain Card',
			getItems: () =>
				Object.entries(homebrew.compendium?.domain_cards ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		ancestry_cards: {
			name: 'Ancestry Card',
			getItems: () =>
				Object.entries(homebrew.compendium?.ancestry_cards ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		community_cards: {
			name: 'Community Card',
			getItems: () =>
				Object.entries(homebrew.compendium?.community_cards ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		transformation_cards: {
			name: 'Transformation Card',
			getItems: () =>
				Object.entries(homebrew.compendium?.transformation_cards ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		adversaries: {
			name: 'Adversary',
			icon: Skull,
			getItems: () =>
				Object.entries(homebrew.compendium?.adversaries ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		},
		environments: {
			name: 'Environment',
			icon: MapPin,
			getItems: () =>
				Object.entries(homebrew.compendium?.environments ?? {}).map(([id, item]) => ({
					id,
					name: item.title
				}))
		}
	};

	type GroupedItems = {
		groups: Array<{
			heading: string;
			type: VaultType;
			items: Array<{ id: string; name: string; type: VaultType }>;
		}>;
		flat: Array<{ id: string; name: string; type: VaultType }>;
	};

	const groupedItems = $derived.by((): GroupedItems => {
		const excludedSet = new Set(excludeItems.map((item) => `${item.type}:${item.id}`));
		const groups: GroupedItems['groups'] = [];
		const flat: GroupedItems['flat'] = [];

		for (const [type, config] of Object.entries(TYPE_CONFIG) as [
			VaultType,
			(typeof TYPE_CONFIG)[VaultType]
		][]) {
			const items = config
				.getItems()
				.map((item) => ({ ...item, type }))
				.filter((item) => !excludedSet.has(`${item.type}:${item.id}`))
				.sort((left, right) => left.name.localeCompare(right.name));

			if (items.length === 0) continue;
			groups.push({ heading: config.name, type, items });
			flat.push(...items);
		}

		return { groups, flat };
	});

	const selectedLabel = $derived.by(() => {
		if (!value) return 'Select item...';
		const [type, id] = value.split(':');
		if (!type || !id) return 'Select item...';
		const item = groupedItems.flat.find((entry) => entry.type === type && entry.id === id);
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
	<svg viewBox="0 0 24 24" class={sizeClass} aria-hidden="true">
		<path
			d="M18,0H6C2.691,0,0,2.691,0,6V24H24V6c0-3.309-2.691-6-6-6Zm4,6v3h-2V2.556c1.19,.694,2,1.97,2,3.444Zm-4-4v7h-3c0-1.654-1.346-3-3-3s-3,1.346-3,3h-3V2h12Zm-5,7v4h-2v-4c0-.551,.448-1,1-1s1,.449,1,1ZM4,2.556v6.444H2v-3c0-1.474,.81-2.75,2-3.444ZM20,22V13h-2v9H6V13h-2v9H2V11h7v4h6v-4h7v11h-2Z"
			fill="currentColor"
		/>
	</svg>
{/snippet}

{#snippet cardIcon(sizeClass = 'size-4')}
	<svg class={sizeClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
	<Select.Content avoidCollisions={false} side="bottom" align="start" class="w-full p-0">
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
							{:else if ['domain_cards', 'ancestry_cards', 'community_cards', 'transformation_cards'].includes(group.type)}
								{@render cardIcon('size-4')}
							{:else}
								{@const Icon = TYPE_CONFIG[group.type].icon}
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
