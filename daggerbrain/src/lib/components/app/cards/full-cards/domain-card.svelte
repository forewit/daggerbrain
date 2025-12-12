<script lang="ts">
	import type { DomainCard, DomainCardChoice } from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import DomainBanner from '../domain-banner.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ChoiceSelector from '$lib/components/app/leveling/secondary-options/choice-selector.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	let {
		bind_choice_select = false,
		bind_token_count = false,
		card = $bindable(),
		class: className = '',
		variant = 'responsive',
		children
	}: {
		bind_choice_select?: boolean;
		bind_token_count?: boolean;
		card: DomainCard;
		variant?: 'responsive' | 'card';
		class?: string;
		children?: Snippet;
	} = $props();

	let clientWidth = $state(360);

	const context = getCharacterContext();
	let character = $derived(context?.character);

	const compendium = getCompendiumContext();

	let width = $state(300);
</script>

{#snippet token_count()}
	{#if character && bind_token_count && card.tokens}
		{@const current_count = character.domain_card_tokens[card.compendium_id] || 0}
		<div class="flex items-center justify-center gap-2">
			<!-- Minus Button -->
			<button
				type="button"
				onclick={() => {
					if (!character) return;
					const current = character.domain_card_tokens[card.compendium_id] || 0;
					character.domain_card_tokens[card.compendium_id] = Math.max(0, current - 1);
				}}
				disabled={current_count === 0}
				class="flex size-7 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white shadow-md transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				aria-label="Decrease token count"
			>
				−
			</button>

			<!-- Coin Stack -->
			<div class="relative flex items-center justify-center">
				<!-- Stack of coins (background coins) -->
				<div class="relative h-12 w-12">
					<!-- Bottom coin -->
					<div
						class="absolute inset-0 rounded-full border-2 border-yellow-700 bg-gradient-to-b from-yellow-400 to-yellow-600"
						style="transform: translate(2px, 4px);"
					></div>
					<!-- Middle coin -->
					<div
						class="absolute inset-0 rounded-full border-2 border-yellow-700 bg-gradient-to-b from-yellow-400 to-yellow-600"
						style="transform: translate(1px, 2px);"
					></div>
					<!-- Top coin with number -->
					<div
						class="absolute inset-0 flex items-center justify-center rounded-full border-2 border-yellow-700 bg-gradient-to-b from-yellow-300 to-yellow-500 shadow-lg"
					>
						<span class="text-sm font-bold text-yellow-900 drop-shadow-sm">
							{current_count}
						</span>
					</div>
				</div>
			</div>

			<!-- Plus Button -->
			<button
				type="button"
				onclick={() => {
					if (!character) return;
					const current = character.domain_card_tokens[card.compendium_id] || 0;
					character.domain_card_tokens[card.compendium_id] = Math.min(99, current + 1);
				}}
				disabled={current_count === 99}
				class="flex size-7 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white shadow-md transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				aria-label="Increase token count"
			>
				+
			</button>
		</div>
	{/if}
{/snippet}

{#snippet choice_select(choice: DomainCardChoice)}
	{#if character && card.choices.length > 0 && bind_choice_select}
		{@const conditional_choice_id = choice.conditional_choice?.choice_id || null}
		{@const conditional_selection_id = choice.conditional_choice?.selection_id || null}

		{#if character.domain_card_choices[card.compendium_id] && character.domain_card_choices[card.compendium_id][choice.choice_id]}
			{#if choice.conditional_choice === null || (conditional_choice_id && conditional_selection_id && character.domain_card_choices[card.compendium_id][conditional_choice_id] && character.domain_card_choices[card.compendium_id][conditional_choice_id].includes(conditional_selection_id))}
				{#if choice.type === 'arbitrary'}
					<ChoiceSelector
						class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
						bind:selected_ids={character.domain_card_choices[card.compendium_id][choice.choice_id]}
						max={choice.max}
						options={choice.options}
						{width}
					/>
				{:else if choice.type === 'experience'}
					<ChoiceSelector
						class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
						bind:selected_ids={character.domain_card_choices[card.compendium_id][choice.choice_id]}
						max={choice.max}
						options={character.experiences.map((exp, i) => {
							return {
								selection_id: i.toString(),
								title: exp,
								short_title: exp
							};
						})}
						term="Experience"
						term_plural="Experiences"
						{width}
					/>
				{/if}
			{:else}
				<!-- conditional choice not met -->
			{/if}
		{/if}
	{/if}
{/snippet}

{#if variant === 'responsive'}
	<div
		class={cn(
			'flex overflow-hidden rounded-xl border-2 border-accent bg-white text-left text-black',
			className
		)}
	>
		<!-- image -->
		<div class="relative max-w-[180px] min-w-[60px] flex-1 border-r-2 border-accent">
			<div
				class={cn(
					'absolute top-1 left-1  size-9.5 scale-90 rounded-full border-2 border-accent bg-gray-800 text-white shadow-lg',
					card.recall_cost > 9 && 'size-12'
				)}
			>
				<div
					class="flex size-full items-center justify-center rounded-full border border-gray-500 pb-0.5"
				>
					<p class="pt-1 pl-1 text-right text-lg font-medium">{card.recall_cost}</p>
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 16 16"
						class="size-3 shrink-0"
						height="1em"
						width="1em"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
						></path></svg
					>
				</div>
			</div>

			<img src={card.image_url} alt="art" class="h-full object-cover" />
		</div>

		<!-- content -->
		<div class="flex flex-2 flex-col gap-2 px-3 py-2" bind:clientWidth={width}>
			<!-- title and community label -->
			<div class="relative flex flex-row-reverse flex-wrap justify-between gap-2">
				<div class="mr-auto h-min rounded bg-accent px-2 py-1 shadow-md">
					<p class="text-xs font-bold tracking-[2px] text-black uppercase">{card.category}</p>
				</div>

				<p class="grow font-eveleth text-wrap uppercase">
					{card.title}
				</p>
			</div>

			<!-- features -->
			{#each card.features as feature}
				<div class="flex flex-col gap-2 text-xs">
					{@html feature.description_html}
				</div>
			{/each}

			<!-- choices -->
			{#each card.choices as choice}
				{@render choice_select(choice)}
			{/each}

			<!-- token count -->
			{@render token_count()}

			<!-- optional children -->
			{@render children?.()}
		</div>

		<!-- banner -->
		<div class="shrink-0">
			<DomainBanner
				domain_id={card.domain_id}
				level_requirement={card.level_requirement}
				style="zoom: 0.75"
			/>
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
					src="/images/card/dividers/domain-divider.png"
					alt="divider"
					class="absolute bottom-0 left-0 z-4 w-full object-cover"
				/>
				<DomainBanner
					domain_id={card.domain_id}
					level_requirement={card.level_requirement}
					class="absolute -top-[9px] left-[14px] w-[75px]"
				/>
				<div
					class={cn(
						'absolute top-[16px]  right-[16px] size-[38px] scale-90 rounded-full border-2 border-accent bg-gray-800 text-white',
						card.recall_cost > 9 && 'size-[48px]'
					)}
				>
					<div
						class="flex size-full items-center justify-center rounded-full border border-gray-500 pb-[2px]"
					>
						<p class="pt-[4px] pl-[4px] text-right text-[18px] font-medium">{card.recall_cost}</p>
						<svg
							stroke="currentColor"
							fill="currentColor"
							stroke-width="0"
							viewBox="0 0 16 16"
							class="size-[12px] shrink-0"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
							></path></svg
						>
					</div>
				</div>
				{#if compendium.domains[card.domain_id]}
					{@const domain = compendium.domains[card.domain_id]}
					<div
						style="background: {domain.color};"
						class="clip-card-type absolute bottom-[3px] left-[111px] h-[23px] w-[135px]"
					></div>
					<p
						style="color: {domain.foreground_color};"
						class="absolute bottom-[8px] left-[180px] z-5 -translate-x-1/2 text-[12px] leading-none font-bold uppercase"
					>
						{card.category}
					</p>
				{/if}
			</div>

			<!-- content -->
			<div
				class="z-5 -mt-[2px] flex shrink-0 flex-col gap-[12px] bg-white px-[12px] pt-[16px] pb-[6px]"
			>
				<p class="text-center font-eveleth text-[20px] leading-none text-black uppercase">
					{card.title}
				</p>

				{#each card.features as feature}
					<div class="flex flex-col gap-[12px] text-[12px] text-black">
						{@html feature.description_html}
					</div>
				{/each}

				{#each card.choices as choice}
					{@render choice_select(choice)}
				{/each}
				{@render token_count()}
			</div>

			<!-- credits -->
			<div class="mt-auto flex shrink-0 items-end px-3 pb-2 leading-none">
				<img src="/images/card/quill-icon.png" alt="quill" class="size-[14px]" />
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
