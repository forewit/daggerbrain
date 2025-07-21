<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '', children } = $props();
</script>

<button class={cn('w-64', className)}>
	{@render children?.()}
</button>
