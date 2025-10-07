<script lang="ts">
    import { getAppContext } from "$lib/ts/app.svelte";
    import { goto } from "$app/navigation";
    let { data, children } = $props();
  
    const app = getAppContext();
  
    const character = $derived(app.characters.find((c) => c.uid === data.characterUid));
  
    $effect(() => {
      if (!character) {
        goto("/characters");
      }
    });
  </script>
  
  <svelte:head>
    <title>{character?.name}</title>
  </svelte:head>
  
  {#if character}
    {@render children?.()}
  {/if}
  