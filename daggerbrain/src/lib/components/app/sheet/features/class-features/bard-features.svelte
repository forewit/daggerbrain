<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { cn } from '$lib/utils';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let bard_class_id = $derived(compendium.classes.bard.compendium_id);
	let wordsmith_subclass_id = $derived(compendium.subclasses.bard_wordsmith.compendium_id);
</script>

{#if character && (character.primary_class_id === bard_class_id || character.secondary_class_id === bard_class_id)}
	<div class="-mb-2 flex items-center gap-2 border-y py-2">
		<div class="w-min rounded-full border bg-foreground/5 px-2 py-1 text-xs">
			{#if (character.primary_subclass_id === wordsmith_subclass_id && context.primary_class_mastery_level >= 3) || (character.secondary_subclass_id === wordsmith_subclass_id && context.secondary_class_mastery_level >= 3)}
				d10
			{:else if character.level < 5}
				d6
			{:else}
				d8
			{/if}
		</div>

		<p class="text-xs font-medium">Rally Die</p>

		<p class="text-xs text-muted-foreground">Add to a roll or clear stress</p>

		<Label class="mr-2 ml-auto cursor-pointer text-xs font-normal text-muted-foreground">
			<Checkbox
				disabled={!context.canEdit}
				class={cn(!context.canEdit && 'pointer-events-none')}
				checked={character.class_choices[bard_class_id]?.['given_out_this_session']?.[0] === 'yes'}
				onCheckedChange={(checked) => {
					if (!character.class_choices[bard_class_id]) character.class_choices[bard_class_id] = {};
					character.class_choices[bard_class_id]['given_out_this_session'] = [
						checked ? 'yes' : 'no'
					];
				}}
			/> Given out this session
		</Label>
	</div>
{/if}
