<script lang="ts">
  import CardCarousel from "$lib/components/app/cards/card-carousel.svelte";
  import Stress from "$lib/components/app/sheet/stress.svelte";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import type { Card, Character } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Tent from "@lucide/svelte/icons/tent";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import ArrowDown from "@lucide/svelte/icons/arrow-down";
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import * as Drawer from "$lib/components/ui/drawer";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
  import SquareStack from "@lucide/svelte/icons/square-stack";

  let { character = $bindable(), class: className = "" }: { character: Character; class?: string } =
    $props();

  let loadout: Card<"domain">[] = $derived(
    character?.ephemeral_stats.domain_card_loadout.map(
      (i) => character.derived_domain_card_vault[i]
    ) || []
  );

  let vault: Card<"domain">[] = $derived(
    (character?.derived_domain_card_vault || []).filter(
      (card) => !loadout.some((loadoutCard) => loadoutCard.title === card.title)
    )
  );

  let selectedVaultIndex = $state(0);
  let selectedVaultCard = $derived(vault[selectedVaultIndex]);
  $inspect(selectedVaultCard);

  let selectedLoadoutIndex = $state(0);

  let restMode = $state(false);
  let expanded = $state(true);

  let remainingStress = $derived(
    character ? character.derived_stats.max_stress - character.ephemeral_stats.marked_stress : 0
  );
</script>

{#if character}
  <div class={cn("", !expanded && "-mb-4")}>
    <div class="flex items-center justify-center gap-4 z-20 mb-4">
      <button
        onclick={() => (expanded = !expanded)}
        class="text-nowrap flex items-center font-medium text-muted-foreground"
      >
        {#if expanded}
          <ChevronDown class="w-k h-4" />
        {:else}
          <ChevronRight class="w-k h-4" />
        {/if}
        Loadout
      </button>
      <div class="flex items-center text-sm h-6 px-3 rounded-full font-medium text-muted-foreground border bg-muted">
        {loadout.length} / {character?.derived_stats.max_domain_card_loadout}
      </div>
      <Drawer.Root>
        <Drawer.Trigger class={cn(buttonVariants({ size: "sm" }))}>
            <ArrowLeftRight class="size-3" />

          Vault
        </Drawer.Trigger>
        <Drawer.Content>
          <div class="overflow-y-auto w-full">
            <!-- vault -->
            <div class="relative mb-4 mt-3 w-full">
              <p class="text-center font-medium text-xl font-eveleth">
                Vault
                <span class="ml-2 py-1 px-3 bg-accent/20 rounded-xl font-bold text-lg">
                  {vault.length}
                </span>
              </p>

              {#if vault.length > 0}
                <CardCarousel
                  cards={vault}
                  bind:selectedIndex={selectedVaultIndex}
                  cardWidth={200}
                />
              {/if}
              {#if restMode}
                <Button
                  hidden={vault.length === 0}
                  onclick={() => {
                    if (!character) return;
                    if (
                      character.ephemeral_stats.domain_card_loadout.length <
                      character.derived_stats.max_domain_card_loadout
                    ) {
                      const vaultIndex = character.derived_domain_card_vault.findIndex(
                        (card) => card.title === vault[selectedVaultIndex].title
                      );
                      character.ephemeral_stats.domain_card_loadout.push(vaultIndex);
                    }
                  }}
                  class="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                  size="sm"
                >
                  <ArrowUp class="size-4" />
                  Add to loadout
                </Button>
              {:else}
                <Button
                  hidden={vault.length === 0}
                  size="sm"
                  onclick={() => {
                    if (!character) return;
                    if (
                      character.ephemeral_stats.domain_card_loadout.length <
                        character.derived_stats.max_domain_card_loadout &&
                      selectedVaultCard?.recall_cost <= remainingStress
                    ) {
                      character.ephemeral_stats.marked_stress += selectedVaultCard.recall_cost;
                      const vaultIndex = character.derived_domain_card_vault.findIndex(
                        (card) => card.title === vault[selectedVaultIndex].title
                      );
                      character.ephemeral_stats.domain_card_loadout.push(vaultIndex);
                    }
                  }}
                  class={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full",
                    selectedVaultCard?.recall_cost > remainingStress &&
                      "border-destructive border-3 bg-muted hover:bg-muted cursor-default"
                  )}
                >
                  {#if selectedVaultCard?.recall_cost > remainingStress}
                    Not enough stress slots
                  {:else}
                    <ArrowUp class="size-4" />
                    Recall ({selectedVaultCard?.recall_cost} stress)
                  {/if}
                </Button>
              {/if}
            </div>

            <!-- Rest Mode -->
            <div class="flex justify-center gap-4 pb-6 flex-wrap">
              <Label
                class={cn(
                  "flex items-center px-3 h-10 rounded-full border w-min hover:cursor-pointer text-nowrap",
                  restMode ? "bg-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <Switch
                  bind:checked={restMode}
                  class="data-[state=checked]:bg-primary-muted/20 data-[state=unchecked]:bg-foreground/10"
                />
                <Tent class="size-4" />
                <p>Rest Mode</p>
              </Label>
              {#if !restMode}
                <Stress {character} class="bg-muted h-10 rounded-full" displayOnly />
              {/if}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </div>
    {#if expanded}
      <div class="relative">
        <CardCarousel cards={loadout} bind:selectedIndex={selectedLoadoutIndex} />
        <Button
          hidden={loadout.length === 0}
          size="sm"
          onclick={() => {
            character.ephemeral_stats.domain_card_loadout.splice(selectedLoadoutIndex, 1);
          }}
          class="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
        >
          Move to Vault
          <ArrowUpRight class="size-4" />
        </Button>
      </div>
    {/if}
  </div>
{/if}
