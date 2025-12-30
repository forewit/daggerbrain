<script lang="ts">
	import type { HomebrewType } from '$lib/types/homebrew-types';
	import type {
		Weapon,
		Armor,
		Beastform,
		Loot,
		Consumable,
		CharacterClass,
		Subclass,
		AncestryCard,
		CommunityCard,
		TransformationCard,
		DomainCard,
		DomainIds
	} from '$lib/types/compendium-types';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	// Import all form components
	import HomebrewWeaponForm from '$lib/components/app/homebrew/forms/weapon-form.svelte';
	import HomebrewArmorForm from '$lib/components/app/homebrew/forms/armor-form.svelte';
	import HomebrewBeastformForm from '$lib/components/app/homebrew/forms/beastform-form.svelte';
	import HomebrewLootForm from '$lib/components/app/homebrew/forms/loot-form.svelte';
	import HomebrewConsumableForm from '$lib/components/app/homebrew/forms/consumable-form.svelte';
	import HomebrewClassForm from '$lib/components/app/homebrew/forms/class-form.svelte';
	import HomebrewSubclassForm from '$lib/components/app/homebrew/forms/subclass-form.svelte';
	import HomebrewAncestryCardForm from '$lib/components/app/homebrew/forms/ancestry-card-form.svelte';
	import HomebrewCommunityCardForm from '$lib/components/app/homebrew/forms/community-card-form.svelte';
	import HomebrewTransformationCardForm from '$lib/components/app/homebrew/forms/transformation-card-form.svelte';
	import HomebrewDomainCardForm from '$lib/components/app/homebrew/forms/domain-card-form.svelte';

	// Import all preview components
	import WeaponPreview from '$lib/components/app/homebrew/previews/weapon-preview.svelte';
	import ArmorPreview from '$lib/components/app/homebrew/previews/armor-preview.svelte';
	import BeastformPreview from '$lib/components/app/homebrew/previews/beastform-preview.svelte';
	import LootPreview from '$lib/components/app/homebrew/previews/loot-preview.svelte';
	import ConsumablePreview from '$lib/components/app/homebrew/previews/consumable-preview.svelte';
	import ClassPreview from '$lib/components/app/homebrew/previews/class-preview.svelte';
	import SubclassPreview from '$lib/components/app/homebrew/previews/subclass-preview.svelte';
	import AncestryCardPreview from '$lib/components/app/homebrew/previews/ancestry-card-preview.svelte';
	import CommunityCardPreview from '$lib/components/app/homebrew/previews/community-card-preview.svelte';
	import TransformationCardPreview from '$lib/components/app/homebrew/previews/transformation-card-preview.svelte';
	import DomainCardPreview from '$lib/components/app/homebrew/previews/domain-card-preview.svelte';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	type HomebrewItem =
		| {
				type: 'weapon';
				item: Weapon;
		  }
		| {
				type: 'armor';
				item: Armor;
		  }
		| {
				type: 'beastform';
				item: Beastform;
		  }
		| {
				type: 'loot';
				item: Loot;
		  }
		| {
				type: 'consumable';
				item: Consumable;
		  }
		| {
				type: 'class';
				item: CharacterClass;
		  }
		| {
				type: 'subclass';
				item: Subclass;
		  }
		| {
				type: 'ancestry-cards';
				item: AncestryCard;
		  }
		| {
				type: 'community-cards';
				item: CommunityCard;
		  }
		| {
				type: 'transformation-cards';
				item: TransformationCard;
		  }
		| {
				type: 'domain-cards';
				item: DomainCard;
		  };

	let homebrewItem: HomebrewItem | null = $derived.by(() => {
		if (!data.type || !data.uid) return null;

		switch (data.type) {
			case 'weapon':
				const weapon =
					homebrew.primary_weapons[data.uid] || homebrew.secondary_weapons[data.uid] || null;
				if (!weapon) return null;
				return {
					type: 'weapon',
					item: weapon
				};
			case 'armor':
				const armor = homebrew.armor[data.uid] || null;
				if (!armor) return null;
				return {
					type: 'armor',
					item: armor
				};
			case 'beastform':
				const beastform = homebrew.beastforms[data.uid] || null;
				if (!beastform) return null;
				return {
					type: 'beastform',
					item: beastform
				};
			case 'loot':
				const loot = homebrew.loot[data.uid] || null;
				if (!loot) return null;
				return {
					type: 'loot',
					item: loot
				};
			case 'consumable':
				const consumable = homebrew.consumables[data.uid] || null;
				if (!consumable) return null;
				return {
					type: 'consumable',
					item: consumable
				};
			case 'class':
				const characterClass = homebrew.classes[data.uid] || null;
				if (!characterClass) return null;
				return {
					type: 'class',
					item: characterClass
				};
			case 'subclass':
				const subclass = homebrew.subclasses[data.uid] || null;
				if (!subclass) return null;
				return {
					type: 'subclass',
					item: subclass
				};
			case 'ancestry-cards':
				const ancestryCard = homebrew.ancestry_cards[data.uid] || null;
				if (!ancestryCard) return null;
				return {
					type: 'ancestry-cards',
					item: ancestryCard
				};
			case 'community-cards':
				const communityCard = homebrew.community_cards[data.uid] || null;
				if (!communityCard) return null;
				return {
					type: 'community-cards',
					item: communityCard
				};
			case 'transformation-cards':
				const transformationCard = homebrew.transformation_cards[data.uid] || null;
				if (!transformationCard) return null;
				return {
					type: 'transformation-cards',
					item: transformationCard
				};
			case 'domain-cards':
				for (const domainId of Object.keys(homebrew.domain_cards) as DomainIds[]) {
					if (homebrew.domain_cards[domainId]?.[data.uid]) {
						return {
							type: 'domain-cards',
							item: homebrew.domain_cards[domainId][data.uid]
						};
					}
				}
				return null;
			default:
				return null;
		}
	});

	// Check if item is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && homebrewItem === null) {
			error(404, `${data.type} with UID "${data.uid}" not found`);
		}
	});

	let hasChanges = $state(false);

	// Union type for all form components that export handleSubmit and handleReset
	type HomebrewFormComponent =
		| HomebrewWeaponForm
		| HomebrewArmorForm
		| HomebrewBeastformForm
		| HomebrewLootForm
		| HomebrewConsumableForm
		| HomebrewClassForm
		| HomebrewSubclassForm
		| HomebrewAncestryCardForm
		| HomebrewCommunityCardForm
		| HomebrewTransformationCardForm
		| HomebrewDomainCardForm;

	// Single component reference for the active form
	let formComponent: HomebrewFormComponent | null = $state(null);

	// Handle form submission
	function handleSave() {
		formComponent?.handleSubmit();
	}

	// Handle form reset
	function handleReset() {
		formComponent?.handleReset();
	}
