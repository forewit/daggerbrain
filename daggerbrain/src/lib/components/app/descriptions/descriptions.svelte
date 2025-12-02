<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let primary_class = $derived(context.primary_class);

	const questions = [
		{ key: 'clothes', label: 'Clothes that are:' },
		{ key: 'eyes', label: 'Eyes like:' },
		{ key: 'body', label: "Body that's:" },
		{ key: 'skin', label: 'Skin the color of:' },
		{ key: 'attitude', label: 'Attitude like:' }
	] as const;
</script>

{#if character && primary_class}
	<div class="flex flex-col gap-4">
		{#each questions as { key, label }}
			<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-3">
				<p class="text-sm font-medium">{label}</p>
				<Textarea
					bind:value={character.character_descriptions[key]}
					placeholder={primary_class.character_description_suggestions[key]}
					class="min-h-20"
				/>
			</div>
		{/each}
	</div>
{:else}
	<p class="text-sm text-muted-foreground italic">
		Select a class to see character description prompts.
	</p>
{/if}
