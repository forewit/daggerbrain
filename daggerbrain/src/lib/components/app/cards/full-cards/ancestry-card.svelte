<script lang="ts">
	import type { AncestryCard, AncestryCardChoice } from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ChoiceSelector from '$lib/components/app/leveling/secondary-options/choice-selector.svelte';

	let {
		bind_choice_select = false,
		card = $bindable(),
		class: className = '',
		variant = 'responsive',
		children
	}: {
		bind_choice_select?: boolean;
		card: AncestryCard;
		variant?: 'responsive' | 'card';
		class?: string;
		children?: Snippet;
	} = $props();

	let clientWidth = $state(360);

	const context = getCharacterContext();
	let character = $derived(context.character);

	let width = $state(300);
</script>

{#snippet choice_select(choice: AncestryCardChoice)}
	{#if character && card.choices.length > 0 && bind_choice_select}
		{@const conditional_choice_id = choice.conditional_choice?.choice_id || null}
		{@const conditional_selection_id = choice.conditional_choice?.selection_id || null}

		{#if character.ancestry_card_choices[choice.choice_id]}
			{#if choice.conditional_choice === null || (conditional_choice_id && conditional_selection_id && character.ancestry_card_choices[conditional_choice_id] && character.ancestry_card_choices[conditional_choice_id].includes(conditional_selection_id))}
				{#if choice.type === 'arbitrary'}
					<ChoiceSelector
						class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
						bind:selected_ids={character.ancestry_card_choices[choice.choice_id]}
						max={choice.max}
						options={choice.options}
						{width}
					/>
				{:else if choice.type === 'experience'}
					<ChoiceSelector
						class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
						bind:selected_ids={character.ancestry_card_choices[choice.choice_id]}
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
			'flex overflow-hidden rounded-xl border-2 border-accent bg-white text-black',
			className
		)}
	>
		<!-- image -->
		<div class="max-w-[180px] min-w-[60px] flex-1 border-r-2 border-accent">
			<img src={card.image_url} alt="art" class="h-full w-full object-cover" />
		</div>

		<!-- content -->
		<div class="flex flex-2 flex-col gap-2 px-3 py-2" bind:clientWidth={width}>
			<!-- title and community label -->
			<div class="relative flex justify-between gap-2">
				<p class="font-eveleth uppercase">
					{card.title}
				</p>

				<div class="h-min rounded bg-accent px-2 py-1 shadow-md">
					<p class=" text-xs font-bold tracking-[2px] text-black uppercase">Ancestry</p>
				</div>
			</div>

			<!-- description -->
			<p class="text-xs italic">
				{@html card.description_html}
			</p>

			<!-- features -->
			{#each card.features as feature}
				<p class="text-xs">
					<b><em>{feature.title}:</em></b>
					{@html feature.description_html}
				</p>
			{/each}

			<!-- choices -->
			{#each card.choices as choice}
				{@render choice_select(choice)}
			{/each}

			{@render children?.()}
		</div>
	</div>
{:else if variant === 'card'}
	<div
		class={cn('max-w-[360px] min-w-[140px] text-left', className)}
		style="height: {(clientWidth * 503) / 360}px;"
		bind:clientWidth
	>
		<div
			class="flex h-[503px] w-[360px] flex-col overflow-hidden rounded-[24px] border-[4px] border-accent bg-white transition-none"
			style="transform: scale({clientWidth / 360}); transform-origin: top left;"
		>
			<!-- image and divider -->
			<div
				class="relative -mb-[30px] max-h-[55%] grow"
				style="background-image: url({card.image_url}); background-size: cover; background-position: center;"
			>
				<img
					src="/images/card/dividers/ancestry-divider.png"
					alt="divider"
					class="absolute bottom-0 left-0 w-full object-cover"
				/>
				<p
					class="absolute right-[15px] bottom-[5px] text-[12px] leading-none font-bold tracking-[2px] text-black uppercase"
				>
					Ancestry
				</p>
			</div>

			<!-- content -->
			<div class="flex shrink-0 flex-col gap-[6px] px-[12px] pt-[14px] pb-[6px]">
				<p class="z-5 font-eveleth text-[26px] leading-none text-black uppercase">{card.title}</p>
				<p class="text-[12px] text-black italic">
					{@html card.description_html}
				</p>
				{#each card.features as feature}
					<p class="text-[12px] text-black">
						<b><em>{feature.title}:</em></b>
						{@html feature.description_html}
					</p>
				{/each}

				<!-- choices -->
				{#each card.choices as choice}
					{@render choice_select(choice)}
				{/each}
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
{/if}
