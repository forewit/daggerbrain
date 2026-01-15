<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import type { Loot, Consumable } from '@shared/types/compendium.types';
	import { cn } from '$lib/utils';
	import ArmorCard from './armor.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { toast } from 'svelte-sonner';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let primary_class = $derived(context.primary_class);

	const compendium = getCompendiumContext();

	// State for checkbox selections
	let selectedPrimaryWeapon = $state(false);
	let selectedSecondaryWeapon = $state(false);
	let selectedArmor = $state(false);
	let selectedSupplies = $state(false);

	// State for radio button selections (only one per group)
	let selectedLootOption = $state<string | null>(null);
	let selectedClassGearOption = $state<number | null>(null);

	// State for spellbook input
	let spellbookInput = $state('');

	// Get suggested items
	let suggestedPrimaryWeapon = $derived.by(() => {
		if (!primary_class?.suggested_primary_weapon_id) return null;
		return compendium.primary_weapons[primary_class.suggested_primary_weapon_id] || null;
	});

	let suggestedSecondaryWeapon = $derived.by(() => {
		if (!primary_class?.suggested_secondary_weapon_id) return null;
		return compendium.secondary_weapons[primary_class.suggested_secondary_weapon_id] || null;
	});

	let suggestedArmor = $derived.by(() => {
		if (!primary_class?.suggested_armor_id) return null;
		return compendium.armor[primary_class.suggested_armor_id] || null;
	});

	// Get loot options (can be either loot or consumables)
	type LootOption =
		| { id: string; item: Loot; type: 'loot' }
		| { id: string; item: Consumable; type: 'consumable' };

	let lootOptions = $derived.by(() => {
		if (!primary_class?.starting_inventory.loot_or_consumable_options) return [] as LootOption[];
		return primary_class.starting_inventory.loot_or_consumable_options
			.map((id): LootOption | null => {
				// Try loot first, then consumable
				const loot = compendium.loot[id];
				if (loot) return { id, item: loot, type: 'loot' as const };
				const consumable = compendium.consumables[id];
				if (consumable) return { id, item: consumable, type: 'consumable' as const };
				return null;
			})
			.filter((option): option is LootOption => option !== null);
	});

	// Get class gear options
	let classGearOptions = $derived(primary_class?.starting_inventory.class_gear_options || []);

	// Get spellbook prompt
	let spellbookPrompt = $derived(primary_class?.starting_inventory.spellbook_prompt || null);

	// Check if button should be enabled (at least one checkbox must be checked)
	let canAddStartingEquipment = $derived.by(() => {
		// Check if any of the main equipment checkboxes are selected
		const hasMainEquipment =
			(suggestedPrimaryWeapon && selectedPrimaryWeapon) ||
			(suggestedSecondaryWeapon && selectedSecondaryWeapon) ||
			(suggestedArmor && selectedArmor) ||
			selectedSupplies ||
			selectedLootOption !== null ||
			selectedClassGearOption !== null ||
			spellbookInput.trim() !== '';

		return hasMainEquipment;
	});

	// Convert gold coins to descriptive English
	// 1 chest = 1000 coins, 1 bag = 100 coins, 1 handful = 10 coins
	// Always rounds up to the nearest handful
	function formatGoldCoins(coins: number): string {
		if (coins === 0) return 'no gold';

		// Calculate units (round up to nearest handful)
		const chests = Math.floor(coins / 1000);
		let remaining = coins % 1000;
		const bags = Math.floor(remaining / 100);
		remaining = remaining % 100;
		const handfuls = Math.ceil(remaining / 10);

		// Build the description
		const parts: string[] = [];

		if (chests > 0) {
			parts.push(chests === 1 ? 'a chest' : `${chests} chests`);
		}

		if (bags > 0) {
			parts.push(bags === 1 ? 'a bag' : `${bags} bags`);
		}

		if (handfuls > 0) {
			parts.push(handfuls === 1 ? 'a handful' : `${handfuls} handfuls`);
		}

		// Format with proper grammar
		if (parts.length === 0) {
			return 'no gold';
		} else if (parts.length === 1) {
			return `${parts[0]} of gold`;
		} else if (parts.length === 2) {
			return `${parts[0]} and ${parts[1]} of gold`;
		} else {
			// 3+ parts: "a chest, 3 bags, and 5 handfuls of gold"
			const lastPart = parts.pop();
			return `${parts.join(', ')}, and ${lastPart} of gold`;
		}
	}

	function addStartingEquipment() {
		if (!character || !primary_class) return;

		// Add selected primary weapon
		if (selectedPrimaryWeapon && suggestedPrimaryWeapon) {
			context.addToInventory(suggestedPrimaryWeapon, 'primary_weapon');
		}

		// Add selected secondary weapon
		if (selectedSecondaryWeapon && suggestedSecondaryWeapon) {
			context.addToInventory(suggestedSecondaryWeapon, 'secondary_weapon');
		}

		// Add selected armor
		if (selectedArmor && suggestedArmor) {
			context.addToInventory(suggestedArmor, 'armor');
		}

		// Add selected supplies (gold and free gear)
		if (selectedSupplies) {
			character.inventory.gold_coins += primary_class.starting_inventory.gold_coins;
			primary_class.starting_inventory.free_gear.forEach((gear) => {
				context.addToInventory(
					{ compendium_id: gear.title, title: gear.title },
					'adventuring_gear'
				);
			});
		}

		// Add selected loot option
		if (selectedLootOption) {
			const option = lootOptions.find((opt) => opt.id === selectedLootOption);
			if (option) {
				context.addToInventory(
					{ compendium_id: selectedLootOption },
					option.type === 'loot' ? 'loot' : 'consumable'
				);
			}
		}

		// Add selected class gear option
		if (selectedClassGearOption !== null) {
			const gear = classGearOptions[selectedClassGearOption];
			if (gear) {
				context.addToInventory(
					{ compendium_id: gear.title, title: gear.title },
					'adventuring_gear'
				);
			}
		}

		// Add spellbook item if input has content
		if (spellbookInput.trim() !== '') {
			context.addToInventory(
				{ compendium_id: spellbookInput.trim(), title: spellbookInput.trim() },
				'adventuring_gear'
			);
		}

		// Reset the selections
		selectedPrimaryWeapon = false;
		selectedSecondaryWeapon = false;
		selectedArmor = false;
		selectedSupplies = false;
		selectedLootOption = null;
		selectedClassGearOption = null;
		spellbookInput = '';

		toast.success('Starting equipment added');
	}
