<script lang="ts">
	import type { DomainCard } from '$lib/types/compendium-types';
	import DomainCardComponent from '$lib/components/app/cards/full-cards/domain-card.svelte';

	let { card }: { card: DomainCard } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<DomainCardComponent {card} variant="responsive" />
</div>
