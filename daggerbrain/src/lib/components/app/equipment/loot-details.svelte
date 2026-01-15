<script lang="ts">
	import { renderMarkdown } from '$lib/utils';
	import type { Loot } from '@shared/types/compendium.types';

	let { loot }: { loot: Loot } = $props();
</script>

<div class="flex flex-col gap-4">
	<!-- Description -->
	{#if loot.description_html}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(loot.description_html)}
		</div>
	{/if}
</div>
