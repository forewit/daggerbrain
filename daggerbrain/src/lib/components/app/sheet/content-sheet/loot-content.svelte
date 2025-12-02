<script lang="ts">
	import type { Loot } from '$lib/types/compendium-types';

	let { loot }: { loot: Loot } = $props();
</script>

<div class="space-y-2 text-sm">
	{#if loot.description_html}
		<div class="text-muted-foreground">{@html loot.description_html}</div>
	{:else}
		<p class="text-muted-foreground">No description available.</p>
	{/if}
</div>
