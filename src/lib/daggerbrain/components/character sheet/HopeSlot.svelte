<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '' } = $props();
</script>

<div class={cn("w-64", className)}>
	<label for="hope">Hope</label>
	<input id="hope" type="number" class="border" />
</div>
