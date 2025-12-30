<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let { children } = $props();
</script>

<!-- <div class="w-full">
	<div class="mx-auto max-w-6xl pl-2">
		<Button href="/homebrew" variant="ghost" class="gap-1 pl-2 text-xs text-muted-foreground">
			<ChevronLeft class="size-3.5" />
			My Homebrew
		</Button>
	</div>
</div> -->

{@render children?.()}
