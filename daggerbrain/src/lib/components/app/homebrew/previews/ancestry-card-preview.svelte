<script lang="ts">
	import type { AncestryCard } from '@shared/types/compendium.types';
	import AncestryCardComponent from '$lib/components/app/cards/full-cards/ancestry-card.svelte';

	let { card }: { card: AncestryCard } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<AncestryCardComponent {card} variant="card" bind_choice_select preview />
</div>
