<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		max_stress,
		class: className = '',
		displayOnly = false,
		slotClasses = ''
	}: {
		max_stress: number;
		class?: string;
		displayOnly?: boolean;
		slotClasses?: string;
	} = $props();

	const context = getCharacterContext();
	const companion = $derived(context.character?.companion);
</script>

{#if companion}
	<div
		class={cn('relative flex items-center gap-4', displayOnly && 'pointer-events-none', className)}
	>
		<button
			onclick={() => {
				companion.marked_stress = 0;
			}}
			class="text-sm font-medium"
			type="button"
		>
			STRESS
		</button>
		<div class="flex flex-wrap gap-2">
			{#each Array(max_stress) as _, index}
				<button
					aria-label="companion-stress-slot"
					class={cn(
						'h-3 w-6 rounded-md border border-muted-foreground transition-colors',
						index < companion.marked_stress ? 'bg-muted-foreground' : 'bg-transparent',
						slotClasses
					)}
					onclick={() => {
						if (index + 1 === companion.marked_stress) {
							companion.marked_stress = Math.max(0, companion.marked_stress - 1);
						} else {
							companion.marked_stress = index + 1;
						}
					}}
					type="button"
				></button>
			{/each}
		</div>
	</div>
{/if}
