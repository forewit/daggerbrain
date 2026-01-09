<script lang="ts">
	import { cn } from '$lib/utils';
	import Traits from './traits.svelte';
	import Banner from '../cards/class-banner.svelte';
	import DamageThresholds from './damage-thresholds.svelte';
	import ArmorSlots from './armor-slots.svelte';
	import Evasion from './evasion.svelte';
	import Hp from './hp.svelte';
	import Stress from './stress.svelte';
	import Hope from './hope.svelte';
	import Conditions from './conditions.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import CardCarousel from '../cards/card-carousel.svelte';
	import Loadout from './loadout.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import type {
		DomainCard,
		AncestryCard,
		CommunityCard,
		TransformationCard,
		SubclassFoundationCard,
		SubclassSpecializationCard,
		SubclassMasteryCard
	} from '$lib/types/compendium-types';
	import Features from './features/features.svelte';
	import ContentSheet, { type SheetContent } from './content-sheet/content-sheet.svelte';
	import Tent from '@lucide/svelte/icons/tent';
	import CampaignInfo from './campaign-info.svelte';

	let sheetOpen = $state(false);
	let sheetContent = $state<SheetContent>(null);

	function openItemSheet(type: 'weapon' | 'armor' | 'consumable' | 'loot', id: string) {
		sheetContent = { type, id };
		sheetOpen = true;
	}

	function openAdventuringGearSheet() {
		sheetContent = { type: 'adventuring_gear' };
		sheetOpen = true;
	}

	function openExperienceSheet() {
		sheetContent = { type: 'experience' };
		sheetOpen = true;
	}

	function openCatalogSheet() {
		sheetContent = { type: 'catalog' };
		sheetOpen = true;
	}

	function openConditionsSheet() {
		sheetContent = { type: 'conditions' };
		sheetOpen = true;
	}

	function openDeathMoveSheet() {
		sheetContent = { type: 'death-move' };
		sheetOpen = true;
	}

	function openDowntimeSheet() {
		sheetContent = { type: 'downtime' };
		sheetOpen = true;
	}

	function openDomainCardCatalog() {
		sheetContent = { type: 'domain-card-catalog' };
		sheetOpen = true;
	}

	function openHeritageCardCatalog() {
		sheetContent = { type: 'heritage-card-catalog' };
		sheetOpen = true;
	}

	function openBeastformCatalog() {
		sheetContent = { type: 'beastform-catalog' };
		sheetOpen = true;
	}

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	const user = getUserContext();
	let character = $derived(context.character);

	let character_cards: (
		| AncestryCard
		| CommunityCard
		| TransformationCard
		| SubclassFoundationCard
		| SubclassSpecializationCard
		| SubclassMasteryCard
	)[] = $derived(
		[
			context.primary_class_mastery_level >= 1 && context.primary_subclass?.foundation_card,
			context.primary_class_mastery_level >= 2 && context.primary_subclass?.specialization_card,
			context.primary_class_mastery_level >= 3 && context.primary_subclass?.mastery_card,
			context.secondary_class_mastery_level >= 1 && context.secondary_subclass?.foundation_card,
			context.secondary_class_mastery_level >= 2 && context.secondary_subclass?.specialization_card,
			context.secondary_class_mastery_level >= 3 && context.secondary_subclass?.mastery_card,
			context.ancestry_card,
			context.community_card,
			context.transformation_card,
			...context.additional_ancestry_cards,
			...context.additional_community_cards,
			...context.additional_transformation_cards
		].filter((c) => !!c)
	);

	let character_cards_expanded = $state(true);

	let fileInput = $state<HTMLInputElement>();

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file || !character) return;

		// Convert file to base64
		const reader = new FileReader();
		reader.onload = async () => {
			const dataUrl = reader.result as string;
			// Remove the "data:image/...;base64," prefix
			const base64 = dataUrl.split(',')[1];

			try {
				const url = await user.upload_user_image({
					data: base64,
					name: file.name,
					type: file.type
				});
				character.image_url = url;
			} catch (error) {
				console.error('Failed to upload image:', error);
				alert('Failed to upload image. Please try again.');
			}

			// Reset the input so the same file can be selected again
			target.value = '';
		};
		reader.readAsDataURL(file);
	}

	function triggerImageUpload() {
		fileInput?.click();
	}

</script>

