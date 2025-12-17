<script lang="ts">
	import type { Loot } from '$lib/types/compendium-types';

	let { loot }: { loot: Loot } = $props();
</script>

<div class="flex flex-col gap-4">
	<!-- Description -->
	{#if loot.description_html}
		<div class="text-sm text-muted-foreground">
			{@html loot.description_html}
		</div>
	{/if}
</div>
