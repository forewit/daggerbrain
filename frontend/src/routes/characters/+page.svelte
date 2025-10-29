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
  import Pencil from "@lucide/svelte/icons/pencil";
  import Trash from "@lucide/svelte/icons/trash";
  import { goto } from "$app/navigation";

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
    //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    "max-w-6xl mx-auto px-4 py-2"
  )}
>
  <!-- Header -->
  <div class="flex justify-between gap-2 py-2 mb-2">
    <p class="text-2xl font-bold text-nowrap">My Characters</p>
    <Button variant="outline" onclick={() => app.newCharacter()}><Plus /> New Character</Button>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each app.characters as character}
      <div class="w-full max-w-[500px] rounded mx-auto overflow-hidden">
        <a href={`/characters/${character.uid}/`} class="bg-primary-muted border hover:bg-primary-muted/80 flex p-1 gap-2 ">
          <div class=" h-16 w-16 shrink-0 rounded-lg border-2 overflow-hidden">
            <img src={character.image} alt={character.name} class="w-full h-full object-cover" />
          </div>
          <div class="truncate">
            <p class="text-lg font-bold truncate mt-1">{character.name}</p>

            <p class="mt-1 truncate text-xs text-muted-foreground">
              {character.ancestry_card?.title || "No ancestry"}
              &ensp;•&ensp;{character.primary_class?.name || "No class"}
              &ensp;•&ensp;{character.primary_subclass?.name || "No subclass"}
            </p>
          </div>
        </a>
        <div class="bg-muted flex">
          <Button
            variant="ghost"
            size="sm"
            class="grow rounded-none hover:text-text border"
            href={`/characters/${character.uid}/`}>View</Button
          >
          <Button
            variant="ghost"
            size="sm"
            class="grow rounded-none hover:text-text border border-x-0"
            href={`/characters/${character.uid}/edit`}>Edit</Button
          >
          <Button
            variant="ghost"
            size="sm"
            class=" grow text-destructive hover:text-destructive rounded-none border"
            onclick={() => handleDeleteCharacter(character)}>Delete</Button
          >
        </div>
      </div>
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
