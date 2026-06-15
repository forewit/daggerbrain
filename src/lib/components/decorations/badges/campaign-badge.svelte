<script lang="ts">
	import Copyright from '@lucide/svelte/icons/copyright';
	import { cn } from '$lib/utils';

	let {
		class: className = ''
	}: {
		class?: string;
	} = $props();
</script>

<Copyright class={cn('text-green-500', className)} />
