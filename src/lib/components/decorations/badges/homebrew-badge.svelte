<script lang="ts">
	import Anvil from '@lucide/svelte/icons/anvil';
	import { cn } from '$lib/utils';

	let {
		class: className = ''
	}: {
		class?: string;
	} = $props();
</script>

<Anvil class={cn('size-3.5 shrink-0 text-accent', className)} />
