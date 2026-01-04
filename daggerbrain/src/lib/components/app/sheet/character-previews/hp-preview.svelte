<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		max_hp,
		marked_hp,
		class: className = ''
	}: {
		max_hp: number;
		marked_hp: number;
		class?: string;
	} = $props();
</script>

<div class={cn('relative flex items-center gap-4', className)}>
	<p class="text-sm font-medium">HP</p>
	<div class="flex flex-wrap gap-2">
		{#each Array(max_hp) as _, index}
			<div
				aria-label="hp-slot"
				class="h-3 w-6 rounded-md border border-muted-foreground {index < marked_hp
					? 'bg-muted-foreground'
					: 'bg-transparent'}"
			></div>
		{/each}
	</div>
</div>

