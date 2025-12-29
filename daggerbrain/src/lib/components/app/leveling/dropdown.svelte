<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let {
		class: className = '',
		title = '',
		subtitle = '',
		disabled = false,
		highlighted = false,
		title_snippet = null,
		subtitle_snippet = null,
		children,
		open = $bindable(false)
	}: {
		class?: string;
		title?: string;
		title_snippet?: Snippet | null;
		subtitle?: string;
		subtitle_snippet?: Snippet | null;
		disabled?: boolean;
		highlighted?: boolean;
		children?: Snippet;
		open?: boolean;
	} = $props();
</script>

<div
	class={cn(
		'relative rounded-lg',
		highlighted && !disabled && 'outline-2 outline-offset-2 outline-primary',
		className
	)}
>
	<button
		type="button"
		class={cn(
			'relative z-10 flex h-14 w-full items-center truncate rounded-lg border-b bg-primary-muted px-4',
			disabled && 'pointer-events-none opacity-50'
		)}
		onclick={() => (open = !open)}
		{disabled}
	>
		<!-- title -->
		{#if title_snippet}
			{@render title_snippet?.()}
		{:else}
			<p class="text-lg font-medium">{title}</p>
		{/if}

		<!-- subtitle -->
		<div class="mr-3 ml-auto truncate pl-4">
			{#if subtitle_snippet}
				{@render subtitle_snippet?.()}
			{:else}
				<p class="truncate text-sm font-normal text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
		<ChevronLeft
			class={cn('size-5 shrink-0 text-muted-foreground transition-all', open && '-rotate-90')}
		/>
	</button>

	{#if open && !disabled}
		<div class="relative z-5 -mt-2 rounded-b-lg border-x border-b bg-primary/5 p-3 pt-6">
			{@render children?.()}
		</div>
	{/if}
</div>
