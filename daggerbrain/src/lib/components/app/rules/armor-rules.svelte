<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<ul class={cn('list-disc space-y-3 text-xs text-muted-foreground italic', className)}>
	<li>
		An armor's <b>base armor score</b> indicates how many Armor Slots it provides its wearer before additional
		bonuses are added to calculate their total Armor Score. A PC's Armor Score can't exceed 12.
	</li>
	<li>
		An armor's <b>base thresholds</b> determine its wearer's Major and Severe damage thresholds before
		adding bonuses to calculate their final damage thresholds. When recording your character's damage
		thresholds, you always add your character's level to those values.
	</li>
	<li>
		An armor's <b>feature</b> is a special rule that stays in effect while the armor is equipped.
	</li>
	<li>
		While <b>unarmored</b>, your character's base Armor Score is 0, their Major threshold is equal
		to their level, and their Severe threshold is equal to twice their level.
	</li>
</ul>
