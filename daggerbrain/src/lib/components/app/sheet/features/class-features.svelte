<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
</script>

<div class={cn(className)}>
	{#if context.primary_class}
		<div class="flex flex-col gap-4">
			<div>
				<p class="pb-2 text-sm font-medium">{context.primary_class.hope_feature.title}</p>
				<div class="flex flex-col gap-2 pl-2 leading-relaxed text-xs text-muted-foreground">
					{@html context.primary_class.hope_feature.description_html}
				</div>
			</div>
			{#each context.primary_class?.class_features as feature}
				<div class="relative text-sm">
					<p class="pb-2 text-sm font-medium">{feature.title}</p>
					<div class="flex flex-col gap-2 pl-2 leading-relaxed text-xs text-muted-foreground">
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
					<p class="pb-2 text-sm font-medium">{feature.title}</p>
					<div class="flex flex-col gap-2 pl-2 leading-relaxed text-xs text-muted-foreground">
						{@html feature.description_html}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
