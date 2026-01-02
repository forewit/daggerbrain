<script lang="ts">
	import type { PageData } from './$types';
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
		DomainCard
	} from '$lib/types/compendium-types';
	import Button from '$lib/components/ui/button/button.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Footer from '$lib/components/app/footer.svelte';
	import { cn } from '$lib/utils';

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

	let { data }: { data: PageData } = $props();

	let loading = $state(true);

	$effect(() => {
		if (data.homebrewItem) {
			loading = false;
		}
	});

	// Check if item is not found
	$effect(() => {
		if (!loading && !data.homebrewItem) {
			error(404, `${data.type} with UID "${data.uid}" not found`);
		}
	});
</script>

{#if loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if data.homebrewItem}
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
						<Button href="/" variant="link">
							<ChevronLeft />
							Back
						</Button>
					</div>
				</div>
			</div>

			<!-- Main Content: Preview Only (Read-Only) -->
			<div class="w-full max-w-6xl sm:px-4 sm:py-8">
				<div
					class="relative grid grid-cols-1 gap-8 border-accent/10 bg-accent/5 px-2 py-8 sm:gap-6 sm:rounded-3xl sm:border-x sm:px-6 sm:py-6"
				>
					<!-- preview -->
					<div class="w-full">
						<p class="mb-4 text-center font-eveleth text-accent">Preview</p>
						<div class="flex flex-col items-center gap-4">
							{#if data.homebrewItem.type === 'weapon'}
								<WeaponPreview weapon={data.homebrewItem.data as Weapon} />
							{:else if data.homebrewItem.type === 'armor'}
								<ArmorPreview armor={data.homebrewItem.data as Armor} />
							{:else if data.homebrewItem.type === 'beastform'}
								<BeastformPreview beastform={data.homebrewItem.data as Beastform} />
							{:else if data.homebrewItem.type === 'loot'}
								<LootPreview loot={data.homebrewItem.data as Loot} />
							{:else if data.homebrewItem.type === 'consumable'}
								<ConsumablePreview consumable={data.homebrewItem.data as Consumable} />
							{:else if data.homebrewItem.type === 'class'}
								<ClassPreview characterClass={data.homebrewItem.data as CharacterClass} />
							{:else if data.homebrewItem.type === 'subclass'}
								<SubclassPreview subclass={data.homebrewItem.data as Subclass} />
							{:else if data.homebrewItem.type === 'ancestry-cards'}
								<AncestryCardPreview card={data.homebrewItem.data as AncestryCard} />
							{:else if data.homebrewItem.type === 'community-cards'}
								<CommunityCardPreview card={data.homebrewItem.data as CommunityCard} />
							{:else if data.homebrewItem.type === 'transformation-cards'}
								<TransformationCardPreview card={data.homebrewItem.data as TransformationCard} />
							{:else if data.homebrewItem.type === 'domain-cards'}
								<DomainCardPreview card={data.homebrewItem.data as DomainCard} />
							{/if}
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

