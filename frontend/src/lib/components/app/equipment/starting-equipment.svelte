<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { getCharacterContext } from "$lib/state/character.svelte";
  import type { Weapon, Armor, Loot, Consumable, AdventuringGear } from "$lib/types/compendium-types";
  import { cn } from "$lib/utils";
  import ArmorCard from "./armor.svelte";
  import { getCompendiumContext } from "$lib/state/compendium.svelte";

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

  // Get suggested items
  let suggestedPrimaryWeapon = $derived.by(() => {
    if (!primary_class?.suggested_primary_weapon_id) return null;
    return compendium.primary_weapons[primary_class.suggested_primary_weapon_id];
  });

  let suggestedSecondaryWeapon = $derived.by(() => {
    if (!primary_class?.suggested_secondary_weapon_id) return null;
    return compendium.secondary_weapons[primary_class.suggested_secondary_weapon_id];
  });

  let suggestedArmor = $derived.by(() => {
    if (!primary_class?.suggested_armor_id) return null;
    return compendium.armor[primary_class.suggested_armor_id];
  });

  // Get loot options (can be either loot or consumables)
  type LootOption =
    | { id: string; item: Loot; type: "loot" }
    | { id: string; item: Consumable; type: "consumable" };

  let lootOptions = $derived.by(() => {
    if (!primary_class?.starting_inventory.loot_or_consumable_options) return [] as LootOption[];
    return primary_class.starting_inventory.loot_or_consumable_options
      .map((id): LootOption | null => {
        // Try loot first, then consumable
        const loot = compendium.loot[id];
        if (loot) return { id, item: loot, type: "loot" as const };
        const consumable = compendium.consumables[id];
        if (consumable) return { id, item: consumable, type: "consumable" as const };
        return null;
      })
      .filter((option): option is LootOption => option !== null);
  });

  // Get class gear options
  let classGearOptions = $derived(primary_class?.starting_inventory.class_gear_options || []);

  // Check if button should be enabled (at least one checkbox must be checked)
  let canAddStartingEquipment = $derived.by(() => {
    // Check if any of the main equipment checkboxes are selected
    const hasMainEquipment =
      (suggestedPrimaryWeapon && selectedPrimaryWeapon) ||
      (suggestedSecondaryWeapon && selectedSecondaryWeapon) ||
      (suggestedArmor && selectedArmor) ||
      selectedSupplies ||
      selectedLootOption !== null ||
      selectedClassGearOption !== null;

    return hasMainEquipment;
  });

  // Convert gold coins to descriptive English
  // 1 chest = 1000 coins, 1 bag = 100 coins, 1 handful = 10 coins
  // Always rounds up to the nearest handful
  function formatGoldCoins(coins: number): string {
    if (coins === 0) return "no gold";

    // Calculate units (round up to nearest handful)
    const chests = Math.floor(coins / 1000);
    let remaining = coins % 1000;
    const bags = Math.floor(remaining / 100);
    remaining = remaining % 100;
    const handfuls = Math.ceil(remaining / 10);

    // Build the description
    const parts: string[] = [];

    if (chests > 0) {
      parts.push(chests === 1 ? "a chest" : `${chests} chests`);
    }

    if (bags > 0) {
      parts.push(bags === 1 ? "a bag" : `${bags} bags`);
    }

    if (handfuls > 0) {
      parts.push(handfuls === 1 ? "a handful" : `${handfuls} handfuls`);
    }

    // Format with proper grammar
    if (parts.length === 0) {
      return "no gold";
    } else if (parts.length === 1) {
      return `${parts[0]} of gold`;
    } else if (parts.length === 2) {
      return `${parts[0]} and ${parts[1]} of gold`;
    } else {
      // 3+ parts: "a chest, 3 bags, and 5 handfuls of gold"
      const lastPart = parts.pop();
      return `${parts.join(", ")}, and ${lastPart} of gold`;
    }
  }

  // Functions to add items
  function addPrimaryWeaponToInventory(weapon: Weapon) {
    if (!character || !weapon) return;
    // Only add if not already in inventory
    if (!(weapon.id in character.inventory.primary_weapons)) {
      character.inventory.primary_weapons[weapon.id] = {
        quantity: 1,
        choices: {},
      };
    } else {
      character.inventory.primary_weapons[weapon.id].quantity++;
    }
  }

  function addSecondaryWeaponToInventory(weapon: Weapon) {
    if (!character || !weapon) return;
    // Only add if not already in inventory
    if (!(weapon.id in character.inventory.secondary_weapons)) {
      character.inventory.secondary_weapons[weapon.id] = {
        quantity: 1,
        choices: {},
      };
    } else {
      character.inventory.secondary_weapons[weapon.id].quantity++;
    }
  }

  function addArmorToInventory(armor: Armor) {
    if (!character || !armor) return;
    if (!(armor.id in character.inventory.armor)) {
      character.inventory.armor[armor.id] = {
        quantity: 1,
        choices: {},
      };
    } else {
      character.inventory.armor[armor.id].quantity++;
    }
  }

  function addLootToInventory(lootId: string, type: "loot" | "consumable") {
    if (!character) return;
    if (type === "loot") {
      if (!(lootId in character.inventory.loot)) {
        character.inventory.loot[lootId] = {
          quantity: 1,
          choices: {},
        };
      } else {
        character.inventory.loot[lootId].quantity++;
      }
    } else {
      // It's a consumable
      if (!(lootId in character.inventory.consumables)) {
        character.inventory.consumables[lootId] = {
          quantity: 1,
          choices: {},
        };
      } else {
        character.inventory.consumables[lootId].quantity++;
      }
    }
  }

  function addAdventuringGear(gear: AdventuringGear) {
    if (!character) return;
    character.inventory.adventuring_gear.push({ ...gear, quantity: 1 });
  }

  function addStartingEquipment() {
    if (!character || !primary_class) return;

    // Add selected primary weapon
    if (selectedPrimaryWeapon && suggestedPrimaryWeapon) {
      addPrimaryWeaponToInventory(suggestedPrimaryWeapon);
    }

    // Add selected secondary weapon
    if (selectedSecondaryWeapon && suggestedSecondaryWeapon) {
      addSecondaryWeaponToInventory(suggestedSecondaryWeapon);
    }

    // Add selected armor
    if (selectedArmor && suggestedArmor) {
      addArmorToInventory(suggestedArmor);
    }

    // Add selected supplies (gold and free gear)
    if (selectedSupplies) {
      character.inventory.gold_coins += primary_class.starting_inventory.gold_coins;
      primary_class.starting_inventory.free_gear.forEach((gear) => {
        addAdventuringGear(gear);
      });
    }

    // Add selected loot option
    if (selectedLootOption) {
      const option = lootOptions.find((opt) => opt.id === selectedLootOption);
      if (option) {
        addLootToInventory(selectedLootOption, option.type);
      }
    }

    // Add selected class gear option
    if (selectedClassGearOption !== null) {
      const gear = classGearOptions[selectedClassGearOption];
      if (gear) {
        addAdventuringGear(gear);
      }
    }

    // Reset the selections
    selectedPrimaryWeapon = false;
    selectedSecondaryWeapon = false;
    selectedArmor = false;
    selectedSupplies = false;
    selectedLootOption = null;
    selectedClassGearOption = null;
  }
