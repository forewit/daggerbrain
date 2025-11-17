<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import HeritageCard from "$lib/components/app/cards/full-cards/ancestry-card.svelte";
  import TransformationCard from "$lib/components/app/cards/full-cards/transformation-card.svelte";
  import CommunityCard from "$lib/components/app/cards/full-cards/community-card.svelte";
  import AncestryCard from "$lib/components/app/cards/full-cards/ancestry-card.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte.js";
  import { ANCESTRY_CARDS, COMMUNITY_CARDS } from "$lib/ts/content/heritage";
  import { TRANSFORMATION_CARDS } from "$lib/ts/content/void";

  let { data } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  let ancestryDialogOpen = $state(false);
  let communityDialogOpen = $state(false);
  let transformationDialogOpen = $state(false);
</script>

{#if character}
  <div
    class={cn(
      //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <Dropdown
        highlighted={!character.ancestry_card_id}
        title="Ancestry"
        subtitle={context.ancestry_card?.title || "Choose an ancestry"}
      >
        <div class="flex flex-col gap-4">
          <p class="text-sm italic text-muted-foreground">
            Ancestries represent your character's lineage which affects their physical appearance
            and access to certain special abilities.
          </p>
          {#if context.ancestry_card}
            <HeritageCard card={context.ancestry_card} />
          {/if}
          <div class="w-full flex gap-2 justify-between">
            {#if !character.ancestry_card_id}
              <Button onclick={() => (ancestryDialogOpen = true)}>Choose an ancestry</Button>
            {:else}
              <div class="w-full flex justify-center sm:justify-end">
                <Button
                  variant="link"
                  class="text-destructive"
                  onclick={() => (character.ancestry_card_id = null)}>Remove</Button
                >
              </div>
            {/if}
          </div>
        </div>
      </Dropdown>

      <Dropdown
        highlighted={!character.community_card_id}
        title="Community"
        subtitle={context.community_card?.title || "Choose a community"}
      >
        <div class="flex flex-col gap-4">
          <p class="text-sm italic text-muted-foreground">
            Communities represent a key aspect of the culture class or environment of origin that
            has had the most influence over your character's upbringing.
          </p>
          {#if context.community_card}
            <CommunityCard card={context.community_card} />
          {/if}

          <div class="flex gap-2 justify-between">
            {#if !character.community_card_id}
              <Button onclick={() => (communityDialogOpen = true)}>Choose a community</Button>
            {:else}
              <div class="w-full flex justify-center sm:justify-end">
                <Button
                  variant="link"
                  class={cn("text-destructive", !character.community_card_id && "hidden")}
                  onclick={() => (character.community_card_id = null)}>Remove</Button
                >
              </div>
            {/if}
          </div>
        </div>
      </Dropdown>

      <Dropdown
        highlighted={!character.transformation_card_id}
        title="Transformation"
        subtitle={context.transformation_card?.title + " • Void 1.5" || "Choose a transformation"}
      >
        <div class="flex flex-col gap-4">
          <p class="text-sm italic text-muted-foreground">
            Transformations represent changes or augmentations to characters in Daggerheart. These
            are optional aspects of a character's identity that may be given out by the GM during a
            campaign for narrative purposes. GMs may also present transformations as an option at
            character creation, at their discretion.
          </p>
          {#if context.transformation_card}
            <TransformationCard card={context.transformation_card} />
          {/if}

          <div class="flex gap-2 justify-between">
            {#if !character.transformation_card_id}
              <Button onclick={() => (transformationDialogOpen = true)}>
                Choose a transformation
              </Button>
            {:else}
              <div class="w-full flex justify-center sm:justify-end">
                <Button
                  variant="link"
                  class={cn("text-destructive", !character.transformation_card_id && "hidden")}
                  onclick={() => (character.transformation_card_id = null)}>Remove</Button
                >
              </div>
            {/if}
          </div>
        </div>
      </Dropdown>
    </div>
  </div>

  <Dialog.Root bind:open={ancestryDialogOpen}>
    <Dialog.Content class="flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
      <Dialog.Header>
        <Dialog.Title>Select an ancestry</Dialog.Title>
      </Dialog.Header>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto p-2">
        {#each Object.entries(ANCESTRY_CARDS) as [id, card]}
          <div>
            <AncestryCard {card}
              ><Button
                onclick={() => {
                  character.ancestry_card_id = id;
                  ancestryDialogOpen = false;
                }}
                class="w-min mt-auto">Select {card.title}</Button
              >
            </AncestryCard>
          </div>
        {/each}
      </div>
      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  <Dialog.Root bind:open={communityDialogOpen}>
    <Dialog.Content class="flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
      <Dialog.Header>
        <Dialog.Title>Select a community</Dialog.Title>
      </Dialog.Header>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto p-2">
        {#each Object.entries(COMMUNITY_CARDS) as [id, card]}
          <div>
            <CommunityCard {card}
              ><Button
                onclick={() => {
                  character.community_card_id = id;
                  communityDialogOpen = false;
                }}
                class="w-min mt-auto">Select {card.title}</Button
              >
            </CommunityCard>
          </div>
        {/each}
      </div>
      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  <Dialog.Root bind:open={transformationDialogOpen}>
    <Dialog.Content class="flex flex-col min-w-[calc(100%-1rem)] md:min-w-3xl max-h-[90%]">
      <Dialog.Header>
        <Dialog.Title>Select a transformation</Dialog.Title>
      </Dialog.Header>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto p-2">
        {#each Object.entries(TRANSFORMATION_CARDS) as [id, card]}
          <div>
            <TransformationCard {card}
              ><Button
                onclick={() => {
                  character.transformation_card_id = id;
                  transformationDialogOpen = false;
                }}
                class="w-min mt-auto">Select {card.title}</Button
              >
            </TransformationCard>
          </div>
        {/each}
      </div>
      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
