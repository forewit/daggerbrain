<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ANCESTRIES, COMMUNITIES, TRANSFORMATIONS } from "$lib/ts/constants/constants.js";
  import HeritageCard from "$lib/components/app/cards/full-cards/ancestry-card.svelte";
  import TransformationCard from "$lib/components/app/cards/full-cards/transformation-card.svelte";
  import CommunityCard from "$lib/components/app/cards/full-cards/community-card.svelte";
  import AncestryCard from "$lib/components/app/cards/full-cards/ancestry-card.svelte";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

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
        highlighted={!character.ancestry_card}
        title="Ancestry"
        subtitle={character.ancestry_card?.title || "Choose an ancestry"}
      >
        <div class="flex flex-col gap-4">
          <p class="text-sm italic">
            {@html ANCESTRIES.description_html}
          </p>
          {#if character.ancestry_card}
            <HeritageCard card={character.ancestry_card} />
          {/if}
          <div class="flex gap-2 justify-between">
            <Button onclick={() => (ancestryDialogOpen = true)}
              >{character.ancestry_card ? "Change your ancestry" : "Choose an ancestry"}</Button
            >
            <Button
              variant="link"
              class={cn("text-destructive", !character.ancestry_card && "hidden")}
              onclick={() => (character.ancestry_card = null)}>Remove</Button
            >
          </div>
        </div>
      </Dropdown>

      <Dropdown
        highlighted={!character.community_card}
        title="Community"
        subtitle={character.community_card?.title || "Choose a community"}
      >
        <div class="flex flex-col gap-4">
          <p class="text-sm italic">
            {@html COMMUNITIES.description_html}
          </p>
          {#if character.community_card}
            <CommunityCard card={character.community_card} />
          {/if}

          <div class="flex gap-2 justify-between">
            <Button onclick={() => (communityDialogOpen = true)}
              >{character.community_card ? "Change your community" : "Choose a community"}</Button
            >
            <Button
              variant="link"
              class={cn("text-destructive", !character.community_card && "hidden")}
              onclick={() => (character.community_card = null)}>Remove</Button
            >
          </div>
        </div>
      </Dropdown>

      <Dropdown
        highlighted={!character.transformation_card}
        title="Transformation"
        subtitle={character.transformation_card?.title || "Choose a transformation"}
      >
        <div class="flex flex-col gap-4">
          <p class="text-sm italic">
            {@html TRANSFORMATIONS.description_html}
          </p>
          {#if character.transformation_card}
            <TransformationCard card={character.transformation_card} />
          {/if}

          <div class="flex gap-2 justify-between">
            <Button onclick={() => (transformationDialogOpen = true)}
              >{character.transformation_card
                ? "Change your transformation"
                : "Choose a transformation"}</Button
            >
            <Button
              variant="link"
              class={cn("text-destructive", !character.transformation_card && "hidden")}
              onclick={() => (character.transformation_card = null)}>Remove</Button
            >
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
        {#each Object.values(ANCESTRIES.cards) as card}
          <div>
            <AncestryCard {card}
              ><Button
                onclick={() => {
                  character.ancestry_card = card;
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
        {#each Object.values(COMMUNITIES.cards) as card}
          <div>
            <CommunityCard {card}
              ><Button
                onclick={() => {
                  character.community_card = card;
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
        {#each Object.values(TRANSFORMATIONS.cards) as card}
          <div>
            <TransformationCard {card}
              ><Button
                onclick={() => {
                  character.transformation_card = card;
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
