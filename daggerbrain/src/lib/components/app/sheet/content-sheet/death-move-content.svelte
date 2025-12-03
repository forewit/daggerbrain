<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
</script>

<Sheet.Header>
	<Sheet.Title>Death Move</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	<p class="text-xs text-muted-foreground">
		When a PC marks their last Hit Point, they must make a death move by choosing one of the
		following options:
	</p>

	<!-- Blaze of Glory -->
	<div class="space-y-2">
		<h3 class="text-sm font-bold">Blaze of Glory:</h3>
		<p class="pl-6 text-xs text-muted-foreground">
			Your character embraces death and goes out in a blaze of glory. Take one final action. It
			automatically critically succeeds (with GM approval), and then you cross through the veil of
			death.
		</p>
	</div>

	<!-- Avoid Death -->
	<div class="space-y-2">
		<h3 class="text-sm font-bold">Avoid Death:</h3>
		<p class="pl-6 text-xs text-muted-foreground">
			Your character avoids death and faces the consequences. They temporarily drop unconscious, and
			then you work with the GM to describe how the situation worsens. While unconscious, your
			character can't move or act, and they can't be targeted by an attack. They return to
			consciousness when an ally clears 1 or more of their marked Hit Points or when the party
			finishes a long rest. After your character falls unconscious, roll your Hope Die. If its value
			is equal to or less than your character's level, they gain a scar: permanently cross out a
			Hope slot and work with the GM to determine its lasting narrative impact and how, if possible,
			it can be restored. If you ever cross out your last Hope slot, your character's journey ends.
		</p>
	</div>

	<!-- Risk It All -->
	<div class="space-y-2">
		<h3 class="text-sm font-bold">Risk It All:</h3>
		<p class="pl-6 text-xs text-muted-foreground">
			Roll your Duality Dice. If the Hope Die is higher, your character stays on their feet and
			clears a number of Hit Points or Stress equal to the value of the Hope Die (you can divide the
			Hope Die value between Hit Points and Stress however you'd prefer). If the Fear Die is higher,
			your character crosses through the veil of death. If the Duality Dice show matching results,
			your character stays up and clears all Hit Points and Stress.
		</p>
	</div>
</div>
