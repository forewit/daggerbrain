<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		PCs can carry up to two additional weapons in the "Inventory Weapon" areas of the character
		sheet.
	</p>
	<ul class="list-disc space-y-3 pl-4">
		<li>
			<b>Category</b> — A weapon's category specifies whether it is a Primary or Secondary weapon. Your
			character can only equip up to one weapon of each category at a time.
		</li>
		<li>
			<b>Trait</b> — A weapon's trait specifies which trait to use when making an attack roll with it.
		</li>
		<li>
			<b>Range</b> — A weapon's range specifies the maximum distance between the attacker and their target
			when attacking with it.
		</li>
		<li>
			<b>Damage</b> — A weapon's damage indicates the size of the damage dice you roll on a successful
			attack with it; you roll a number of dice equal to your Proficiency. If the damage includes a flat
			modifier, this number is added to the total damage rolled, but is not altered or affected by Proficiency.
		</li>
		<li>
			<b>Damage Type</b> — A weapon's damage type indicates whether it deals physical or magic damage.
			Weapons that deal magic damage can only be wielded by characters with a Spellcast trait.
		</li>
		<li>
			<b>Burden</b> — A weapon's burden indicates how many hands it occupies when equipped. Your character's
			maximum burden is 2 hands.
		</li>
		<li>
			<b>Feature</b> — A weapon's feature is a special rule that stays in effect while the weapon is
			equipped.
		</li>
	</ul>
	<p class="pt-2">
		You can throw an equipped weapon at a target within Very Close range, making the attack roll
		with Finesse. On a success, deal damage as usual for that weapon. Once thrown, the weapon is no
		longer considered equipped. Until you retrieve and re-equip it, you can't attack with it or
		benefit from its features.
	</p>
</div>
