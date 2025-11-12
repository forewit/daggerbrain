<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, capitalize } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Shield from "@lucide/svelte/icons/shield";
  import Hand from "@lucide/svelte/icons/hand";
  import { getCharacterContext } from "$lib/ts/character/character.svelte.js";

  let { data } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
  <div
    class={cn(
      //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <Dropdown title="Starting Equipment"></Dropdown>
      <Dropdown title="Inventory">
        <div class="flex flex-col gap-4">
          <div class="bg-primary/50 p-2 rounded-md">
            <!-- Armor Slot -->
            <p class="text-sm font-medium pb-2 pt-1 px-1">Active Armor</p>
            <div class="flex gap-2 items-center flex-wrap justify-end">
              {#if context.armor !== null}
                <div
                  class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex justify-end items-center gap-3 grow"
                >
                  <p class="text-sm grow">{context.armor.title}</p>

                  <div class="flex flex-wrap items-center gap-1 justify-end">
                    <div
                      class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1"
                    >
                      {context.armor.max_armor}<Shield class="size-3.5" />
                    </div>
                    <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                      {context.armor.damage_thresholds.major} / {context.armor.damage_thresholds
                        .severe}
                    </div>
                  </div>
                </div>
                <Button
                  variant="link"
                  class="text-destructive"
                  onclick={() => (character.armor_id = null)}>Unequip</Button
                >
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

              {#if context.primary_weapon !== null}
                <div class="flex gap-2 items-center flex-wrap justify-end">
                  <div
                    class="relative bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center justify-end gap-3 grow"
                  >
                    <div class="grow flex flex-col">
                      <p class="text-sm">{context.primary_weapon.title}</p>
                      <p class="text-xs text-muted-foreground italic">
                        {context.primary_weapon.category}
                      </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-1 justify-end">
                      <div
                        class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1"
                      >
                        {context.primary_weapon.burden}<Hand class="size-3.5" />
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {context.primary_weapon.damage_dice}
                        !!damage_type selector!!
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        !!trait selector!!
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {context.primary_weapon.range}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="link"
                    class="text-destructive"
                    onclick={() => {
                      character.primary_weapon_id = null;
                    }}>Unequip</Button
                  >
                </div>
              {:else}
                <div
                  class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center gap-3 grow truncate"
                >
                  <p class="text-sm text-muted-foreground">No Primary Weapon</p>
                </div>
              {/if}
              {#if context.secondary_weapon !== null}
                <div class="flex gap-2 items-center flex-wrap justify-end">
                  <div
                    class="relative bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center justify-end gap-3 grow"
                  >
                    <div class="grow flex flex-col">
                      <p class="text-sm">{context.secondary_weapon.title}</p>
                      <p class="text-xs text-muted-foreground italic">
                        {context.secondary_weapon.category}
                      </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-1 justify-end">
                      <div
                        class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1"
                      >
                        {context.secondary_weapon.burden}<Hand class="size-3.5" />
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {context.secondary_weapon.damage_dice}
                        <!-- {context.secondary_weapon.damage_type} -->
                         !!damage_type selector!!
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        <!-- {capitalize(context.secondary_weapon.trait)} -->
                         !!trait selector!!
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {context.secondary_weapon.range}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="link"
                    class="text-destructive"
                    onclick={() => {
                      character.secondary_weapon_id = null;
                    }}>Unequip</Button
                  >
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
      </Dropdown>
    </div>
  </div>
{/if}
