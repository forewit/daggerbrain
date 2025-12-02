<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';

	let { consumable }: { consumable: Consumable } = $props();
</script>

<div class="space-y-2 text-sm">
	{#if consumable.description_html}
		<div class="text-muted-foreground">{@html consumable.description_html}</div>
	{:else}
		<p class="text-muted-foreground">No description available.</p>
	{/if}
</div>
