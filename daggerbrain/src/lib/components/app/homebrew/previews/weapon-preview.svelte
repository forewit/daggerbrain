<script lang="ts">
	import type { DamageTypes, Weapon } from '$lib/types/compendium-types';
	import { capitalize } from '$lib/utils';
	import Hand from '@lucide/svelte/icons/hand';

	let { weapon }: { weapon: Weapon } = $props();

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};
</script>

<div class="mx-auto flex w-[300px] flex-col gap-4 rounded-lg border p-4">
	<!-- Title and Subtitle -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{weapon.title}</h3>
		{#if weapon.category !== 'Unarmed'}
			<p class="text-xs text-muted-foreground italic">
				Tier {levelToTier(weapon.level_requirement)} {weapon.category} Weapon
			</p>
		{/if}
	</div>

	<!-- Description -->
	{#if weapon.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html weapon.description_html}</p>
	{/if}

	<!-- Stats Table -->
	<table class="w-full border-collapse text-sm">
		<tbody>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Range</th>
				<td class="py-2 text-right">{weapon.range}</td>
			</tr>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Trait</th>
				<td class="py-2 text-right">{weapon.available_traits.map(capitalize).join(' / ')}</td>
			</tr>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage</th>
				<td class="py-2 text-right">
					{weapon.damage_dice}{#if weapon.damage_bonus > 0}+{weapon.damage_bonus}{/if}
				</td>
			</tr>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage Type</th>
				<td class="py-2 text-right">
					{weapon.available_damage_types.map((t) => damageTypeMap[t]).join(' / ')}
				</td>
			</tr>
			<tr>
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Burden</th>
				<td class="py-2 text-right">
					{weapon.burden}
					<Hand class="-mt-0.5 ml-0.5 inline-block size-3.5" />
				</td>
			</tr>
		</tbody>
	</table>

	<!-- Features -->
	{#if weapon.features.length > 0}
		<div class="rounded-lg border bg-primary/5 px-4 py-3">
			<div class="flex items-center justify-between">
				<p class="text-sm">Features</p>
			</div>
			<div class="mt-3 space-y-3">
				{#each weapon.features as feature}
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="text-sm font-medium text-muted-foreground">{feature.title || 'Unnamed feature'}</p>
						<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

