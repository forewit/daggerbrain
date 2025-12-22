<script lang="ts">
	import { createEditingHeaderContext } from '$lib/state/editing-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let { children } = $props();

	const header = createEditingHeaderContext();
</script>

{#if header.title}
	<div class="w-full border-b bg-muted/30">
		<div class="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
			<Button href="/homebrew" variant="ghost" size="icon" class="shrink-0">
				<ChevronLeft class="size-5" />
			</Button>
			<div class="flex flex-col gap-0.5">
				<h1 class="text-xl font-semibold">{header.title}</h1>
				<p class="text-sm text-muted-foreground">{header.subtitle}</p>
			</div>
		</div>
	</div>
{/if}

{@render children?.()}
