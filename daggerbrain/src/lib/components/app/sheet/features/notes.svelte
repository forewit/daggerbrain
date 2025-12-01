<script lang="ts">
	import { cn } from '$lib/utils';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	let { class: className = '' }: { class?: string } = $props();

	let notes = $state('');
</script>

<div class={cn('flex flex-col gap-2', className)}>
	<p class="text-sm text-muted-foreground">Session notes (not saved)</p>
	<Textarea
		bind:value={notes}
		placeholder="Write your session notes here..."
		class="min-h-48 resize-y"
	/>
</div>
