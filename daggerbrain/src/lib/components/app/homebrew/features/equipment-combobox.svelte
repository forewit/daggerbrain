<script lang="ts">
	import { tick } from 'svelte';
	import { cn, level_to_tier } from '$lib/utils';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Select from '$lib/components/ui/select';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	let {
		type,
		value = $bindable(null),
		includeNone = true,
		disabled = false
	}: {
		type: 'primary_weapon' | 'secondary_weapon' | 'armor';
		value?: string | null;
		includeNone?: boolean;
		disabled?: boolean;
	} = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	type EquipmentOption = {
		id: string;
		title: string;
		tier: number;
		source: 'compendium' | 'homebrew';
	};

	type GroupedEquipment = {
		groups: Array<{ heading: string; items: EquipmentOption[] }>;
		flat: EquipmentOption[];
	};

	const groupedEquipment = $derived.by((): GroupedEquipment => {
		const groupsMap = new Map<number, EquipmentOption[]>();
		const flat: EquipmentOption[] = [];

		if (type === 'primary_weapon') {
			// Add compendium primary weapons
			for (const [id, weapon] of Object.entries(compendium.primary_weapons)) {
				const tier = level_to_tier(weapon.level_requirement);
				const option: EquipmentOption = {
					id,
					title: weapon.title,
					tier,
					source: 'compendium'
				};
				if (!groupsMap.has(tier)) {
					groupsMap.set(tier, []);
				}
				groupsMap.get(tier)!.push(option);
				flat.push(option);
			}
			// Add homebrew primary weapons
			for (const [id, weapon] of Object.entries(homebrew.primary_weapons)) {
				const tier = level_to_tier(weapon.level_requirement);
				const option: EquipmentOption = {
					id,
					title: weapon.title,
					tier,
					source: 'homebrew'
				};
				if (!groupsMap.has(tier)) {
					groupsMap.set(tier, []);
				}
				groupsMap.get(tier)!.push(option);
				flat.push(option);
			}
		} else if (type === 'secondary_weapon') {
			// Add compendium secondary weapons
			for (const [id, weapon] of Object.entries(compendium.secondary_weapons)) {
				const tier = level_to_tier(weapon.level_requirement);
				const option: EquipmentOption = {
					id,
					title: weapon.title,
					tier,
					source: 'compendium'
				};
				if (!groupsMap.has(tier)) {
					groupsMap.set(tier, []);
				}
				groupsMap.get(tier)!.push(option);
				flat.push(option);
			}
			// Add homebrew secondary weapons
			for (const [id, weapon] of Object.entries(homebrew.secondary_weapons)) {
				const tier = level_to_tier(weapon.level_requirement);
				const option: EquipmentOption = {
					id,
					title: weapon.title,
					tier,
					source: 'homebrew'
				};
				if (!groupsMap.has(tier)) {
					groupsMap.set(tier, []);
				}
				groupsMap.get(tier)!.push(option);
				flat.push(option);
			}
		} else if (type === 'armor') {
			// Add compendium armor
			for (const [id, item] of Object.entries(compendium.armor)) {
				const tier = level_to_tier(item.level_requirement);
				const option: EquipmentOption = {
					id,
					title: item.title,
					tier,
					source: 'compendium'
				};
				if (!groupsMap.has(tier)) {
					groupsMap.set(tier, []);
				}
				groupsMap.get(tier)!.push(option);
				flat.push(option);
			}
			// Add homebrew armor
			for (const [id, item] of Object.entries(homebrew.armor)) {
				const tier = level_to_tier(item.level_requirement);
				const option: EquipmentOption = {
					id,
					title: item.title,
					tier,
					source: 'homebrew'
				};
				if (!groupsMap.has(tier)) {
					groupsMap.set(tier, []);
				}
				groupsMap.get(tier)!.push(option);
				flat.push(option);
			}
		}

		// Sort items within each tier
		for (const items of groupsMap.values()) {
			items.sort((a, b) => a.title.localeCompare(b.title));
		}

		// Convert to groups array and sort by tier
		const groups = Array.from(groupsMap.entries())
			.map(([tier, items]) => ({
				heading: `Tier ${tier}`,
				items
			}))
			.sort((a, b) => {
				const tierA = parseInt(a.heading.replace('Tier ', ''));
				const tierB = parseInt(b.heading.replace('Tier ', ''));
				return tierA - tierB;
			});

		return { groups, flat };
	});

	const selectedLabel = $derived.by(() => {
		if (!value) return includeNone ? 'None' : 'Select...';
		const item = groupedEquipment.flat.find((e) => e.id === value);
		return item?.title || 'Unknown';
	});

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
	{disabled}
	value={value || undefined}
	onValueChange={(newValue) => {
		if (newValue !== undefined) {
			value = newValue || null;
			closeAndFocusTrigger();
		}
	}}
>
	<Select.Trigger bind:ref={triggerRef} class="w-full">
		<p class="truncate">{selectedLabel}</p>
	</Select.Trigger>
	<Select.Content
		collisionPadding={10}
		avoidCollisions={false}
		side="bottom"
		align="start"
		class="w-full p-0"
	>
		<Command.Root>
			<Command.Input placeholder="Search..." />
			<Command.List class="max-h-auto">
				<Command.Empty>No items found.</Command.Empty>
				{#if includeNone}
					<Command.Group class="p-0">
						<Command.Item
							value=""
							keywords={['none', 'clear', 'remove']}
							class="!bg-transparent !p-0 hover:!bg-transparent aria-selected:!bg-transparent"
						>
							<Select.Item value="" class="cursor-pointer justify-center">
								<span class="text-muted-foreground">-- None --</span>
							</Select.Item>
						</Command.Item>
					</Command.Group>
				{/if}
				{#each groupedEquipment.groups as group (group.heading)}
					<Command.Group heading={group.heading} class="p-0">
						{#each group.items as item (item.id)}
							<Command.Item
								value={item.id}
								keywords={[item.title, group.heading]}
								class="!bg-transparent !p-0 hover:!bg-transparent aria-selected:!bg-transparent"
							>
								<Select.Item value={item.id} class="cursor-pointer pl-4">
									{item.title} ({item.source === 'homebrew' ? 'Homebrew' : 'Compendium'})
								</Select.Item>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Select.Content>
</Select.Root>
