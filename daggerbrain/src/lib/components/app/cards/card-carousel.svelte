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
	import { onMount } from 'svelte';
	import AncestryCardComponent from './full-cards/ancestry-card.svelte';
	import CommunityCardComponent from './full-cards/community-card.svelte';
	import DomainCardComponent from './full-cards/domain-card.svelte';
	import TransformationCardComponent from './full-cards/transformation-card.svelte';
	import SubclassCardComponent from './full-cards/subclass-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronFirst from '@lucide/svelte/icons/chevron-first';
	import ChevronLast from '@lucide/svelte/icons/chevron-last';

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
	let mainContainer: HTMLDivElement;
	let containerWidth: number = $state(null!);
	let isShiftPressed = $state(false);
	let isHovered = $state(false);

	function handleScroll() {
		if (cards.length === 0) {
			selectedIndex = -1;
			return;
		}
		const i = Math.round(scrollContainer.scrollLeft / cardWidth);
		selectedIndex = Math.max(Math.min(i, cards.length - 1), 0);
	}

	function scrollToCard(index: number) {
		if (index < 0 || index >= cards.length || !scrollContainer) return;
		// Find the card button at the target index and scroll it into view
		const cardButtons = scrollContainer.querySelectorAll('button.snap-center');
		const targetButton = cardButtons[index] as HTMLButtonElement | undefined;
		
		if (targetButton) {
			targetButton.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			});
		}
	}

	function navigate(direction: 'next' | 'previous', useShift: boolean = false) {
		if (useShift) {
			scrollToCard(direction === 'next' ? cards.length - 1 : 0);
		} else {
			const targetIndex = direction === 'next' ? selectedIndex + 1 : selectedIndex - 1;
			if (targetIndex >= 0 && targetIndex < cards.length) {
				scrollToCard(targetIndex);
			}
		}
	}

	function scrollToPrevious(event?: MouseEvent) {
		navigate('previous', event?.shiftKey ?? false);
	}

	function scrollToNext(event?: MouseEvent) {
		navigate('next', event?.shiftKey ?? false);
	}

	let canScrollLeft = $derived(cards.length > 1 && selectedIndex > 0);
	let canScrollRight = $derived(cards.length > 1 && selectedIndex < cards.length - 1);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.shiftKey) {
			isShiftPressed = true;
		}
		
		if (!isHovered) return;
		
		const isArrowRight = event.key === 'ArrowRight';
		const isArrowLeft = event.key === 'ArrowLeft';
		
		if (isArrowRight || isArrowLeft) {
			event.preventDefault();
			event.stopPropagation();
			navigate(isArrowRight ? 'next' : 'previous', event.shiftKey);
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Shift' || !event.shiftKey) {
			isShiftPressed = false;
		}
	}

	function handleCardClick(event: MouseEvent) {
		const el = event.currentTarget as HTMLButtonElement;
		el.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		});
	}

	onMount(() => {
		scrollContainer?.addEventListener('scroll', handleScroll);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			scrollContainer?.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});
</script>


<div 
	class="relative" 
	bind:this={mainContainer}
	role="region"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
>


<div
	bind:this={scrollContainer}
	bind:clientWidth={containerWidth}
	class={cn(
		'py-2 snap-x-mandatory relative flex snap-x items-center overflow-x-auto overflow-y-hidden',
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
			onclick={handleCardClick}
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
			{:else if ['subclass_foundation', 'subclass_specialization', 'subclass_mastery'].includes(card.card_type)}
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

<div class="absolute top-1/2 right-0 left-0 -translate-y-1/2 flex justify-center">
	<div class="flex px-4 grow max-w-3xl items-center justify-between">
		<Button
			class="size-10 rounded-full mr-auto"
			hidden={!canScrollLeft}
			onclick={(e) => scrollToPrevious(e)}
		>
			{#if isShiftPressed}
				<ChevronFirst class="-ml-[1px] size-6" />
			{:else}
				<ChevronLeft class="-ml-[1px] size-6" />
			{/if}
		</Button>
		<Button
			class="size-10 rounded-full ml-auto"
			hidden={!canScrollRight}
			onclick={(e) => scrollToNext(e)}
		>
			{#if isShiftPressed}
				<ChevronLast class="-mr-[1px] size-6" />
			{:else}
				<ChevronRight class="-mr-[1px] size-6" />
			{/if}
		</Button>
	</div>
</div>
</div>