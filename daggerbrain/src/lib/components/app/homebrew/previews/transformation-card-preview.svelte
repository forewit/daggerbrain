<script lang="ts">
	import type { TransformationCard } from '$lib/types/compendium-types';
	import TransformationCardComponent from '$lib/components/app/cards/full-cards/transformation-card.svelte';

	let { card }: { card: TransformationCard } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<TransformationCardComponent {card} variant="responsive" />
</div>
