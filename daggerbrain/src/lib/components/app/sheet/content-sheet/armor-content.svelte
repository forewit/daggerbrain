<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils/markdown';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Shield from '@lucide/svelte/icons/shield';
	import HomebrewBadge from '../../homebrew/homebrew-badge.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import ArmorRules from '../../rules/armor-rules.svelte';
	import { z } from 'zod';
	import CampaignBadge from '../../homebrew/campaign-badge.svelte';

	let { armorId }: { armorId: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let whatIsArmorOpen = $state(false);
	let customizeOpen = $state(false);

	// Get armor from inventory
	let armor = $derived(
		context.inventory_armor.find((a) => a.id === armorId) ||
			(context.derived_armor?.id === armorId ? context.derived_armor : null)
	);

	// Get the inventory item
	let inventoryItem = $derived.by(() => {
		if (!character || !armorId) return null;
		return character.inventory.armor[armorId] || null;
	});

	// Validation schema for tier
	const tierSchema = z.enum(['1', '2', '3', '4']);
	let tierError = $state<string | null>(null);

	// Form state - initialized from inventory item
	let customName = $state('');
	let customTier = $state('');
	let customMaxArmor = $state('');
	let customMajorThreshold = $state('');
	let customSevereThreshold = $state('');

	// Derived value for is save button disabled (if customizations match the existing armor)
	let isSaveDisabled = $derived.by(() => {
		if (!armor || !inventoryItem) return false;

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
		const baseArmorTier = String(context.level_to_tier(armor.level_requirement));
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
			const effectiveTier = savedCustomTier ?? baseArmorTier;
			tiersMatch = formTier === effectiveTier;
		}

		// Compare max armor
		const maxArmorStr = String(customMaxArmor ?? '').trim();
		const formMaxArmor =
			maxArmorStr === '' ? null : isNaN(Number(maxArmorStr)) ? null : Number(maxArmorStr);
		const savedMaxArmor = inventoryItem.custom_max_armor;
		const maxArmorMatch =
			(formMaxArmor === null && savedMaxArmor === null) ||
			(formMaxArmor !== null && savedMaxArmor !== null && formMaxArmor === savedMaxArmor);

		// Compare damage thresholds
		const majorStr = String(customMajorThreshold ?? '').trim();
		const severeStr = String(customSevereThreshold ?? '').trim();
		const formMajor = majorStr === '' ? null : isNaN(Number(majorStr)) ? null : Number(majorStr);
		const formSevere =
			severeStr === '' ? null : isNaN(Number(severeStr)) ? null : Number(severeStr);
		const savedMajor = inventoryItem.custom_damage_thresholds.major;
		const savedSevere = inventoryItem.custom_damage_thresholds.severe;
		const thresholdsMatch =
			(formMajor === null && savedMajor === null && formSevere === null && savedSevere === null) ||
			(formMajor !== null &&
				savedMajor !== null &&
				formMajor === savedMajor &&
				formSevere !== null &&
				savedSevere !== null &&
				formSevere === savedSevere);

		return namesMatch && tiersMatch && maxArmorMatch && thresholdsMatch;
	});

	// Check if there are any customizations on the inventory item
	let hasCustomizations = $derived.by(() => {
		if (!inventoryItem) return false;
		return (
			inventoryItem.custom_title !== null ||
			inventoryItem.custom_level_requirement !== null ||
			inventoryItem.custom_max_armor !== null ||
			inventoryItem.custom_damage_thresholds.major !== null ||
			inventoryItem.custom_damage_thresholds.severe !== null
		);
	});

	// Update form when inventory item changes
	$effect(() => {
		if (inventoryItem && armor) {
			customName = inventoryItem.custom_title === null ? '' : inventoryItem.custom_title;
			// Convert level requirement to tier if it exists
			if (inventoryItem.custom_level_requirement !== null) {
				customTier = context.level_to_tier(inventoryItem.custom_level_requirement).toString();
			} else {
				// Use the armor's current tier
				customTier = '';
			}
			customMaxArmor =
				inventoryItem.custom_max_armor !== null ? String(inventoryItem.custom_max_armor) : '';
			customMajorThreshold =
				inventoryItem.custom_damage_thresholds.major !== null
					? String(inventoryItem.custom_damage_thresholds.major)
					: '';
			customSevereThreshold =
				inventoryItem.custom_damage_thresholds.severe !== null
					? String(inventoryItem.custom_damage_thresholds.severe)
					: '';
		} else {
			customName = '';
			customTier = '';
			customMaxArmor = '';
			customMajorThreshold = '';
			customSevereThreshold = '';
		}
	});

	function handleSave() {
		if (!character || !inventoryItem || !armorId) return;

		const item = character.inventory.armor[armorId];
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

		// Update max armor
		const trimmedMaxArmor = String(customMaxArmor ?? '').trim();
		if (trimmedMaxArmor) {
			const maxArmorNum = Number(trimmedMaxArmor);
			if (!isNaN(maxArmorNum) && maxArmorNum > 0) {
				item.custom_max_armor = maxArmorNum;
			} else {
				item.custom_max_armor = null;
			}
		} else {
			item.custom_max_armor = null;
		}

		// Update damage thresholds
		const trimmedMajor = String(customMajorThreshold ?? '').trim();
		const trimmedSevere = String(customSevereThreshold ?? '').trim();
		if (trimmedMajor) {
			const majorNum = Number(trimmedMajor);
			if (!isNaN(majorNum) && majorNum > 0) {
				item.custom_damage_thresholds.major = majorNum;
			} else {
				item.custom_damage_thresholds.major = null;
			}
		} else {
			item.custom_damage_thresholds.major = null;
		}
		if (trimmedSevere) {
			const severeNum = Number(trimmedSevere);
			if (!isNaN(severeNum) && severeNum > 0) {
				item.custom_damage_thresholds.severe = severeNum;
			} else {
				item.custom_damage_thresholds.severe = null;
			}
		} else {
			item.custom_damage_thresholds.severe = null;
		}
	}

	function handleClear() {
		customName = '';
		customTier = '';
		customMaxArmor = '';
		customMajorThreshold = '';
		customSevereThreshold = '';
		tierError = null;
		handleSave();
	}