</script>

{#if character && primary_class}
	<div class="flex flex-col gap-3">
		<!-- Starting Equipment List -->
		<p class="text-center text-xs font-medium text-muted-foreground uppercase">Take:</p>
		<div
			class={cn(
				'flex flex-col gap-3 rounded-xl border bg-background px-4 pt-1 pb-6 text-sm text-wrap',
				(selectedPrimaryWeapon || selectedSecondaryWeapon || selectedArmor || selectedSupplies) &&
					'border-primary/50 bg-muted/50'
			)}
		>
			<Button
				variant="link"
				size="sm"
				class="-mb-2 w-min p-0 italic"
				onclick={() => {
					selectedPrimaryWeapon = true;
					selectedSecondaryWeapon = true;
					selectedArmor = true;
					selectedSupplies = true;
				}}>Select all?</Button
			>

			<!-- Primary Weapon -->
			{#if suggestedPrimaryWeapon}
				<Label
					class={cn(
						'cursor-pointer text-sm font-normal text-muted-foreground',
						selectedPrimaryWeapon && 'text-foreground'
					)}
				>
					<Checkbox bind:checked={selectedPrimaryWeapon} />
					<span class="font-bold">Suggested Primary weapon:</span>
					{suggestedPrimaryWeapon.title}
				</Label>
			{/if}

			<!-- Secondary Weapon -->
			{#if suggestedSecondaryWeapon}
				<Label
					class={cn(
						'cursor-pointer text-sm font-normal text-muted-foreground',
						selectedSecondaryWeapon && ' text-foreground'
					)}
				>
					<Checkbox bind:checked={selectedSecondaryWeapon} />
					<span class="font-bold">Suggested Secondary weapon:</span>
					{suggestedSecondaryWeapon.title}
				</Label>
			{/if}

			<!-- Armor -->
			{#if suggestedArmor}
				<Label
					class={cn(
						'cursor-pointer text-sm font-normal text-muted-foreground',
						selectedArmor && 'text-foreground'
					)}
				>
					<Checkbox bind:checked={selectedArmor} />
					<span class="font-bold">Suggested Armor:</span>
					{suggestedArmor.title}
				</Label>
			{/if}

			<!-- Supplies (Free Gear + Gold) -->
			<Label
				class={cn(
					'cursor-pointer text-sm font-normal text-muted-foreground',
					selectedSupplies && 'text-foreground'
				)}
			>
				<Checkbox bind:checked={selectedSupplies} />
				{primary_class.starting_inventory.free_gear.map((gear) => gear.title).join(', ')}, and {formatGoldCoins(
					primary_class.starting_inventory.gold_coins
				)}
			</Label>
		</div>

		<!-- Loot Options (Choose One) -->
		{#if lootOptions.length > 0}
			<p class="text-center text-xs font-medium text-muted-foreground uppercase">
				Then Choose Between:
			</p>
			<div class="flex gap-2">
				{#each lootOptions as option, index}
					{@const isChecked = selectedLootOption === option.id}
					<!-- {#if index !== 0}
              <p class="my-auto text-sm font-medium text-muted-foreground">OR</p>
            {/if} -->
					<Label
						class={cn(
							'flex-1 cursor-pointer rounded-xl border bg-background  px-4 py-3 text-sm text-wrap text-muted-foreground',
							isChecked && 'border-primary/50 bg-muted/50 text-foreground'
						)}
					>
						<Checkbox
							checked={isChecked}
							onCheckedChange={() => {
								// Radio button behavior: only one can be selected
								selectedLootOption = isChecked ? null : option.id;
							}}
						/>
						{option.item.title}
					</Label>
				{/each}
			</div>
		{/if}

		<!-- Class Gear Options (Choose One) -->
		{#if classGearOptions.length > 0}
			<p class="text-center text-xs font-medium text-muted-foreground uppercase">And Either:</p>
			<div class="flex gap-2">
				{#each classGearOptions as gear, index}
					{@const isChecked = selectedClassGearOption === index}
					<!-- {#if index !== 0}
              <p class="my-auto text-sm font-medium text-muted-foreground">OR</p>
            {/if} -->
					<Label
						class={cn(
							'flex-1 cursor-pointer rounded-xl border bg-background  px-4 py-3 text-sm text-wrap text-muted-foreground',
							isChecked && 'border-primary/50 bg-muted/50 text-foreground '
						)}
					>
						<Checkbox
							checked={isChecked}
							onCheckedChange={() => {
								// Radio button behavior: only one can be selected
								selectedClassGearOption = isChecked ? null : index;
							}}
						/>
						{gear.title}
					</Label>
				{/each}
			</div>
		{/if}

		<!-- Spellbook Options -->
		{#if spellbookPrompt}
			<p class="text-center text-xs font-medium text-muted-foreground uppercase">
				Decide What You Carry Your Spells In:
			</p>

			<Input
				bind:value={spellbookInput}
				placeholder={spellbookPrompt}
				class={cn(
					'h-12 rounded-xl border bg-background px-4',
					spellbookInput.trim() !== '' && 'border-primary/50 bg-muted/50'
				)}
			/>
		{/if}

		<!-- Add Starting Equipment Button -->
		<Button
			onclick={addStartingEquipment}
			class="mx-auto mt-3 w-min rounded-full px-6"
			variant={canAddStartingEquipment ? 'default' : 'outline'}
			disabled={!canAddStartingEquipment}
		>
			Add Starting Equipment
		</Button>
	</div>
{:else if !primary_class}
	<p class="py-4 text-center text-sm text-muted-foreground">Please select a class first</p>
{/if}
