<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';

	let { consumable }: { consumable: Consumable } = $props();
</script>

<div class="mx-auto flex w-[300px] flex-col gap-4 rounded-lg border p-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{consumable.title}</h3>
	</div>

	<!-- Description -->
	{#if consumable.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html consumable.description_html}</p>
	{/if}
</div>

