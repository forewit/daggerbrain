<script lang="ts">
	import type { Loot } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';

	let { loot }: { loot: Loot } = $props();
</script>

<Sheet.Header>
	<Sheet.Title>{loot.title}</Sheet.Title>
	<Sheet.Description>Loot</Sheet.Description>
</Sheet.Header>

<div class="space-y-2 py-4 text-sm">
	{#if loot.description_html}
		<div class="text-muted-foreground">{@html loot.description_html}</div>
	{:else}
		<p class="text-muted-foreground">No description available.</p>
	{/if}
</div>
