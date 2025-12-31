<script lang="ts">
	import type { CommunityCard } from '$lib/types/compendium-types';
	import CommunityCardComponent from '$lib/components/app/cards/full-cards/community-card.svelte';

	let { card }: { card: CommunityCard } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px]">
	<CommunityCardComponent {card} variant="responsive" />
</div>
