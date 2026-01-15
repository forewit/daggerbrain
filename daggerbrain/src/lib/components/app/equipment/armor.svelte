<script lang="ts">
	import { cn } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';
	import type { Armor } from '@shared/types/compendium.types';

	let { armor, class: className = '' }: { armor: Armor; class?: string } = $props();
</script>

<div
	class={cn(
		'flex min-h-10 items-center justify-end gap-3 rounded-md bg-card/50 px-4 py-2',
		className
	)}
>
	<p class="grow text-sm">{armor.title}</p>

	<div class="flex flex-wrap items-center justify-end gap-1">
		<div class="flex items-center gap-1 rounded-full bg-primary-muted px-2 py-1 text-xs">
			{armor.max_armor}<Shield class="size-3.5" />
		</div>
		<div class="rounded-full bg-primary-muted px-2 py-1 text-xs">
			{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
		</div>
	</div>
</div>
