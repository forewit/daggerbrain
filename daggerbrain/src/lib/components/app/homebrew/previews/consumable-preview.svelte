<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';
	import { renderMarkdown } from '$lib/utils/markdown';

	let { consumable }: { consumable: Consumable } = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px] flex-col gap-4 rounded-lg bg-background p-4 shadow">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{consumable.title}</h3>
		<p class="text-xs text-muted-foreground italic">Consumable</p>
	</div>

	<!-- Description -->
	{#if consumable.description_html.trim().length > 0}
		<p class="text-sm">{@html consumable.description_html}</p>
	{/if}
</div>

<!-- consumable inventory row preview -->
<div class="container h-min max-w-[500px] rounded-lg bg-background p-2 shadow">
	<table class="w-full border-collapse">
		<colgroup>
			<col />
			<col />
		</colgroup>
		<thead>
			<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
				<th class="px-4 py-2 text-left">Consumables</th>
				<th class="py-2 pr-4 text-right">Description</th>
			</tr>
		</thead>
		<tbody>
			<tr class="text-xs">
				<td class="px-4 py-2">
					{consumable.title}
				</td>
				<td class="py-2 pr-4 text-right">
					{#if consumable.description_html}
						<div class="text-muted-foreground">
							{@html renderMarkdown(consumable.description_html)}
						</div>
					{:else}
						<span class="text-muted-foreground">—</span>
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</div>
