<script lang="ts">
	import type {
		DomainCard,
		AncestryCard,
		CommunityCard,
		TransformationCard,
		SubclassFoundationCard,
		SubclassSpecializationCard,
		SubclassMasteryCard
	} from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import AncestryCardComponent from './full-cards/ancestry-card.svelte';
	import CommunityCardComponent from './full-cards/community-card.svelte';
	import DomainCardComponent from './full-cards/domain-card.svelte';
	import TransformationCardComponent from './full-cards/transformation-card.svelte';
	import SubclassCardComponent from './full-cards/subclass-card.svelte';

	let {
		class: className = '',
		cards = $bindable(),
		cardWidth = $bindable(240),
		selectedIndex = $bindable(0),
		disabled_indices = new Set<number>(),
		highlighted_indices = new Set<number>(),
		bind_token_count = false,
		bind_choice_select = false,
		emptyMessage = ''
	}: {
		class?: string;
		cards: (
			| DomainCard
			| AncestryCard
			| CommunityCard
			| TransformationCard
			| SubclassFoundationCard
			| SubclassSpecializationCard
			| SubclassMasteryCard
		)[];
		cardWidth?: number;
		selectedIndex?: number;
		disabled_indices?: Set<number>;
		highlighted_indices?: Set<number>;
		bind_token_count?: boolean;
		bind_choice_select?: boolean;
		emptyMessage?: string;
	} = $props();

	let scrollContainer: HTMLDivElement;
	let containerWidth: number = $state(null!);
	function handleScroll() {
		if (cards.length === 0) {
			selectedIndex = -1;
			return;
		}
		const i = Math.round(scrollContainer.scrollLeft / cardWidth);
		selectedIndex = Math.max(Math.min(i, cards.length - 1), 0);
	}

	onMount(() => {
		if (scrollContainer) {
			//scrollContainer.scrollLeft = cardWidth;
			scrollContainer.addEventListener('scroll', handleScroll);
		}

		return () => {
			scrollContainer.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div
	bind:this={scrollContainer}
	bind:clientWidth={containerWidth}
	class={cn(
		'snap-x-mandatory relative flex snap-x items-center overflow-x-auto overflow-y-hidden p-2',
		className
	)}
	style="scrollbar-width:none;"
>
	<div
		class="h-2 shrink-0 snap-align-none"
		style="width: {(containerWidth - cardWidth) / 2}px;"
	></div>

	{#each cards as card, index (card.compendium_id)}
		<button
			class={cn(
				'transition-scale relative scale-95 snap-center rounded-xl duration-200',
				selectedIndex === index && 'scale-100',
				disabled_indices.has(index) && 'opacity-50'
			)}
			style="width: {cardWidth}px;"
			onclick={(e) => {
				let el = e.currentTarget as HTMLButtonElement;
				el.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center'
				});
			}}
		>
			<span
				class="absolute inset-0 rounded-2xl"
				style={cn(
					`width: ${cardWidth}px;`,
					highlighted_indices.has(index) &&
						'outline-offset: 2px; outline-width: 4px; outline-color: var(--primary); outline-style: solid;'
				)}
			></span>
			{#if card.card_type === 'domain'}
				<DomainCardComponent
					card={card as DomainCard}
					variant="card"
					bind_choice_select
					bind_token_count
				/>
			{:else if card.card_type === 'ancestry'}
				<AncestryCardComponent card={card as AncestryCard} variant="card" bind_choice_select />
			{:else if card.card_type === 'community'}
				<CommunityCardComponent card={card as CommunityCard} variant="card" bind_token_count />
			{:else if card.card_type === 'transformation'}
				<TransformationCardComponent card={card as TransformationCard} variant="card" />
			{:else if card.card_type === 'subclass_foundation' || card.card_type === 'subclass_specialization' || card.card_type === 'subclass_mastery'}
				<SubclassCardComponent
					card={card as SubclassFoundationCard | SubclassSpecializationCard | SubclassMasteryCard}
					variant="card"
				/>
			{/if}
		</button>
	{/each}

	{#if cards.length === 0}
		<div
			class="relative flex snap-center items-center justify-center rounded-2xl border-4 border-dotted border-muted"
			style="width: {cardWidth}px; height: {(cardWidth * 503) / 360}px;"
		>
			<p class="text-center font-eveleth text-lg text-muted">{emptyMessage}</p>
		</div>
	{/if}

	<div
		class="h-2 shrink-0 snap-align-none"
		style="width: {(containerWidth - cardWidth) / 2}px;"
	></div>
</div>