</script>

{#if character && primary_class}
  <div class="flex flex-col gap-3">
    <!-- Starting Equipment List -->
    <p class="text-xs uppercase font-medium text-center text-muted-foreground">Take:</p>
    <div
      class={cn(
        "flex flex-col gap-3 pb-6 pt-1 px-4 text-sm rounded-xl bg-background border text-wrap",
        (selectedPrimaryWeapon || selectedSecondaryWeapon || selectedArmor || selectedSupplies) &&
          "bg-muted/50 border-primary/50"
      )}
    >
      <Button
        variant="link"
        size="sm"
        class="italic w-min p-0 -mb-2"
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
            "text-muted-foreground cursor-pointer font-normal text-sm",
            selectedPrimaryWeapon && "text-foreground"
          )}
        >
          <Checkbox bind:checked={selectedPrimaryWeapon} />
          <span class="font-bold">Primary weapon:</span>
          {suggestedPrimaryWeapon.title}
        </Label>
      {/if}

      <!-- Secondary Weapon -->
      {#if suggestedSecondaryWeapon}
        <Label
          class={cn(
            "text-muted-foreground cursor-pointer font-normal text-sm",
            selectedSecondaryWeapon && " text-foreground"
          )}
        >
          <Checkbox bind:checked={selectedSecondaryWeapon} />
          <span class="font-bold">Secondary weapon:</span>
          {suggestedSecondaryWeapon.title}
        </Label>
      {/if}

      <!-- Armor -->
      {#if suggestedArmor}
        <Label
          class={cn(
            "text-muted-foreground cursor-pointer font-normal text-sm",
            selectedArmor && "text-foreground"
          )}
        >
          <Checkbox bind:checked={selectedArmor} />
          <span class="font-bold">Armor:</span>
          {suggestedArmor.title}
        </Label>
      {/if}

      <!-- Supplies (Free Gear + Gold) -->
      <Label
        class={cn(
          "text-muted-foreground cursor-pointer font-normal text-sm",
          selectedSupplies && "text-foreground"
        )}
      >
        <Checkbox bind:checked={selectedSupplies} />
        {primary_class.starting_inventory.free_gear.map((gear) => gear.title).join(", ")}, and {formatGoldCoins(
          primary_class.starting_inventory.gold_coins
        )}
      </Label>
    </div>

    <!-- Loot Options (Choose One) -->
    {#if lootOptions.length > 0}
      <p class="text-xs uppercase font-medium text-center text-muted-foreground">
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
              "text-muted-foreground flex-1 py-3 px-4 text-sm  rounded-xl bg-background border cursor-pointer text-wrap",
              isChecked && "bg-muted/50 border-primary/50 text-foreground"
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
      <p class="text-xs uppercase font-medium text-center text-muted-foreground">And Either:</p>
      <div class="flex gap-2">
        {#each classGearOptions as gear, index}
          {@const isChecked = selectedClassGearOption === index}
          <!-- {#if index !== 0}
              <p class="my-auto text-sm font-medium text-muted-foreground">OR</p>
            {/if} -->
          <Label
            class={cn(
              "text-muted-foreground flex-1 py-3 px-4 text-sm  rounded-xl bg-background border cursor-pointer text-wrap",
              isChecked && "bg-muted/50 border-primary/50 text-foreground "
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

    <!-- Add Starting Equipment Button -->
    <Button
      onclick={addStartingEquipment}
      class="w-min mx-auto mt-3 rounded-full px-6"
      variant={canAddStartingEquipment ? "default" : "outline"}
      disabled={!canAddStartingEquipment}
    >
      Add Starting Equipment
    </Button>
  </div>
{:else if !primary_class}
  <p class="text-sm text-muted-foreground text-center py-4">Please select a class first</p>
{/if}
