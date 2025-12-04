<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
</script>

<div class={cn('rounded-md border-2 p-2 text-center', className)}>
	<p class="text-sm font-medium">Proficiency</p>
	<p class="text-lg font-bold ">
		{context.proficiency}
	</p>
</div>
