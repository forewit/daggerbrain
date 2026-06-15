<script lang="ts">
	import type { CommunityCard } from '@convex/schemas/compendium';
	import CommunityCardComponent from '$lib/components/compendium-items/cards/community-card.svelte';

	let { card }: { card: CommunityCard } = $props();

	let choices = $state({});
	let tokens = $state(0);
	let experiences = ['Example experience 1', 'Example experience 2'];
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<CommunityCardComponent
		enable_choices
		enable_tokens
		bind:choices
		bind:tokens
		{card}
		{experiences}
		variant="card"
	/>
</div>
