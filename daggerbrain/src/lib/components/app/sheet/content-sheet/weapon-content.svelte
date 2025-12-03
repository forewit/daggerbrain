<script lang="ts">
	import type { Weapon, DamageTypes } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn, capitalize } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Hand from '@lucide/svelte/icons/hand';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { weapon }: { weapon: Weapon } = $props();

	const context = getCharacterContext();
	let whatIsWeaponsOpen = $state(false);

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};
</script>

<Sheet.Header>
	<Sheet.Title>{weapon.title}</Sheet.Title>
	{#if weapon.category !== 'Unarmed'}
		<p class="text-xs text-muted-foreground italic">
			Tier {context.get_tier_from_level(weapon.level_requirement)}
			{weapon.category} Weapon
		</p>
	{/if}
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4">
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
				<td class="py-2 text-right"
					>{weapon.damage_dice}{#if weapon.damage_bonus > 0}+{weapon.damage_bonus}{/if}</td
				>
			</tr>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage Type</th>
				<td class="py-2 text-right"
					>{weapon.available_damage_types.map((t) => damageTypeMap[t]).join(' / ')}</td
				>
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
						<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
						<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<Collapsible.Root bind:open={whatIsWeaponsOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight class={cn('size-4 transition-transform', whatIsWeaponsOpen && 'rotate-90')} />
			<p class="text-sm font-medium">More info</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="space-y-3 pt-2 pl-5 text-xs text-muted-foreground italic">
				<p>
					PCs can carry up to two additional weapons in the "Inventory Weapon" areas of the
					character sheet.
				</p>
				<ul class="list-disc space-y-3 pl-4">
					<li>
						<b>Category</b> — A weapon's category specifies whether it is a Primary or Secondary weapon.
						Your character can only equip up to one weapon of each category at a time.
					</li>
					<li>
						<b>Trait</b> — A weapon's trait specifies which trait to use when making an attack roll with
						it.
					</li>
					<li>
						<b>Range</b> — A weapon's range specifies the maximum distance between the attacker and their
						target when attacking with it.
					</li>
					<li>
						<b>Damage</b> — A weapon's damage indicates the size of the damage dice you roll on a successful
						attack with it; you roll a number of dice equal to your Proficiency. If the damage includes
						a flat modifier, this number is added to the total damage rolled, but is not altered or affected
						by Proficiency.
					</li>
					<li>
						<b>Damage Type</b> — A weapon's damage type indicates whether it deals physical or magic
						damage. Weapons that deal magic damage can only be wielded by characters with a Spellcast
						trait.
					</li>
					<li>
						<b>Burden</b> — A weapon's burden indicates how many hands it occupies when equipped. Your
						character's maximum burden is 2 hands.
					</li>
					<li>
						<b>Feature</b> — A weapon's feature is a special rule that stays in effect while the weapon
						is equipped.
					</li>
				</ul>
				<p class="pt-2">
					You can throw an equipped weapon at a target within Very Close range, making the attack
					roll with Finesse. On a success, deal damage as usual for that weapon. Once thrown, the
					weapon is no longer considered equipped. Until you retrieve and re-equip it, you can't
					attack with it or benefit from its features.
				</p>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
