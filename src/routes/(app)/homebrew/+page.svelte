<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import type { Id } from '@convex/_generated/dataModel';
	import { COMPENDIUM_DEFAULTS } from '@convex/constants/constants';
	import { HOMEBREW_LIMIT } from '@convex/constants/entitlements';
	import type {
		Adversary,
		AncestryCard,
		Armor,
		Beastform,
		CharacterClass,
		CommunityCard,
		Consumable,
		Domain,
		DomainCard,
		Environment,
		Loot,
		PrimaryWeapon,
		SecondaryWeapon,
		Subclass,
		TransformationCard
	} from '@convex/schemas/compendium';
	import type { HomebrewTable } from '@convex/permissions';
	import Search from '@lucide/svelte/icons/search';
	import Shield from '@lucide/svelte/icons/shield';
	import Swords from '@lucide/svelte/icons/swords';
	import PawPrint from '@lucide/svelte/icons/paw-print';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Anvil from '@lucide/svelte/icons/anvil';
	import Sword from '@lucide/svelte/icons/sword';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Trees from '@lucide/svelte/icons/trees';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plus from '@lucide/svelte/icons/plus';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { artForge } from '$lib/assets/images';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import SafeDelete from '$lib/components/shared/safe-delete.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Footer from '$lib/components/navigation/footer.svelte';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import TemplateCombobox from '$lib/components/homebrew/template-combobox.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { cn, level_to_tier, merge_compendium_content } from '$lib/utils';

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

	type ActiveTab =
		| ''
		| 'primary-weapons'
		| 'secondary-weapons'
		| 'armor'
		| 'beastforms'
		| 'loot'
		| 'consumables'
		| 'classes'
		| 'subclasses'
		| 'domains'
		| 'domain-cards'
		| 'ancestry-cards'
		| 'community-cards'
		| 'transformation-cards'
		| 'adversaries'
		| 'environments';

	type HomebrewEntry =
		| { id: Id<'primary_weapons'>; table: 'primary_weapons'; item: PrimaryWeapon }
		| { id: Id<'secondary_weapons'>; table: 'secondary_weapons'; item: SecondaryWeapon }
		| { id: Id<'armor'>; table: 'armor'; item: Armor }
		| { id: Id<'beastforms'>; table: 'beastforms'; item: Beastform }
		| { id: Id<'loot'>; table: 'loot'; item: Loot }
		| { id: Id<'consumables'>; table: 'consumables'; item: Consumable }
		| { id: Id<'classes'>; table: 'classes'; item: CharacterClass }
		| { id: Id<'subclasses'>; table: 'subclasses'; item: Subclass }
		| { id: Id<'domains'>; table: 'domains'; item: Domain }
		| { id: Id<'domain_cards'>; table: 'domain_cards'; item: DomainCard }
		| { id: Id<'ancestry_cards'>; table: 'ancestry_cards'; item: AncestryCard }
		| { id: Id<'community_cards'>; table: 'community_cards'; item: CommunityCard }
		| { id: Id<'transformation_cards'>; table: 'transformation_cards'; item: TransformationCard }
		| { id: Id<'adversaries'>; table: 'adversaries'; item: Adversary }
		| { id: Id<'environments'>; table: 'environments'; item: Environment };

	const userContext = getUserContext();
	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();

	function deepClone<T>(value: T): T {
		return JSON.parse(JSON.stringify(value)) as T;
	}

	function setTitle<T extends { title: string; source_key: string }>(item: T, title: string): T {
		item.source_key = 'Homebrew';
		item.title = title;
		return item;
	}

	const fullCompendium = $derived.by(() =>
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);

	const allItems = $derived.by(() => {
		const compendium = homebrew.compendium;
		if (!compendium) return [] as HomebrewEntry[];

		return [
			...Object.entries(compendium.primary_weapons).map(
				([id, item]) =>
					({ id: id as Id<'primary_weapons'>, table: 'primary_weapons', item }) as const
			),
			...Object.entries(compendium.secondary_weapons).map(
				([id, item]) =>
					({ id: id as Id<'secondary_weapons'>, table: 'secondary_weapons', item }) as const
			),
			...Object.entries(compendium.armor).map(
				([id, item]) => ({ id: id as Id<'armor'>, table: 'armor', item }) as const
			),
			...Object.entries(compendium.beastforms).map(
				([id, item]) => ({ id: id as Id<'beastforms'>, table: 'beastforms', item }) as const
			),
			...Object.entries(compendium.loot).map(
				([id, item]) => ({ id: id as Id<'loot'>, table: 'loot', item }) as const
			),
			...Object.entries(compendium.consumables).map(
				([id, item]) => ({ id: id as Id<'consumables'>, table: 'consumables', item }) as const
			),
			...Object.entries(compendium.classes).map(
				([id, item]) => ({ id: id as Id<'classes'>, table: 'classes', item }) as const
			),
			...Object.entries(compendium.subclasses).map(
				([id, item]) => ({ id: id as Id<'subclasses'>, table: 'subclasses', item }) as const
			),
			...Object.entries(compendium.domains).map(
				([id, item]) => ({ id: id as Id<'domains'>, table: 'domains', item }) as const
			),
			...Object.entries(compendium.domain_cards).map(
				([id, item]) => ({ id: id as Id<'domain_cards'>, table: 'domain_cards', item }) as const
			),
			...Object.entries(compendium.ancestry_cards).map(
				([id, item]) => ({ id: id as Id<'ancestry_cards'>, table: 'ancestry_cards', item }) as const
			),
			...Object.entries(compendium.community_cards).map(
				([id, item]) =>
					({ id: id as Id<'community_cards'>, table: 'community_cards', item }) as const
			),
			...Object.entries(compendium.transformation_cards).map(
				([id, item]) =>
					({ id: id as Id<'transformation_cards'>, table: 'transformation_cards', item }) as const
			),
			...Object.entries(compendium.adversaries).map(
				([id, item]) => ({ id: id as Id<'adversaries'>, table: 'adversaries', item }) as const
			),
			...Object.entries(compendium.environments).map(
				([id, item]) => ({ id: id as Id<'environments'>, table: 'environments', item }) as const
			)
		] satisfies HomebrewEntry[];
	});

	const countByTable = $derived.by(() => {
		const counts: Record<HomebrewTable, number> = {
			primary_weapons: 0,
			secondary_weapons: 0,
			armor: 0,
			loot: 0,
			consumables: 0,
			beastforms: 0,
			classes: 0,
			subclasses: 0,
			domains: 0,
			domain_cards: 0,
			ancestry_cards: 0,
			community_cards: 0,
			transformation_cards: 0,
			adversaries: 0,
			environments: 0
		};

		for (const entry of allItems) {
			counts[entry.table] += 1;
		}

		return counts;
	});

	const totalCount = $derived(userContext.user?.homebrew_count ?? allItems.length);
	const canCreateHomebrew = $derived(userContext.homebrew_limits.can_create_homebrew);
	const hasUnlimitedHomebrew = $derived(userContext.homebrew_limits.has_unlimited);
	const titleText = $derived(
		userContext.user ? `${userContext.user.homebrew_count}/${HOMEBREW_LIMIT}` : ''
	);

	let searchQuery = $state('');
	let activeTab = $state<ActiveTab>('');
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let weaponTypeFilter = $state<'Magical' | 'Physical' | ''>('');
	let domainFilter = $state('');
	let filtersOpen = $state(false);

	let showDeleteDialog = $state(false);
	let itemToDelete = $state<{ id: Id<HomebrewTable>; name: string } | null>(null);

	let showCreateDialog = $state(false);
	let newItemType = $state<CreateHomebrewType | undefined>(undefined);
	let newItemName = $state('');
	let selectedTemplateId = $state('');
	let isCreating = $state(false);

	const isLoading = $derived(
		userContext.isLoading || homebrew.isLoading || sources.isLoading || isCreating
	);
	const loadError = $derived(userContext.error || sources.error || homebrew.error);
	const filterCount = $derived(
		(searchQuery.length > 0 ? 1 : 0) +
			(activeTab !== '' ? 1 : 0) +
			(tierFilter !== '' ? 1 : 0) +
			(weaponTypeFilter !== '' ? 1 : 0) +
			(domainFilter !== '' ? 1 : 0)
	);

	$effect(() => {
		if (showCreateDialog && !newItemType && activeTab) {
			const typeMap: Record<Exclude<ActiveTab, ''>, CreateHomebrewType> = {
				'primary-weapons': 'primary-weapon',
				'secondary-weapons': 'secondary-weapon',
				armor: 'armor',
				beastforms: 'beastform',
				loot: 'loot',
				consumables: 'consumable',
				classes: 'class',
				subclasses: 'subclass',
				domains: 'domain',
				'domain-cards': 'domain-cards',
				'ancestry-cards': 'ancestry-cards',
				'community-cards': 'community-cards',
				'transformation-cards': 'transformation-cards',
				adversaries: 'adversary',
				environments: 'environment'
			};
			newItemType = typeMap[activeTab];
		}
	});

	$effect(() => {
		newItemType;
		selectedTemplateId = '';
	});

	$effect(() => {
		if (!showCreateDialog) {
			newItemType = undefined;
			newItemName = '';
			selectedTemplateId = '';
		}
	});
	const selectedTemplate = $derived.by(() => {
		if (!newItemType || !selectedTemplateId) return null;

		switch (newItemType) {
			case 'primary-weapon':
				return fullCompendium.primary_weapons[selectedTemplateId] ?? null;
			case 'secondary-weapon':
				return fullCompendium.secondary_weapons[selectedTemplateId] ?? null;
			case 'armor':
				return fullCompendium.armor[selectedTemplateId] ?? null;
			case 'beastform':
				return fullCompendium.beastforms[selectedTemplateId] ?? null;
			case 'loot':
				return fullCompendium.loot[selectedTemplateId] ?? null;
			case 'consumable':
				return fullCompendium.consumables[selectedTemplateId] ?? null;
			case 'class':
				return fullCompendium.classes[selectedTemplateId] ?? null;
			case 'subclass':
				return fullCompendium.subclasses[selectedTemplateId] ?? null;
			case 'domain':
				return fullCompendium.domains[selectedTemplateId] ?? null;
			case 'domain-cards':
				return fullCompendium.domain_cards[selectedTemplateId] ?? null;
			case 'ancestry-cards':
				return fullCompendium.ancestry_cards[selectedTemplateId] ?? null;
			case 'community-cards':
				return fullCompendium.community_cards[selectedTemplateId] ?? null;
			case 'transformation-cards':
				return fullCompendium.transformation_cards[selectedTemplateId] ?? null;
			case 'adversary':
				return fullCompendium.adversaries[selectedTemplateId] ?? null;
			case 'environment':
				return fullCompendium.environments[selectedTemplateId] ?? null;
			default:
				return null;
		}
	});

	function getDomainName(domainId: string | undefined): string {
		if (!domainId) return 'Unknown';
		return fullCompendium.domains[domainId]?.title || domainId;
	}

	function getItemName(entry: HomebrewEntry): string {
		return entry.item.title || 'Unnamed Homebrew';
	}

	function getItemSubtitle(entry: HomebrewEntry): string {
		switch (entry.table) {
			case 'primary_weapons':
				return `Tier ${level_to_tier(entry.item.level_requirement)} ${entry.item.type} Primary Weapon`;
			case 'secondary_weapons':
				return `Tier ${level_to_tier(entry.item.level_requirement)} ${entry.item.type} Secondary Weapon`;
			case 'armor':
				return `Tier ${level_to_tier(entry.item.level_requirement)} Armor`;
			case 'beastforms':
				return `Tier ${level_to_tier(entry.item.level_requirement)} Beastform`;
			case 'loot':
				return `Loot`;
			case 'consumables':
				return `Consumable`;
			case 'classes':
				return 'Class';
			case 'subclasses':
				return `${entry.item.class_id ? fullCompendium.classes[entry.item.class_id]?.title || 'Unassigned Class' : 'Unassigned Class'} Subclass`;
			case 'domains':
				return 'Domain';
			case 'domain_cards':
				return `Level ${entry.item.level_requirement} ${getDomainName(entry.item.domain_id)} Domain Card`;
			case 'ancestry_cards':
				return 'Ancestry Card';
			case 'community_cards':
				return 'Community Card';
			case 'transformation_cards':
				return 'Transformation Card';
			case 'adversaries':
				return `Tier ${entry.item.tier} ${entry.item.type} Adversary`;
			case 'environments':
				return `Tier ${entry.item.tier} ${entry.item.type} Environment`;
		}
	}

	function getItemHref(entry: HomebrewEntry): string {
		const routeByTable: Record<HomebrewTable, string> = {
			primary_weapons: 'primary-weapon',
			secondary_weapons: 'secondary-weapon',
			armor: 'armor',
			loot: 'loot',
			consumables: 'consumable',
			beastforms: 'beastform',
			classes: 'class',
			subclasses: 'subclass',
			domains: 'domain',
			domain_cards: 'domain-cards',
			ancestry_cards: 'ancestry-cards',
			community_cards: 'community-cards',
			transformation_cards: 'transformation-cards',
			adversaries: 'adversary',
			environments: 'environment'
		};
		return `/homebrew/${routeByTable[entry.table]}/${entry.id}`;
	}

	function matchesActiveTab(entry: HomebrewEntry): boolean {
		switch (activeTab) {
			case '':
				return true;
			case 'primary-weapons':
				return entry.table === 'primary_weapons';
			case 'secondary-weapons':
				return entry.table === 'secondary_weapons';
			case 'armor':
				return entry.table === 'armor';
			case 'beastforms':
				return entry.table === 'beastforms';
			case 'loot':
				return entry.table === 'loot';
			case 'consumables':
				return entry.table === 'consumables';
			case 'classes':
				return entry.table === 'classes';
			case 'subclasses':
				return entry.table === 'subclasses';
			case 'domains':
				return entry.table === 'domains';
			case 'domain-cards':
				return entry.table === 'domain_cards';
			case 'ancestry-cards':
				return entry.table === 'ancestry_cards';
			case 'community-cards':
				return entry.table === 'community_cards';
			case 'transformation-cards':
				return entry.table === 'transformation_cards';
			case 'adversaries':
				return entry.table === 'adversaries';
			case 'environments':
				return entry.table === 'environments';
		}
	}

	function matchesFilters(entry: HomebrewEntry): boolean {
		if (!matchesActiveTab(entry)) return false;

		const normalizedQuery = searchQuery.trim().toLowerCase();
		if (normalizedQuery) {
			const haystack = `${getItemName(entry)} ${getItemSubtitle(entry)}`.toLowerCase();
			if (!haystack.includes(normalizedQuery)) return false;
		}

		if (tierFilter) {
			const tier = (() => {
				switch (entry.table) {
					case 'primary_weapons':
					case 'secondary_weapons':
					case 'armor':
					case 'beastforms':
					case 'domain_cards':
						return level_to_tier(entry.item.level_requirement);
					case 'adversaries':
					case 'environments':
						return entry.item.tier;
					default:
						return null;
				}
			})();

			if (tier === null || String(tier) !== tierFilter) return false;
		}

		if (
			(activeTab === 'primary-weapons' || activeTab === 'secondary-weapons') &&
			weaponTypeFilter &&
			(entry.table === 'primary_weapons' || entry.table === 'secondary_weapons') &&
			entry.item.type !== weaponTypeFilter
		) {
			return false;
		}

		if (activeTab === 'domain-cards' && domainFilter) {
			if (entry.table !== 'domain_cards' || entry.item.domain_id !== domainFilter) return false;
		}

		return true;
	}

	const filteredItems = $derived.by(() =>
		[...allItems]
			.filter(matchesFilters)
			.sort((a, b) => getItemName(a).localeCompare(getItemName(b)))
	);

	function openDeleteDialog(id: Id<HomebrewTable>, name: string) {
		itemToDelete = { id, name };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (!itemToDelete) return;
		try {
			await homebrew.removeItem(itemToDelete.id);
		} catch (error) {
			return;
		}

		itemToDelete = null;
		showDeleteDialog = false;
	}

	function tierFilterVisible(): boolean {
		return (
			activeTab === 'primary-weapons' ||
			activeTab === 'secondary-weapons' ||
			activeTab === 'armor' ||
			activeTab === 'beastforms' ||
			activeTab === 'domain-cards' ||
			activeTab === 'adversaries' ||
			activeTab === 'environments'
		);
	}

	async function handleCreateHomebrew() {
		if (!newItemType || !newItemName.trim() || !canCreateHomebrew) return;

		const title = newItemName.trim();
		isCreating = true;

		try {
			let id: Id<HomebrewTable> | null = null;
			let routeType: string = newItemType;

			switch (newItemType) {
				case 'primary-weapon':
					id = await homebrew.addItem({
						type: 'primary_weapons',
						item: setTitle(
							deepClone(
								(selectedTemplate as PrimaryWeapon | null) ?? COMPENDIUM_DEFAULTS.primary_weapons
							),
							title
						)
					});
					break;
				case 'secondary-weapon':
					id = await homebrew.addItem({
						type: 'secondary_weapons',
						item: setTitle(
							deepClone(
								(selectedTemplate as SecondaryWeapon | null) ??
									COMPENDIUM_DEFAULTS.secondary_weapons
							),
							title
						)
					});
					break;
				case 'armor':
					id = await homebrew.addItem({
						type: 'armor',
						item: setTitle(
							deepClone((selectedTemplate as Armor | null) ?? COMPENDIUM_DEFAULTS.armor),
							title
						)
					});
					break;
				case 'beastform':
					id = await homebrew.addItem({
						type: 'beastforms',
						item: setTitle(
							deepClone((selectedTemplate as Beastform | null) ?? COMPENDIUM_DEFAULTS.beastforms),
							title
						)
					});
					routeType = 'beastform';
					break;
				case 'loot':
					id = await homebrew.addItem({
						type: 'loot',
						item: setTitle(
							deepClone((selectedTemplate as Loot | null) ?? COMPENDIUM_DEFAULTS.loot),
							title
						)
					});
					break;
				case 'consumable':
					id = await homebrew.addItem({
						type: 'consumables',
						item: setTitle(
							deepClone((selectedTemplate as Consumable | null) ?? COMPENDIUM_DEFAULTS.consumables),
							title
						)
					});
					break;
				case 'class':
					id = await homebrew.addItem({
						type: 'classes',
						item: setTitle(
							deepClone((selectedTemplate as CharacterClass | null) ?? COMPENDIUM_DEFAULTS.classes),
							title
						)
					});
					break;
				case 'subclass':
					id = await homebrew.addItem({
						type: 'subclasses',
						item: setTitle(
							deepClone((selectedTemplate as Subclass | null) ?? COMPENDIUM_DEFAULTS.subclasses),
							title
						)
					});
					break;
				case 'domain':
					id = await homebrew.addItem({
						type: 'domains',
						item: setTitle(
							deepClone((selectedTemplate as Domain | null) ?? COMPENDIUM_DEFAULTS.domains),
							title
						)
					});
					break;
				case 'domain-cards':
					id = await homebrew.addItem({
						type: 'domain_cards',
						item: setTitle(
							deepClone(
								(selectedTemplate as DomainCard | null) ?? COMPENDIUM_DEFAULTS.domain_cards
							),
							title
						)
					});
					break;
				case 'ancestry-cards':
					id = await homebrew.addItem({
						type: 'ancestry_cards',
						item: setTitle(
							deepClone(
								(selectedTemplate as AncestryCard | null) ?? COMPENDIUM_DEFAULTS.ancestry_cards
							),
							title
						)
					});
					break;
				case 'community-cards':
					id = await homebrew.addItem({
						type: 'community_cards',
						item: setTitle(
							deepClone(
								(selectedTemplate as CommunityCard | null) ?? COMPENDIUM_DEFAULTS.community_cards
							),
							title
						)
					});
					break;
				case 'transformation-cards':
					id = await homebrew.addItem({
						type: 'transformation_cards',
						item: setTitle(
							deepClone(
								(selectedTemplate as TransformationCard | null) ??
									COMPENDIUM_DEFAULTS.transformation_cards
							),
							title
						)
					});
					break;
				case 'adversary':
					id = await homebrew.addItem({
						type: 'adversaries',
						item: setTitle(
							deepClone((selectedTemplate as Adversary | null) ?? COMPENDIUM_DEFAULTS.adversaries),
							title
						)
					});
					break;
				case 'environment':
					id = await homebrew.addItem({
						type: 'environments',
						item: setTitle(
							deepClone(
								(selectedTemplate as Environment | null) ?? COMPENDIUM_DEFAULTS.environments
							),
							title
						)
					});
					break;
			}

			showCreateDialog = false;
			newItemName = '';
			newItemType = undefined;
			selectedTemplateId = '';

			if (id) {
				await goto(`/homebrew/${routeType}/${id}`);
			}
		} finally {
			isCreating = false;
		}
	}
