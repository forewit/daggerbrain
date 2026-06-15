<script lang="ts">
	import { cn } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		class: className = '',
		onclick
	}: {
		class?: string;
		onclick?: () => void;
	} = $props();

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);

	// Look up the armor from inventory
	const derived_unarmored = $derived(derived_character_data?.derived_unarmored);
</script>

{#if derived_unarmored}
	<tr
		class={cn('@container cursor-pointer text-xs', className)}
		onclick={(e) => {
			// Don't trigger onclick if clicking on interactive elements (but allow the row itself)
			const target = e.target as HTMLElement;
			const interactive = target.closest('button, select, input');
			if (interactive && interactive !== e.currentTarget) {
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
		<td class="px-4 py-2">
			{derived_unarmored.title}
		</td>
		<td class="py-2 pr-4 whitespace-nowrap">
			<div class="mx-auto flex w-min items-center gap-1 rounded-full text-xs leading-none">
				{derived_unarmored.max_armor}<Shield class="size-3.5" />
			</div>
		</td>
		<td class="py-2 pr-4 text-right whitespace-nowrap @lg:text-center">
			<div class="ml-auto w-min rounded-full text-xs @lg:mx-auto">
				{derived_unarmored.damage_thresholds.major} / {derived_unarmored.damage_thresholds.severe}
			</div>
		</td>
		<td class="hidden py-2 pr-4 text-right text-xs @lg:table-cell">
			<div class="ml-auto w-min text-right">
				{derived_unarmored.features.map((f) => f.title).join(', ') || '—'}
			</div>
		</td>
	</tr>
{/if}
