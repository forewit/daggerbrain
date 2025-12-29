<script lang="ts">
	import { cn, level_to_tier } from '$lib/utils';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import TemplateCombobox from '$lib/components/app/homebrew/template-combobox.svelte';
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
	import Chest from '@lucide/svelte/icons/package';
	import FlaskConical from '@lucide/svelte/icons/flask-conical';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Users from '@lucide/svelte/icons/users';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Anvil from '@lucide/svelte/icons/anvil';
	import Footer from '$lib/components/app/footer.svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Label from '$lib/components/ui/label/label.svelte';
	import Filter from '@lucide/svelte/icons/filter';
	import { goto } from '$app/navigation';
	import type { HomebrewType } from '$lib/types/homebrew-types';
	import { MAX_HOMEBREW } from '$lib/types/homebrew-types';

	const homebrew = getHomebrewContext();
	const compendium = getCompendiumContext();

	// Create dialog state
	let showCreateDialog = $state(false);
	let newItemType = $state<HomebrewType | undefined>(undefined);
	let newItemName = $state('');
	let selectedTemplateId = $state('');
	let isCreating = $state(false);

	// Reset template selection when type changes
	$effect(() => {
		newItemType; // track dependency
		selectedTemplateId = '';
	});

	// Clear dialog fields when dialog closes
	$effect(() => {
		if (!showCreateDialog) {
			newItemName = '';
			newItemType = undefined;
			selectedTemplateId = '';
		}
	});

	// Set default type from active filter when dialog opens
	$effect(() => {
		if (showCreateDialog && !newItemType && activeTab) {
			// Map activeTab to HomebrewType
			const typeMap: Record<string, HomebrewType> = {
				weapons: 'weapon',
				armor: 'armor',
				beastforms: 'beastform',
				loot: 'loot',
				consumables: 'consumable',
				classes: 'class',
				subclasses: 'subclass',
				'domain-cards': 'domain-cards',
				'ancestry-cards': 'ancestry-cards',
				'community-cards': 'community-cards',
				'transformation-cards': 'transformation-cards'
			};
			const mappedType = typeMap[activeTab];
			if (mappedType) {
				newItemType = mappedType;
			}
		}
	});

	// Look up the selected template from compendium
	const selectedTemplate = $derived.by(() => {
		if (!selectedTemplateId || !newItemType) return null;

		switch (newItemType) {
			case 'weapon': {
				const primary = compendium.primary_weapons[selectedTemplateId];
				if (primary) return { type: 'primary' as const, data: primary };
				const secondary = compendium.secondary_weapons[selectedTemplateId];
				if (secondary) return { type: 'secondary' as const, data: secondary };
				return null;
			}
			case 'armor':
				return compendium.armor[selectedTemplateId] || null;
			case 'beastform':
				return compendium.beastforms[selectedTemplateId] || null;
			case 'loot':
				return compendium.loot[selectedTemplateId] || null;
			case 'consumable':
				return compendium.consumables[selectedTemplateId] || null;
			case 'class':
				return compendium.classes[selectedTemplateId] || null;
			case 'subclass':
				return compendium.subclasses[selectedTemplateId] || null;
			case 'domain-cards': {
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
				for (const domainId of domainIds) {
					const card = compendium.domain_cards[domainId]?.[selectedTemplateId];
					if (card) return card;
				}
				return null;
			}
			case 'ancestry-cards':
				return compendium.ancestry_cards[selectedTemplateId] || null;
			case 'community-cards':
				return compendium.community_cards[selectedTemplateId] || null;
			case 'transformation-cards':
				return compendium.transformation_cards[selectedTemplateId] || null;
			default:
				return null;
		}
	});

	// Helper function to safely deep clone objects from reactive state
	// Uses JSON serialization which works reliably with plain data objects
	// This is safer than structuredClone for objects from Svelte 5 reactive state,
	// which may contain proxies or other non-cloneable properties
	function deepClone<T>(obj: T): T {
		return JSON.parse(JSON.stringify(obj)) as T;
	}

	async function handleCreateHomebrew() {
		if (!newItemName.trim() || !newItemType) return;

		isCreating = true;
		try {
			let id = '';
			const itemType = newItemType; // Save type before resetting
			switch (newItemType) {
				case 'weapon': {
					const template = selectedTemplate as {
						type: 'primary' | 'secondary';
						data: Weapon;
					} | null;
					if (template) {
						const cloned = deepClone(template.data);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createPrimaryWeapon(cloned);
					} else {
						id = await homebrew.createPrimaryWeapon({
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
					}
					break;
				}
				case 'armor': {
					const template = selectedTemplate as Armor | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createArmor(cloned);
					} else {
						id = await homebrew.createArmor({
							compendium_id: '',
							source_id: 'Homebrew',
							title: newItemName.trim(),
							description_html: '',
							level_requirement: 1,
							max_armor: 0,
							damage_thresholds: { major: 0, severe: 0 },
							features: []
						});
					}
					break;
				}
				case 'beastform': {
					const template = selectedTemplate as Beastform | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.name = newItemName.trim();
						id = await homebrew.createBeastform(cloned);
					} else {
						id = await homebrew.createBeastform({
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
					}
					break;
				}
				case 'loot': {
					const template = selectedTemplate as Loot | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createLoot(cloned);
					} else {
						id = await homebrew.createLoot({
							compendium_id: '',
							source_id: 'Homebrew',
							title: newItemName.trim(),
							description_html: '',
							rarity_roll: 1,
							character_modifiers: [],
							weapon_modifiers: []
						});
					}
					break;
				}
				case 'consumable': {
					const template = selectedTemplate as Consumable | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createConsumable(cloned);
					} else {
						id = await homebrew.createConsumable({
							compendium_id: '',
							source_id: 'Homebrew',
							title: newItemName.trim(),
							description_html: '',
							rarity_roll: 1
						});
					}
					break;
				}
				case 'class': {
					const template = selectedTemplate as CharacterClass | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.name = newItemName.trim();
						id = await homebrew.createClass(cloned);
					} else {
						id = await homebrew.createClass({
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
					}
					break;
				}
				case 'subclass': {
					const template = selectedTemplate as Subclass | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.name = newItemName.trim();
						id = await homebrew.createSubclass(cloned);
					} else {
						id = await homebrew.createSubclass({
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
					}
					break;
				}
				case 'domain-cards': {
					const template = selectedTemplate as DomainCard | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createDomainCard(cloned);
					} else {
						id = await homebrew.createDomainCard({
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
					}
					break;
				}
				case 'ancestry-cards': {
					const template = selectedTemplate as AncestryCard | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createAncestryCard(cloned);
					} else {
						id = await homebrew.createAncestryCard({
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
					}
					break;
				}
				case 'community-cards': {
					const template = selectedTemplate as CommunityCard | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createCommunityCard(cloned);
					} else {
						id = await homebrew.createCommunityCard({
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
					}
					break;
				}
				case 'transformation-cards': {
					const template = selectedTemplate as TransformationCard | null;
					if (template) {
						const cloned = deepClone(template);
						cloned.compendium_id = '';
						cloned.source_id = 'Homebrew';
						cloned.title = newItemName.trim();
						id = await homebrew.createTransformationCard(cloned);
					} else {
						id = await homebrew.createTransformationCard({
							compendium_id: '',
							source_id: 'Homebrew',
							card_type: 'transformation',
							title: newItemName.trim(),
							description_html: '',
							image_url: '',
							artist_name: '',
							features: []
						});
					}
					break;
				}
			}

			// Reset form and close dialog
			newItemName = '';
			newItemType = undefined;
			selectedTemplateId = '';
			showCreateDialog = false;

			// Navigate to the newly created item
			if (id) {
				let route = '';
				switch (itemType) {
					case 'weapon':
						route = `/homebrew/weapons/${id}`;
						break;
					case 'armor':
						route = `/homebrew/armor/${id}`;
						break;
					case 'beastform':
						route = `/homebrew/beastforms/${id}`;
						break;
					case 'loot':
						route = `/homebrew/loot/${id}`;
						break;
					case 'consumable':
						route = `/homebrew/consumables/${id}`;
						break;
					case 'class':
						route = `/homebrew/classes/${id}`;
						break;
					case 'subclass':
						route = `/homebrew/subclasses/${id}`;
						break;
					case 'domain-cards':
						route = `/homebrew/domain-cards/${id}`;
						break;
					case 'ancestry-cards':
						route = `/homebrew/ancestry-cards/${id}`;
						break;
					case 'community-cards':
						route = `/homebrew/community-cards/${id}`;
						break;
					case 'transformation-cards':
						route = `/homebrew/transformation-cards/${id}`;
						break;
				}
				if (route) {
					await goto(route);
				}
			}
		} catch (err) {
			console.error('Failed to create homebrew item:', err);
		} finally {
			isCreating = false;
		}
	}

	// Filter state
	let searchQuery = $state('');
	let activeTab = $state<
		| ''
		| 'weapons'
		| 'armor'
		| 'beastforms'
		| 'loot'
		| 'consumables'
		| 'classes'
		| 'subclasses'
		| 'domain-cards'
		| 'ancestry-cards'
		| 'community-cards'
		| 'transformation-cards'
	>('');
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
			| 'domain-cards'
			| 'ancestry-cards'
			| 'community-cards'
			| 'transformation-cards';
		domainId?: DomainIds;
	} | null>(null);

	// Clear subfilters when main tab changes
	$effect(() => {
		if (activeTab !== 'weapons') {
			weaponCategoryFilter = '';
			weaponTypeFilter = '';
		}
		if (
			activeTab === '' ||
			(activeTab !== 'armor' && activeTab !== 'beastforms' && activeTab !== 'domain-cards')
		) {
			tierFilter = '';
		}
	});

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

	// Filter primary weapons
	let filteredPrimaryWeapons = $derived(
		Object.entries(homebrew.primary_weapons)
			.map(([id, weapon]) => ({ id, weapon }))
			.filter(({ weapon }) => {
				if (!matchesSearch(weapon.title, weapon.description_html, searchQuery)) return false;
				if (tierFilter !== '' && level_to_tier(weapon.level_requirement) !== parseInt(tierFilter))
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
				if (tierFilter !== '' && level_to_tier(weapon.level_requirement) !== parseInt(tierFilter))
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
				if (tierFilter !== '' && level_to_tier(armor.level_requirement) !== parseInt(tierFilter))
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
					level_to_tier(beastform.level_requirement) !== parseInt(tierFilter)
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
				if (tierFilter !== '' && level_to_tier(card.level_requirement) !== parseInt(tierFilter))
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
		| { type: 'domain-cards'; id: string; item: DomainCard; domainId: DomainIds }
		| { type: 'ancestry-cards'; id: string; item: AncestryCard }
		| { type: 'community-cards'; id: string; item: CommunityCard }
		| { type: 'transformation-cards'; id: string; item: TransformationCard };

	let filteredItems = $derived.by((): FilteredItem[] => {
		const items: FilteredItem[] = [];

		if (activeTab === '' || activeTab === 'weapons') {
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

		if (activeTab === '' || activeTab === 'armor') {
			items.push(
				...filteredArmor.map(({ id, armor }) => ({
					type: 'armor' as const,
					id,
					item: armor
				}))
			);
		}

		if (activeTab === '' || activeTab === 'beastforms') {
			items.push(
				...filteredBeastforms.map(({ id, beastform }) => ({
					type: 'beastform' as const,
					id,
					item: beastform
				}))
			);
		}

		if (activeTab === '' || activeTab === 'loot') {
			items.push(
				...filteredLoot.map(({ id, loot }) => ({
					type: 'loot' as const,
					id,
					item: loot
				}))
			);
		}

		if (activeTab === '' || activeTab === 'consumables') {
			items.push(
				...filteredConsumables.map(({ id, consumable }) => ({
					type: 'consumable' as const,
					id,
					item: consumable
				}))
			);
		}

		if (activeTab === '' || activeTab === 'classes') {
			items.push(
				...filteredClasses.map(({ id, characterClass }) => ({
					type: 'class' as const,
					id,
					item: characterClass
				}))
			);
		}

		if (activeTab === '' || activeTab === 'subclasses') {
			items.push(
				...filteredSubclasses.map(({ id, subclass }) => ({
					type: 'subclass' as const,
					id,
					item: subclass
				}))
			);
		}

		if (activeTab === '' || activeTab === 'domain-cards') {
			items.push(
				...filteredDomainCards.map(({ id, card, domainId }) => ({
					type: 'domain-cards' as const,
					id,
					item: card,
					domainId
				}))
			);
		}

		if (activeTab === '' || activeTab === 'ancestry-cards') {
			items.push(
				...filteredAncestryCards.map(({ id, card }) => ({
					type: 'ancestry-cards' as const,
					id,
					item: card
				}))
			);
		}

		if (activeTab === '' || activeTab === 'community-cards') {
			items.push(
				...filteredCommunityCards.map(({ id, card }) => ({
					type: 'community-cards' as const,
					id,
					item: card
				}))
			);
		}

		if (activeTab === '' || activeTab === 'transformation-cards') {
			items.push(
				...filteredTransformationCards.map(({ id, card }) => ({
					type: 'transformation-cards' as const,
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

	// Check if all types are at limit
	let atLimit = $derived(totalCount >= MAX_HOMEBREW);

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
			| 'domain-cards'
			| 'ancestry-cards'
			| 'community-cards'
			| 'transformation-cards',
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
				case 'domain-cards':
					if (itemToDelete.domainId) {
						await homebrew.deleteDomainCard(itemToDelete.id, itemToDelete.domainId);
					}
					break;
				case 'ancestry-cards':
					await homebrew.deleteAncestryCard(itemToDelete.id);
					break;
				case 'community-cards':
					await homebrew.deleteCommunityCard(itemToDelete.id);
					break;
				case 'transformation-cards':
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
			case 'domain-cards':
			case 'ancestry-cards':
			case 'community-cards':
			case 'transformation-cards':
				return entry.item.title;
		}
	}

	// Get item tier helper
	function getItemTier(entry: FilteredItem): number | null {
		if ('level_requirement' in entry.item) {
			return level_to_tier(entry.item.level_requirement);
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
			case 'domain-cards':
				const tier = getItemTier(entry);
				return tier ? `Tier ${tier} Domain Card` : 'Domain Card';
			case 'ancestry-cards':
				return 'Ancestry Card';
			case 'community-cards':
				return 'Community Card';
			case 'transformation-cards':
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
			case 'domain-cards':
				return `/homebrew/domain-cards/${entry.id}`;
			case 'ancestry-cards':
				return `/homebrew/ancestry-cards/${entry.id}`;
			case 'community-cards':
				return `/homebrew/community-cards/${entry.id}`;
			case 'transformation-cards':
				return `/homebrew/transformation-cards/${entry.id}`;
		}
	}

	let filtersExpanded = $state(false);
	// number of custom filters set
	let filterCount = $derived(
		(searchQuery.length > 0 ? 1 : 0) +
			(activeTab !== '' ? 1 : 0) +
			(tierFilter !== '' ? 1 : 0) +
			(weaponCategoryFilter !== '' ? 1 : 0) +
			(weaponTypeFilter !== '' ? 1 : 0)
	);
</script>

{#snippet tierFilterSelect()}
	<Select.Root
		type="single"
		value={tierFilter}
		onValueChange={(v) => (tierFilter = (v as '1' | '2' | '3' | '4' | '') || '')}
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

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Forge footer image with fade effect - background -->
	<div
		class="forge-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-64 w-full overflow-hidden"
	>
		<img
			src="/images/art/forge.webp"
			alt=""
			class="forge-fade-container h-full w-full object-cover object-center"
		/>
	</div>

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
			<div class="flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
				<!-- Header -->
				<div class="flex items-center justify-between gap-2">
					<p class="flex items-center gap-2 text-2xl font-bold">
						Homebrew
						<span
							class="rounded-full border bg-card px-2 py-0.5 text-base tracking-widest text-muted-foreground"
						>
							{totalCount}/{MAX_HOMEBREW}
						</span>
					</p>

					<div class="flex gap-2">
						<Button variant="outline" onclick={() => (showCreateDialog = true)} disabled={atLimit}>
							<Plus /> New Homebrew
						</Button>
					</div>
				</div>

				{#if totalCount === 0}
					<Button class="mx-auto my-24" onclick={() => (showCreateDialog = true)}>
						<Anvil />
						Create your first homebrew!
					</Button>
				{:else}
					<!-- filters -->
					<div class={cn('-mt-3 mb-3', !filtersExpanded && 'mb-4')}>
						<Collapsible.Root bind:open={filtersExpanded}>
							<Collapsible.Trigger class="relative z-20 w-full">
								<p
									class="absolute top-1.5 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded bg-background py-0.5 pr-2 pl-1 text-xs font-medium text-primary sm:left-4 sm:translate-x-0"
								>
									<ChevronRight
										class={cn('size-3.5 transition-transform', filtersExpanded && 'rotate-90')}
									/>

									Filters
									{#if filterCount > 0}
										({filterCount})
									{/if}
									{#if activeTab !== '' || searchQuery.length > 0}
										<Button
											variant="link"
											size="sm"
											onclick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												activeTab = '';
												tierFilter = '';
												weaponCategoryFilter = '';
												weaponTypeFilter = '';
												searchQuery = '';
											}}
											class="-top-2 right-0 ml-2 p-0 text-xs"
										>
											Reset
											<RotateCcw class="size-3.5" />
										</Button>
									{/if}
								</p>
							</Collapsible.Trigger>
							<div class={cn('border-t-2 bg-primary/5', filtersExpanded && 'border-b-2')}>
								<Collapsible.Content
									class="relative flex flex-wrap justify-center gap-3 px-4 py-4 sm:justify-start"
								>
									<!-- Search Box -->
									<div class="relative h-min">
										<Search
											class="pointer-events-none absolute top-1/2 left-3 size-4 shrink -translate-y-1/2 text-muted-foreground"
										/>
										<Input bind:value={searchQuery} placeholder="Search..." class="pl-9" />
									</div>

									<!-- Type Filter Select -->
									<Select.Root
										type="single"
										value={activeTab || undefined}
										onValueChange={(v) => {
											activeTab = (v || '') as typeof activeTab;
										}}
									>
										<Select.Trigger class="w-[232px]">
											<div class="flex items-center gap-2">
												{#if activeTab === ''}
													All ({totalCount})
												{:else if activeTab === 'weapons'}
													<Swords class="size-4" />
													Weapons ({weaponCount})
												{:else if activeTab === 'armor'}
													<Shield class="size-4" />
													Armor ({armorCount})
												{:else if activeTab === 'beastforms'}
													<PawPrint class="size-4" />
													Beastforms ({beastformCount})
												{:else if activeTab === 'loot'}
													<Chest class="size-4" />
													Loot ({lootCount})
												{:else if activeTab === 'consumables'}
													<FlaskConical class="size-4" />
													Consumables ({consumableCount})
												{:else if activeTab === 'classes'}
													<GraduationCap class="size-4" />
													Classes ({classCount})
												{:else if activeTab === 'subclasses'}
													<BookOpen class="size-4" />
													Subclasses ({subclassCount})
												{:else if activeTab === 'domain-cards'}
													<BookOpen class="size-4" />
													Domain Cards ({domainCardCount})
												{:else if activeTab === 'ancestry-cards'}
													<Users class="size-4" />
													Ancestry Cards ({ancestryCardCount})
												{:else if activeTab === 'community-cards'}
													<Users class="size-4" />
													Community Cards ({communityCardCount})
												{:else if activeTab === 'transformation-cards'}
													<Sparkles class="size-4" />
													Transformation Cards ({transformationCardCount})
												{/if}
											</div>
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="">
												<div class="flex items-center gap-2">
													All ({totalCount})
												</div>
											</Select.Item>
											<Select.Item value="weapons">
												<div class="flex items-center gap-2">
													<Swords class="size-4" />
													Weapons ({weaponCount})
												</div>
											</Select.Item>
											<Select.Item value="armor">
												<div class="flex items-center gap-2">
													<Shield class="size-4" />
													Armor ({armorCount})
												</div>
											</Select.Item>
											<Select.Item value="beastforms">
												<div class="flex items-center gap-2">
													<PawPrint class="size-4" />
													Beastforms ({beastformCount})
												</div>
											</Select.Item>
											<Select.Item value="loot">
												<div class="flex items-center gap-2">
													<Chest class="size-4" />
													Loot ({lootCount})
												</div>
											</Select.Item>
											<Select.Item value="consumables">
												<div class="flex items-center gap-2">
													<FlaskConical class="size-4" />
													Consumables ({consumableCount})
												</div>
											</Select.Item>
											<Select.Item value="classes">
												<div class="flex items-center gap-2">
													<GraduationCap class="size-4" />
													Classes ({classCount})
												</div>
											</Select.Item>
											<Select.Item value="subclasses">
												<div class="flex items-center gap-2">
													<BookOpen class="size-4" />
													Subclasses ({subclassCount})
												</div>
											</Select.Item>
											<Select.Item value="domain-cards">
												<div class="flex items-center gap-2">
													<BookOpen class="size-4" />
													Domain Cards ({domainCardCount})
												</div>
											</Select.Item>
											<Select.Item value="ancestry-cards">
												<div class="flex items-center gap-2">
													<Users class="size-4" />
													Ancestry Cards ({ancestryCardCount})
												</div>
											</Select.Item>
											<Select.Item value="community-cards">
												<div class="flex items-center gap-2">
													<Users class="size-4" />
													Community Cards ({communityCardCount})
												</div>
											</Select.Item>
											<Select.Item value="transformation-cards">
												<div class="flex items-center gap-2">
													<Sparkles class="size-4" />
													Transformation Cards ({transformationCardCount})
												</div>
											</Select.Item>
										</Select.Content>
									</Select.Root>

									<!-- Subfilters for Weapons -->
									{#if activeTab === 'weapons'}
										<!-- Category Select (Primary/Secondary) -->
										<Select.Root
											type="single"
											value={weaponCategoryFilter}
											onValueChange={(v) =>
												(weaponCategoryFilter = (v as 'Primary' | 'Secondary' | '') || '')}
										>
											<Select.Trigger class="w-[142px]">
												{weaponCategoryFilter || 'All Categories'}
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="">All Categories</Select.Item>
												<Select.Item value="Primary">Primary</Select.Item>
												<Select.Item value="Secondary">Secondary</Select.Item>
											</Select.Content>
										</Select.Root>

										<!-- Tier Select -->
										{@render tierFilterSelect()}

										<!-- Type Select (Magical/Physical) -->
										<Select.Root
											type="single"
											value={weaponTypeFilter}
											onValueChange={(v) =>
												(weaponTypeFilter = (v as 'Magical' | 'Physical' | '') || '')}
										>
											<Select.Trigger class="w-[128px]">
												{weaponTypeFilter || 'All Types'}
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="">All Types</Select.Item>
												<Select.Item value="Physical">Physical</Select.Item>
												<Select.Item value="Magical">Magical</Select.Item>
											</Select.Content>
										</Select.Root>
									{/if}

									<!-- Subfilters for Armor -->
									{#if activeTab === 'armor'}
										<!-- Tier Select -->
										{@render tierFilterSelect()}
									{/if}

									<!-- Subfilters for Beastforms -->
									{#if activeTab === 'beastforms'}
										<!-- Tier Select -->
										{@render tierFilterSelect()}
									{/if}

									<!-- Subfilters for Domain Cards -->
									{#if activeTab === 'domain-cards'}
										<!-- Tier Select -->
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
						<!-- Results Grid -->
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{#each filteredItems as entry (entry.id)}
								<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded">
									<!-- Card Header -->
									<a
										href={getItemHref(entry)}
										class="flex gap-2 border bg-primary-muted p-3 hover:bg-primary-muted/80"
									>
										<div
											class="flex size-12 shrink-0 items-center justify-center rounded-lg border-2 bg-card"
										>
											{#if entry.type === 'primary_weapon' || entry.type === 'secondary_weapon'}
												<Swords class="size-6 text-muted-foreground" />
											{:else if entry.type === 'armor'}
												<Shield class="size-6 text-muted-foreground" />
											{:else if entry.type === 'beastform'}
												<PawPrint class="size-6 text-muted-foreground" />
											{:else if entry.type === 'loot'}
												<Chest class="size-6 text-muted-foreground" />
											{:else if entry.type === 'consumable'}
												<FlaskConical class="size-6 text-muted-foreground" />
											{:else if entry.type === 'class'}
												<GraduationCap class="size-6 text-muted-foreground" />
											{:else if entry.type === 'subclass'}
												<BookOpen class="size-6 text-muted-foreground" />
											{:else if entry.type === 'domain-cards'}
												<BookOpen class="size-6 text-muted-foreground" />
											{:else if entry.type === 'ancestry-cards'}
												<Users class="size-6 text-muted-foreground" />
											{:else if entry.type === 'community-cards'}
												<Users class="size-6 text-muted-foreground" />
											{:else if entry.type === 'transformation-cards'}
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
												if (entry.type === 'domain-cards') {
													openDeleteDialog(
														entry.id,
														getItemName(entry),
														entry.type,
														entry.domainId
													);
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

		<form
			onsubmit={(e) => {
				e.preventDefault();
				if (newItemName.trim() && newItemType && !isCreating && !atLimit) {
					handleCreateHomebrew();
				}
			}}
		>
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
									<Chest class="size-4" />
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
							{:else if newItemType === 'domain-cards'}
								<div class="flex items-center gap-2">
									<BookOpen class="size-4" />
									Domain Card
								</div>
							{:else if newItemType === 'ancestry-cards'}
								<div class="flex items-center gap-2">
									<Users class="size-4" />
									Ancestry Card
								</div>
							{:else if newItemType === 'community-cards'}
								<div class="flex items-center gap-2">
									<Users class="size-4" />
									Community Card
								</div>
							{:else if newItemType === 'transformation-cards'}
								<div class="flex items-center gap-2">
									<Sparkles class="size-4" />
									Transformation Card
								</div>
							{:else}
								<span class="text-muted-foreground">Select a type...</span>
							{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="weapon" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<Swords class="size-4" />
									Weapon
								</div>
							</Select.Item>
							<Select.Item value="armor" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<Shield class="size-4" />
									Armor
								</div>
							</Select.Item>
							<Select.Item value="beastform" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<PawPrint class="size-4" />
									Beastform
								</div>
							</Select.Item>
							<Select.Item value="loot" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<svg viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true">
										<path
											d="M18,0H6C2.691,0,0,2.691,0,6V24H24V6c0-3.309-2.691-6-6-6Zm4,6v3h-2V2.556c1.19,.694,2,1.97,2,3.444Zm-4-4v7h-3c0-1.654-1.346-3-3-3s-3,1.346-3,3h-3V2h12Zm-5,7v4h-2v-4c0-.551,.448-1,1-1s1,.449,1,1ZM4,2.556v6.444H2v-3c0-1.474,.81-2.75,2-3.444ZM20,22V13h-2v9H6V13h-2v9H2V11h7v4h6v-4h7v11h-2Z"
										/>
									</svg>
									Loot
								</div>
							</Select.Item>
							<Select.Item value="consumable" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<FlaskConical class="size-4" />
									Consumable
								</div>
							</Select.Item>
							<Select.Item value="class" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<GraduationCap class="size-4" />
									Class
								</div>
							</Select.Item>
							<Select.Item value="subclass" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<BookOpen class="size-4" />
									Subclass
								</div>
							</Select.Item>
							<Select.Item value="domain-cards" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<svg
										class="size-4"
										width="800px"
										height="800px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.4 7.53333C9.2 7.26667 8.8 7.26667 8.6 7.53333L6.225 10.7C6.09167 10.8778 6.09167 11.1222 6.225 11.3L8.6 14.4667C8.8 14.7333 9.2 14.7333 9.4 14.4667L11.775 11.3C11.9083 11.1222 11.9083 10.8778 11.775 10.7L9.4 7.53333Z"
											fill="currentColor"
										/>
										<path
											d="M4.09245 5.63868C4.03647 5.5547 4.03647 5.4453 4.09245 5.36133L4.79199 4.31202C4.89094 4.16359 5.10906 4.16359 5.20801 4.31202L5.90755 5.36132C5.96353 5.4453 5.96353 5.5547 5.90755 5.63867L5.20801 6.68798C5.10906 6.83641 4.89094 6.83641 4.79199 6.68798L4.09245 5.63868Z"
											fill="currentColor"
										/>
										<path
											d="M13.208 15.312C13.1091 15.1636 12.8909 15.1636 12.792 15.312L12.0924 16.3613C12.0365 16.4453 12.0365 16.5547 12.0924 16.6387L12.792 17.688C12.8909 17.8364 13.1091 17.8364 13.208 17.688L13.9075 16.6387C13.9635 16.5547 13.9635 16.4453 13.9075 16.3613L13.208 15.312Z"
											fill="currentColor"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M1 4C1 2.34315 2.34315 1 4 1H14C15.1323 1 16.1181 1.62732 16.6288 2.55337L20.839 3.68148C22.4394 4.11031 23.3891 5.75532 22.9603 7.35572L19.3368 20.8787C18.908 22.4791 17.263 23.4288 15.6626 23L8.19849 21H4C2.34315 21 1 19.6569 1 18V4ZM17 18V4.72339L20.3213 5.61334C20.8548 5.75628 21.1714 6.30461 21.0284 6.83808L17.405 20.361C17.262 20.8945 16.7137 21.2111 16.1802 21.0681L15.1198 20.784C16.222 20.3403 17 19.261 17 18ZM4 3C3.44772 3 3 3.44772 3 4V18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18V4C15 3.44772 14.5523 3 14 3H4Z"
											fill="currentColor"
										/>
									</svg>
									Domain Card
								</div>
							</Select.Item>
							<Select.Item value="ancestry-cards" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<svg
										width="800px"
										height="800px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.4 7.53333C9.2 7.26667 8.8 7.26667 8.6 7.53333L6.225 10.7C6.09167 10.8778 6.09167 11.1222 6.225 11.3L8.6 14.4667C8.8 14.7333 9.2 14.7333 9.4 14.4667L11.775 11.3C11.9083 11.1222 11.9083 10.8778 11.775 10.7L9.4 7.53333Z"
											fill="currentColor"
										/>
										<path
											d="M4.09245 5.63868C4.03647 5.5547 4.03647 5.4453 4.09245 5.36133L4.79199 4.31202C4.89094 4.16359 5.10906 4.16359 5.20801 4.31202L5.90755 5.36132C5.96353 5.4453 5.96353 5.5547 5.90755 5.63867L5.20801 6.68798C5.10906 6.83641 4.89094 6.83641 4.79199 6.68798L4.09245 5.63868Z"
											fill="currentColor"
										/>
										<path
											d="M13.208 15.312C13.1091 15.1636 12.8909 15.1636 12.792 15.312L12.0924 16.3613C12.0365 16.4453 12.0365 16.5547 12.0924 16.6387L12.792 17.688C12.8909 17.8364 13.1091 17.8364 13.208 17.688L13.9075 16.6387C13.9635 16.5547 13.9635 16.4453 13.9075 16.3613L13.208 15.312Z"
											fill="currentColor"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M1 4C1 2.34315 2.34315 1 4 1H14C15.1323 1 16.1181 1.62732 16.6288 2.55337L20.839 3.68148C22.4394 4.11031 23.3891 5.75532 22.9603 7.35572L19.3368 20.8787C18.908 22.4791 17.263 23.4288 15.6626 23L8.19849 21H4C2.34315 21 1 19.6569 1 18V4ZM17 18V4.72339L20.3213 5.61334C20.8548 5.75628 21.1714 6.30461 21.0284 6.83808L17.405 20.361C17.262 20.8945 16.7137 21.2111 16.1802 21.0681L15.1198 20.784C16.222 20.3403 17 19.261 17 18ZM4 3C3.44772 3 3 3.44772 3 4V18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18V4C15 3.44772 14.5523 3 14 3H4Z"
											fill="currentColor"
										/>
									</svg>
									Ancestry Card
								</div>
							</Select.Item>
							<Select.Item value="community-cards" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<svg
										width="800px"
										height="800px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.4 7.53333C9.2 7.26667 8.8 7.26667 8.6 7.53333L6.225 10.7C6.09167 10.8778 6.09167 11.1222 6.225 11.3L8.6 14.4667C8.8 14.7333 9.2 14.7333 9.4 14.4667L11.775 11.3C11.9083 11.1222 11.9083 10.8778 11.775 10.7L9.4 7.53333Z"
											fill="currentColor"
										/>
										<path
											d="M4.09245 5.63868C4.03647 5.5547 4.03647 5.4453 4.09245 5.36133L4.79199 4.31202C4.89094 4.16359 5.10906 4.16359 5.20801 4.31202L5.90755 5.36132C5.96353 5.4453 5.96353 5.5547 5.90755 5.63867L5.20801 6.68798C5.10906 6.83641 4.89094 6.83641 4.79199 6.68798L4.09245 5.63868Z"
											fill="currentColor"
										/>
										<path
											d="M13.208 15.312C13.1091 15.1636 12.8909 15.1636 12.792 15.312L12.0924 16.3613C12.0365 16.4453 12.0365 16.5547 12.0924 16.6387L12.792 17.688C12.8909 17.8364 13.1091 17.8364 13.208 17.688L13.9075 16.6387C13.9635 16.5547 13.9635 16.4453 13.9075 16.3613L13.208 15.312Z"
											fill="currentColor"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M1 4C1 2.34315 2.34315 1 4 1H14C15.1323 1 16.1181 1.62732 16.6288 2.55337L20.839 3.68148C22.4394 4.11031 23.3891 5.75532 22.9603 7.35572L19.3368 20.8787C18.908 22.4791 17.263 23.4288 15.6626 23L8.19849 21H4C2.34315 21 1 19.6569 1 18V4ZM17 18V4.72339L20.3213 5.61334C20.8548 5.75628 21.1714 6.30461 21.0284 6.83808L17.405 20.361C17.262 20.8945 16.7137 21.2111 16.1802 21.0681L15.1198 20.784C16.222 20.3403 17 19.261 17 18ZM4 3C3.44772 3 3 3.44772 3 4V18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18V4C15 3.44772 14.5523 3 14 3H4Z"
											fill="currentColor"
										/>
									</svg>
									Community Card
								</div>
							</Select.Item>
							<Select.Item value="transformation-cards" disabled={atLimit}>
								<div class="flex items-center gap-2">
									<svg
										width="800px"
										height="800px"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M9.4 7.53333C9.2 7.26667 8.8 7.26667 8.6 7.53333L6.225 10.7C6.09167 10.8778 6.09167 11.1222 6.225 11.3L8.6 14.4667C8.8 14.7333 9.2 14.7333 9.4 14.4667L11.775 11.3C11.9083 11.1222 11.9083 10.8778 11.775 10.7L9.4 7.53333Z"
											fill="currentColor"
										/>
										<path
											d="M4.09245 5.63868C4.03647 5.5547 4.03647 5.4453 4.09245 5.36133L4.79199 4.31202C4.89094 4.16359 5.10906 4.16359 5.20801 4.31202L5.90755 5.36132C5.96353 5.4453 5.96353 5.5547 5.90755 5.63867L5.20801 6.68798C5.10906 6.83641 4.89094 6.83641 4.79199 6.68798L4.09245 5.63868Z"
											fill="currentColor"
										/>
										<path
											d="M13.208 15.312C13.1091 15.1636 12.8909 15.1636 12.792 15.312L12.0924 16.3613C12.0365 16.4453 12.0365 16.5547 12.0924 16.6387L12.792 17.688C12.8909 17.8364 13.1091 17.8364 13.208 17.688L13.9075 16.6387C13.9635 16.5547 13.9635 16.4453 13.9075 16.3613L13.208 15.312Z"
											fill="currentColor"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M1 4C1 2.34315 2.34315 1 4 1H14C15.1323 1 16.1181 1.62732 16.6288 2.55337L20.839 3.68148C22.4394 4.11031 23.3891 5.75532 22.9603 7.35572L19.3368 20.8787C18.908 22.4791 17.263 23.4288 15.6626 23L8.19849 21H4C2.34315 21 1 19.6569 1 18V4ZM17 18V4.72339L20.3213 5.61334C20.8548 5.75628 21.1714 6.30461 21.0284 6.83808L17.405 20.361C17.262 20.8945 16.7137 21.2111 16.1802 21.0681L15.1198 20.784C16.222 20.3403 17 19.261 17 18ZM4 3C3.44772 3 3 3.44772 3 4V18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18V4C15 3.44772 14.5523 3 14 3H4Z"
											fill="currentColor"
										/>
									</svg>
									Transformation Card
								</div>
							</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Template Selection -->
				<div class="flex flex-col gap-2">
					<Label>Template</Label>
					<TemplateCombobox
						disabled={!newItemType}
						homebrewType={newItemType}
						bind:value={selectedTemplateId}
					/>
				</div>

				<!-- Name Input -->
				<div class="flex flex-col gap-2">
					<Label>Name</Label>
					<Input bind:value={newItemName} placeholder="Enter a name..." disabled={!newItemType} />
				</div>
			</div>

			<Dialog.Footer class="flex gap-3">
				<Dialog.Close class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
					Cancel
				</Dialog.Close>
				<Button
					type="submit"
					disabled={!newItemName.trim() || !newItemType || isCreating || atLimit}
				>
					{isCreating ? 'Creating...' : 'Create'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<style>
	.forge-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
