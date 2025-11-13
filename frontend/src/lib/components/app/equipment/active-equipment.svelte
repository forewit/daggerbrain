<script lang="ts">
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import WeaponCard from "$lib/components/app/equipment/weapon-card.svelte";
  import ArmorCard from "$lib/components/app/equipment/armor-card.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CircleMinus from "@lucide/svelte/icons/circle-minus";

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

<div class="bg-primary/50 p-2 rounded-md">
  <!-- Armor Slot -->
  <p class="text-sm font-medium pb-2 pt-1 px-1">Active Armor</p>
  <div class="flex items-center flex-wrap justify-end">
    {#if context.armor !== null}
      <div class="grow">
        <ArmorCard armor={context.armor} />
      </div>
      <Button
        size="icon"
        variant="link"
        onclick={() => {
          if (character) character.armor_id = null;
        }}
      >
        <CircleMinus class="size-4" />
      </Button>
    {:else}
      <div
        class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center gap-3 grow truncate"
      >
        <p class="text-sm text-muted-foreground">Unarmored</p>
      </div>
    {/if}
  </div>

  <!-- Active Weapons -->
  <div class="grow">
    <p class="text-sm font-medium pb-1 pt-4 px-1">Active Weapons</p>
    <p class="text-xs italic text-muted-foreground pb-2 px-1">
      You can only equip one primary and one secondary weapon. Maximum burden is 2 hands.
    </p>

    <div class="flex flex-col gap-2">
      {#if context.primary_weapon !== null}
        <div class="flex items-center flex-wrap justify-end">
          <div class="grow">
            <WeaponCard weapon={context.primary_weapon} bind_choices={true} />
          </div>
          <Button
            size="icon"
            variant="link"
            onclick={() => {
              if (character) character.primary_weapon_id = null;
            }}
          >
            <CircleMinus class="size-4" />
          </Button>
        </div>
      {:else}
        <div
          class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center gap-3 grow truncate"
        >
          <p class="text-sm text-muted-foreground">No Primary Weapon</p>
        </div>
      {/if}
      {#if context.secondary_weapon !== null}
        <div class="flex items-center flex-wrap justify-end">
          <div class="grow">
            <WeaponCard weapon={context.secondary_weapon} bind_choices={true} />
          </div>
          <Button
            size="icon"
            variant="link"
            onclick={() => {
              if (character) character.secondary_weapon_id = null;
            }}
          >
            <CircleMinus class="size-4" />
          </Button>
        </div>
      {:else}
        <div
          class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center gap-3 grow truncate"
        >
          <p class="text-sm text-muted-foreground">No Secondary Weapon</p>
        </div>
      {/if}
    </div>
  </div>
</div>

