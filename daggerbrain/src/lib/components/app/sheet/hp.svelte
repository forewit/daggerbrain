<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Skull from '@lucide/svelte/icons/skull';

	let { class: className = '', onDeathMove }: { class?: string; onDeathMove?: () => void } =
		$props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div class={cn('relative', className)}>
		<div class="flex items-center gap-4">
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
		</div>
		{#if context.max_hp === character.marked_hp}
			<Button
				onclick={() => {
					onDeathMove?.();
				}}
				size="sm"
				variant="ghost"
				class="absolute -bottom-8 left-1/2 -translate-x-1/2"
			>
				<Skull class="size-4" />
				Death move?
			</Button>
		{/if}
	</div>
{/if}
