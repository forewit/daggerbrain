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
	import ClassFeatures from './class-features.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import { save_user_image } from '$lib/remote/images.remote';
	import Experiences from './experiences.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import CardCarousel from '../cards/card-carousel.svelte';
	import Loadout from './loadout.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import type {
		DomainCard,
		AncestryCard,
		CommunityCard,
		TransformationCard,
		SubclassFoundationCard,
		SubclassSpecializationCard,
		SubclassMasteryCard
	} from '$lib/types/compendium-types';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	let character_cards_expanded = $state(true);
	let character_cards: (
		| DomainCard
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
			...context.additional_domain_cards
		].filter((c) => !!c)
	);

	let fileInput = $state<HTMLInputElement>();

	async function handleImageUpload(event: Event) {
		if (!character) return;

		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		try {
			// Upload to R2 and get URL
			const url = await save_user_image(file);

			// Update character with R2 URL
			character.image_url = url;
		} catch (error) {
			console.error('Failed to upload image:', error);
			alert('Failed to upload image. Please try again.');
		}
	}

	function triggerImageUpload() {
		fileInput?.click();
	}
</script>

{#if character}
	<div class={cn('flex flex-col gap-6', className)}>
		<!-- hidden file input for image upload -->
		<input
			bind:this={fileInput}
			type="file"
			accept="image/*"
			onchange={handleImageUpload}
			class="hidden"
		/>

		<!-- main content -->
		<div class="mx-auto flex w-full max-w-2xl min-w-[260px] flex-col gap-6">
			<!-- top bar -->
			<div class="flex gap-2 px-2 pr-4">
				<div class="relative grow truncate">
					<!-- level class subclass -->
					<div class="mt-4 mb-2.5 flex h-9 max-w-[400px] items-center truncate overflow-hidden">
						<a
							href={`/characters/${character.id}/class/`}
							class="group relative grid h-full min-w-[72px] place-items-center overflow-hidden rounded-l-full border-b border-accent/10 bg-accent/10 pr-3 pl-4 text-xs font-medium text-accent hover:bg-accent/20"
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
							href={`/characters/${character.id}/class/`}
							class={cn(
								'h-full grow justify-start gap-2 truncate  rounded-l-none rounded-r-full',
								'border-0 border-b'
							)}
							variant="outline"
						>
							<p class="truncate text-left text-xs">
								{context.primary_class?.name || 'No class'}
								&ensp;•&ensp;
								{context.primary_subclass?.name || 'No subclass'}
							</p>
							<div class="grow"></div>
							<Pencil class="mr-1 size-3 stroke-3" />
						</Button>
					</div>

					<div class="ml-1 flex gap-3">
						<!-- character image -->
						<button
							class="group aspect-square h-[90px] w-[90px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition-colors hover:border-primary/50"
							onclick={triggerImageUpload}
						>
							<img
								class="h-full w-full rounded-md object-cover"
								src={character.image_url}
								alt={character.name}
							/>
						</button>

						<!-- name and heritage -->
						<div class="flex grow flex-col gap-2 truncate">
							<p class="truncate text-2xl font-bold">{character.name}</p>
							<p class="truncate text-xs text-muted-foreground">
								{context.ancestry_card?.title || 'No ancestry'}
								&ensp;•&ensp;
								{context.community_card?.title || 'No community'}
							</p>
							<p class="truncate text-xs text-muted-foreground">
								Proficiency: {context.proficiency}
							</p>
						</div>
					</div>
				</div>

				<!-- class banner -->
				{#if context.primary_class}
					<Banner character_class={context.primary_class} />
				{/if}
			</div>

			<!-- traits -->
			<Traits traits={context.traits} class="mx-2 " />

			<!-- evasion and armor -->
			<div
				class="mx-auto grid grid-cols-1 place-items-center gap-x-6 gap-y-2 sm:grid-cols-[auto_auto]"
			>
				<div class="flex gap-2">
					<Evasion />
					<ArmorSlots />
				</div>
				<DamageThresholds class="my-2" />
			</div>

			<!-- hp and stress -->
			<div class="mx-2 flex flex-col gap-2">
				<Hp class="justify-center sm:justify-start" />
				<Stress class="justify-center sm:justify-start" />
			</div>

			<!-- hope -->
			<Hope />

			<!-- class features -->
			{#if context.primary_class}
				<ClassFeatures character_class={context.primary_class} class="mx-2" />
			{/if}
			{#if context.secondary_class}
				<ClassFeatures character_class={context.secondary_class} class="mx-2" />
			{/if}

			<!-- experiences -->
			{#if character.experiences.some((experience) => experience !== '')}
				<Experiences class="mx-2" />
			{/if}
		</div>

		<!-- Character cards -->
		<div class={cn(!character_cards_expanded && '-mb-4')}>
			<button
				onclick={() => (character_cards_expanded = !character_cards_expanded)}
				class="z-20 mx-auto mb-4 flex items-center font-medium text-nowrap text-muted-foreground"
			>
				{#if character_cards_expanded}
					<ChevronDown class="w-k h-4" />
				{:else}
					<ChevronRight class="w-k h-4" />
				{/if}
				Character Cards
			</button>
			{#if character_cards_expanded}
				<CardCarousel cards={character_cards} emptyMessage="None" />
			{/if}
		</div>

		<!-- domain card loadout -->
		<Loadout />
	</div>
{/if}
