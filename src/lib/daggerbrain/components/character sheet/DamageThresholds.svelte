<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '' } = $props();
</script>

<div class={cn("w-64", className)}>
	<label for="damage-thresholds">Damage thresholds</label>
    <p>todo...</p>
</div>
