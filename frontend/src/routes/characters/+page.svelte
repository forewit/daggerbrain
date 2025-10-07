<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import CharacterPreview from "$lib/components/app/CharacterPreview.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const app = getAppContext();
</script>

<svelte:head>
  <title>Characters</title>
</svelte:head>

<!-- Page -->
<main
  style="scrollbar-width: none;"
  class={cn(
    app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
    "relative overflow-y-auto overflow-x-hidden"
  )}
>
  <div
    class={cn(
      "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    )}
  >
    <a href="/">Home</a>
    <p>All Characters:</p>
    {#each app.characters as character (character.uid)}
      <CharacterPreview characterUid={character.uid} />
    {/each}
    <Button onclick={() => app.newCharacter()}>Add Character</Button>
  </div>
</main>
