<script lang="ts">
	import type { Armor } from '$lib/types/compendium-types';

	let { armor }: { armor: Armor } = $props();
</script>

<div class="space-y-2 text-sm">
	<p><span class="text-muted-foreground">Armor Slots:</span> {armor.max_armor}</p>
	<p>
		<span class="text-muted-foreground">Thresholds:</span>
		{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
	</p>
</div>
