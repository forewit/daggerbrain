<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		class: className = '',
		displayOnly = false,
		slotClasses = ''
	}: {
		class?: string;
		displayOnly?: boolean;
		slotClasses?: string;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div
		class={cn(
			'flex h-12 items-center gap-4 rounded-md border-2 px-4',
			displayOnly && 'pointer-events-none',
			className
		)}
	>
		<button
			onclick={() => {
				character.marked_stress = 0;
			}}
			class="text-sm font-medium">STRESS</button
		>
		<div class="flex flex-wrap gap-2">
			{#each Array(context.max_stress) as _, index}
				<button
					aria-label="character.stress-slot"
					class={cn(
						'h-3 w-6 rounded-md border border-muted-foreground transition-colors',
						index < character.marked_stress ? 'bg-muted-foreground' : 'bg-transparent',
						slotClasses
					)}
					onclick={() => {
						if (index + 1 === character.marked_stress) {
							character.marked_stress = Math.max(0, character.marked_stress - 1);
						} else {
							character.marked_stress = index + 1;
						}
					}}
					type="button"
				></button>
			{/each}
		</div>

		{#if context.max_stress === character.marked_stress && !displayOnly}
			<button
				onclick={() => {
					if (character.marked_hp < context.max_hp) character.marked_hp++;
				}}
				class="grid place-items-center rounded-md bg-border p-2 text-xs leading-none text-nowrap hover:bg-muted-foreground/20"
			>
				Mark HP
			</button>
		{/if}
	</div>
{/if}
