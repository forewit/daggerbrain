<script lang="ts">
	import { cn } from '$lib/utils';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import type { Weapon, Armor, Beastform } from '$lib/types/compendium-types';
	import Search from '@lucide/svelte/icons/search';
	import Shield from '@lucide/svelte/icons/shield';
	import Swords from '@lucide/svelte/icons/swords';
	import PawPrint from '@lucide/svelte/icons/paw-print';
	import Footer from '$lib/components/app/footer.svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Label from '$lib/components/ui/label/label.svelte';

	const homebrew = getHomebrewContext();

	// Create dialog state
	type HomebrewType = 'weapon' | 'armor' | 'beastform';
	let showCreateDialog = $state(false);
	let newItemType = $state<HomebrewType | undefined>(undefined);
	let newItemName = $state('');
	let isCreating = $state(false);

	async function handleCreateHomebrew() {
		if (!newItemName.trim() || !newItemType) return;

		isCreating = true;
		try {
			switch (newItemType) {
				case 'weapon':
					await homebrew.createPrimaryWeapon({
						compendium_id: '',
						source_id: 'Homebrew',
						title: newItemName.trim(),
						description_html: '',
						level_requirement: 1,
						category: 'Primary',
						type: 'Physical',
						available_traits: [],
						range: 'Melee',
						features: [],
						attack_roll_bonus: 0,
						damage_bonus: 0,
						damage_dice: '1d6',
						available_damage_types: [],
						burden: 1
					});
					break;
				case 'armor':
					await homebrew.createArmor({
						compendium_id: '',
						source_id: 'Homebrew',
						title: newItemName.trim(),
						description_html: '',
						level_requirement: 1,
						max_armor: 0,
						damage_thresholds: { major: 0, severe: 0 },
						features: []
					});
					break;
				case 'beastform':
					await homebrew.createBeastform({
						compendium_id: '',
						source_id: 'Homebrew',
						level_requirement: 1,
						name: newItemName.trim(),
						category: '',
						character_trait: {
							trait: 'agility',
							bonus: 0
						},
						attack: {
							range: 'Melee',
							trait: 'agility',
							damage_dice: 'd4',
							damage_bonus: 0,
							damage_type: 'phy'
						},
						advantages: [],
						evasion_bonus: 0,
						features: []
					});
					break;
			}
			// Reset form and close dialog
			newItemName = '';
			newItemType = undefined;
			showCreateDialog = false;
		} catch (err) {
			console.error('Failed to create homebrew item:', err);
		} finally {
			isCreating = false;
		}
	}

	// Filter state
	let searchQuery = $state('');
	let activeTab = $state<'all' | 'weapons' | 'armor' | 'beastforms'>('all');
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let weaponCategoryFilter = $state<'Primary' | 'Secondary' | ''>('');
	let weaponTypeFilter = $state<'Magical' | 'Physical' | ''>('');

	// Delete dialog state
	let showDeleteDialog = $state(false);
	let itemToDelete = $state<{
		id: string;
		name: string;
		type: 'primary_weapon' | 'secondary_weapon' | 'armor' | 'beastform';
	} | null>(null);

	// Clear subfilters when main tab changes
	$effect(() => {
		if (activeTab !== 'weapons') {
			weaponCategoryFilter = '';
			weaponTypeFilter = '';
		}
		if (activeTab === 'all') {
			tierFilter = '';
		}
	});

	// Helper function to convert level to tier
	function levelToTier(level: number): number {
		if (level <= 4) return 1;
		if (level <= 7) return 2;
		if (level <= 9) return 3;
		return 4;
	}

	// Helper function to strip HTML tags for search
	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').trim();
	}

	// Helper function to check if item matches search
	function matchesSearch(title: string, description: string, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const titleMatch = title.toLowerCase().includes(searchLower);
		const descMatch = stripHtml(description).toLowerCase().includes(searchLower);
		return titleMatch || descMatch;
	}

	// Helper to convert tier string to number
	function getTierNumber(tier: '1' | '2' | '3' | '4'): number {
		return parseInt(tier);
	}

	// Filter primary weapons
	let filteredPrimaryWeapons = $derived(
		Object.entries(homebrew.primary_weapons)
			.map(([id, weapon]) => ({ id, weapon }))
			.filter(({ weapon }) => {
				if (!matchesSearch(weapon.title, weapon.description_html, searchQuery)) return false;
				if (tierFilter !== '' && levelToTier(weapon.level_requirement) !== getTierNumber(tierFilter))
					return false;
				if (weaponTypeFilter !== '' && weapon.type !== weaponTypeFilter) return false;
				return true;
			})
	);

	// Filter secondary weapons
	let filteredSecondaryWeapons = $derived(
		Object.entries(homebrew.secondary_weapons)
			.map(([id, weapon]) => ({ id, weapon }))
			.filter(({ weapon }) => {
				if (!matchesSearch(weapon.title, weapon.description_html, searchQuery)) return false;
				if (tierFilter !== '' && levelToTier(weapon.level_requirement) !== getTierNumber(tierFilter))
					return false;
				if (weaponTypeFilter !== '' && weapon.type !== weaponTypeFilter) return false;
				return true;
			})
	);

	// Filter armor
	let filteredArmor = $derived(
		Object.entries(homebrew.armor)
			.map(([id, armor]) => ({ id, armor }))
			.filter(({ armor }) => {
				if (!matchesSearch(armor.title, armor.description_html, searchQuery)) return false;
				if (tierFilter !== '' && levelToTier(armor.level_requirement) !== getTierNumber(tierFilter))
					return false;
				return true;
			})
	);

	// Filter beastforms
	let filteredBeastforms = $derived(
		Object.entries(homebrew.beastforms)
			.map(([id, beastform]) => ({ id, beastform }))
			.filter(({ beastform }) => {
				const descHtml = beastform.features.map((f) => f.description_html).join(' ');
				if (!matchesSearch(beastform.name, descHtml, searchQuery)) return false;
				if (
					tierFilter !== '' &&
					levelToTier(beastform.level_requirement) !== getTierNumber(tierFilter)
				)
					return false;
				return true;
			})
	);

	// Combined filtered items based on tab
	type FilteredItem =
		| { type: 'primary_weapon'; id: string; item: Weapon }
		| { type: 'secondary_weapon'; id: string; item: Weapon }
		| { type: 'armor'; id: string; item: Armor }
		| { type: 'beastform'; id: string; item: Beastform };

	let filteredItems = $derived.by((): FilteredItem[] => {
		const items: FilteredItem[] = [];

		if (activeTab === 'all' || activeTab === 'weapons') {
			if (weaponCategoryFilter === '' || weaponCategoryFilter === 'Primary') {
				items.push(
					...filteredPrimaryWeapons.map(({ id, weapon }) => ({
						type: 'primary_weapon' as const,
						id,
						item: weapon
					}))
				);
			}
			if (weaponCategoryFilter === '' || weaponCategoryFilter === 'Secondary') {
				items.push(
					...filteredSecondaryWeapons.map(({ id, weapon }) => ({
						type: 'secondary_weapon' as const,
						id,
						item: weapon
					}))
				);
			}
		}

		if (activeTab === 'all' || activeTab === 'armor') {
			items.push(
				...filteredArmor.map(({ id, armor }) => ({
					type: 'armor' as const,
					id,
					item: armor
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'beastforms') {
			items.push(
				...filteredBeastforms.map(({ id, beastform }) => ({
					type: 'beastform' as const,
					id,
					item: beastform
				}))
			);
		}

		return items;
	});

	// Count items by type for display
	let primaryWeaponCount = $derived(Object.keys(homebrew.primary_weapons).length);
	let secondaryWeaponCount = $derived(Object.keys(homebrew.secondary_weapons).length);
	let weaponCount = $derived(primaryWeaponCount + secondaryWeaponCount);
	let armorCount = $derived(Object.keys(homebrew.armor).length);
	let beastformCount = $derived(Object.keys(homebrew.beastforms).length);
	let totalCount = $derived(weaponCount + armorCount + beastformCount);

	// Check if at limit for each type (limit of 1 per type)
	let isWeaponAtLimit = $derived(primaryWeaponCount >= 1);
	let isArmorAtLimit = $derived(armorCount >= 1);
	let isBeastformAtLimit = $derived(beastformCount >= 1);

	// Check if the selected type in the create dialog is at limit
	let isSelectedTypeAtLimit = $derived.by(() => {
		if (!newItemType) return false;
		switch (newItemType) {
			case 'weapon':
				return isWeaponAtLimit;
			case 'armor':
				return isArmorAtLimit;
			case 'beastform':
				return isBeastformAtLimit;
			default:
				return false;
		}
	});

	// Check if all types are at limit
	let allTypesAtLimit = $derived(isWeaponAtLimit && isArmorAtLimit && isBeastformAtLimit);

	// Handle delete
	function openDeleteDialog(
		id: string,
		name: string,
		type: 'primary_weapon' | 'secondary_weapon' | 'armor' | 'beastform'
	) {
		itemToDelete = { id, name, type };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (!itemToDelete) return;

		try {
			switch (itemToDelete.type) {
				case 'primary_weapon':
					await homebrew.deletePrimaryWeapon(itemToDelete.id);
					break;
				case 'secondary_weapon':
					await homebrew.deleteSecondaryWeapon(itemToDelete.id);
					break;
				case 'armor':
					await homebrew.deleteArmor(itemToDelete.id);
					break;
				case 'beastform':
					await homebrew.deleteBeastform(itemToDelete.id);
					break;
			}
		} catch (err) {
			console.error('Failed to delete item:', err);
		} finally {
			itemToDelete = null;
			showDeleteDialog = false;
		}
	}

	// Get item name helper
	function getItemName(entry: FilteredItem): string {
		if (entry.type === 'beastform') {
			return (entry.item as Beastform).name;
		}
		return (entry.item as Weapon | Armor).title;
	}

	// Get item tier helper
	function getItemTier(entry: FilteredItem): number {
		return levelToTier(entry.item.level_requirement);
	}

	// Get item subtitle helper
	function getItemSubtitle(entry: FilteredItem): string {
		switch (entry.type) {
			case 'primary_weapon':
				return `Tier ${getItemTier(entry)} Primary Weapon`;
			case 'secondary_weapon':
				return `Tier ${getItemTier(entry)} Secondary Weapon`;
			case 'armor':
				return `Tier ${getItemTier(entry)} Armor`;
			case 'beastform':
				return (entry.item as Beastform).category;
		}
	}

	// Get item href helper
	function getItemHref(entry: FilteredItem): string {
		switch (entry.type) {
			case 'primary_weapon':
			case 'secondary_weapon':
				return `/homebrew/weapons/${entry.id}`;
			case 'armor':
				return `/homebrew/armor/${entry.id}`;
			case 'beastform':
				return `/homebrew/beastforms/${entry.id}`;
		}
	}

</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	{#if homebrew.loading}
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else}
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
		<div class="w-full max-w-6xl space-y-4 px-4 py-4">
			<!-- Header -->
			<div class="flex items-center justify-between gap-2">
				<p class="flex items-center gap-2 text-2xl font-bold">
					My Homebrew
					<span
						class="rounded-full border bg-card px-2 py-0.5 text-base tracking-widest text-muted-foreground"
					>
						{totalCount}
					</span>
				</p>

				<div class="flex gap-2">
					<Button variant="outline" onclick={() => (showCreateDialog = true)} disabled={allTypesAtLimit}>
						<Plus /> New Homebrew
					</Button>
				</div>
			</div>

			 <div class="grow flex justify-center sm:justify-start">
				<!-- Tabs as Filter -->
				<Tabs.Root bind:value={activeTab}>
					<Tabs.List class="sm:mx-0 flex h-auto flex-wrap sm:flex-nowrap gap-y-1">
						<Tabs.Trigger value="all" class="flex-initial gap-1">
							All ({totalCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="weapons" class="flex-initial gap-1">
							<Swords class="size-4" />
							Weapons ({weaponCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="armor" class="flex-initial gap-1">
							<Shield class="size-4" />
							Armor ({armorCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="beastforms" class="flex-initial gap-1">
							<PawPrint class="size-4" />
							Beastforms ({beastformCount})
						</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>	
				
			<div class="flex justify-center sm:justify-start flex-wrap gap-2">
				<!-- Search Box -->
				<div class="shrink relative h-min w-[200px]">
					<Search
						class="shrink pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input bind:value={searchQuery} placeholder="Search..." class="pl-9" />
				</div>

				<!-- Subfilters for Weapons -->
				{#if activeTab === 'weapons'}
						<!-- Category Select (Primary/Secondary) -->
						<Select.Root
							type="single"
							value={weaponCategoryFilter}
							onValueChange={(v) => (weaponCategoryFilter = (v as 'Primary' | 'Secondary' | '') || '')}
						>
							<Select.Trigger class="w-32">
								{weaponCategoryFilter || 'All Categories'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">All Categories</Select.Item>
								<Select.Item value="Primary">Primary</Select.Item>
								<Select.Item value="Secondary">Secondary</Select.Item>
							</Select.Content>
						</Select.Root>

						<!-- Tier Select -->
						<Select.Root
							type="single"
							value={tierFilter}
							onValueChange={(v) => (tierFilter = (v as '1' | '2' | '3' | '4' | '') || '')}
						>
							<Select.Trigger class="w-28">
								{tierFilter ? `Tier ${tierFilter}` : 'All Tiers'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">All Tiers</Select.Item>
								<Select.Item value="1">Tier 1</Select.Item>
								<Select.Item value="2">Tier 2</Select.Item>
								<Select.Item value="3">Tier 3</Select.Item>
								<Select.Item value="4">Tier 4</Select.Item>
							</Select.Content>
						</Select.Root>

						<!-- Type Select (Magical/Physical) -->
						<Select.Root
							type="single"
							value={weaponTypeFilter}
							onValueChange={(v) => (weaponTypeFilter = (v as 'Magical' | 'Physical' | '') || '')}
						>
							<Select.Trigger class="w-28">
								{weaponTypeFilter || 'All Types'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">All Types</Select.Item>
								<Select.Item value="Physical">Physical</Select.Item>
								<Select.Item value="Magical">Magical</Select.Item>
							</Select.Content>
						</Select.Root>

						<!-- Reset Button -->
						{#if weaponCategoryFilter !== '' || tierFilter !== '' || weaponTypeFilter !== ''}
							<Button
								variant="link"
								size="sm"
								onclick={() => {
									weaponCategoryFilter = '';
									tierFilter = '';
									weaponTypeFilter = '';
								}}
								class="text-muted-foreground"
							>
								Reset
								<RotateCcw class="size-3.5"/>
							</Button>
						{/if}
				{/if}

				<!-- Subfilters for Armor -->
				{#if activeTab === 'armor'}
						<!-- Tier Select -->
						<Select.Root
							type="single"
							value={tierFilter}
							onValueChange={(v) => (tierFilter = (v as '1' | '2' | '3' | '4' | '') || '')}
						>
							<Select.Trigger class="w-28">
								{tierFilter ? `Tier ${tierFilter}` : 'All Tiers'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">All Tiers</Select.Item>
								<Select.Item value="1">Tier 1</Select.Item>
								<Select.Item value="2">Tier 2</Select.Item>
								<Select.Item value="3">Tier 3</Select.Item>
								<Select.Item value="4">Tier 4</Select.Item>
							</Select.Content>
						</Select.Root>

						<!-- Reset Button -->
						{#if tierFilter !== ''}
							<Button
								variant="link"
								size="sm"
								onclick={() => {
									tierFilter = '';
								}}
								class="text-muted-foreground"
							>
								Reset
							</Button>
						{/if}
				{/if}

				<!-- Subfilters for Beastforms -->
				{#if activeTab === 'beastforms'}
						<!-- Tier Select -->
						<Select.Root
							type="single"
							value={tierFilter}
							onValueChange={(v) => (tierFilter = (v as '1' | '2' | '3' | '4' | '') || '')}
						>
							<Select.Trigger class="w-28">
								{tierFilter ? `Tier ${tierFilter}` : 'All Tiers'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">All Tiers</Select.Item>
								<Select.Item value="1">Tier 1</Select.Item>
								<Select.Item value="2">Tier 2</Select.Item>
								<Select.Item value="3">Tier 3</Select.Item>
								<Select.Item value="4">Tier 4</Select.Item>
							</Select.Content>
						</Select.Root>

						<!-- Reset Button -->
						{#if tierFilter !== ''}
							<Button
								variant="link"
								size="sm"
								onclick={() => {
									tierFilter = '';
								}}
								class="text-muted-foreground"
							>
								Reset
								<RotateCcw class="size-3.5"/>
							</Button>
						{/if}
				{/if}
			</div>

			<!-- Results Grid -->
			{#if filteredItems.length === 0}
				<p class="py-8 text-center text-sm text-muted-foreground">
					{#if totalCount === 0}
						You haven't created any homebrew items yet.
					{:else}
						No items match your filters.
					{/if}
				</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredItems as entry (entry.id)}
						<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded">
							<!-- Card Header -->
							<a
								href={getItemHref(entry)}
								class="flex gap-2 border bg-primary-muted p-3 hover:bg-primary-muted/80"
							>
								<div class="flex size-12 shrink-0 items-center justify-center rounded-lg border-2 bg-card">
									{#if entry.type === 'primary_weapon' || entry.type === 'secondary_weapon'}
										<Swords class="size-6 text-muted-foreground" />
									{:else if entry.type === 'armor'}
										<Shield class="size-6 text-muted-foreground" />
									{:else if entry.type === 'beastform'}
										<PawPrint class="size-6 text-muted-foreground" />
									{/if}
								</div>
								<div class="min-w-0 flex-1 truncate">
									<p class="truncate text-lg font-bold">
										{getItemName(entry)}
									</p>
									<p class="truncate text-xs text-muted-foreground">
										{getItemSubtitle(entry)}
									</p>
								</div>
							</a>

							<!-- Card Actions -->
							<div class="flex bg-muted">
								<Button
									variant="ghost"
									size="sm"
									class="hover:text-text grow rounded-none border"
									href={getItemHref(entry)}
								>
									Edit
								</Button>
								<Button
									variant="ghost"
									size="sm"
									class="grow rounded-none border border-x-0 text-destructive hover:text-destructive"
									onclick={() => openDeleteDialog(entry.id, getItemName(entry), entry.type)}
								>
									Delete
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	{/if}
</div>

<Footer />

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Homebrew Item</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong>{itemToDelete?.name || 'this item'}</strong>? This
				action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-3 pt-4">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
				Cancel
			</Dialog.Close>
			<Dialog.Close class={buttonVariants({ variant: 'destructive' })} onclick={confirmDelete}>
				Delete
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Create Homebrew Dialog -->
<Dialog.Root bind:open={showCreateDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Create New Homebrew</Dialog.Title>
			<Dialog.Description>
				Choose a type and give your homebrew creation a name to get started.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-4 py-4">
			<!-- Type Selection -->
			<div class="flex flex-col gap-2">
				<Label>What do you want to create?</Label>
				<Select.Root
					type="single"
					value={newItemType}
					onValueChange={(v) => (newItemType = (v || undefined) as HomebrewType | undefined)}
				>
					<Select.Trigger class="w-full">
						{#if newItemType === 'weapon'}
							<div class="flex items-center gap-2">
								<Swords class="size-4" />
								Weapon
							</div>
						{:else if newItemType === 'armor'}
							<div class="flex items-center gap-2">
								<Shield class="size-4" />
								Armor
							</div>
						{:else if newItemType === 'beastform'}
							<div class="flex items-center gap-2">
								<PawPrint class="size-4" />
								Beastform
							</div>
						{:else}
							<span class="text-muted-foreground">Select a type...</span>
						{/if}
					</Select.Trigger>
				<Select.Content>
					<Select.Item value="weapon" disabled={isWeaponAtLimit}>
						<div class="flex items-center gap-2">
							<Swords class="size-4" />
							Weapon {isWeaponAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="armor" disabled={isArmorAtLimit}>
						<div class="flex items-center gap-2">
							<Shield class="size-4" />
							Armor {isArmorAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="beastform" disabled={isBeastformAtLimit}>
						<div class="flex items-center gap-2">
							<PawPrint class="size-4" />
							Beastform {isBeastformAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
				</Select.Content>
				</Select.Root>
			</div>

			<!-- Name Input -->
			<div class="flex flex-col gap-2">
				<Label>Name</Label>
				<Input
					bind:value={newItemName}
					placeholder="Enter a name..."
					onkeydown={(e) => {
						if (e.key === 'Enter' && newItemName.trim() && newItemType && !isCreating) {
							handleCreateHomebrew();
						}
					}}
				/>
			</div>
		</div>

		<Dialog.Footer class="flex gap-3">
			<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
				Cancel
			</Dialog.Close>
			<Button
				onclick={handleCreateHomebrew}
				disabled={!newItemName.trim() || !newItemType || isCreating || isSelectedTypeAtLimit}
			>
				{isCreating ? 'Creating...' : 'Create'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
