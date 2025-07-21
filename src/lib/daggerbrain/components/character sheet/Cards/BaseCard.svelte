<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '', children } = $props();
</script>

<div class={cn("w-64", className)}>
	<label for="armor">BaseCard</label>
    <p>todo...</p>
	{@render children?.()}
</div>
