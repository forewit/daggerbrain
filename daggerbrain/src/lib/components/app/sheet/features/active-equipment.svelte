<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import PrimaryWeaponCard from '$lib/components/app/equipment/primary-weapon.svelte';
	import SecondaryWeaponCard from '$lib/components/app/equipment/secondary-weapon.svelte';
	import ArmorCard from '$lib/components/app/equipment/armor.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

<div class={cn('rounded-md bg-primary/50 p-2', className)}>
	<!-- Armor Slot -->
	<p class="px-1 pt-1 pb-2 text-sm font-medium">Active Armor</p>
	<div class="flex items-center justify-end gap-1">
		{#if context.active_armor !== null}
			<div class="grow">
				<ArmorCard armor={context.active_armor} />
			</div>
			<Button
				size="icon"
				variant="link"
				onclick={() => {
					if (character) character.active_armor_id = null;
				}}
			>
				<CircleMinus class="size-4" />
			</Button>
		{:else}
			<div class="flex min-h-10 grow items-center gap-3 truncate rounded-md bg-card/30 px-4 py-2">
				<p class="text-sm text-muted-foreground">Unarmored</p>
			</div>
		{/if}
	</div>

	<!-- Active Weapons -->
	<div class="grow">
		<p class="px-1 pt-4 pb-1 text-sm font-medium">Active Weapons</p>
		<p class="px-1 pb-2 text-xs text-muted-foreground italic">
			You can only equip one primary and one secondary weapon. Maximum burden is 2 hands.
		</p>

		<div class="flex flex-col gap-2">
			{#if context.derived_primary_weapon !== null}
				<div class="flex items-center justify-end gap-1">
					<div class="grow">
						<PrimaryWeaponCard weapon={context.derived_primary_weapon} bind_choices />
					</div>
					<Button
						size="icon"
						variant="link"
						onclick={() => {
							if (character) character.active_primary_weapon_id = null;
						}}
					>
						<CircleMinus class="size-4" />
					</Button>
				</div>
			{:else}
				<div class="flex min-h-10 grow items-center gap-3 truncate rounded-md bg-card/30 px-4 py-2">
					<p class="text-sm text-muted-foreground">No Primary Weapon</p>
				</div>
			{/if}
			{#if context.derived_secondary_weapon !== null}
				<div class="flex items-center justify-end gap-1">
					<div class="grow">
						<SecondaryWeaponCard weapon={context.derived_secondary_weapon} bind_choices />
					</div>
					<Button
						size="icon"
						variant="link"
						onclick={() => {
							if (character) character.active_secondary_weapon_id = null;
						}}
					>
						<CircleMinus class="size-4" />
					</Button>
				</div>
			{:else}
				<div class="flex min-h-10 grow items-center gap-3 truncate rounded-md bg-card/30 px-4 py-2">
					<p class="text-sm text-muted-foreground">No Secondary Weapon</p>
				</div>
			{/if}
		</div>
	</div>
</div>
