<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { Character } from "$lib/ts/types";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Plus from "@lucide/svelte/icons/plus";
  import ExternalLink from "@lucide/svelte/icons/external-link";

  const app = getAppContext();

  let characterToDelete = $state<Character | null>(null);
  let showDeleteDialog = $state(false);

  function handleDeleteCharacter(character: Character) {
    characterToDelete = character;
    showDeleteDialog = true;
  }

  function confirmDelete() {
    if (characterToDelete) {
      app.deleteCharacter(characterToDelete.uid);
      characterToDelete = null;
      showDeleteDialog = false;
    }
  }
</script>

<div
  class={cn(
    "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    "max-w-6xl mx-auto p-2"
  )}
>
  <!-- Header -->
  <div class="flex items-center justify-between py-2">
    <p class="text-2xl font-bold mb-2 text-nowrap">My Characters</p>

    <Button variant="outline" onclick={() => app.newCharacter()}><Plus /> New Character</Button>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each app.characters as character}
      <a href={`/characters/${character.uid}/`} class="rounded bg-border w-full max-w-[500px] mx-auto flex p-2 gap-2">
        <div class="rounded-lg overflow-hidden h-20 w-20 shrink-0 border-2">
          <img src={character.image} alt={character.name} class="w-full h-full object-cover" />
        </div>
        <div class="truncate">
          <p class="text-lg font-bold truncate">{character.name}</p>

          <p class="mt-1 truncate text-sm text-muted-foreground">
            {character.heritage.ancestry_card?.title || "No ancestry"}
            &ensp;|&ensp;{character.class?.name || "No class"}
            &ensp;|&ensp;{character.subclass?.name || "No subclass"}
          </p>
        </div>
      </a>
      <!-- <div
        class="w-[300px] h-[246px] bg-muted rounded-lg shadow-md transition-all overflow-hidden group border"
      >
        <div class="relative h-32 overflow-hidden">
          <img
            src={character.image}
            alt={character.name}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          ></div>

          <div
            class="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-slate-900 dark:text-slate-100"
          >
            Level {character.level}
          </div>
        </div>

        <div class="p-2">
          <p class="text-lg font-bold truncate">{character.name}</p>

          <div class="flex gap-3 mb-3 mt-1 text-sm text-muted-foreground">
            {#if character.heritage.ancestry_card}
              <p class="truncate">{character.heritage.ancestry_card.title}</p>
            {/if}
            {#if character.class}
              <p class="truncate">{character.class.name}</p>
            {/if}
            {#if character.subclass}
              <p class="truncate">{character.subclass.name}</p>
            {/if}
          </div>

          <div class="flex justify-between gap-2">
            <Button href={`/${character.uid}`} variant="outline" class="grow">
              <ExternalLink /> View
            </Button>

            <Button
              onclick={() => handleDeleteCharacter(character)}
              aria-label="Delete character"
              variant="link"
              class="text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      </div> -->
    {/each}
  </div>
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={showDeleteDialog}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Delete Character</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete <strong>{characterToDelete?.name}</strong>? This action
        cannot be undone.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer class="flex gap-3 pt-4">
      <Dialog.Close class={cn(buttonVariants({ variant: "link" }), "text-muted-foreground")}
        >Cancel</Dialog.Close
      >
      <Dialog.Close class={buttonVariants({ variant: "destructive" })} onclick={confirmDelete}
        >Delete</Dialog.Close
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
