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
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import * as Dialog from "$lib/components/ui/dialog";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";

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

  let selectedLoadoutIndex = $state(0);

  let restMode = $state(false);
  let expanded = $state(true);

  let remainingStress = $derived(
    character ? character.derived_stats.max_stress - character.ephemeral_stats.marked_stress : 0
  );
</script>

{#if character}
  <div class={cn(!expanded && "-mb-4", className)}>
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
      <div
        class="flex items-center text-sm h-6 px-3 rounded-full font-medium text-muted-foreground border bg-muted"
      >
        {loadout.length} / {character?.derived_stats.max_domain_card_loadout}
      </div>
      <Dialog.Root>
        <Dialog.Trigger class={cn(buttonVariants({ size: "sm" }))}>
          <ArrowLeftRight class="size-3" />
          Vault
        </Dialog.Trigger>
        <Dialog.Content class="px-0 flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
          <Dialog.Header class="px-6">
            <Dialog.Title>
              Vault
              <!-- <span class="ml-1 py-1 px-3 bg-accent/20 rounded-full font-medium text-md">
                {vault.length}
              </span> -->
            </Dialog.Title>
          </Dialog.Header>
          <div class="flex flex-col overflow-y-auto">
            <!-- vault -->
            <div class="relative mb-5 shrink">
              <CardCarousel
                cards={vault}
                bind:selectedIndex={selectedVaultIndex}
                emptyMessage="Vault Empty"
              />
              {#if vault.length > 0}
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
                    class={cn(
                      "absolute -bottom-[2px] left-1/2 -translate-x-1/2 rounded-full",
                      loadout.length >= character.derived_stats.max_domain_card_loadout &&
                        "border-destructive border-3 bg-muted hover:bg-muted cursor-default"
                    )}
                    size="sm"
                  >
                    {#if loadout.length >= character.derived_stats.max_domain_card_loadout}
                      Loadout is full
                    {:else}
                      <ArrowUp class="size-4" />
                      Add to loadout
                    {/if}
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
                      (selectedVaultCard?.recall_cost > remainingStress ||
                        loadout.length >= character.derived_stats.max_domain_card_loadout) &&
                        "border-destructive border-3 bg-muted hover:bg-muted cursor-default"
                    )}
                  >
                    {#if loadout.length >= character.derived_stats.max_domain_card_loadout}
                      Loadout is full
                    {:else if selectedVaultCard?.recall_cost > remainingStress}
                      Not enough stress slots
                    {:else}
                      <ArrowUp class="size-4" />
                      Recall ({selectedVaultCard?.recall_cost} stress)
                    {/if}
                  </Button>
                {/if}
              {/if}
            </div>

            <!-- Rest Mode -->
            <div class="px-6 flex flex-col justify-center items-center gap-3">
              {#if !restMode}
                <Stress
                  {character}
                  class={cn(
                    "bg-muted h-10 rounded-full"
                    // character.ephemeral_stats.marked_stress >= character.derived_stats.max_stress &&
                    //"border-3 border-destructive"
                  )}
                  displayOnly
                />
              {/if}
              <Label
                class={cn(
                  "flex items-center px-3 h-10 rounded-full border w-min hover:cursor-pointer text-nowrap",
                  restMode ? "bg-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <Switch
                  bind:checked={restMode}
                  class="data-[state=checked]:bg-primary-muted/50 data-[state=unchecked]:bg-foreground/20"
                />
                <Tent class="size-4" />
                <p>Rest Mode</p>
              </Label>
            </div>
          </div>
          <Dialog.Footer class="px-6">
            <Dialog.Close class={buttonVariants({ variant: "link" })}>Close</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
    {#if expanded}
      <div class="relative">
        <CardCarousel
          cards={loadout}
          bind:selectedIndex={selectedLoadoutIndex}
          emptyMessage="Loadout Empty"
        />
        <Button
          hidden={loadout.length === 0}
          size="sm"
          onclick={() => {
            character.ephemeral_stats.domain_card_loadout.splice(selectedLoadoutIndex, 1);
          }}
          class="absolute -bottom-[2px] left-1/2 -translate-x-1/2 rounded-full"
        >
          Move to Vault
          <ArrowUpRight class="size-4" />
        </Button>
      </div>
    {/if}
  </div>
{/if}
