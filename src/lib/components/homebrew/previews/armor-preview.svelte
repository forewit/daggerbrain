<script lang="ts">
	import type { Armor } from '@convex/schemas/compendium';
	import ArmorDetails from '$lib/components/compendium-items/equipment/armor-details.svelte';
	import { level_to_tier } from '$lib/utils';

	let { armor }: { armor: Armor } = $props();
</script>

<div
	class="flex max-w-[500px] min-w-[300px] flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm"
>
	<div class="flex flex-col gap-1">
		<p class="text-lg font-medium">{armor.title || 'Unnamed armor'}</p>
		<p class="text-xs text-muted-foreground italic">
			Tier {level_to_tier(armor.level_requirement)} Armor
		</p>
	</div>

	<ArmorDetails {armor} />
</div>
