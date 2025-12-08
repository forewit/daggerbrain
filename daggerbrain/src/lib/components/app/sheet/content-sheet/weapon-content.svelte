<script lang="ts">
	import type { DamageTypes } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Hand from '@lucide/svelte/icons/hand';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import WeaponsRules from '../../rules/weapons-rules.svelte';
	import { z } from 'zod';

	let { weaponId }: { weaponId: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let whatIsWeaponsOpen = $state(false);
	let customizeOpen = $state(false);

	// Get weapon from inventory
	let weapon = $derived.by(() => {
		return (
			context.inventory_primary_weapons.find((w) => w.id === weaponId) ||
			context.inventory_secondary_weapons.find((w) => w.id === weaponId) ||
			(context.derived_unarmed_attack?.id === weaponId ? context.derived_unarmed_attack : null)
		);
	});

	// Get the inventory item
	let inventoryItem = $derived.by(() => {
		if (!character || !weaponId) return null;
		return (
			character.inventory.primary_weapons[weaponId] ||
			character.inventory.secondary_weapons[weaponId] ||
			null
		);
	});

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	// Validation schema for tier
	const tierSchema = z.enum(['1', '2', '3', '4']);
	let tierError = $state<string | null>(null);

	// Form state - initialized from inventory item
	let customName = $state('');
	let customTier = $state('');

	// Derived value for is save button disabled (if customizations match the existing weapon)
	let isSaveDisabled = $derived.by(() => {
		if (!weapon || !inventoryItem) return false;

		const formName = customName.trim();
		const savedName = (inventoryItem.custom_title ?? '').trim();
		const namesMatch = formName === savedName;

		// Normalize form tier: empty becomes empty string, valid numbers become string
		let formTier = '';
		if (customTier) {
			const tierNum = Number(customTier);
			if (!isNaN(tierNum) && tierNum >= 1 && tierNum <= 4) {
				formTier = String(tierNum);
			} else {
				formTier = String(customTier).trim();
			}
		}

		// Determine the effective saved tier
		const baseWeaponTier = String(context.level_to_tier(weapon.level_requirement));
		const hasCustomTier = inventoryItem.custom_level_requirement !== null;
		const savedCustomTier =
			inventoryItem.custom_level_requirement !== null
				? String(context.level_to_tier(inventoryItem.custom_level_requirement))
				: null;

		// Compare tiers:
		// - Empty form tier means "no custom tier" - matches when saved also has no custom tier
		// - Non-empty form tier matches when it equals the effective tier (custom tier if exists, otherwise base tier)
		let tiersMatch = false;
		if (formTier === '') {
			// Empty form tier means "no custom tier" - matches when saved also has no custom tier
			tiersMatch = !hasCustomTier;
		} else {
			// Non-empty form tier - compare to effective tier (custom tier if exists, otherwise base tier)
			const effectiveTier = savedCustomTier ?? baseWeaponTier;
			tiersMatch = formTier === effectiveTier;
		}

		return namesMatch && tiersMatch;
	});

	// Check if there are any customizations on the inventory item
	let hasCustomizations = $derived.by(() => {
		if (!inventoryItem) return false;
		return inventoryItem.custom_title !== null || inventoryItem.custom_level_requirement !== null;
	});

	// Update form when inventory item changes
	$effect(() => {
		if (inventoryItem && weapon) {
			customName = inventoryItem.custom_title === null ? '' : inventoryItem.custom_title;
			// Convert level requirement to tier if it exists
			if (inventoryItem.custom_level_requirement !== null) {
				customTier = context.level_to_tier(inventoryItem.custom_level_requirement).toString();
			} else {
				// Use the weapon's current tier
				customTier = '';
			}
		} else {
			customName = '';
			customTier = '';
		}
	});

	function handleSave() {
		if (!character || !inventoryItem || !weaponId) return;

		// Find which inventory the weapon is in
		const item =
			character.inventory.primary_weapons[weaponId] ||
			character.inventory.secondary_weapons[weaponId];
		if (!item) return;

		tierError = null;

		// Validate tier first (if provided)
		let tierStr: string | null = null;
		if (customTier) {
			// Convert to string for validation (number inputs can return numbers)
			tierStr = String(customTier).trim();
			const validation = tierSchema.safeParse(tierStr);
			if (!validation.success) {
				tierError = 'Tier must be 1, 2, 3, or 4';
				return; // Don't save anything if validation fails
			}
		}

		// All validations passed - update the item
		// Update name (always valid - empty becomes null)
		const trimmedName = customName.trim();
		item.custom_title = trimmedName || null;

		// Update tier
		if (tierStr) {
			item.custom_level_requirement = context.tier_to_min_level(Number(tierStr));
		} else {
			// Empty tier means no custom level requirement
			item.custom_level_requirement = null;
		}
	}

	function handleClear() {
		customName = '';
		customTier = '';
		tierError = null;
		handleSave();
	}
</script>

{#if weapon}
	<Sheet.Header>
		<Sheet.Title>{weapon.title}</Sheet.Title>
		{#if weapon.category !== 'Unarmed'}
			<p class="text-xs text-muted-foreground italic">
				Tier {context.level_to_tier(weapon.level_requirement)}
				{weapon.category} Weapon
			</p>
		{/if}
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		{#if weapon.description_html.trim().length > 0}
			<p class="py-4 text-sm">{@html weapon.description_html}</p>
		{/if}

		<!-- Stats Table -->
		<table class="w-full border-collapse text-sm">
			<tbody>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Range</th>
					<td class="py-2 text-right">{weapon.range}</td>
				</tr>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Trait</th>
					<td class="py-2 text-right">{weapon.available_traits.map(capitalize).join(' / ')}</td>
				</tr>

				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage</th>
					<td class="py-2 text-right"
						>{weapon.damage_dice}{#if weapon.damage_bonus > 0}+{weapon.damage_bonus}{/if}</td
					>
				</tr>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage Type</th>
					<td class="py-2 text-right"
						>{weapon.available_damage_types.map((t) => damageTypeMap[t]).join(' / ')}</td
					>
				</tr>
				<tr>
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Burden</th>
					<td class="py-2 text-right">
						{weapon.burden}
						<Hand class="-mt-0.5 ml-0.5 inline-block size-3.5" />
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Features -->
		{#if weapon.features.length > 0}
			<div class="rounded-lg border bg-primary/5 px-4 py-3">
				<div class="flex items-center justify-between">
					<p class="text-sm">Features</p>
				</div>
				<div class="mt-3 space-y-3">
					{#each weapon.features as feature}
						<div class="border-l-2 border-accent/30 pl-3">
							<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if inventoryItem}
			<Collapsible.Root bind:open={customizeOpen}>
				<Collapsible.Trigger
					class={cn(
						'flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm',
						customizeOpen && 'rounded-b-none'
					)}
				>
					<span>Customize</span>
					<ChevronLeft class={cn('size-4 transition-transform', customizeOpen && '-rotate-90')} />
				</Collapsible.Trigger>
				<Collapsible.Content class="space-y-2 rounded-b-md border bg-card/50 p-2">
					<div class="flex flex-col gap-2">
						<label for="custom-name" class="text-xs font-medium text-muted-foreground">Name</label>
						<Input id="custom-name" bind:value={customName} placeholder="Name" />
					</div>
					<div class="flex flex-col gap-2">
						<label for="custom-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
						<Input
							id="custom-tier"
							type="number"
							bind:value={customTier}
							placeholder="Tier (1-4)"
							min="1"
							max="4"
							step="1"
						/>
						{#if tierError}
							<p class="text-xs text-destructive">{tierError}</p>
						{/if}
					</div>
					<div class="flex gap-2">
						<Button size="sm" onclick={handleSave} hidden={isSaveDisabled}>Save</Button>
						{#if hasCustomizations}
							<Button
								size="sm"
								variant="link"
								class="ml-auto text-destructive"
								onclick={handleClear}>Clear</Button
							>
						{/if}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		{/if}

		<Collapsible.Root bind:open={whatIsWeaponsOpen} class="pt-2">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight class={cn('size-4 transition-transform', whatIsWeaponsOpen && 'rotate-90')} />
				<p class="text-sm font-medium">More info</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<WeaponsRules class="pt-2 pl-5" />
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
{/if}
