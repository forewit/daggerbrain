<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		max_uses,
		marked_uses = $bindable(),
		class: className = '',
		slotClasses = '',
		disabled = false
	}: {
		max_uses: number;
		marked_uses: number;
		class?: string;
		slotClasses?: string;
		disabled?: boolean;
	} = $props();
</script>

<div class={cn('relative flex items-center gap-4', disabled && 'pointer-events-none', className)}>
	<button
		{disabled}
		onclick={() => {
			marked_uses = 0;
		}}
		class="text-sm font-medium">Relentless</button
	>
	<div class="flex flex-wrap gap-2">
		{#each Array(max_uses) as _, index}
			<button
				{disabled}
				aria-label="adversary-stress-slot"
				class={cn(
					'h-3 w-6 rounded-md border border-muted-foreground transition-colors',
					index < marked_uses ? 'bg-muted-foreground' : 'bg-transparent',
					slotClasses
				)}
				onclick={() => {
					if (index + 1 === marked_uses) {
						marked_uses = Math.max(0, marked_uses - 1);
					} else {
						marked_uses = index + 1;
					}
				}}
				type="button"
			></button>
		{/each}
	</div>
</div>
