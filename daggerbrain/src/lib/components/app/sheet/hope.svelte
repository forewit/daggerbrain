<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div class={cn('flex flex-col justify-center gap-2 text-center', className)}>
		<button
			onclick={() => {
				character.marked_hope = 0;
			}}
			class="text-sm font-medium text-accent">HOPE</button
		>
		<div class="mb-2 flex flex-wrap justify-center gap-4">
			{#each Array(context.max_hope) as _, index}
				<button
					aria-label="hope-slot"
					class={cn(
						'aspect-square h-[16px] w-[16px] rotate-45 transform rounded-[2px] border border-accent transition-all duration-300',
						index < character.marked_hope ? 'bg-accent' : 'bg-transparent',
						character.marked_hope === context.max_hope &&
							'shadow-[0_0_8px_rgba(253,212,113,0.4),0_0_16px_rgba(253,212,113,0.2)]'
					)}
					onclick={() => {
						if (index + 1 === character.marked_hope) {
							character.marked_hope = Math.max(0, character.marked_hope - 1);
						} else {
							character.marked_hope = index + 1;
						}
					}}
					type="button"
				></button>
			{/each}
		</div>

		{#if context.primary_class}
			<p class="flex items-center justify-center text-xs text-muted-foreground">
				<span class="mr-1 text-xs font-medium text-foreground"
					>{context.primary_class.hope_feature.title}:</span
				>
				{@html context.primary_class.hope_feature.description_html}
			</p>
		{/if}
	</div>
{/if}
