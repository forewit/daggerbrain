<script lang="ts">
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	let expanded = $state(true);
</script>

{#if character}
	<div
		class={cn(
			'relative flex flex-col gap-4 rounded-md border-2 p-4 text-left transition-all',
			className
		)}
	>
		<button
			onclick={() => (expanded = !expanded)}
			class="absolute -top-0 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center bg-background p-2 font-medium text-nowrap text-muted-foreground"
		>
			{#if expanded}
				<ChevronDown class="w-k h-4" />
			{:else}
				<ChevronRight class="w-k h-4" />
			{/if}
			Experiences
		</button>

		{#if expanded}
			<div class="flex flex-col gap-4">
				{#each character.experiences as experience, i}
					{#if experience.trim() !== ''}
						<p class="text-sm text-[1rem] font-medium">
							<span class="mr-3 ml-1 font-medium text-muted-foreground"
								>+{context.experience_modifiers[i]}</span
							>
							{experience}
						</p>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}
