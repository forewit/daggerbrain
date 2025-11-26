<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Class } from '$lib/types/compendium-types';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let { class: className = '', character_class }: { class?: string; character_class: Class } =
		$props();

	let expanded = $state(true);
</script>

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
		{character_class.name} Features
	</button>
	{#if expanded}
		<div class="flex flex-col gap-4">
			{#each character_class.class_features as feature}
				<div class="relative text-sm">
					<p class="pb-2 text-[1rem] font-medium">{feature.title}</p>
					<div class="flex flex-col gap-2 pl-2 leading-relaxed">
						{@html feature.description_html}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
