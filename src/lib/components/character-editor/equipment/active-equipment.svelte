<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ActiveArmor from './active-armor.svelte';
	import ActivePrimaryWeapon from './active-primary-weapon.svelte';
	import ActiveSecondaryWeapon from './active-secondary-weapon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
</script>

{#if character && derived_character_data}
	<div class="rounded-md border bg-primary/70 p-2 pb-3">
		<!-- Armor Slot -->
		<p class="px-1 pt-1 pb-2 text-sm font-medium">Equipped Armor</p>
		<div class="flex items-center justify-end gap-1">
			{#if derived_character_data?.derived_armor}
				<div class="grow">
					<ActiveArmor armor={derived_character_data.derived_armor} />
				</div>
				<Button
					size="icon"
					variant="link"
					onclick={() => {
						if (character) character.active_armor_inventory_id = undefined;
					}}
				>
					<CircleMinus class="size-4" />
				</Button>
			{:else}
				<div class="flex min-h-10 grow items-center gap-3 truncate rounded-md bg-card/80 px-4 py-2">
					<p class="text-xs text-muted-foreground italic">Unarmored</p>
				</div>
			{/if}
		</div>

		<!-- Active Weapons -->
		<div class="grow">
			<p class="px-1 pt-4 pb-1 text-sm font-medium">Equipped Weapons</p>
			<p class="px-1 pb-2 text-xs text-muted-foreground italic">
				You can only equip one primary and one secondary weapon. Maximum burden is
				{derived_character_data.max_burden}
				{derived_character_data.max_burden === 1 ? 'hand' : 'hands'}.
				{#if derived_character_data.hasCompatTrainingClassFeature}
					Combat Training lets you ignore weapon burden.
				{/if}
			</p>

			<div class="flex flex-col gap-2">
				{#if derived_character_data.derived_primary_weapon}
					<div class="flex items-center justify-end gap-1">
						<div class="grow">
							<ActivePrimaryWeapon
								inventory_id={derived_character_data.derived_primary_weapon.inventory_id}
								bind_choices
							/>
						</div>
						<Button
							size="icon"
							variant="link"
							onclick={() => {
								if (character) character.active_primary_weapon_inventory_id = undefined;
							}}
						>
							<CircleMinus class="size-4" />
						</Button>
					</div>
				{:else}
					<div
						class="flex min-h-10 grow items-center gap-3 truncate rounded-md bg-card/80 px-4 py-2"
					>
						<p class="text-xs text-muted-foreground italic">No Primary Weapon</p>
					</div>
				{/if}
				{#if derived_character_data.derived_secondary_weapon}
					<div class="flex items-center justify-end gap-1">
						<div class="grow">
							<ActiveSecondaryWeapon
								inventory_id={derived_character_data.derived_secondary_weapon.inventory_id}
								bind_choices
							/>
						</div>
						<Button
							size="icon"
							variant="link"
							onclick={() => {
								if (character) character.active_secondary_weapon_inventory_id = undefined;
							}}
						>
							<CircleMinus class="size-4" />
						</Button>
					</div>
				{:else}
					<div
						class="flex min-h-10 grow items-center gap-3 truncate rounded-md bg-card/80 px-4 py-2"
					>
						<p class="text-xs text-muted-foreground italic">No Secondary Weapon</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
