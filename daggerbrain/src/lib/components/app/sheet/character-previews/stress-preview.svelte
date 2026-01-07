<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		max_stress,
		marked_stress,
		class: className = ''
	}: {
		max_stress: number;
		marked_stress: number;
		class?: string;
	} = $props();
</script>

<div class={cn('relative flex items-center gap-4', className)}>
	<p class="text-sm font-medium">STRESS</p>
	<div class="flex flex-wrap gap-2">
		{#each Array(max_stress) as _, index}
			<div
				aria-label="stress-slot"
				class="h-3 w-6 rounded-md border border-muted-foreground {index < marked_stress
					? 'bg-muted-foreground'
					: 'bg-transparent'}"
			></div>
		{/each}
	</div>
</div>
