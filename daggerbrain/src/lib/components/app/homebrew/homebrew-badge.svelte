<script lang="ts">
	import Anvil from '@lucide/svelte/icons/anvil';
	import { cn } from '$lib/utils';

	type HomebrewType =
		| 'weapon'
		| 'armor'
		| 'beastform'
		| 'loot'
		| 'consumable'
		| 'class'
		| 'subclass'
		| 'ancestry-cards'
		| 'community-cards'
		| 'transformation-cards'
		| 'domain-cards';

	let {
		type,
		id,
		class: className = ''
	}: {
		type?: HomebrewType;
		id?: string;
		class?: string;
	} = $props();
</script>

<Anvil class={cn('text-accent', className)} />
