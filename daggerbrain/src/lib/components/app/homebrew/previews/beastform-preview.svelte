<script lang="ts">
	import type { Beastform } from '$lib/types/compendium-types';
	import BeastformCard from '$lib/components/app/cards/full-cards/beastform.svelte';

	let { beastform }: { beastform: Beastform } = $props();
</script>

<div class="mx-auto w-[300px]">
	<BeastformCard {beastform} />
</div>

