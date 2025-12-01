<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
</script>

<div class={cn(className)}>
	{#if context.primary_class}
		<div class="flex flex-col gap-4">
			{#each context.primary_class?.class_features as feature}
				<div class="relative text-sm">
					<p class="pb-2 text-[1rem] font-medium">{feature.title}</p>
					<div class="flex flex-col gap-2 pl-2 leading-relaxed">
						{@html feature.description_html}
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if context.secondary_class}
		<div class="flex flex-col gap-4">
			{#each context.secondary_class?.class_features as feature}
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
