<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		Some features can apply special or unique conditions, which work as described in the feature
		text.
	</p>
	<ul class="list-disc space-y-3 pl-4">
		<li>
			<b>Hidden:</b> While you're out of sight from all enemies and they don't otherwise know your location,
			you gain the Hidden condition. Any rolls against a Hidden creature have disadvantage. After an adversary
			moves to where they would see you, you move into their line of sight, or you make an attack, you
			are no longer Hidden.
		</li>
		<li>
			<b>Restrained:</b> Restrained characters can't move, but you can still take actions from their current
			position.
		</li>
		<li>
			<b>Vulnerable:</b> When a creature is Vulnerable, all rolls targeting them have advantage.
		</li>
	</ul>
	<p>
		Unless otherwise noted, the same condition can't be applied more than once to the same target.
	</p>
</div>
