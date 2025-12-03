<script lang="ts">
	import Catalog from '../../equipment/catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
</script>

<Sheet.Header>
	<Sheet.Title>Add Items</Sheet.Title>
	<Sheet.Description>Browse and add items to your inventory</Sheet.Description>
</Sheet.Header>

<div class="px-4 pb-6 overflow-y-auto">
	<Catalog />
</div>

