<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		size = 'sm',
		variant = 'outline',
		disabled = false,
		onBeforeRevive,
		onAfterRevive,
		children
	}: {
		class?: string;
		size?: 'sm' | 'default' | 'lg' | 'icon';
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		disabled?: boolean;
		onBeforeRevive?: () => void;
		onAfterRevive?: () => void;
		children?: Snippet;
	} = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const canEdit = $derived(characterCtx.canEdit);

	function revive() {
		if (!character || !character.death_state || !canEdit || disabled) return;

		onBeforeRevive?.();
		const totalHopeSlots = (characterCtx.derived_character_data?.max_hope ?? 0) + character.scars;
		if (totalHopeSlots > 0 && character.scars >= totalHopeSlots) {
			characterCtx.removeScar();
		}
		character.death_state = undefined;

		onAfterRevive?.();
	}
</script>

{#if canEdit}
	<Button
		{variant}
		{size}
		class={cn(className)}
		disabled={disabled || !character?.death_state}
		onclick={revive}
	>
		{@render children?.()}
	</Button>
{/if}
