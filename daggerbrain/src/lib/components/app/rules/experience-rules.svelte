<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		An Experience is a word or phrase used to encapsulate a specific set of skills, personality
		traits, or aptitudes your character has acquired over the course of their life. When your PC
		makes a move, they can spend a Hope to add a relevant Experience's modifier to an action or
		reaction roll.
	</p>
	<ul class="list-disc space-y-3 pl-4">
		<li>Your PC gets two Experiences at character creation, each with a +2 modifier.</li>
		<li>
			There's no set list of Experiences to choose from, but an Experience can't be too broadly
			applicable and it can't grant your character specific mechanical benefits, such as magic
			spells or special abilities. For example, "Lucky" and "Highly Skilled" are too broad, because
			they could be applied to virtually any roll. Likewise, "Supersonic Flight" and "Invulnerable"
			imply game-breaking special abilities.
		</li>
	</ul>
</div>
