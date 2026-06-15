<script lang="ts">
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import BeastformComponent from '$lib/components/compendium-items/beastform.svelte';
	import PawPrint from '@lucide/svelte/icons/paw-print';

	let {
		onBeastformCatalogClick = () => {}
	}: {
		onBeastformCatalogClick?: () => void;
	} = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const derivedBeastform = $derived(derived_character_data?.derived_beastform);

	function removeBeastform() {
		if (!character) return;
		character.chosen_beastform = undefined;
	}

	const apply_beastform_bonuses = $derived(
		character?.chosen_beastform?.apply_beastform_bonuses ?? false
	);

	function handleTransformedChange(checked: boolean) {
		if (!character?.chosen_beastform) return;
		character.chosen_beastform.apply_beastform_bonuses = checked;
		if (!checked) {
			// Clear evolution_trait when transformed is turned off
			character.feature_choices['evolution_trait'] = [''];
		}
	}
</script>

{#if character && derived_character_data}
	<div class="flex flex-col items-center gap-4">
		{#if derivedBeastform && character.chosen_beastform}
			<label
				class={cn(
					buttonVariants({ variant: 'outline', size: 'sm' }),
					'cursor-pointer gap-3 rounded-full px-4',
					apply_beastform_bonuses &&
						'border-accent/10 bg-accent/5 text-accent hover:bg-accent/10 hover:text-accent',
					!characterCtx.canEdit && 'pointer-events-none'
				)}
			>
				Transform
				<Switch
					disabled={!characterCtx.canEdit}
					class="data-[state=checked]:bg-accent/50"
					checked={apply_beastform_bonuses}
					onCheckedChange={handleTransformedChange}
				/>
			</label>
			<BeastformComponent
				beastform={derivedBeastform}
				bind:choices={character.chosen_beastform.choices}
				proficiency={derived_character_data.proficiency}
				compendium={characterCtx.character_compendium}
			/>

			{#if characterCtx.canEdit}
				<div class="flex justify-center gap-2">
					<Button variant="outline" size="sm" onclick={onBeastformCatalogClick}>
						<PawPrint class="size-4" />
						Change Beastform
					</Button>
					<Button variant="link" size="sm" class="text-destructive" onclick={removeBeastform}>
						Remove
					</Button>
				</div>
			{/if}
		{:else if characterCtx.canEdit}
			<Button class="mt-8" variant="outline" size="sm" onclick={onBeastformCatalogClick}>
				<PawPrint class="size-4" />
				Choose a Beastform
			</Button>
		{/if}
	</div>
{/if}
