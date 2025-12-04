<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<!-- General Rules -->
	<div class="space-y-3">
		<p>
			Between conflicts, the party can take a rest to recover expended resources and deepen their
			bonds. During a rest, each PC can make up to two downtime moves.
		</p>
		<p>
			When the party rests, they must choose between a short rest and a long rest. If a party takes
			three short rests in a row, their next rest must be a long rest.
		</p>
		<p>
			If a short rest is interrupted, such as by an adversary's attack, the characters don't gain
			its benefits. If a long rest is interrupted, the characters only gain the benefits of a short
			rest.
		</p>
	</div>

	<!-- Short Rest -->
	<div class="space-y-3 border-t pt-4">
		<div>
			<p class="text-sm font-bold not-italic">Short Rest</p>
			<p class="mt-2">
				A short rest lasts enough time for the party to catch its breath, about an hour in-world.
				Each player can move domain cards between their loadout and vault for free, then choose
				twice from the following list of downtime moves (players can choose the same move twice):
			</p>
		</div>
		<ul class="list-disc space-y-3 pl-4">
			<li>
				<b>Tend to Wounds:</b> Clear 1d4+Tier Hit Points for yourself or an ally.
			</li>
			<li>
				<b>Clear Stress:</b> Clear 1d4+Tier Stress.
			</li>
			<li>
				<b>Repair Armor:</b> Clear 1d4+Tier Armor Slots from your or an ally's armor.
			</li>
			<li>
				<b>Prepare:</b> Describe how you prepare yourself for the path ahead, then gain a Hope. If you
				choose to Prepare with one or more members of your party, you each gain 2 Hope.
			</li>
		</ul>
		<p>
			At the end of a short rest, any features or effects with a limited number of uses per rest
			refresh and any features or effects that last until your next rest expire.
		</p>
	</div>

	<!-- Long Rest -->
	<div class="space-y-3 border-t pt-4">
		<div>
			<p class="text-sm font-bold not-italic">Long Rest</p>
			<p class="mt-2">
				A long rest is when the characters make camp and relax or sleep for several in-game hours.
				Each player can move domain cards between their loadout and vault for free, then choose
				twice from the following list of downtime moves (players can choose the same move twice):
			</p>
		</div>
		<ul class="list-disc space-y-3 pl-4">
			<li>
				<b>Tend to All Wounds:</b> Clear all Hit Points for yourself or an ally.
			</li>
			<li>
				<b>Clear All Stress:</b> Clear all Stress.
			</li>
			<li>
				<b>Repair All Armor:</b> Clear all Armor Slots from your or an ally's armor.
			</li>
			<li>
				<b>Prepare:</b> Describe how you prepare for the next day's adventure, then gain a Hope. If you
				choose to Prepare with one or more members of your party, you each gain 2 Hope.
			</li>
			<li>
				<b>Work on a Project:</b> With GM approval, a PC may pursue a long-term project, such as deciphering
				an ancient text or crafting a new weapon. The first time they start a new project, assign it
				a countdown. Each time a PC makes the Work on a Project move, they either advance their project's
				countdown automatically or make an action roll to advance it (GM's choice).
			</li>
		</ul>
		<p>
			At the end of a long rest, any features or effects with a limited number of uses per rest or
			per long rest refresh and any features or effects that last until your next rest or until your
			next long rest expire.
		</p>
	</div>
</div>
