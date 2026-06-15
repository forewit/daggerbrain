<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = '',
		variant = 'tablet'
	}: { children?: Snippet; class?: string; variant?: 'tablet' | 'phone' } = $props();
</script>

{#if variant === 'tablet'}
	<div
		class={cn(
			'rounded-2xl border-8 border-black bg-black shadow-xl',
			'aspect-4/3 w-[350px] overflow-hidden',
			className
		)}
	>
		{@render children?.()}
	</div>
{:else if variant === 'phone'}
	<div
		class={cn(
			'shadow- rounded-2xl border-8 border-black bg-black',
			'aspect-1/2 w-[120px] overflow-hidden',
			className
		)}
	>
		{@render children?.()}
	</div>
{/if}
