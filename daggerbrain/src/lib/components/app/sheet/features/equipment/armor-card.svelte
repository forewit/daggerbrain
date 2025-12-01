<script lang="ts">
	import { cn } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';
	import type { Armor } from '$lib/types/compendium-types';

	let {
		armor,
		class: className = '',
		onclick
	}: { armor: Armor; class?: string; onclick?: () => void } = $props();
</script>

<tr
	class={cn('cursor-pointer text-xs', className)}
	onclick={(e) => {
		// Don't trigger onclick if clicking on interactive elements
		const target = e.target as HTMLElement;
		if (target.closest('button, [role="button"], select, input')) {
			return;
		}
		onclick?.();
	}}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
>
	<td class="px-4 py-2">{armor.title}</td>
	<td class="px-4 py-2 whitespace-nowrap">
		<div class="w-min mx-auto flex items-center gap-1 rounded-full border bg-foreground/5 px-2 py-1 text-xs">
			{armor.max_armor}<Shield class="size-3.5" />
		</div>
	</td>
	<td class="px-4 py-2 whitespace-nowrap">
		<div class="w-min mx-auto rounded-full border bg-foreground/5 px-2 py-1 text-xs">
			{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
		</div>
	</td>
	<td class="hidden px-4 py-2 text-xs sm:table-cell">
		<div class="w-min ml-auto text-right">
			{armor.features.map(f => f.title).join(', ') || '—'}
		</div>
	</td>
</tr>
