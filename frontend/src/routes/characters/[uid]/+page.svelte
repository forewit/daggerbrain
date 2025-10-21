<script lang="ts">
  import Dice from "$lib/components/app/dice/dice.svelte";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte.js";
  let { data } = $props();

  const context = getCharacterContext();
</script>

{#if context.character}
  <Sheet bind:character={context.character} class="mb-24" />
  <Dice
    class="bottom-6 left-6 z-45"
    onRollEnd={(notation, total) => {
      console.log(notation, total);
    }}
  />
{/if}
