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
	import { beforeNavigate } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import Loader2 from '@lucide/svelte/icons/loader-2';

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
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Anvil from '@lucide/svelte/icons/anvil';
	import Footer from '$lib/components/app/footer.svelte';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	type HomebrewItem = { name: string; typeName: string } & (
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
		  }
	);

	let homebrewItem: HomebrewItem | null = $state(null);
	$effect(() => {
		if (!data.type || !data.uid) {
			homebrewItem = null;
		} else {
			switch (data.type) {
				case 'weapon':
					const weapon =
						homebrew.primary_weapons[data.uid] || homebrew.secondary_weapons[data.uid] || null;
					homebrewItem = weapon
						? {
								type: 'weapon',
								typeName: 'Weapon',
								item: weapon,
								name: weapon.title
							}
						: null;
					break;
				case 'armor':
					const armor = homebrew.armor[data.uid] || null;
					homebrewItem = armor
						? {
								type: 'armor',
								typeName: 'Armor',
								item: armor,
								name: armor.title
							}
						: null;
					break;
				case 'beastform':
					const beastform = homebrew.beastforms[data.uid] || null;
					homebrewItem = beastform
						? {
								type: 'beastform',
								typeName: 'Beastform',
								item: beastform,
								name: beastform.name
							}
						: null;
					break;
				case 'loot':
					const loot = homebrew.loot[data.uid] || null;
					homebrewItem = loot
						? {
								type: 'loot',
								typeName: 'Loot',
								item: loot,
								name: loot.title
							}
						: null;
					break;
				case 'consumable':
					const consumable = homebrew.consumables[data.uid] || null;
					homebrewItem = consumable
						? {
								type: 'consumable',
								typeName: 'Consumable',
								item: consumable,
								name: consumable.title
							}
						: null;
					break;
				case 'class':
					const characterClass = homebrew.classes[data.uid] || null;
					homebrewItem = characterClass
						? {
								type: 'class',
								typeName: 'Class',
								item: characterClass,
								name: characterClass.name
							}
						: null;
					break;
				case 'subclass':
					const subclass = homebrew.subclasses[data.uid] || null;
					homebrewItem = subclass
						? {
								type: 'subclass',
								typeName: 'Subclass',
								item: subclass,
								name: subclass.name
							}
						: null;
					break;
				case 'ancestry-cards':
					const ancestryCard = homebrew.ancestry_cards[data.uid] || null;
					homebrewItem = ancestryCard
						? {
								type: 'ancestry-cards',
								typeName: 'Ancestry Card',
								item: ancestryCard,
								name: ancestryCard.title
							}
						: null;
					break;
				case 'community-cards':
					const communityCard = homebrew.community_cards[data.uid] || null;
					homebrewItem = communityCard
						? {
								type: 'community-cards',
								typeName: 'Community Card',
								item: communityCard,
								name: communityCard.title
							}
						: null;
					break;
				case 'transformation-cards':
					const transformationCard = homebrew.transformation_cards[data.uid] || null;
					homebrewItem = transformationCard
						? {
								type: 'transformation-cards',
								typeName: 'Transformation Card',
								item: transformationCard,
								name: transformationCard.title
							}
						: null;
					break;
				case 'domain-cards':
					for (const domainId of Object.keys(homebrew.domain_cards) as DomainIds[]) {
						const domainCard = homebrew.domain_cards[domainId]?.[data.uid];
						if (domainCard) {
							homebrewItem = {
								type: 'domain-cards',
								typeName: 'Domain Card',
								item: domainCard,
								name: domainCard.title
							};
							break;
						}
					}
					break;
				default:
					homebrewItem = null;
			}
		}
	});

	// Check if item is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && homebrewItem === null) {
			error(404, `${data.type} with UID "${data.uid}" not found`);
		}
	});

	let hasChanges = $state(false);
	let hasErrors = $state(false);
	let wasSaving = $state(false);

	// Watch for save completion and show toast
	$effect(() => {
		const currentlySaving = homebrew.saving;
		if (wasSaving && !currentlySaving && !hasChanges) {
			// Save completed successfully
			toast.success('Changes saved');
		}
		wasSaving = currentlySaving;
	});

	// Prevent navigation if there are unsaved changes
	beforeNavigate(({ cancel }) => {
		if (hasChanges) {
			if (!confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
				cancel();
			}
		}
	});

	// Handle browser navigation (closing tab, refreshing, etc.)
	$effect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasChanges) {
				e.preventDefault();
				// Modern browsers ignore custom messages, but we still need to set returnValue
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

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

	let editMode = $state(false);
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
		<!-- Forge side image with fade effect - background -->
		<div
			class="forge-fade-container pointer-events-none absolute top-0 right-0 bottom-0 z-0 w-96 overflow-hidden"
		>
			<img
				src="/images/art/forge.webp"
				alt=""
				class="forge-fade-container h-full w-full object-cover object-right"
			/>
		</div>

		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<!-- navigation -->
			<div
				class=" sticky top-[calc(var(--navbar-height,3.5rem)-1px)] z-20 w-full bg-background sm:top-0"
			>
				<div class="w-full bg-primary/50">
					<div class="relative mx-auto flex w-full max-w-6xl items-center gap-2 py-2 pr-4">
						<Button href="/homebrew" variant="link">
							<ChevronLeft />
							Back to Homebrew
						</Button>

						<div class="grow"></div>

						<div class="gap- flex">
							{#if hasChanges}
								<Button type="button" size="sm" class="h-7" variant="link" onclick={handleReset}>
									<RotateCcw class="size-3.5" />
									<p class="hidden sm:block">Discard</p>
								</Button>
							{/if}
							<Button
								type="button"
								size="sm"
								class={cn(
									'h-7',
									hasErrors && 'cursor-not-allowed border border-destructive hover:bg-primary'
								)}
								disabled={!hasChanges || homebrew.saving}
								hidden={!hasChanges && !homebrew.saving}
								onclick={handleSave}
							>
								{#if homebrew.saving}
									<Loader2 class="size-3.5 animate-spin" />
									Saving...
								{:else}
									Save
								{/if}
							</Button>
						</div>
					</div>
				</div>
			</div>

			<!-- Main Content: Preview and Edit Side by Side -->
			<div class="w-full max-w-6xl sm:px-4 sm:py-8">
				<div
					class="relative grid grid-cols-1 gap-8 border-accent/10 bg-accent/5 px-2 py-8 sm:gap-6 sm:rounded-3xl sm:border-x sm:px-6 sm:py-6 md:grid-cols-2"
				>
					<!-- edit -->
					<div>
						<p class="mb-4 text-center font-eveleth text-accent">Edit</p>
						<div class="rounded-lg bg-background p-4">
							{#if homebrewItem.type === 'weapon'}
								<HomebrewWeaponForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'armor'}
								<HomebrewArmorForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'beastform'}
								<HomebrewBeastformForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'loot'}
								<HomebrewLootForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'consumable'}
								<HomebrewConsumableForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
								<!-- {:else if homebrewItem.type === 'class'}
								<HomebrewClassForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'subclass'}
								<HomebrewSubclassForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'ancestry-cards'}
								<HomebrewAncestryCardForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'community-cards'}
								<HomebrewCommunityCardForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'transformation-cards'}
								<HomebrewTransformationCardForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/>
							{:else if homebrewItem.type === 'domain-cards'}
								<HomebrewDomainCardForm
									bind:this={formComponent}
									bind:item={homebrewItem.item}
									bind:hasChanges
									bind:hasErrors
									onSubmit={handleSave}
									onReset={handleReset}
								/> -->
							{/if}
						</div>
					</div>

					<!-- preview -->
					<div>
						<div class="sticky top-17">
							<p class="mb-4 text-center font-eveleth text-accent">Preview</p>
							<div class="  flex flex-col items-center gap-4">
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
									<!-- {:else if homebrewItem.type === 'class'}
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
								<DomainCardPreview card={homebrewItem.item} /> -->
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<Footer />

<style>
	.forge-fade-container {
		mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
