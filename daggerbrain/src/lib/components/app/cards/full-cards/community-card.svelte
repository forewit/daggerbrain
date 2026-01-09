<script lang="ts">
	import type { CommunityCard } from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { Snippet } from 'svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		bind_token_count = false,
		card = $bindable(),
		class: className = '',
		variant = 'responsive',
		children
	}: {
		bind_token_count?: boolean;
		card: CommunityCard;
		variant?: 'responsive' | 'card';
		class?: string;
		children?: Snippet;
	} = $props();

	let clientWidth = $state(360);

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#snippet token_count()}
	{#if character && bind_token_count && card.tokens}
		{@const current_count = character.community_card_tokens || 0}
		<div class="flex items-center justify-center gap-2">
			<!-- Minus Button -->
			 {#if context.canEdit}
			<button
				type="button"
				onclick={() => {
					if (!character) return;
					const current = character.community_card_tokens || 0;
					character.community_card_tokens = Math.max(0, current - 1);
				}}
				disabled={current_count <= 0}
				class="flex size-7 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white shadow-md transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				aria-label="Decrease token count"
			>
				−
			</button>
			{/if}
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
			{#if context.canEdit}
			<button
				type="button"
				onclick={() => {
					if (!character) return;
					const current = character.community_card_tokens || 0;
					character.community_card_tokens = Math.min(99, current + 1);
				}}
				disabled={current_count >= 99}
				class="flex size-7 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white shadow-md transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				aria-label="Increase token count"
			>
				+
			</button>
			{/if}
		</div>
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
		<div class="max-w-[180px] min-w-[60px] flex-1 border-r-2 border-accent">
			<img src={card.image_url} alt="art" class="h-full w-full object-cover" />
		</div>

		<!-- content -->
		<div class="flex flex-2 flex-col gap-2 px-3 py-2">
			<!-- title and community label -->
			<div class="relative flex justify-between gap-2">
				<p class="font-eveleth uppercase">
					{card.title}
				</p>

				<div class="h-min rounded bg-accent px-2 py-1 shadow-md">
					<p class=" text-xs font-bold tracking-[2px] text-black uppercase">Community</p>
				</div>
			</div>

			<!-- description -->
			<p class="text-xs italic">
				{@html renderMarkdown(card.description_html)}
			</p>

			<!-- features -->
			{#each card.features as feature}
				<p class="text-xs">
					<b><em>{feature.title}:</em></b>
					{@html renderMarkdown(feature.description_html)}
				</p>
			{/each}

			<!-- token count -->
			{@render token_count()}

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
				class="relative max-h-[55%] shrink grow"
				style="background-image: url({card.image_url}); background-size: cover; background-position: center;"
			>
				<img
					src="/images/card/dividers/communities-divider.webp"
					alt="divider"
					class="absolute bottom-0 left-0 w-full object-cover"
				/>
				<p
					class="absolute right-[36px] bottom-[24px] text-[10px] leading-none font-medium tracking-[2px] text-black uppercase"
				>
					Community
				</p>
			</div>

			<!-- content -->
			<div class="flex shrink-0 flex-col gap-[6px] px-[12px] pt-[14px] pb-[6px]">
				<p class="z-5 font-eveleth text-[26px] leading-none text-black uppercase">{card.title}</p>
				<p class="text-[12px] text-black italic">
					{@html renderMarkdown(card.description_html)}
				</p>
				{#each card.features as feature}
					<p class="text-[12px] text-black">
						<b><em>{feature.title}:</em></b>
						{@html renderMarkdown(feature.description_html)}
					</p>
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
{/if}
