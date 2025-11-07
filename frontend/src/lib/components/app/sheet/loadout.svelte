<script lang="ts">
  import CardCarousel from "$lib/components/app/cards/card-carousel.svelte";
  import Stress from "$lib/components/app/sheet/stress.svelte";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import type { Card, Character } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import Tent from "@lucide/svelte/icons/tent";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import * as Dialog from "$lib/components/ui/dialog";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let { class: className = "" }: { class?: string } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  let loadout: Card<"domain">[] = $derived(
    character?.ephemeral_stats.domain_card_loadout.map((i) => context.domain_card_vault[i]) || []
  );

  let vault: Card<"domain">[] = $derived(
    (context.domain_card_vault || []).filter(
      (card) => !loadout.some((loadoutCard) => loadoutCard.title === card.title)
    )
  );

  let selectedVaultIndex = $state(0);
  let selectedVaultCard = $derived(vault[selectedVaultIndex]);

  let selectedLoadoutIndex = $state(0);

  let restMode = $state(false);
  let expanded = $state(true);

  let remainingStress = $derived(
    character ? context.max_stress - character.ephemeral_stats.marked_stress : 0
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
        class=" h-4.5 px-1.5 bg-accent text-background rounded-full font-bold text-xs grid place-items-center"
      >
        {loadout.length} / {context.max_domain_card_loadout}
      </div>
      <Dialog.Root>
        <Dialog.Trigger class={cn(buttonVariants({ size: "sm" }), "relative")}>
          <ArrowLeftRight class="size-3" />
          Vault
          <span
            class="absolute top-1 right-0 translate-x-1/2 -translate-y-1/2 h-4.5 px-1.5 bg-accent text-background rounded-full font-bold text-xs grid place-items-center"
          >
            {vault.length}
          </span>
        </Dialog.Trigger>
        <Dialog.Content class="px-0 flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
          <Dialog.Header class="px-6">
            <Dialog.Title>Vault</Dialog.Title>
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
                        context.max_domain_card_loadout
                      ) {
                        const vaultIndex = context.domain_card_vault.findIndex(
                          (card) => card.id === vault[selectedVaultIndex].id
                        );
                        character.ephemeral_stats.domain_card_loadout.push(vaultIndex);
                      }
                    }}
                    class={cn(
                      "absolute -bottom-[2px] left-1/2 -translate-x-1/2 rounded-full",
                      loadout.length >= context.max_domain_card_loadout &&
                        "border-destructive border-3 bg-muted hover:bg-muted cursor-default"
                    )}
                    size="sm"
                  >
                    {#if loadout.length >= context.max_domain_card_loadout}
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
                          context.max_domain_card_loadout &&
                        selectedVaultCard?.recall_cost <= remainingStress
                      ) {
                        character.ephemeral_stats.marked_stress += selectedVaultCard.recall_cost;
                        const vaultIndex = context.domain_card_vault.findIndex(
                          (card) => card.id === vault[selectedVaultIndex].id
                        );
                        character.ephemeral_stats.domain_card_loadout.push(vaultIndex);
                      }
                    }}
                    class={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full",
                      (selectedVaultCard?.recall_cost > remainingStress ||
                        loadout.length >= context.max_domain_card_loadout) &&
                        "border-destructive border-3 bg-muted hover:bg-muted cursor-default"
                    )}
                  >
                    {#if loadout.length >= context.max_domain_card_loadout}
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
