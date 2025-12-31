<script lang="ts">
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import BeastformComponent from '../../cards/full-cards/beastform.svelte';
	import PawPrint from '@lucide/svelte/icons/paw-print';

	let {
		onBeastformCatalogClick = () => {}
	}: {
		onBeastformCatalogClick?: () => void;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let derivedBeastform = $derived(context.derived_beastform);

	const compendium = getCompendiumContext();
	let druid_class_id = $derived(compendium.classes.druid.compendium_id);

	function removeBeastform() {
		if (!character) return;
		character.chosen_beastform = null;
	}

	let apply_beastform_bonuses = $derived(
		character?.chosen_beastform?.apply_beastform_bonuses ?? false
	);

	function handleTransformedChange(checked: boolean) {
		if (!character?.chosen_beastform) return;
		character.chosen_beastform.apply_beastform_bonuses = checked;
		if (!checked) {
			// Clear evolution_trait when transformed is turned off
			if (character.class_choices[druid_class_id]) {
				character.class_choices[druid_class_id]['evolution_trait'] = [''];
			}
		}
	}
</script>

{#if character && (character.primary_class_id === druid_class_id || character.secondary_class_id === druid_class_id)}
	<div class="flex flex-col items-center gap-4">
		{#if derivedBeastform}
			<label
				class={cn(
					buttonVariants({ variant: 'outline', size: 'sm' }),
					'cursor-pointer gap-3 rounded-full px-4',
					apply_beastform_bonuses &&
						'border-accent/10 bg-accent/5 text-accent hover:bg-accent/10 hover:text-accent'
				)}
			>
				Transformed
				<Switch
					class="data-[state=checked]:bg-accent/50"
					checked={apply_beastform_bonuses}
					onCheckedChange={handleTransformedChange}
				/>
			</label>
			<BeastformComponent beastform={derivedBeastform} show_choices={true} />
			<div class="flex justify-center gap-2">
				<Button variant="outline" size="sm" onclick={onBeastformCatalogClick}>
					<PawPrint class="size-4" />
					Change Beastform
				</Button>
				<Button variant="link" size="sm" class="text-destructive" onclick={removeBeastform}>
					Remove
				</Button>
			</div>
		{:else}
			<Button variant="outline" size="sm" onclick={onBeastformCatalogClick}>
				<PawPrint class="size-4" />
				Choose a Beastform
			</Button>
		{/if}
	</div>
{/if}
