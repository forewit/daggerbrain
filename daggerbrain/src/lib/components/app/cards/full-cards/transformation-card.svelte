<script lang="ts">
	import type { TransformationCard } from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { Snippet } from 'svelte';

	let {
		card = $bindable(),
		class: className = '',
		variant = 'responsive',
		children
	}: {
		card: TransformationCard;
		variant?: 'responsive' | 'card';
		class?: string;
		children?: Snippet;
	} = $props();

	let clientWidth = $state(360);
</script>

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
					<p class=" text-xs font-bold tracking-[2px] text-black uppercase">Transformation</p>
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
					src="/images/card/dividers/transformation-divider.avif"
					alt="divider"
					class="absolute bottom-0 left-0 w-full object-cover"
				/>
				<p
					class="absolute bottom-[27px] left-[24px] text-[9px] leading-none font-medium tracking-[2px] text-black uppercase"
				>
					Transformation
				</p>
			</div>

			<!-- content -->
			<div class="flex shrink-0 flex-col gap-[6px] px-[12px] pt-[8px] pb-[6px]">
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
