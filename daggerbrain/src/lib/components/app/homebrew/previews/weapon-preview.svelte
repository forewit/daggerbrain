<script lang="ts">
	import type { DamageTypes, Weapon } from '$lib/types/compendium-types';
	import { capitalize, applyProficiencyToDice, level_to_tier } from '$lib/utils';
	import Hand from '@lucide/svelte/icons/hand';
	import WeaponRow from '../../sheet/features/equipment/weapon-row.svelte';
	import { TRAITS } from '$lib/types/rules';

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

	// For preview: use first available trait and damage type, proficiency = 1
	const currentTrait = weapon.available_traits[0] || null;
	const currentDamageType = weapon.available_damage_types[0] || null;
	const proficiency = 1; // Default for preview

	// Calculate to hit: just weapon attack_roll_bonus (no trait bonus in preview)
	const toHit = weapon.attack_roll_bonus;
	const formattedToHit = toHit >= 0 ? `+${toHit}` : `${toHit}`;

	// Format damage (with proficiency = 1, so no change)
	const diceWithProficiency = applyProficiencyToDice(weapon.damage_dice, proficiency);
	const formattedDamage = `${diceWithProficiency}${weapon.damage_bonus > 0 ? '+' + weapon.damage_bonus : ''}${currentDamageType ? ' ' + currentDamageType : ''}`;
</script>


<!-- weapon content preview -->
<div class="flex min-w-[300px] max-w-[300px] flex-col gap-4 p-4 rounded-lg shadow bg-background">
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

<!-- weapon inventory row preview -->
<div class="container max-w-[500px] p-2 bg-background shadow rounded-lg h-min">
	<table class="w-full border-collapse">
		<colgroup>
			<col />
			<col class="w-16" />
			<col class="w-18" />
			<col class="w-18" />
			<col class="hidden w-20 @sm:table-column" />
		</colgroup>
		<thead>
			<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
				<th class="px-4 py-2 text-left">Weapons</th>
				<th class="py-2 pr-4 text-center">Range</th>
				<th class="py-2 pr-4 text-center">Hit</th>
				<th class="py-2 pr-4 text-right @sm:text-center">Damage</th>
				<th class="hidden py-2 pr-4 text-right @sm:table-cell">Features</th>
			</tr>
		</thead>
		<tbody>
			<tr class="text-xs">
				<td class="px-4 py-2">
					<div class="flex items-center gap-1">
						{#if weapon.category !== 'Unarmed'}
							<div class="-mb-1">
								<p>{weapon.title}</p>
								<p class="text-[10px] text-muted-foreground">
									Tier {level_to_tier(weapon.level_requirement)} {weapon.category.toLocaleLowerCase()}
								</p>
							</div>
						{:else}
							<p>{weapon.title}</p>
						{/if}
					</div>
				</td>
				<td class="py-2 pr-4 text-center whitespace-nowrap">{weapon.range}</td>
				<td class="py-2 pr-4 whitespace-nowrap">
					<div class="mx-auto w-min rounded-full border bg-foreground/5 px-2 py-1 text-xs">
						{formattedToHit}
						{#if currentTrait}
							<span class="text-xs">{TRAITS[currentTrait].short_name}</span>
						{/if}
					</div>
				</td>
				<td class="py-2 pr-4 text-right whitespace-nowrap @sm:text-center">
					<div class="ml-auto w-min rounded-full border bg-foreground/5 px-2 py-1 text-xs @sm:mx-auto">
						{formattedDamage}
					</div>
				</td>
				<td class="hidden py-2 pr-4 text-right text-xs @sm:table-cell">
					<div class="ml-auto w-min text-right">
						{weapon.features.map((f) => f.title).join(', ') || '—'}
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>

