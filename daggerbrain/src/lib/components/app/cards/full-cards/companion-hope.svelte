<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	const companion = $derived(context.character?.companion);
	const derived_companion = $derived(context.derived_companion);
</script>

{#if companion && derived_companion}
	<div class={cn('flex items-center gap-4', className)}>
		<button
			disabled={!context.canEdit}
			onclick={() => {
				companion.marked_hope = 0;
			}}
			class="text-sm font-medium text-accent"
			type="button"
		>
			HOPE
		</button>
		<div class="flex flex-wrap gap-2">
			{#each Array(derived_companion.max_hope) as _, index}
				<button
					disabled={!context.canEdit}
					aria-label="companion-hope-slot"
					class={cn(
						'aspect-square h-[16px] w-[16px] rotate-45 transform rounded-[2px] border border-accent transition-all duration-300',
						index < companion.marked_hope ? 'bg-accent' : 'bg-transparent',
						companion.marked_hope === derived_companion.max_hope &&
							'shadow-[0_0_8px_rgba(253,212,113,0.4),0_0_16px_rgba(253,212,113,0.2)]'
					)}
					onclick={() => {
						if (index + 1 === companion.marked_hope) {
							companion.marked_hope = Math.max(0, companion.marked_hope - 1);
						} else {
							companion.marked_hope = index + 1;
						}
					}}
					type="button"
				></button>
			{/each}
		</div>
	</div>
{/if}
