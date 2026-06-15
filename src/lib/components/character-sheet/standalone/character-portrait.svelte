<script lang="ts">
	import type { DeathState } from '@convex/schemas/characters';
	import Activity from '@lucide/svelte/icons/activity';
	import Flame from '@lucide/svelte/icons/flame';
	import Sword from '@lucide/svelte/icons/sword';
	import { cn } from '$lib/utils';

	let {
		src,
		alt,
		death_state,
		class: className = '',
		imageClass = ''
	}: {
		src: string;
		alt: string;
		death_state?: DeathState;
		class?: string;
		imageClass?: string;
	} = $props();
</script>

<div class={cn('relative overflow-hidden', className)}>
	<img
		{src}
		{alt}
		class={cn('h-full w-full object-cover', imageClass, death_state?.is_dead && 'saturate-20')}
	/>

	{#if death_state?.is_dead}
		<div
			class="absolute bottom-0 left-0 flex items-center gap-1 rounded-tr-lg bg-card px-2 py-[3px] pl-[5px] text-xs font-bold text-muted-foreground"
		>
			{#if death_state?.death_move === 'blaze_of_glory'}
				<Flame class="-mt-0.5 inline size-3.5 fill-current" />
			{:else if death_state?.death_move === 'risk_it_all'}
				<Sword class="inline size-3.5 fill-current" />
			{:else if death_state?.death_move === 'avoid_death'}
				<Activity class="inline size-3.5" />
			{/if}
			Dead
		</div>
	{/if}
</div>
