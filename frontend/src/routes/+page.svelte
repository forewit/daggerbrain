<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { JUST_JAMES } from "$lib/ts/constants";
  import type { Character } from "$lib/ts/types";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Plus from "@lucide/svelte/icons/plus";
  import Trash2 from "@lucide/svelte/icons/trash-2";
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

  onMount(() => {
    //  pwa instructions credit: https://github.com/philfung/add-to-homescreen
    //@ts-ignore
    window.AddToHomeScreenInstance = window.AddToHomeScreen({
      appName: "Daggerbrain", // Name of the app. [Required]
      appNameDisplay: "inline", // or "standalone"
      appIconUrl: "/icon512_rounded.png", // App icon link (square, at least 40 x 40 pixels) [Required]
      assetUrl: "https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.5/dist/assets/img/", // Link to directory of library image assets [Required]
      maxModalDisplayCount: -1, // If set, the modal will only show this many times [Optional. Default: -1 (no limit).]
      displayOptions: { showMobile: true, showDesktop: false }, // show on mobile/desktop [Optional] Default: show everywhere
      allowClose: true, // allow the user to close the modal by tapping outside of it. [Optional. Default: true]
      showArrow: true, // show the arrow on the modal [Optional. Default: true]
      // (Debugging: Use this.clearModalDisplayCount() to reset the count)
    });
    //@ts-ignore
    window.AddToHomeScreenInstance.show(); // popup is only shown if web app is not already added to homescreen
  });
</script>

<svelte:head>
  <!-- pwa instructions credit: https://github.com/philfung/add-to-homescreen -->
  <link rel="stylesheet" href="/add-to-homescreen/add-to-homescreen.css" />
  <script type="text/javascript" src="/add-to-homescreen/add-to-homescreen.min.js"></script>
</svelte:head>

<main
  style="scrollbar-width: none;"
  class={cn(
    app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
    "relative snap-y snap-mandatory overflow-y-auto overflow-x-hidden"
  )}
>
  <!-- Background -->
  <div
    class={cn(
      "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-6xl mx-auto px-4 py-8"
    )}
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold mb-2">My Characters</h1>
        <div class="flex items-center gap-2">
          <img
            src="/assets/logos/compatible_with_DH.png"
            alt="Compatible with Daggerheart"
            class="size-6"
          />
          <p class="text-xs text-muted-foreground italic">
            Daggerheart™ Compatible. Terms at Daggerheart.com
          </p>
        </div>
      </div>

      <Button variant="outline" onclick={() => app.newCharacter()}>
        <Plus />
        New Character
      </Button>
    </div>

    <div class="flex flex-wrap gap-4">
      {#each app.characters as character}
        <div
          class="w-[300px] h-[246px] bg-muted rounded-lg shadow-md transition-all overflow-hidden group border"
        >
          <!-- Character Image -->
          <div class="relative h-32 overflow-hidden">
            <img
              src={character.image}
              alt={character.name}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            ></div>

            <!-- Level Badge -->
            <div
              class="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              Level {character.level}
            </div>
          </div>

          <!-- Character Info -->
          <div class="p-2">
            <p class="text-lg font-bold truncate">{character.name}</p>

            <!-- Character Heritage Info -->
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

            <!-- Action Buttons -->
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
</main>
