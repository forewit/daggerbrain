<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../ui/button/button.svelte';

	let { class: className = '' } = $props();
</script>

<Button class={cn(className)}>Become and Adventurer</Button>
