<script lang="ts">
	import Catalog from '../../equipment/catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { getCharacterContext } from '$lib/state/character.svelte';

	const context = getCharacterContext();
</script>

{#if context.canEdit}
	<Sheet.Header>
		<Sheet.Title>Add Items</Sheet.Title>
		<Sheet.Description>Browse and add items to your inventory</Sheet.Description>
	</Sheet.Header>

	<div class="overflow-y-auto px-4 pb-6">
		<Catalog />
	</div>
{/if}
