<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		max_hope,
		marked_hope,
		class: className = ''
	}: {
		max_hope: number;
		marked_hope: number;
		class?: string;
	} = $props();
</script>

<div class={cn('flex items-center  gap-5 text-center', className)}>
	<p class="mx-auto w-min text-sm font-medium text-accent">HOPE</p>
	<div class="flex flex-wrap justify-center gap-4">
		{#each Array(max_hope) as _, index}
			<div
				aria-label="hope-slot"
				class={cn(
					'aspect-square h-[16px] w-[16px] rotate-45 transform rounded-[2px] border border-accent',
					index < marked_hope ? 'bg-accent' : 'bg-transparent',
					marked_hope === max_hope &&
						'shadow-[0_0_8px_rgba(253,212,113,0.4),0_0_16px_rgba(253,212,113,0.2)]'
				)}
			></div>
		{/each}
	</div>
</div>