</script>

{#if homebrew.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if homebrewItem}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<!-- Main Content: Preview and Edit Side by Side -->
			<div
				class="flex w-full max-w-6xl flex-col flex-col-reverse justify-center gap-6 p-4 md:flex-row"
			>
				<!-- Edit Section -->
				<div class="w-full md:w-[400px]">
					<div class="mb-2 flex items-center justify-between gap-4">
						<h2 class="text-lg font-semibold">Edit</h2>
						<div class="flex gap-2">
							{#if hasChanges}
								<Button type="button" size="sm" class="h-auto" variant="link" onclick={handleReset}>
									<RotateCcw class="size-3.5" />
									Discard
								</Button>
							{/if}
							<Button
								type="button"
								size="sm"
								class="h-7 px-3"
								disabled={!hasChanges}
								onclick={handleSave}
							>
								Save
							</Button>
						</div>
					</div>

					<div class="rounded-lg border bg-card p-4">
						{#if homebrewItem.type === 'weapon'}
							<HomebrewWeaponForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'armor'}
							<HomebrewArmorForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'beastform'}
							<HomebrewBeastformForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'loot'}
							<HomebrewLootForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'consumable'}
							<HomebrewConsumableForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'class'}
							<HomebrewClassForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'subclass'}
							<HomebrewSubclassForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'ancestry-cards'}
							<HomebrewAncestryCardForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'community-cards'}
							<HomebrewCommunityCardForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'transformation-cards'}
							<HomebrewTransformationCardForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{:else if homebrewItem.type === 'domain-cards'}
							<HomebrewDomainCardForm
								bind:this={formComponent}
								bind:item={homebrewItem.item}
								bind:hasChanges
								onSubmit={handleSave}
								onReset={handleReset}
							/>
						{/if}
					</div>
				</div>

				<!-- Preview Section -->
				<div>
					<div class="sticky top-4 grow">
						<h2 class="mb-2 ml-2 flex items-center gap-2 text-lg font-semibold">Preview</h2>
						{#if homebrewItem.type === 'weapon'}
							<WeaponPreview weapon={homebrewItem.item} />
						{:else if homebrewItem.type === 'armor'}
							<ArmorPreview armor={homebrewItem.item} />
						{:else if homebrewItem.type === 'beastform'}
							<BeastformPreview beastform={homebrewItem.item} />
						{:else if homebrewItem.type === 'loot'}
							<LootPreview loot={homebrewItem.item} />
						{:else if homebrewItem.type === 'consumable'}
							<ConsumablePreview consumable={homebrewItem.item} />
						{:else if homebrewItem.type === 'class'}
							<ClassPreview characterClass={homebrewItem.item} />
						{:else if homebrewItem.type === 'subclass'}
							<SubclassPreview subclass={homebrewItem.item} />
						{:else if homebrewItem.type === 'ancestry-cards'}
							<AncestryCardPreview card={homebrewItem.item} />
						{:else if homebrewItem.type === 'community-cards'}
							<CommunityCardPreview card={homebrewItem.item} />
						{:else if homebrewItem.type === 'transformation-cards'}
							<TransformationCardPreview card={homebrewItem.item} />
						{:else if homebrewItem.type === 'domain-cards'}
							<DomainCardPreview card={homebrewItem.item} />
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
