<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import * as Sheet from '$lib/components/ui/sheet';

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

<Sheet.Header>
	<Sheet.Title>Experiences</Sheet.Title>
	<Sheet.Description>Character Experiences</Sheet.Description>
</Sheet.Header>

{#if character}
	<div class="space-y-3 py-4 text-sm">
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
