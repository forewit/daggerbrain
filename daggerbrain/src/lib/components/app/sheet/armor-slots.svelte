<script lang="ts">
	import { cn } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div class={cn('flex h-min gap-2 rounded-md border-2 p-2 text-center', className)}>
		<button onclick={() => (character.marked_armor = 0)}>
			<p class="text-lg font-bold">
				{context.max_armor}
			</p>
			<p class="text-sm font-medium">Armor</p>
		</button>
		<div
			class={cn(
				'my-auto grid grid-cols-4 place-items-center gap-x-1 gap-y-1.5',
				context.max_armor === 0 && 'hidden',
				context.max_armor < 7 && 'grid-cols-3',
				context.max_armor < 3 && 'grid-cols-2',
				context.max_armor < 2 && 'grid-cols-1'
			)}
		>
			{#each Array(context.max_armor) as _, index}
				<button
					aria-label="armor-slot"
					class="size-min rounded outline-offset-2"
					onclick={() => {
						if (index + 1 === character.marked_armor) {
							character.marked_armor = Math.max(0, character.marked_armor - 1);
						} else {
							character.marked_armor = index + 1;
						}
					}}
					type="button"
				>
					<Shield
						class="size-4 text-muted-foreground transition-all {index < character.marked_armor
							? 'fill-muted-foreground'
							: 'fill-transparent'}"
					/>
				</button>
			{/each}
		</div>
	</div>
{/if}
