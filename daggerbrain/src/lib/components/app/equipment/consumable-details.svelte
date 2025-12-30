<script lang="ts">
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { Consumable } from '$lib/types/compendium-types';

	let { consumable }: { consumable: Consumable } = $props();
</script>

<div class="flex flex-col gap-4">
	<!-- Description -->
	{#if consumable.description_html}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(consumable.description_html)}
		</div>
	{/if}
</div>
