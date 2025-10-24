<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { goto } from "$app/navigation";
  import { setCharacterContext } from "$lib/ts/character.svelte.js";
  import { onDestroy } from "svelte";

  let { data, children } = $props();

  const app = getAppContext();
  const context = setCharacterContext(data.uid || "");
  const character = $derived(context.character);

  $effect(() => {
    if (!character && app.initialLoad) {
      goto("/characters");
    }
  });

  onDestroy(() => {
    context.destroy();
  });
</script>

<svelte:head>
  <title>{character?.name || "Character"}</title>
</svelte:head>

{#if character}
  {@render children?.()}
{/if}
