<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '', onDeathMove }: { class?: string; onDeathMove?: () => void } =
		$props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div class={cn('flex items-center gap-4 rounded-md border-2 px-4 py-2', className)}>
		<button
			onclick={() => {
				character.marked_hp = 0;
			}}
			class="text-sm font-medium">HP</button
		>
		<div class="flex flex-wrap gap-2">
			{#each Array(context.max_hp) as _, index}
				<button
					aria-label="hp-slot"
					class="h-3 w-6 rounded-md border border-muted-foreground {index < character.marked_hp
						? 'bg-muted-foreground'
						: 'bg-transparent'} transition-colors"
					onclick={() => {
						if (index + 1 === character.marked_hp) {
							character.marked_hp = Math.max(0, character.marked_hp - 1);
						} else {
							character.marked_hp = index + 1;
						}
					}}
					type="button"
				></button>
			{/each}
		</div>

		{#if context.max_hp === character.marked_hp}
			<button
				onclick={() => {
					onDeathMove?.();
				}}
				class="grid place-items-center rounded-md bg-border p-2 text-xs leading-none text-nowrap hover:bg-muted-foreground/20"
			>
				Death Move
			</button>
		{/if}
	</div>
{/if}
