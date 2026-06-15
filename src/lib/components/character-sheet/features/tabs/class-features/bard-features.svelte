<script lang="ts">
	import RollButton from '$lib/components/dice/roll-button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { cn } from '$lib/utils';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
</script>

{#if character && derived_character_data && derived_character_data.hasRallyClassFeature}
	<div class="-mb-2 flex items-center gap-2 border-y py-2">
		<RollButton
			type="base"
			diceString={derived_character_data.hasRallyEpicPoetrySubclassFeature
				? '1d10'
				: character.level >= 5
					? '1d8'
					: '1d6'}
		/>

		<p class="text-xs font-medium">Rally Die</p>

		<p class="text-xs text-muted-foreground">Add to a roll or clear stress</p>

		<Label class="mr-2 ml-auto cursor-pointer text-xs font-normal text-muted-foreground">
			<Checkbox
				disabled={!characterCtx.canEdit}
				class={cn(!characterCtx.canEdit && 'pointer-events-none')}
				checked={character.feature_choices['given_out_this_session']?.[0] === 'yes'}
				onCheckedChange={(checked) => {
					character.feature_choices['given_out_this_session'] = [checked ? 'yes' : 'no'];
				}}
			/> Given out this session
		</Label>
	</div>
{/if}
