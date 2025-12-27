<script lang="ts">
	import { cn } from '$lib/utils';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import type {
		Weapon,
		Armor,
		Beastform,
		Loot,
		Consumable,
		CharacterClass,
		Subclass,
		DomainCard,
		AncestryCard,
		CommunityCard,
		TransformationCard,
		DomainIds,
		Feature
	} from '$lib/types/compendium-types';
	import Search from '@lucide/svelte/icons/search';
	import Shield from '@lucide/svelte/icons/shield';
	import Swords from '@lucide/svelte/icons/swords';
	import PawPrint from '@lucide/svelte/icons/paw-print';
	import Package from '@lucide/svelte/icons/package';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Users from '@lucide/svelte/icons/users';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Footer from '$lib/components/app/footer.svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Label from '$lib/components/ui/label/label.svelte';

	const homebrew = getHomebrewContext();

	// Create dialog state
	type HomebrewType =
		| 'weapon'
		| 'armor'
		| 'beastform'
		| 'loot'
		| 'consumable'
		| 'class'
		| 'subclass'
		| 'domain_card'
		| 'ancestry_card'
		| 'community_card'
		| 'transformation_card';
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
				case 'loot':
					await homebrew.createLoot({
						compendium_id: '',
						source_id: 'Homebrew',
						title: newItemName.trim(),
						description_html: '',
						rarity_roll: 1,
						character_modifiers: [],
						weapon_modifiers: []
					});
					break;
				case 'consumable':
					await homebrew.createConsumable({
						compendium_id: '',
						source_id: 'Homebrew',
						title: newItemName.trim(),
						description_html: '',
						rarity_roll: 1
					});
					break;
				case 'class':
					await homebrew.createClass({
						compendium_id: '',
						source_id: 'Homebrew',
						name: newItemName.trim(),
						image_url: '',
						description_html: '',
						starting_evasion: 0,
						starting_max_hp: 0,
						hope_feature: {
							title: '',
							description_html: '',
							character_modifiers: [],
							weapon_modifiers: []
						},
						primary_domain_id: 'arcana',
						secondary_domain_id: 'arcana',
						class_features: [],
						subclass_ids: [],
						suggested_traits: {
							agility: null,
							strength: null,
							finesse: null,
							instinct: null,
							presence: null,
							knowledge: null
						},
						suggested_primary_weapon_id: null,
						suggested_secondary_weapon_id: null,
						suggested_armor_id: null,
						starting_inventory: {
							gold_coins: 0,
							free_gear: [],
							loot_or_consumable_options: [],
							class_gear_options: [],
							spellbook_prompt: null
						},
						background_questions: [],
						connection_questions: [],
						character_description_suggestions: {
							clothes: '',
							eyes: '',
							body: '',
							skin: '',
							attitude: ''
						}
					});
					break;
				case 'subclass':
					await homebrew.createSubclass({
						compendium_id: '',
						source_id: 'Homebrew',
						name: newItemName.trim(),
						description_html: '',
						class_id: '',
						foundation_card: {
							compendium_id: '',
							card_type: 'subclass_foundation',
							title: '',
							description_html: '',
							image_url: '',
							artist_name: '',
							features: [],
							spellcast_trait: null,
							class_id: ''
						},
						specialization_card: {
							compendium_id: '',
							card_type: 'subclass_specialization',
							title: '',
							description_html: '',
							image_url: '',
							artist_name: '',
							features: [],
							class_id: ''
						},
						mastery_card: {
							compendium_id: '',
							card_type: 'subclass_mastery',
							title: '',
							description_html: '',
							image_url: '',
							artist_name: '',
							features: [],
							class_id: ''
						}
					});
					break;
				case 'domain_card':
					await homebrew.createDomainCard({
						compendium_id: '',
						source_id: 'Homebrew',
						card_type: 'domain',
						title: newItemName.trim(),
						image_url: '',
						artist_name: '',
						domain_id: 'arcana',
						level_requirement: 1,
						recall_cost: 0,
						category: 'ability',
						features: [],
						choices: [],
						tokens: false,
						applies_in_vault: false,
						forced_in_loadout: false,
						forced_in_vault: false
					});
					break;
				case 'ancestry_card':
					await homebrew.createAncestryCard({
						compendium_id: '',
						source_id: 'Homebrew',
						card_type: 'ancestry',
						title: newItemName.trim(),
						description_html: '',
						image_url: '',
						artist_name: '',
						features: [],
						choices: []
					});
					break;
				case 'community_card':
					await homebrew.createCommunityCard({
						compendium_id: '',
						source_id: 'Homebrew',
						card_type: 'community',
						title: newItemName.trim(),
						description_html: '',
						image_url: '',
						artist_name: '',
						features: [],
						tokens: false
					});
					break;
				case 'transformation_card':
					await homebrew.createTransformationCard({
						compendium_id: '',
						source_id: 'Homebrew',
						card_type: 'transformation',
						title: newItemName.trim(),
						description_html: '',
						image_url: '',
						artist_name: '',
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
	let activeTab = $state<
		| 'all'
		| 'weapons'
		| 'armor'
		| 'beastforms'
		| 'loot'
		| 'consumables'
		| 'classes'
		| 'subclasses'
		| 'domain_cards'
		| 'ancestry_cards'
		| 'community_cards'
		| 'transformation_cards'
	>('all');
	let tierFilter = $state<'1' | '2' | '3' | '4' | ''>('');
	let weaponCategoryFilter = $state<'Primary' | 'Secondary' | ''>('');
	let weaponTypeFilter = $state<'Magical' | 'Physical' | ''>('');

	// Delete dialog state
	let showDeleteDialog = $state(false);
	let itemToDelete = $state<{
		id: string;
		name: string;
		type:
			| 'primary_weapon'
			| 'secondary_weapon'
			| 'armor'
			| 'beastform'
			| 'loot'
			| 'consumable'
			| 'class'
			| 'subclass'
			| 'domain_card'
			| 'ancestry_card'
			| 'community_card'
			| 'transformation_card';
		domainId?: DomainIds;
	} | null>(null);

	// Clear subfilters when main tab changes
	$effect(() => {
		if (activeTab !== 'weapons') {
			weaponCategoryFilter = '';
			weaponTypeFilter = '';
		}
		if (activeTab === 'all' || (activeTab !== 'armor' && activeTab !== 'beastforms' && activeTab !== 'domain_cards')) {
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

	// Filter loot
	let filteredLoot = $derived(
		Object.entries(homebrew.loot)
			.map(([id, loot]) => ({ id, loot }))
			.filter(({ loot }) => {
				return matchesSearch(loot.title, loot.description_html, searchQuery);
			})
	);

	// Filter consumables
	let filteredConsumables = $derived(
		Object.entries(homebrew.consumables)
			.map(([id, consumable]) => ({ id, consumable }))
			.filter(({ consumable }) => {
				return matchesSearch(consumable.title, consumable.description_html, searchQuery);
			})
	);

	// Filter classes
	let filteredClasses = $derived(
		Object.entries(homebrew.classes)
			.map(([id, characterClass]) => ({ id, characterClass }))
			.filter(({ characterClass }) => {
				return matchesSearch(characterClass.name, characterClass.description_html, searchQuery);
			})
	);

	// Filter subclasses
	let filteredSubclasses = $derived(
		Object.entries(homebrew.subclasses)
			.map(([id, subclass]) => ({ id, subclass }))
			.filter(({ subclass }) => {
				return matchesSearch(subclass.name, subclass.description_html, searchQuery);
			})
	);

	// Filter domain cards (flatten nested structure)
	let filteredDomainCards = $derived(
		Object.entries(homebrew.domain_cards)
			.flatMap(([domainId, cards]) =>
				Object.entries(cards).map(([id, card]) => ({ id, card, domainId: domainId as DomainIds }))
			)
			.filter(({ card }) => {
				const descHtml = card.features.map((f) => f.description_html).join(' ');
				if (!matchesSearch(card.title, descHtml, searchQuery)) return false;
				if (tierFilter !== '' && levelToTier(card.level_requirement) !== getTierNumber(tierFilter))
					return false;
				return true;
			})
	);

	// Filter ancestry cards
	let filteredAncestryCards = $derived(
		Object.entries(homebrew.ancestry_cards)
			.map(([id, card]) => ({ id, card }))
			.filter(({ card }) => {
				const descHtml = card.features.map((f) => f.description_html).join(' ');
				return matchesSearch(card.title, descHtml, searchQuery);
			})
	);

	// Filter community cards
	let filteredCommunityCards = $derived(
		Object.entries(homebrew.community_cards)
			.map(([id, card]) => ({ id, card }))
			.filter(({ card }) => {
				const descHtml = card.features.map((f) => f.description_html).join(' ');
				return matchesSearch(card.title, descHtml, searchQuery);
			})
	);

	// Filter transformation cards
	let filteredTransformationCards = $derived(
		Object.entries(homebrew.transformation_cards)
			.map(([id, card]) => ({ id, card }))
			.filter(({ card }) => {
				const descHtml = card.features.map((f) => f.description_html).join(' ');
				return matchesSearch(card.title, descHtml, searchQuery);
			})
	);

	// Combined filtered items based on tab
	type FilteredItem =
		| { type: 'primary_weapon'; id: string; item: Weapon }
		| { type: 'secondary_weapon'; id: string; item: Weapon }
		| { type: 'armor'; id: string; item: Armor }
		| { type: 'beastform'; id: string; item: Beastform }
		| { type: 'loot'; id: string; item: Loot }
		| { type: 'consumable'; id: string; item: Consumable }
		| { type: 'class'; id: string; item: CharacterClass }
		| { type: 'subclass'; id: string; item: Subclass }
		| { type: 'domain_card'; id: string; item: DomainCard; domainId: DomainIds }
		| { type: 'ancestry_card'; id: string; item: AncestryCard }
		| { type: 'community_card'; id: string; item: CommunityCard }
		| { type: 'transformation_card'; id: string; item: TransformationCard };

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

		if (activeTab === 'all' || activeTab === 'loot') {
			items.push(
				...filteredLoot.map(({ id, loot }) => ({
					type: 'loot' as const,
					id,
					item: loot
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'consumables') {
			items.push(
				...filteredConsumables.map(({ id, consumable }) => ({
					type: 'consumable' as const,
					id,
					item: consumable
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'classes') {
			items.push(
				...filteredClasses.map(({ id, characterClass }) => ({
					type: 'class' as const,
					id,
					item: characterClass
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'subclasses') {
			items.push(
				...filteredSubclasses.map(({ id, subclass }) => ({
					type: 'subclass' as const,
					id,
					item: subclass
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'domain_cards') {
			items.push(
				...filteredDomainCards.map(({ id, card, domainId }) => ({
					type: 'domain_card' as const,
					id,
					item: card,
					domainId
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'ancestry_cards') {
			items.push(
				...filteredAncestryCards.map(({ id, card }) => ({
					type: 'ancestry_card' as const,
					id,
					item: card
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'community_cards') {
			items.push(
				...filteredCommunityCards.map(({ id, card }) => ({
					type: 'community_card' as const,
					id,
					item: card
				}))
			);
		}

		if (activeTab === 'all' || activeTab === 'transformation_cards') {
			items.push(
				...filteredTransformationCards.map(({ id, card }) => ({
					type: 'transformation_card' as const,
					id,
					item: card
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
	let lootCount = $derived(Object.keys(homebrew.loot).length);
	let consumableCount = $derived(Object.keys(homebrew.consumables).length);
	let classCount = $derived(Object.keys(homebrew.classes).length);
	let subclassCount = $derived(Object.keys(homebrew.subclasses).length);
	let domainCardCount = $derived(
		Object.values(homebrew.domain_cards).reduce((sum, cards) => sum + Object.keys(cards).length, 0)
	);
	let ancestryCardCount = $derived(Object.keys(homebrew.ancestry_cards).length);
	let communityCardCount = $derived(Object.keys(homebrew.community_cards).length);
	let transformationCardCount = $derived(Object.keys(homebrew.transformation_cards).length);
	let totalCount = $derived(
		weaponCount +
			armorCount +
			beastformCount +
			lootCount +
			consumableCount +
			classCount +
			subclassCount +
			domainCardCount +
			ancestryCardCount +
			communityCardCount +
			transformationCardCount
	);

	// Check if at limit for each type (limit of 1 per type)
	let isWeaponAtLimit = $derived(primaryWeaponCount >= 1);
	let isArmorAtLimit = $derived(armorCount >= 1);
	let isBeastformAtLimit = $derived(beastformCount >= 1);
	let isLootAtLimit = $derived(lootCount >= 1);
	let isConsumableAtLimit = $derived(consumableCount >= 1);
	let isClassAtLimit = $derived(classCount >= 1);
	let isSubclassAtLimit = $derived(subclassCount >= 1);
	let isDomainCardAtLimit = $derived(domainCardCount >= 1);
	let isAncestryCardAtLimit = $derived(ancestryCardCount >= 1);
	let isCommunityCardAtLimit = $derived(communityCardCount >= 1);
	let isTransformationCardAtLimit = $derived(transformationCardCount >= 1);

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
			case 'loot':
				return isLootAtLimit;
			case 'consumable':
				return isConsumableAtLimit;
			case 'class':
				return isClassAtLimit;
			case 'subclass':
				return isSubclassAtLimit;
			case 'domain_card':
				return isDomainCardAtLimit;
			case 'ancestry_card':
				return isAncestryCardAtLimit;
			case 'community_card':
				return isCommunityCardAtLimit;
			case 'transformation_card':
				return isTransformationCardAtLimit;
			default:
				return false;
		}
	});

	// Check if all types are at limit
	let allTypesAtLimit = $derived(
		isWeaponAtLimit &&
			isArmorAtLimit &&
			isBeastformAtLimit &&
			isLootAtLimit &&
			isConsumableAtLimit &&
			isClassAtLimit &&
			isSubclassAtLimit &&
			isDomainCardAtLimit &&
			isAncestryCardAtLimit &&
			isCommunityCardAtLimit &&
			isTransformationCardAtLimit
	);

	// Handle delete
	function openDeleteDialog(
		id: string,
		name: string,
		type:
			| 'primary_weapon'
			| 'secondary_weapon'
			| 'armor'
			| 'beastform'
			| 'loot'
			| 'consumable'
			| 'class'
			| 'subclass'
			| 'domain_card'
			| 'ancestry_card'
			| 'community_card'
			| 'transformation_card',
		domainId?: DomainIds
	) {
		itemToDelete = { id, name, type, domainId };
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
				case 'loot':
					await homebrew.deleteLoot(itemToDelete.id);
					break;
				case 'consumable':
					await homebrew.deleteConsumable(itemToDelete.id);
					break;
				case 'class':
					await homebrew.deleteClass(itemToDelete.id);
					break;
				case 'subclass':
					await homebrew.deleteSubclass(itemToDelete.id);
					break;
				case 'domain_card':
					if (itemToDelete.domainId) {
						await homebrew.deleteDomainCard(itemToDelete.id, itemToDelete.domainId);
					}
					break;
				case 'ancestry_card':
					await homebrew.deleteAncestryCard(itemToDelete.id);
					break;
				case 'community_card':
					await homebrew.deleteCommunityCard(itemToDelete.id);
					break;
				case 'transformation_card':
					await homebrew.deleteTransformationCard(itemToDelete.id);
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
		switch (entry.type) {
			case 'beastform':
				return entry.item.name;
			case 'class':
				return entry.item.name;
			case 'subclass':
				return entry.item.name;
			case 'primary_weapon':
			case 'secondary_weapon':
			case 'armor':
			case 'loot':
			case 'consumable':
			case 'domain_card':
			case 'ancestry_card':
			case 'community_card':
			case 'transformation_card':
				return entry.item.title;
		}
	}

	// Get item tier helper
	function getItemTier(entry: FilteredItem): number | null {
		if ('level_requirement' in entry.item) {
			return levelToTier(entry.item.level_requirement);
		}
		return null;
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
				return entry.item.category;
			case 'loot':
				return `Rarity Roll: ${entry.item.rarity_roll}`;
			case 'consumable':
				return `Rarity Roll: ${entry.item.rarity_roll}`;
			case 'class':
				return 'Character Class';
			case 'subclass':
				return 'Subclass';
			case 'domain_card':
				const tier = getItemTier(entry);
				return tier ? `Tier ${tier} Domain Card` : 'Domain Card';
			case 'ancestry_card':
				return 'Ancestry Card';
			case 'community_card':
				return 'Community Card';
			case 'transformation_card':
				return 'Transformation Card';
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
			case 'loot':
				return `/homebrew/loot/${entry.id}`;
			case 'consumable':
				return `/homebrew/consumables/${entry.id}`;
			case 'class':
				return `/homebrew/classes/${entry.id}`;
			case 'subclass':
				return `/homebrew/subclasses/${entry.id}`;
			case 'domain_card':
				return `/homebrew/domain-cards/${entry.id}`;
			case 'ancestry_card':
				return `/homebrew/ancestry-cards/${entry.id}`;
			case 'community_card':
				return `/homebrew/community-cards/${entry.id}`;
			case 'transformation_card':
				return `/homebrew/transformation-cards/${entry.id}`;
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
		<div class="w-full max-w-6xl flex flex-col gap-4 px-4 py-4">
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

				<!-- Tabs as Filter -->
				<Tabs.Root bind:value={activeTab}>
					<Tabs.List class="flex flex-wrap h-auto gap-y-1">
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
						<Tabs.Trigger value="loot" class="flex-initial gap-1">
							<Package class="size-4" />
							Loot ({lootCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="consumables" class="flex-initial gap-1">
							<FlaskConical class="size-4" />
							Consumables ({consumableCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="classes" class="flex-initial gap-1">
							<GraduationCap class="size-4" />
							Classes ({classCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="subclasses" class="flex-initial gap-1">
							<BookOpen class="size-4" />
							Subclasses ({subclassCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="domain_cards" class="flex-initial gap-1">
							<BookOpen class="size-4" />
							Domain Cards ({domainCardCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="ancestry_cards" class="flex-initial gap-1">
							<Users class="size-4" />
							Ancestry Cards ({ancestryCardCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="community_cards" class="flex-initial gap-1">
							<Users class="size-4" />
							Community Cards ({communityCardCount})
						</Tabs.Trigger>
						<Tabs.Trigger value="transformation_cards" class="flex-initial gap-1">
							<Sparkles class="size-4" />
							Transformation Cards ({transformationCardCount})
						</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
				
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

				<!-- Subfilters for Domain Cards -->
				{#if activeTab === 'domain_cards'}
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
									{:else if entry.type === 'loot'}
										<Package class="size-6 text-muted-foreground" />
									{:else if entry.type === 'consumable'}
										<FlaskConical class="size-6 text-muted-foreground" />
									{:else if entry.type === 'class'}
										<GraduationCap class="size-6 text-muted-foreground" />
									{:else if entry.type === 'subclass'}
										<BookOpen class="size-6 text-muted-foreground" />
									{:else if entry.type === 'domain_card'}
										<BookOpen class="size-6 text-muted-foreground" />
									{:else if entry.type === 'ancestry_card'}
										<Users class="size-6 text-muted-foreground" />
									{:else if entry.type === 'community_card'}
										<Users class="size-6 text-muted-foreground" />
									{:else if entry.type === 'transformation_card'}
										<Sparkles class="size-6 text-muted-foreground" />
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
									onclick={() => {
										if (entry.type === 'domain_card') {
											openDeleteDialog(entry.id, getItemName(entry), entry.type, entry.domainId);
										} else {
											openDeleteDialog(entry.id, getItemName(entry), entry.type);
										}
									}}
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
					onValueChange={(v) => (newItemType = (v || undefined) as HomebrewType)}
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
						{:else if newItemType === 'loot'}
							<div class="flex items-center gap-2">
								<Package class="size-4" />
								Loot
							</div>
						{:else if newItemType === 'consumable'}
							<div class="flex items-center gap-2">
								<FlaskConical class="size-4" />
								Consumable
							</div>
						{:else if newItemType === 'class'}
							<div class="flex items-center gap-2">
								<GraduationCap class="size-4" />
								Class
							</div>
						{:else if newItemType === 'subclass'}
							<div class="flex items-center gap-2">
								<BookOpen class="size-4" />
								Subclass
							</div>
						{:else if newItemType === 'domain_card'}
							<div class="flex items-center gap-2">
								<BookOpen class="size-4" />
								Domain Card
							</div>
						{:else if newItemType === 'ancestry_card'}
							<div class="flex items-center gap-2">
								<Users class="size-4" />
								Ancestry Card
							</div>
						{:else if newItemType === 'community_card'}
							<div class="flex items-center gap-2">
								<Users class="size-4" />
								Community Card
							</div>
						{:else if newItemType === 'transformation_card'}
							<div class="flex items-center gap-2">
								<Sparkles class="size-4" />
								Transformation Card
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
					<Select.Item value="loot" disabled={isLootAtLimit}>
						<div class="flex items-center gap-2">
							<Package class="size-4" />
							Loot {isLootAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="consumable" disabled={isConsumableAtLimit}>
						<div class="flex items-center gap-2">
							<FlaskConical class="size-4" />
							Consumable {isConsumableAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="class" disabled={isClassAtLimit}>
						<div class="flex items-center gap-2">
							<GraduationCap class="size-4" />
							Class {isClassAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="subclass" disabled={isSubclassAtLimit}>
						<div class="flex items-center gap-2">
							<BookOpen class="size-4" />
							Subclass {isSubclassAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="domain_card" disabled={isDomainCardAtLimit}>
						<div class="flex items-center gap-2">
							<BookOpen class="size-4" />
							Domain Card {isDomainCardAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="ancestry_card" disabled={isAncestryCardAtLimit}>
						<div class="flex items-center gap-2">
							<Users class="size-4" />
							Ancestry Card {isAncestryCardAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="community_card" disabled={isCommunityCardAtLimit}>
						<div class="flex items-center gap-2">
							<Users class="size-4" />
							Community Card {isCommunityCardAtLimit ? '(1/1)' : '(0/1)'}
						</div>
					</Select.Item>
					<Select.Item value="transformation_card" disabled={isTransformationCardAtLimit}>
						<div class="flex items-center gap-2">
							<Sparkles class="size-4" />
							Transformation Card {isTransformationCardAtLimit ? '(1/1)' : '(0/1)'}
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
