<script lang="ts">
	import type { TransformationCard } from '@convex/schemas/compendium';
	import TransformationCardComponent from '$lib/components/compendium-items/cards/transformation-card.svelte';

	let { card }: { card: TransformationCard } = $props();

	let choices = $state({});
	let tokens = $state(0);
	let experiences = ['Example experience 1', 'Example experience 2'];
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<TransformationCardComponent
		enable_choices
		enable_tokens
		bind:choices
		bind:tokens
		{card}
		{experiences}
		variant="card"
	/>
</div>
