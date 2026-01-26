<script lang="ts">
	import type { DomainCard } from '@shared/types/compendium.types';
	import DomainCardComponent from '$lib/components/app/cards/full-cards/domain-card.svelte';

	let { card }: { card: DomainCard } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<DomainCardComponent {card} variant="card" bind_choice_select bind_token_count preview />
</div>
