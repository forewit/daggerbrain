<script lang="ts">
	import type {
		SubclassFoundationCard,
		SubclassSpecializationCard,
		SubclassMasteryCard
	} from '@shared/types/compendium.types';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import ClassBanner from '../class-banner.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	let {
		card = $bindable(),
		class: className = '',
		children,
		hideImage = false,
		variant = 'responsive'
	}: {
		card: SubclassFoundationCard | SubclassSpecializationCard | SubclassMasteryCard;
		class?: string;
		children?: Snippet;
		hideImage?: boolean;
		variant?: 'responsive' | 'card';
	} = $props();

	let clientWidth = $state(360);

	const compendium = getCompendiumContext();

	// Explicitly track card.class_id to ensure reactivity when it changes
	const character_class = $derived.by(() => {
		card.class_id; // Track the nested property
		return compendium.classes[card.class_id] || null;
	});
</script>

{#if variant === 'responsive'}
	<div
		class={cn(
			'flex overflow-hidden rounded-xl border-2 border-accent bg-white text-black',
			className
		)}
	>
		<!-- image -->
		{#if !hideImage}
			<div class="max-w-[180px] flex-1 border-r-2 border-accent">
				<img src={card.image_url} alt="art" class="h-full object-cover" />
			</div>
		{/if}

		<!-- content -->
		<div class="flex flex-2 flex-col gap-2 px-3 py-2">
			<!-- title and community label -->
			<div class="relative flex flex-row-reverse flex-wrap gap-x-2 gap-y-3">
				<div class="mx-auto h-min rounded bg-accent px-2 py-1 shadow-md">
					<p class="text-xs font-bold tracking-[2px] text-black uppercase">
						{card.description_html}
					</p>
				</div>

				<p class="grow font-eveleth uppercase">
					{card.title}
				</p>
			</div>

			<!-- spellcast trait -->
			{#if card.card_type === 'subclass_foundation' && (card as SubclassFoundationCard).spellcast_trait}
				<p class="text-center text-xs">
					<b><em>Spellcast Trait:</em></b>
					{(card as SubclassFoundationCard).spellcast_trait}
				</p>
			{/if}

			<!-- features -->
			{#each card.features as feature}
				<p class="text-xs">
					<b><em>{feature.title}:</em></b>
					{@html renderMarkdown(feature.description_html)}
				</p>
			{/each}
			{@render children?.()}
		</div>
	</div>
{:else if variant === 'card'}
	<div
		class={cn('max-w-[360px] min-w-[140px]', className)}
		style="height: {(clientWidth * 503) / 360}px;"
		bind:clientWidth
	>
		<div
			class="flex h-[503px] w-[360px] flex-col overflow-hidden rounded-[24px] border-[4px] border-accent bg-white text-left transition-none"
			style="transform: scale({clientWidth / 360}); transform-origin: top left;"
		>
			<!-- image and divider -->
			<div
				class="relative max-h-[55%] grow"
				style="background-image: url({card.image_url}); background-size: cover; background-position: center;"
			>
				<img
					src="/images/card/dividers/subclass-divider.png"
					alt="divider"
					class="absolute bottom-0 left-0 z-4 w-full object-cover"
				/>
				{#if character_class}
					<ClassBanner {character_class} class="absolute -top-[2px] left-[14px] w-[75px]" />

					{#if compendium.domains[character_class.primary_domain_id] && compendium.domains[character_class.secondary_domain_id]}
						{@const primaryDomain = compendium.domains[character_class.primary_domain_id]}
						{@const secondaryDomain = compendium.domains[character_class.secondary_domain_id]}
						<div
							style="background: linear-gradient(to right, {primaryDomain.color}, {secondaryDomain.color});"
							class="clip-card-type absolute bottom-[5px] left-[110px] h-[21px] w-[129px]"
						></div>
					{/if}
					<p
						class="absolute bottom-[9px] left-[175px] z-5 -translate-x-1/2 text-[12px] leading-none font-bold text-white uppercase"
					>
						{character_class.name}
					</p>
				{/if}
			</div>

			<!-- content -->
			<div
				class="z-5 -mt-[2px] flex shrink-0 flex-col gap-[12px] bg-white px-[12px] pt-[16px] pb-[6px]"
			>
				<div class="flex flex-col gap-[4px]">
					<p class="text-center font-eveleth text-[20px] leading-none text-black uppercase">
						{card.title}
					</p>

					<p class="text-center text-[14px] text-black italic">
						{@html renderMarkdown(card.description_html)}
					</p>

					{#if card.card_type === 'subclass_foundation' && (card as SubclassFoundationCard).spellcast_trait}
						<p class="text-center text-[14px] text-black uppercase">
							<b>Spellcast Trait:</b>
							{(card as SubclassFoundationCard).spellcast_trait}
						</p>
					{/if}
				</div>

				{#each card.features as feature}
					<p class="text-[12px] text-black">
						{@html renderMarkdown(feature.description_html)}
					</p>
				{/each}
			</div>

			<!-- credits -->
			<div class="mt-auto flex shrink-0 items-end px-3 pb-2 leading-none">
				<img
					src="/images/card/quill-icon.png"
					alt="quill"
					class={cn('size-[14px]', card.artist_name.trim() === '' && 'hidden')}
				/>
				<p class="grow text-[9px] text-black italic">{card.artist_name}</p>
				<p class="px-[2px] text-[8px] text-black text-muted-foreground italic">
					Daggerheart™ Compatible. Terms at Daggerheart.com
				</p>
				<img src="/images/card/cgl-logo.svg" alt="CGL" class="size-[16px]" />
			</div>
		</div>
	</div>

	<style>
		.clip-card-type {
			clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
		}
	</style>
{/if}
