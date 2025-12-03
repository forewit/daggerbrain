<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';

	let { consumable }: { consumable: Consumable } = $props();
</script>

<Sheet.Header>
	<Sheet.Title>{consumable.title}</Sheet.Title>
	<Sheet.Description>Consumable</Sheet.Description>
</Sheet.Header>

<div class="space-y-2 py-4 text-sm">
	{#if consumable.description_html}
		<div class="text-muted-foreground">{@html consumable.description_html}</div>
	{:else}
		<p class="text-muted-foreground">No description available.</p>
	{/if}
</div>