</script>

{#if armor}
	<Sheet.Header>
		<Sheet.Title>{armor.title}</Sheet.Title>
		{#if armor.compendium_id !== 'unarmored'}
			<p class="flex items-center gap-1.5 text-xs text-muted-foreground italic">
				{#if armor.source_id === 'Homebrew'}
					<HomebrewBadge type="armor" id={armor.compendium_id} class="-mt-0.5 size-4" />
				{:else if armor.source_id === 'Campaign'}
					<CampaignBadge type="armor" id={armor.compendium_id} class="-mt-0.5 size-4" />
				{/if}
				Tier {context.level_to_tier(armor.level_requirement)}
			</p>
		{/if}
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		{#if armor.description_html}
			<p class="py-4 text-sm">{@html renderMarkdown(armor.description_html)}</p>
		{/if}

		<!-- Stats Table -->
		<table class="w-full border-collapse text-sm">
			<tbody>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Base Armor Score</th>
					<td class="py-2 text-right">
						{armor.max_armor}
						<Shield class="-mt-0.5 ml-0.5 inline-block size-3.5" />
					</td>
				</tr>
				<tr>
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground"
						>Base Damage Thresholds</th
					>
					<td class="py-2 text-right"
						>{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}</td
					>
				</tr>
			</tbody>
		</table>

		<!-- Features -->
		{#if armor.features.length > 0}
			<div class="rounded-lg border bg-primary/5 px-4 py-3">
				<div class="flex items-center justify-between">
					<p class="text-sm">Features</p>
				</div>
				<div class="mt-3 space-y-3">
					{#each armor.features as feature}
						<div class="border-l-2 border-accent/30 pl-3">
							<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">
								{@html renderMarkdown(feature.description_html)}
							</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if inventoryItem && context.canEdit}
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
				<Collapsible.Content class="flex flex-col gap-3 rounded-b-md border bg-card/50 p-2">
					<div class="flex flex-col gap-1">
						<label for="custom-name" class="text-xs font-medium text-muted-foreground">Name</label>
						<Input id="custom-name" bind:value={customName} />
					</div>
					<div class="flex flex-col gap-1">
						<label for="custom-tier" class="text-xs font-medium text-muted-foreground">Tier</label>
						<Input
							id="custom-tier"
							type="number"
							inputmode="numeric"
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
					<div class="flex flex-col gap-1">
						<label for="custom-max-armor" class="text-xs font-medium text-muted-foreground"
							>Base Armor Score</label
						>
						<Input
							id="custom-max-armor"
							type="number"
							inputmode="numeric"
							bind:value={customMaxArmor}
							min="0"
							step="1"
						/>
					</div>
					<div class="flex flex-col gap-1">
						<div class="flex gap-2">
							<div class="flex flex-1 flex-col gap-1">
								<label for="custom-major-threshold" class="text-xs text-muted-foreground"
									>Major Threshold</label
								>
								<Input
									id="custom-major-threshold"
									type="number"
									inputmode="numeric"
									bind:value={customMajorThreshold}
									min="0"
									step="1"
								/>
							</div>
							<div class="flex flex-1 flex-col gap-1">
								<label for="custom-severe-threshold" class="text-xs text-muted-foreground"
									>Severe Threshold</label
								>
								<Input
									id="custom-severe-threshold"
									type="number"
									inputmode="numeric"
									bind:value={customSevereThreshold}
									min="0"
									step="1"
								/>
							</div>
						</div>
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

		<Collapsible.Root bind:open={whatIsArmorOpen} class="pt-2">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight class={cn('size-4 transition-transform', whatIsArmorOpen && 'rotate-90')} />
				<p class="text-sm font-medium">More info</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<ArmorRules class="pt-2 pl-5" />
			</Collapsible.Content>
		</Collapsible.Root>
	</div>

	{#if inventoryItem}
		<Sheet.Footer>
			<Sheet.Close
				class={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'text-destructive')}
				onclick={() => {
					context.removeFromInventory({ id: armorId }, 'armor');
				}}
			>
				Remove
			</Sheet.Close>
		</Sheet.Footer>
	{/if}
{/if}
