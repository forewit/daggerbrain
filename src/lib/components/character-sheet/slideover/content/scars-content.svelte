<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from '$lib/components/ui/button/button.svelte';
	import Hope from '$lib/components/character-sheet/standalone/hope.svelte';
	import ReviveButton from '$lib/components/character-sheet/standalone/revive-button.svelte';
	import ScarRules from '$lib/components/rule-snippets/scar-rules.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Sprout from '@lucide/svelte/icons/sprout';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const canEdit = $derived(characterCtx.canEdit);
	const hasNoHopeSlotsRemaining = $derived.by(
		() => !!character && !!derived_character_data && derived_character_data.max_hope <= 0
	);

	let moreInfoOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>Hope and Scars</Sheet.Title>
</Sheet.Header>

{#if character && derived_character_data}
	<div class={cn('space-y-3 px-4 text-xs text-muted-foreground italic')}>
		<p>
			If your character takes the <b>Avoid Death</b> death move, they could gain a Scar, permanently crossing
			out a Hope slot.
		</p>

		<p>
			Work with the GM to determine its lasting narrative impact and how, if possible, it can be
			restored. If you ever cross out your last Hope slot, your character's journey ends.
		</p>
	</div>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pt-4 pb-6">
		<div class="">
			<Hope
				disabled
				max={derived_character_data.max_hope}
				bind:marked={character.marked_hope}
				bind:scars={character.scars}
				class="mx-auto flex-col gap-4"
			/>

			<div class="mt-8 flex justify-center gap-2">
				{#if hasNoHopeSlotsRemaining}
					<ReviveButton><Sprout />Revive</ReviveButton>
				{:else}
					<Button variant="outline" size="sm" onclick={() => characterCtx.addScar()}
						>Add Scar</Button
					>

					<Button
						size="sm"
						disabled={character.scars <= 0}
						onclick={() => characterCtx.removeScar()}
					>
						Heal Scar
					</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}
