<script lang="ts">
	import type { Weapon } from '$lib/types/compendium-types';

	let { weapon }: { weapon: Weapon } = $props();
</script>

<div class="space-y-2 text-sm">
	<p><span class="text-muted-foreground">Category:</span> {weapon.category}</p>
	<p><span class="text-muted-foreground">Range:</span> {weapon.range}</p>
	<p><span class="text-muted-foreground">Damage:</span> {weapon.damage_dice}</p>
</div>
