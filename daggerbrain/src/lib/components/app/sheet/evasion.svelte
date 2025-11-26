<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let evasion = $derived(context.evasion);
</script>

<div class={cn('w-[90px] rounded-md border-2 p-2 text-center', className)}>
	<p class="text-lg font-bold">
		{evasion}
	</p>
	<p class="text-sm font-medium">Evasion</p>
</div>
