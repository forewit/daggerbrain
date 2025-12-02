<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div class="space-y-3 text-sm">
		{#each character.experiences as experience, i}
			<div class="flex items-start gap-3">
				<div class="shrink-0 rounded-full border bg-foreground/5 px-2 py-1 text-xs">
					{#if context.experience_modifiers[i] > 0}+{/if}{context.experience_modifiers[i]}
				</div>
				<p class="text-muted-foreground italic">
					{experience.trim() === '' ? 'Unnamed Experience' : experience}
				</p>
			</div>
		{/each}
	</div>
{/if}
