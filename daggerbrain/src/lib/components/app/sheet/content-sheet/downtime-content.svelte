<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
</script>

<Sheet.Header>
	<Sheet.Title>Downtime</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	<!-- General Rules -->
	<div class="space-y-2">
		<p class="text-xs text-muted-foreground">
			Between conflicts, the party can take a rest to recover expended resources and deepen their
			bonds. During a rest, each PC can make up to two downtime moves.
		</p>
		<p class="text-xs text-muted-foreground">
			When the party rests, they must choose between a short rest and a long rest. If a party takes
			three short rests in a row, their next rest must be a long rest.
		</p>
		<p class="text-xs text-muted-foreground">
			If a short rest is interrupted, such as by an adversary's attack, the characters don't gain
			its benefits. If a long rest is interrupted, the characters only gain the benefits of a short
			rest.
		</p>
	</div>

	<!-- Short Rest -->
	<div class="space-y-3 border-t pt-4">
		<div>
			<h3 class="text-sm font-bold">Short Rest</h3>
			<p class="text-xs text-muted-foreground">
				A short rest lasts enough time for the party to catch its breath, about an hour in-world.
				Each player can move domain cards between their loadout and vault for free, then choose
				twice from the following list of downtime moves (players can choose the same move twice):
			</p>
		</div>
		<div class="space-y-3 pl-4">
			<div>
				<p class="text-sm font-semibold">Tend to Wounds:</p>
				<p class="text-xs text-muted-foreground">
					Clear 1d4+Tier Hit Points for yourself or an ally.
				</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Clear Stress:</p>
				<p class="text-xs text-muted-foreground">Clear 1d4+Tier Stress.</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Repair Armor:</p>
				<p class="text-xs text-muted-foreground">
					Clear 1d4+Tier Armor Slots from your or an ally's armor.
				</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Prepare:</p>
				<p class="text-xs text-muted-foreground">
					Describe how you prepare yourself for the path ahead, then gain a Hope. If you choose to
					Prepare with one or more members of your party, you each gain 2 Hope.
				</p>
			</div>
		</div>
		<p class="text-xs text-muted-foreground italic">
			At the end of a short rest, any features or effects with a limited number of uses per rest
			refresh and any features or effects that last until your next rest expire.
		</p>
	</div>

	<!-- Long Rest -->
	<div class="space-y-3 border-t pt-4">
		<div>
			<h3 class="text-sm font-bold">Long Rest</h3>
			<p class="text-xs text-muted-foreground">
				A long rest is when the characters make camp and relax or sleep for several in-game hours.
				Each player can move domain cards between their loadout and vault for free, then choose
				twice from the following list of downtime moves (players can choose the same move twice):
			</p>
		</div>
		<div class="space-y-3 pl-4">
			<div>
				<p class="text-sm font-semibold">Tend to All Wounds:</p>
				<p class="text-xs text-muted-foreground">Clear all Hit Points for yourself or an ally.</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Clear All Stress:</p>
				<p class="text-xs text-muted-foreground">Clear all Stress.</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Repair All Armor:</p>
				<p class="text-xs text-muted-foreground">
					Clear all Armor Slots from your or an ally's armor.
				</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Prepare:</p>
				<p class="text-xs text-muted-foreground">
					Describe how you prepare for the next day's adventure, then gain a Hope. If you choose to
					Prepare with one or more members of your party, you each gain 2 Hope.
				</p>
			</div>
			<div>
				<p class="text-sm font-semibold">Work on a Project:</p>
				<p class="text-xs text-muted-foreground">
					With GM approval, a PC may pursue a long-term project, such as deciphering an ancient text
					or crafting a new weapon. The first time they start a new project, assign it a countdown.
					Each time a PC makes the Work on a Project move, they either advance their project's
					countdown automatically or make an action roll to advance it (GM's choice).
				</p>
			</div>
		</div>
		<p class="text-xs text-muted-foreground italic">
			At the end of a long rest, any features or effects with a limited number of uses per rest or
			per long rest refresh and any features or effects that last until your next rest or until your
			next long rest expire.
		</p>
	</div>
</div>
