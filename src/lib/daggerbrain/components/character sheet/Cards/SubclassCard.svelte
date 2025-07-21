<script>
	import BaseCard from "./BaseCard.svelte";

	let {class:className = ""} = $props()
</script>
<BaseCard class={className}>Subclass Card...</BaseCard>