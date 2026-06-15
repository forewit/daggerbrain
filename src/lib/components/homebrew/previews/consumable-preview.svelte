<script lang="ts">
	import type { Consumable } from '@convex/schemas/compendium';
	import { renderMarkdown } from '$lib/utils';

	let { consumable }: { consumable: Consumable } = $props();
</script>

<div
	class="flex max-w-[500px] min-w-[300px] flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm"
>
	<div class="flex flex-col gap-1">
		<p class="text-lg font-medium">{consumable.title || 'Unnamed consumable'}</p>
		<p class="text-xs text-muted-foreground italic">Consumable</p>
	</div>

	{#if consumable.description_html.trim().length > 0}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(consumable.description_html)}
		</div>
	{/if}
</div>
