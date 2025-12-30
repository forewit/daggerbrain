<script lang="ts">
	import type { Armor } from '$lib/types/compendium-types';

	let { armor }: { armor: Armor } = $props();

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}
</script>

<div class="mx-auto flex w-[300px] flex-col gap-4 rounded-lg border p-4">
	<!-- Title and Subtitle -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{armor.title}</h3>
		<p class="text-xs text-muted-foreground italic">Tier {levelToTier(armor.level_requirement)} Armor</p>
	</div>

	<!-- Description -->
	{#if armor.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html armor.description_html}</p>
	{/if}

	<!-- Stats Table -->
	<table class="w-full border-collapse text-sm">
		<tbody>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Base Armor Score</th>
				<td class="py-2 text-right">{armor.max_armor}</td>
			</tr>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Base Damage Thresholds</th>
				<td class="py-2 text-right">
					{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
				</td>
			</tr>
		</tbody>
	</table>

	<!-- Features -->
	{#if armor.features.length > 0}
		<div class="rounded-lg border bg-primary/5 px-4 py-3">
			<div class="flex items-center justify-between">
				<p class="text-sm">Features</p>
			</div>
			<div class="mt-3 space-y-3">
				{#each armor.features as feature}
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="text-sm font-medium text-muted-foreground">{feature.title || 'Unnamed feature'}</p>
						<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

