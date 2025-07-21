<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '' } = $props();
</script>

<div class={cn("w-64", className)}>
	<label for="armor">armor</label>
	<input id="armor" type="number" class="border" />
</div>
