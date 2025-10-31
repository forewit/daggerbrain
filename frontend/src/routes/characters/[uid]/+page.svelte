<script lang="ts">
  import Dice from "$lib/components/app/dice/dice.svelte";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte.js";
  import { getAppContext } from "$lib/ts/app.svelte";

  const context = getCharacterContext();
  let character = $derived(context.character);

  const app = getAppContext();

  $effect(() => {
    app.showFooter = false;
    return () => {
      app.showFooter = true;
    };
  });
</script>

{#if character}
  {#if Object.values(character.base_stats.traits).includes(null) || !character.primary_class}
    <div class="flex flex-col items-center justify-center gap-4 py-12 px-4">
      <p class="text-sm font-muted-foreground italic">Ready to finish setting up your character?</p>
      <Button href={!character.primary_class ? "class/" : "traits/"}>Edit Character</Button>
    </div>
  {:else}
    <Sheet bind:character class="mb-24" />
    <!-- <Dice
  class="bottom-6 left-6 z-45"
  onRollEnd={(notation, total) => {
    console.log(notation, total);
  }}
/> -->
  {/if}
{/if}
