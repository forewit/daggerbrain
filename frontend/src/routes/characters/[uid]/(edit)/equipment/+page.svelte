<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, capitalize } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Shield from "@lucide/svelte/icons/shield";
  import Hand from "@lucide/svelte/icons/hand";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
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
              {#if character.active_armor !== null}
                <div
                  class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex justify-end items-center gap-3 grow"
                >
                  <p class="text-sm grow">{character.active_armor.title}</p>

                  <div class="flex flex-wrap items-center gap-1 justify-end">
                    <div
                      class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1"
                    >
                      {character.active_armor.max_armor}<Shield class="size-3.5" />
                    </div>
                    <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                      {character.active_armor.damage_thresholds.major} / {character.active_armor
                        .damage_thresholds.severe}
                    </div>
                  </div>
                </div>
                <Button
                  variant="link"
                  class="text-destructive"
                  onclick={() => (character.active_armor = null)}>Unequip</Button
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

              {#each character.active_weapons as weapon, i}
                <div class="flex gap-2 items-center flex-wrap justify-end">
                  <div
                    class="relative bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center justify-end gap-3 grow"
                  >
                    <div class="grow flex flex-col">
                      <p class="text-sm">{weapon.title}</p>
                      <p class="text-xs text-muted-foreground italic">{weapon.category}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-1 justify-end">
                      <div
                        class="text-xs flex items-center gap-1 bg-primary-muted rounded-full px-2 py-1"
                      >
                        {weapon.burden}<Hand class="size-3.5" />
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {weapon.damage}
                        {weapon.damage_type}
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {capitalize(weapon.trait)}
                      </div>
                      <div class="text-xs bg-primary-muted rounded-full px-2 py-1">
                        {weapon.range}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="link"
                    class="text-destructive"
                    onclick={() => character.active_weapons.splice(i, 1)}>Unequip</Button
                  >
                </div>
              {/each}

              {#if character.active_weapons.length === 0}
                <div
                  class="bg-card/50 rounded-md px-4 min-h-10 py-2 flex items-center gap-3 grow truncate"
                >
                  <p class="text-sm text-muted-foreground">None</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </Dropdown>
    </div>
  </div>
{/if}
