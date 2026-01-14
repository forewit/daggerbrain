<script lang="ts">
	import type { Armor } from '@shared/types/compendium.types';
	import { level_to_tier } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';

	let { armor }: { armor: Armor } = $props();

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}
</script>

<div class="flex max-w-[300px] min-w-[300px] flex-col gap-4 rounded-lg bg-background p-4 shadow">
	<!-- Title and Subtitle -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{armor.title}</h3>
		<p class="text-xs text-muted-foreground italic">
			Tier {levelToTier(armor.level_requirement)} Armor
		</p>
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
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Base Damage Thresholds</th
				>
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
						<p class="text-sm font-medium text-muted-foreground">
							{feature.title || 'Unnamed feature'}
						</p>
						<p class="mt-0.5 text-xs text-muted-foreground">
							{@html renderMarkdown(feature.description_html)}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- armor inventory row preview -->
<div class="container h-min max-w-[500px] rounded-lg bg-background p-2 shadow">
	<table class="w-full border-collapse">
		<colgroup>
			<col />
			<col class="w-12" />
			<col class="w-29" />
			<col class="hidden w-20 @sm:table-column" />
		</colgroup>
		<thead>
			<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
				<th class="px-4 py-2 text-left">Armor</th>
				<th class="py-2 pr-4 text-center">Slots</th>
				<th class="py-2 pr-4 text-right @sm:text-center">Base Thresholds</th>
				<th class="hidden py-2 pr-4 text-right @sm:table-cell">Features</th>
			</tr>
		</thead>
		<tbody>
			<tr class="text-xs">
				<td class="px-4 py-2">
					<div class="flex items-center gap-1">
						{#if armor.compendium_id !== 'unarmored'}
							<div class="-mb-1">
								<p>{armor.title}</p>
								<p class="text-[10px] text-muted-foreground">
									Tier {level_to_tier(armor.level_requirement)}
								</p>
							</div>
						{:else}
							<p>{armor.title}</p>
						{/if}
					</div>
				</td>
				<td class="py-2 pr-4 whitespace-nowrap">
					<div class="mx-auto flex w-min items-center gap-1 rounded-full text-xs leading-none">
						{armor.max_armor}<Shield class="size-3.5" />
					</div>
				</td>
				<td class="py-2 pr-4 text-right whitespace-nowrap @sm:text-center">
					<div class="ml-auto w-min rounded-full text-xs @sm:mx-auto">
						{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
					</div>
				</td>
				<td class="hidden py-2 pr-4 text-right text-xs @sm:table-cell">
					<div class="ml-auto w-min text-right">
						{armor.features.map((f) => f.title).join(', ') || '—'}
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>
