<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '' } = $props();
</script>

<div class={cn("w-64", className)}>
	<label for="evasion">evasion</label>
	<input id="evasion" type="number" class="border" />
</div>
