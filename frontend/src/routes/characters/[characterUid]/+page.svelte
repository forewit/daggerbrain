<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  let { data } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === data.characterUid));
</script>

{#if character}
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
        "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <a href="/characters">← Back to Characters</a>
      <div class="border">
        <p>{character.name}</p>
        <Button variant="link" onclick={() => goto(`/characters/${data.characterUid}/deck`)}
          >Deck</Button
        >
      </div>
    </div>
  </main>
{/if}
