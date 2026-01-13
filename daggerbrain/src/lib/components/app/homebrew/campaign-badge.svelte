<script lang="ts">
	import Copyright from '@lucide/svelte/icons/copyright';
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

<Copyright class={cn('text-green-500', className)} />