{#if character}
	<!-- Campaign Info Section - displayed at the very top when enabled -->
	{#if character.campaign_id && character.settings.show_campaign_info}
		<CampaignInfo />
	{/if}

	<div class={cn('flex flex-col gap-6', className)}>
		<!-- hidden file input for image upload -->
		<input
			disabled={!context.canEdit}
			bind:this={fileInput}
			type="file"
			accept="image/*"
			onchange={handleImageUpload}
			class="hidden"
		/>

		<!-- main content -->
		<div class="mx-auto flex w-full max-w-2xl min-w-[260px] flex-col gap-6">
			<!-- top bar -->
			<div class="flex gap-4 px-2 pr-3">
				<div class="relative grow truncate">
					<!-- level class subclass -->
					<div class="mt-4 mb-2.5 flex h-9 max-w-[400px] items-center truncate overflow-hidden">
						<a
							href={`/characters/${character.id}/class/`}
							
							class={cn("group relative grid h-full min-w-[72px] place-items-center overflow-hidden rounded-l-full border-b border-accent/10 bg-accent/10 pr-3 pl-4 text-xs font-medium text-accent hover:bg-accent/20", !context.canEdit && 'pointer-events-none')}
						>
							<span class="transition-transform duration-200 group-hover:-translate-y-[150%]">
								Level {character.level}
							</span>
							<span
								class="absolute inset-0 grid translate-y-full place-items-center text-xs font-medium transition-transform duration-200 group-hover:translate-y-0"
							>
								Level up?
							</span>
						</a>
						<Button
							href={`/characters/${character.id}/edit/`}
							class={cn(
								'h-full  justify-start gap-2 truncate  rounded-l-none rounded-r-full',
								'border-0 border-b',
								!context.canEdit && 'pointer-events-none'
							)}
							variant="outline"
						>
							<p class="truncate text-left text-xs">
								{context.primary_class?.name || 'No class'}
								&ensp;•&ensp;
								{context.primary_subclass?.name || 'No subclass'}
							</p>
							<div class="grow"></div>
							{#if context.canEdit}
								<Pencil class="mr-1 size-3 stroke-3" />
							{/if}
						</Button>
					</div>

					<div class="ml-1 flex gap-3">
						<!-- character image -->
						<button
							class={cn("group aspect-square h-[90px] w-[90px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition-colors hover:border-primary/50", !context.canEdit && 'pointer-events-none')}
							onclick={triggerImageUpload}
							disabled={!context.canEdit}
						>
							<img
								class="h-full w-full rounded-md object-cover"
								src={character.image_url}
								alt={character.name}
							/>
						</button>

						<!-- name and heritage -->
						<div class="flex grow flex-col gap-1 truncate">
							<p class="truncate text-2xl font-bold">{character.name}</p>
							<p class="mt-1 truncate text-xs text-muted-foreground">
								{context.ancestry_card?.title || 'No ancestry'}
							</p>
							<p class="truncate text-xs text-muted-foreground">
								{context.community_card?.title || 'No community'}
							</p>
						</div>
					</div>
				</div>

				<!-- class banner -->
				{#if context.primary_class}
					<Banner character_class={context.primary_class} />
				{/if}
			</div>

			<!-- rest & death moves -->
			<div class="-my-1 flex items-center justify-center gap-4">
				<Button variant="outline" onclick={openDowntimeSheet}>
					<Tent class="size-4" />
					Downtime
				</Button>

				<Conditions onConditionsClick={openConditionsSheet} />
			</div>

			<!-- traits -->
			<Traits traits={context.traits} class="mx-2" />

			<!-- evasion and armor -->
			<div class="mx-auto grid grid-cols-1 place-items-center gap-6 sm:grid-cols-[auto_auto]">
				<div class="flex gap-6">
					<Evasion />
					<ArmorSlots />
				</div>
				<DamageThresholds class="my-2" />
			</div>

			<!-- hp and stress -->
			<div class="mx-2 mt-2 flex flex-col justify-evenly gap-6 sm:flex-row">
				<Hp class="justify-center sm:justify-start" onDeathMove={openDeathMoveSheet} />
				<Stress class="justify-center sm:justify-start" />
			</div>

			<!-- hope -->
			<Hope class="my-1" />

			<!-- features tabs -->
			<Features
				class="mx-2"
				onItemClick={openItemSheet}
				onAdventuringGearClick={openAdventuringGearSheet}
				onExperienceClick={openExperienceSheet}
				onAddItems={openCatalogSheet}
				onBeastformCatalogClick={openBeastformCatalog}
			/>
		</div>

		<!-- Character cards -->
		<div class={cn(!character_cards_expanded && '-mb-4')}>
			<div class="mb-4 flex items-center justify-center gap-2">
				<button
					onclick={() => (character_cards_expanded = !character_cards_expanded)}
					class="z-20 flex items-center font-medium text-nowrap text-muted-foreground"
				>
					{#if character_cards_expanded}
						<ChevronDown class="w-k h-4" />
					{:else}
						<ChevronRight class="w-k h-4" />
					{/if}
					Character Cards
					<div
						class="ml-2 grid h-4.5 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-background"
					>
						{character_cards.length}
					</div>
				</button>
				{#if context.canEdit}
				<Button
					variant="ghost"
					size="sm"
					class="h-auto text-muted-foreground/50"
					onclick={openHeritageCardCatalog}><Pencil /></Button
				>
				{/if}
			</div>
			{#if character_cards_expanded}
				<CardCarousel cards={character_cards} emptyMessage="None" bind_token_count />
			{/if}
		</div>

		<!-- domain card loadout -->
		<Loadout {openDomainCardCatalog} />
	</div>

	<!-- Item/Experience detail sheet -->
	<ContentSheet bind:open={sheetOpen} content={sheetContent} />
{/if}
