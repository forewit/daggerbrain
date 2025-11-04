<script lang="ts">
  import type { Character } from "$lib/ts/types";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/";
  import * as Collapsible from "$lib/components/ui/collapsible/";
  import SubclassCard from "../../../cards/subclass-card.svelte";
  import { cn } from "$lib/utils";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  let {
    character = $bindable(),
  }: {
    character: Character;
  } = $props();

  let subclass_dialog_open = $state(false);
  let subclass_cards_open = $state(false);
</script>

{#if !character.primary_subclass}
  <Button onclick={() => (subclass_dialog_open = true)}>Choose a subclass</Button>
{:else}
  <div class="flex flex-col gap-4">
    <p class="text-lg font-medium">{character.primary_subclass.name}</p>
    <p class="-mt-2 text-xs italic text-muted-foreground">
      {@html character.primary_subclass.description_html}
    </p>

    <SubclassCard card={character.primary_subclass.foundation_card} />

    {#if character.derived_stats.primary_class_mastery_level < 3}
      <Collapsible.Root bind:open={subclass_cards_open}>
        <Collapsible.Trigger class="flex items-center text-left text-sm text-muted-foreground">
          <ChevronRight
            class={cn("w-k h-4 transition-transform", subclass_cards_open && "rotate-90")}
          />
          Specialization and Mastery Cards
        </Collapsible.Trigger>
        <Collapsible.Content class="flex flex-col gap-3 py-4 opacity-70">
          <SubclassCard card={character.primary_subclass.specialization_card} />
          <SubclassCard card={character.primary_subclass.mastery_card} />
        </Collapsible.Content>
      </Collapsible.Root>
    {/if}

    <div class="flex justify-center sm:justify-end">
      <Button
        variant="link"
        class="text-destructive"
        onclick={() => (character.primary_subclass = null)}>Remove</Button
      >
    </div>
  </div>
{/if}

<!-- Choose a Subclass dialog -->
<Dialog.Root bind:open={subclass_dialog_open}>
  <Dialog.Content class="flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
    <Dialog.Header>
      <Dialog.Title>Select a Subclass</Dialog.Title>
    </Dialog.Header>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
      <!-- each class -->
      {#if character.primary_class}
        {#each Object.values(character.primary_class.subclasses) as subclass}
          <div class="flex flex-col gap-3 border-2 rounded-md p-3 bg-primary-muted">
            <p class="text-lg font-medium">{subclass.name}</p>
            <p class="-mt-2 text-xs italic text-muted-foreground">
              {@html subclass.description_html}
            </p>
            {#if subclass.foundation_card.spellcast_trait}
              <p class="text-xs italic text-muted-foreground">
                <b class="text-foreground"><em>Spellcast Trait:</em></b>
                {subclass.foundation_card.spellcast_trait}
              </p>
            {/if}
            <Button
              class="mt-2"
              disabled={character.primary_subclass?.name === subclass.name}
              onclick={() => {
                character.primary_subclass = subclass;
                subclass_dialog_open = false;
              }}
            >
              {character.primary_subclass?.name === subclass.name
                ? "Selected"
                : "Select " + subclass.name}
            </Button>
          </div>
        {/each}
      {/if}
    </div>
    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

