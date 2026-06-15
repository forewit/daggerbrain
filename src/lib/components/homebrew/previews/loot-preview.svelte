<script lang="ts">
	import type { Loot } from '@convex/schemas/compendium';
	import { renderMarkdown } from '$lib/utils';

	let { loot }: { loot: Loot } = $props();
</script>

<div
	class="flex max-w-[500px] min-w-[300px] flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm"
>
	<div class="flex flex-col gap-1">
		<p class="text-lg font-medium">{loot.title || 'Unnamed loot'}</p>
		<p class="text-xs text-muted-foreground italic">Loot</p>
	</div>

	{#if loot.description_html.trim().length > 0}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(loot.description_html)}
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-3">
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
				Character Modifiers
			</p>
			<p class="text-sm">{loot.character_modifiers.length}</p>
		</div>
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
				Weapon Modifiers
			</p>
			<p class="text-sm">{loot.weapon_modifiers.length}</p>
		</div>
	</div>
</div>
