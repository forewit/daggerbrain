<script lang="ts">
	import type { Beastform } from '@shared/types/compendium.types';
	import BeastformCard from '$lib/components/app/cards/full-cards/beastform.svelte';

	let { beastform }: { beastform: Beastform } = $props();
</script>

<div class="flex max-w-[400px] min-w-[300px] rounded-lg bg-background p-4 shadow">
	<BeastformCard {beastform} preview show_choices />
</div>