</script>

{#snippet tierFilterSelect()}
	<Select.Root
		type="single"
		value={tierFilter}
		onValueChange={(value) => (tierFilter = (value as '1' | '2' | '3' | '4' | '') || '')}
	>
		<Select.Trigger class="w-[128px]">
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
{/snippet}

{#snippet lootIcon(sizeClass = 'size-4')}
	<svg viewBox="0 0 24 24" class="{sizeClass} fill-current" aria-hidden="true">
		<path
			d="M18,0H6C2.691,0,0,2.691,0,6V24H24V6c0-3.309-2.691-6-6-6Zm4,6v3h-2V2.556c1.19,.694,2,1.97,2,3.444Zm-4-4v7h-3c0-1.654-1.346-3-3-3s-3,1.346-3,3h-3V2h12Zm-5,7v4h-2v-4c0-.551,.448-1,1-1s1,.449,1,1ZM4,2.556v6.444H2v-3c0-1.474,.81-2.75,2-3.444ZM20,22V13h-2v9H6V13h-2v9H2V11h7v4h6v-4h7v11h-2Z"
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

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="forge-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artForge}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="forge-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<Loader {isLoading} />

	<div
		class={cn(
			'z-10 flex h-full w-full flex-col items-center justify-start',
			'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
		)}
	>
		<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 py-4">
			<div class="flex items-center justify-between gap-2">
				<p class="flex h-9 items-center gap-2 text-2xl font-bold">
					Homebrew
					{#if !isLoading && !hasUnlimitedHomebrew}
						<span
							in:fade
							class="rounded-full border bg-card px-2 py-0.5 text-base tracking-widest text-muted-foreground"
							>{titleText}</span
						>
					{/if}
				</p>

				<div class="flex gap-2">
					<Button
						variant="outline"
						onclick={() => (showCreateDialog = true)}
						disabled={!canCreateHomebrew}
					>
						<Plus />
						New Homebrew
					</Button>
				</div>
			</div>

			{#if !isLoading && !hasUnlimitedHomebrew}
				<div class="flex flex-col items-start gap-1"></div>
			{/if}

			{#if isLoading}
				<div></div>
			{:else if loadError}
				<LoadError />
			{:else}
				<div in:fade class="relative flex flex-col gap-4">
					{#if totalCount > 0}
						<div class={cn('-mt-7 mb-3', !filtersOpen && 'mb-4')}>
							<Collapsible.Root bind:open={filtersOpen}>
								<Collapsible.Trigger class="relative z-20 w-full">
									<p
										class="absolute top-1.5 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded bg-background py-0.5 pr-2 pl-1 text-xs font-medium text-primary sm:left-4 sm:translate-x-0"
									>
										<ChevronRight
											class={cn('size-3.5 transition-transform', filtersOpen && 'rotate-90')}
										/>
										Filters
										{#if filterCount > 0}({filterCount}){/if}
										{#if filterCount > 0}
											<Button
												variant="link"
												size="sm"
												onclick={(event) => {
													event.preventDefault();
													event.stopPropagation();
													searchQuery = '';
													activeTab = '';
													tierFilter = '';
													weaponTypeFilter = '';
													domainFilter = '';
												}}
												class="-top-2 right-0 ml-2 p-0 text-xs"
											>
												Reset
												<RotateCcw class="size-3.5" />
											</Button>
										{/if}
									</p>
								</Collapsible.Trigger>
								<div class={cn('border-t-2 bg-primary/5', filtersOpen && 'rounded-lg border-2')}>
									<Collapsible.Content
										class="relative flex flex-wrap justify-center gap-3 px-4 py-4 sm:justify-start"
									>
										<div class="relative h-min">
											<Search
												class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
											/>
											<Input bind:value={searchQuery} placeholder="Search..." class="pl-9" />
										</div>

										<Select.Root
											type="single"
											value={activeTab}
											onValueChange={(value) => (activeTab = (value as ActiveTab | '') || '')}
										>
											<Select.Trigger class="w-[232px]">
												<div class="flex items-center gap-2">
													{#if activeTab === ''}
														All ({totalCount})
													{:else if activeTab === 'primary-weapons'}
														<Swords class="size-4" />
														Primary Weapons ({countByTable.primary_weapons})
													{:else if activeTab === 'secondary-weapons'}
														<Swords class="size-4" />
														Secondary Weapons ({countByTable.secondary_weapons})
													{:else if activeTab === 'armor'}
														<Shield class="size-4" />
														Armor ({countByTable.armor})
													{:else if activeTab === 'beastforms'}
														<PawPrint class="size-4" />
														Beastforms ({countByTable.beastforms})
													{:else if activeTab === 'loot'}
														{@render lootIcon('size-4')}
														Loot ({countByTable.loot})
													{:else if activeTab === 'consumables'}
														<FlaskConical class="size-4" />
														Consumables ({countByTable.consumables})
													{:else if activeTab === 'classes'}
														<GraduationCap class="size-4" />
														Classes ({countByTable.classes})
													{:else if activeTab === 'subclasses'}
														<BookOpen class="size-4" />
														Subclasses ({countByTable.subclasses})
													{:else if activeTab === 'domains'}
														<Sparkles class="size-4" />
														Domains ({countByTable.domains})
													{:else if activeTab === 'domain-cards'}
														{@render cardIcon('size-4')}
														Domain Cards ({countByTable.domain_cards})
													{:else if activeTab === 'ancestry-cards'}
														{@render cardIcon('size-4')}
														Ancestry Cards ({countByTable.ancestry_cards})
													{:else if activeTab === 'community-cards'}
														{@render cardIcon('size-4')}
														Community Cards ({countByTable.community_cards})
													{:else if activeTab === 'transformation-cards'}
														{@render cardIcon('size-4')}
														Transformation Cards ({countByTable.transformation_cards})
													{:else if activeTab === 'adversaries'}
														<Sword class="size-4" />
														Adversaries ({countByTable.adversaries})
													{:else if activeTab === 'environments'}
														<Trees class="size-4" />
														Environments ({countByTable.environments})
													{/if}
												</div>
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="">
													<div class="flex items-center gap-2">All ({totalCount})</div>
												</Select.Item>
												<Select.Item value="primary-weapons">
													<div class="flex items-center gap-2">
														<Swords class="size-4" />
														Primary Weapons ({countByTable.primary_weapons})
													</div>
												</Select.Item>
												<Select.Item value="secondary-weapons">
													<div class="flex items-center gap-2">
														<Swords class="size-4" />
														Secondary Weapons ({countByTable.secondary_weapons})
													</div>
												</Select.Item>
												<Select.Item value="armor">
													<div class="flex items-center gap-2">
														<Shield class="size-4" />
														Armor ({countByTable.armor})
													</div>
												</Select.Item>
												<Select.Item value="beastforms">
													<div class="flex items-center gap-2">
														<PawPrint class="size-4" />
														Beastforms ({countByTable.beastforms})
													</div>
												</Select.Item>
												<Select.Item value="loot">
													<div class="flex items-center gap-2">
														{@render lootIcon('size-4')}
														Loot ({countByTable.loot})
													</div>
												</Select.Item>
												<Select.Item value="consumables">
													<div class="flex items-center gap-2">
														<FlaskConical class="size-4" />
														Consumables ({countByTable.consumables})
													</div>
												</Select.Item>
												<Select.Item value="classes">
													<div class="flex items-center gap-2">
														<GraduationCap class="size-4" />
														Classes ({countByTable.classes})
													</div>
												</Select.Item>
												<Select.Item value="subclasses">
													<div class="flex items-center gap-2">
														<BookOpen class="size-4" />
														Subclasses ({countByTable.subclasses})
													</div>
												</Select.Item>
												<Select.Item value="domains">
													<div class="flex items-center gap-2">
														<Sparkles class="size-4" />
														Domains ({countByTable.domains})
													</div>
												</Select.Item>
												<Select.Item value="domain-cards">
													<div class="flex items-center gap-2">
														{@render cardIcon('size-4')}
														Domain Cards ({countByTable.domain_cards})
													</div>
												</Select.Item>
												<Select.Item value="ancestry-cards">
													<div class="flex items-center gap-2">
														{@render cardIcon('size-4')}
														Ancestry Cards ({countByTable.ancestry_cards})
													</div>
												</Select.Item>
												<Select.Item value="community-cards">
													<div class="flex items-center gap-2">
														{@render cardIcon('size-4')}
														Community Cards ({countByTable.community_cards})
													</div>
												</Select.Item>
												<Select.Item value="transformation-cards">
													<div class="flex items-center gap-2">
														{@render cardIcon('size-4')}
														Transformation Cards ({countByTable.transformation_cards})
													</div>
												</Select.Item>
												<Select.Item value="adversaries">
													<div class="flex items-center gap-2">
														<Sword class="size-4" />
														Adversaries ({countByTable.adversaries})
													</div>
												</Select.Item>
												<Select.Item value="environments">
													<div class="flex items-center gap-2">
														<Trees class="size-4" />
														Environments ({countByTable.environments})
													</div>
												</Select.Item>
											</Select.Content>
										</Select.Root>

										{#if activeTab === 'primary-weapons' || activeTab === 'secondary-weapons'}
											{@render tierFilterSelect()}
											<Select.Root
												type="single"
												value={weaponTypeFilter}
												onValueChange={(value) =>
													(weaponTypeFilter = (value as 'Magical' | 'Physical' | '') || '')}
											>
												<Select.Trigger class="w-[128px]"
													>{weaponTypeFilter || 'All Types'}</Select.Trigger
												>
												<Select.Content>
													<Select.Item value="">All Types</Select.Item>
													<Select.Item value="Physical">Physical</Select.Item>
													<Select.Item value="Magical">Magical</Select.Item>
												</Select.Content>
											</Select.Root>
										{/if}

										{#if activeTab === 'armor' || activeTab === 'beastforms'}
											{@render tierFilterSelect()}
										{/if}

										{#if activeTab === 'domain-cards'}
											<Select.Root
												type="single"
												value={domainFilter}
												onValueChange={(value) => (domainFilter = value || '')}
											>
												<Select.Trigger class="w-[142px]"
													>{domainFilter
														? getDomainName(domainFilter)
														: 'All Domains'}</Select.Trigger
												>
												<Select.Content>
													<Select.Item value="">All Domains</Select.Item>
													{#each Object.entries(fullCompendium.domains).sort( (a, b) => a[1].title.localeCompare(b[1].title) ) as [id, domain]}
														<Select.Item value={id}>{domain.title}</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
											{@render tierFilterSelect()}
										{/if}
									</Collapsible.Content>
								</div>
							</Collapsible.Root>
						</div>

						{#if filteredItems.length === 0}
							<p class="my-16 text-center text-sm text-muted-foreground">
								No items match the filters
							</p>
						{:else}
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{#each filteredItems as entry (entry.id)}
									<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded shadow">
										<a
											href={getItemHref(entry)}
											class="flex gap-2 border bg-primary-muted p-2 hover:bg-primary-muted/80"
										>
											<div
												class="flex size-12 shrink-0 items-center justify-center rounded-lg border border-background bg-background"
											>
												{#if entry.table === 'primary_weapons' || entry.table === 'secondary_weapons'}<Swords
														class="size-6 text-muted-foreground"
													/>{:else if entry.table === 'armor'}<Shield
														class="size-6 text-muted-foreground"
													/>{:else if entry.table === 'beastforms'}<PawPrint
														class="size-6 text-muted-foreground"
													/>{:else if entry.table === 'loot'}<Anvil
														class="size-6 text-muted-foreground"
													/>{:else if entry.table === 'consumables'}<FlaskConical
														class="size-6 text-muted-foreground"
													/>{:else if entry.table === 'classes'}{#if entry.item.image_url}<img
															class="h-full w-full rounded-md object-cover"
															src={entry.item.image_url}
															alt="Class"
														/>{:else}<GraduationCap
															class="size-6 text-muted-foreground"
														/>{/if}{:else if entry.table === 'subclasses'}{#if entry.item.image_url}<img
															class="h-full w-full rounded-md object-cover"
															src={entry.item.image_url}
															alt="Subclass"
														/>{:else}<BookOpen
															class="size-6 text-muted-foreground"
														/>{/if}{:else if entry.table === 'domains'}{#if entry.item.image_url}<img
															class="h-full w-full rounded-md object-cover"
															src={entry.item.image_url}
															alt="Domain"
														/>{:else}<Sparkles
															class="size-6 text-muted-foreground"
														/>{/if}{:else if entry.table === 'domain_cards' || entry.table === 'ancestry_cards' || entry.table === 'community_cards' || entry.table === 'transformation_cards'}{#if entry.item.image_url}<img
															class="h-full w-full rounded-md object-cover"
															src={entry.item.image_url}
															alt={getItemName(entry)}
														/>{:else}<Sparkles
															class="size-6 text-muted-foreground"
														/>{/if}{:else if entry.table === 'adversaries'}{#if entry.item.image_url}<img
															class="h-full w-full rounded-md object-cover"
															src={entry.item.image_url}
															alt="Adversary"
														/>{:else}<Sword
															class="size-6 text-muted-foreground"
														/>{/if}{:else if entry.table === 'environments'}{#if entry.item.image_url}<img
															class="h-full w-full rounded-md object-cover"
															src={entry.item.image_url}
															alt="Environment"
														/>{:else}<Trees class="size-6 text-muted-foreground" />{/if}{/if}
											</div>
											<div class="min-w-0 flex-1 truncate">
												<p class="truncate text-lg font-bold">{getItemName(entry)}</p>
												<p class="truncate text-xs text-muted-foreground">
													{getItemSubtitle(entry)}
												</p>
											</div>
										</a>
										<div class="flex border-t border-background">
											<Button
												variant="outline"
												size="sm"
												class=" grow rounded-none border-none"
												href={getItemHref(entry)}>Edit</Button
											>
											<Button
												variant="outline"
												size="sm"
												class="grow rounded-none border-none text-destructive hover:text-destructive"
												onclick={() =>
													openDeleteDialog(entry.id as Id<HomebrewTable>, getItemName(entry))}
												>Delete</Button
											>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					{:else}
						<Button
							class="mx-auto my-20"
							onclick={() => (showCreateDialog = true)}
							disabled={!canCreateHomebrew}
						>
							<Anvil />
							Create your first homebrew!
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<Footer />
<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Homebrew Item</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong>{itemToDelete?.name || 'this item'}</strong>? This
				action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<SafeDelete
			open={showDeleteDialog}
			itemName={itemToDelete?.name || ''}
			itemLabel="this item"
			deleteLabel="Delete Homebrew Item"
			onDelete={confirmDelete}
		/>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showCreateDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Create New Homebrew</Dialog.Title>
			<Dialog.Description
				>Choose a type and give your homebrew creation a name to get started.</Dialog.Description
			>
		</Dialog.Header>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				if (newItemType && newItemName.trim() && !isCreating && canCreateHomebrew) {
					handleCreateHomebrew();
				}
			}}
		>
			<div class="flex flex-col gap-4 py-4">
				<div class="flex flex-col gap-2">
					<Label>What do you want to create?</Label>
					<Select.Root
						type="single"
						value={newItemType}
						onValueChange={(value) => (newItemType = (value || undefined) as CreateHomebrewType)}
					>
						<Select.Trigger class="w-full">
							{#if newItemType === 'primary-weapon'}Primary Weapon{:else if newItemType === 'secondary-weapon'}Secondary
								Weapon{:else if newItemType === 'armor'}Armor{:else if newItemType === 'beastform'}Beastform{:else if newItemType === 'loot'}Loot{:else if newItemType === 'consumable'}Consumable{:else if newItemType === 'class'}Class{:else if newItemType === 'subclass'}Subclass{:else if newItemType === 'domain'}Domain{:else if newItemType === 'domain-cards'}Domain
								Card{:else if newItemType === 'ancestry-cards'}Ancestry Card{:else if newItemType === 'community-cards'}Community
								Card{:else if newItemType === 'transformation-cards'}Transformation Card{:else if newItemType === 'adversary'}Adversary{:else if newItemType === 'environment'}Environment{:else}Select
								a type...{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="primary-weapon" disabled={!canCreateHomebrew}
								>Primary Weapon</Select.Item
							>
							<Select.Item value="secondary-weapon" disabled={!canCreateHomebrew}
								>Secondary Weapon</Select.Item
							>
							<Select.Item value="armor" disabled={!canCreateHomebrew}>Armor</Select.Item>
							<Select.Item value="beastform" disabled={!canCreateHomebrew}>Beastform</Select.Item>
							<Select.Item value="loot" disabled={!canCreateHomebrew}>Loot</Select.Item>
							<Select.Item value="consumable" disabled={!canCreateHomebrew}>Consumable</Select.Item>
							<Select.Item value="class" disabled={!canCreateHomebrew}>Class</Select.Item>
							<Select.Item value="subclass" disabled={!canCreateHomebrew}>Subclass</Select.Item>
							<Select.Item value="domain" disabled={!canCreateHomebrew}>Domain</Select.Item>
							<Select.Item value="domain-cards" disabled={!canCreateHomebrew}
								>Domain Card</Select.Item
							>
							<Select.Item value="ancestry-cards" disabled={!canCreateHomebrew}
								>Ancestry Card</Select.Item
							>
							<Select.Item value="community-cards" disabled={!canCreateHomebrew}
								>Community Card</Select.Item
							>
							<Select.Item value="transformation-cards" disabled={!canCreateHomebrew}
								>Transformation Card</Select.Item
							>
							<Select.Item value="adversary" disabled={!canCreateHomebrew}>Adversary</Select.Item>
							<Select.Item value="environment" disabled={!canCreateHomebrew}
								>Environment</Select.Item
							>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex flex-col gap-2">
					<Label>Template</Label>
					<TemplateCombobox
						disabled={!newItemType}
						homebrewType={newItemType}
						compendium={fullCompendium}
						bind:value={selectedTemplateId}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<Label>Name</Label>
					<Input bind:value={newItemName} placeholder="Enter a name..." disabled={!newItemType} />
				</div>
			</div>
			<Dialog.Footer class="flex gap-3">
				<Dialog.Close
					type="button"
					class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					>Cancel</Dialog.Close
				>
				<Button
					type="submit"
					disabled={!newItemName.trim() || !newItemType || isCreating || !canCreateHomebrew}
					>{isCreating ? 'Creating...' : 'Create'}</Button
				>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<style>
	.forge-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
