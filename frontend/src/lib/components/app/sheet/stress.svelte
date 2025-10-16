<script lang="ts">
  import { cn } from "$lib/utils";
  import { getAppContext } from "$lib/ts/app.svelte";

  let { class: className = "", characterUid }: { class?: string; characterUid: string } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === characterUid));
</script>

{#if character}
  <div class={cn("flex items-center gap-4 border-2 rounded-md h-12 px-4", className)}>
    <button onclick={()=>{character.stress.marked = 0}} class="text-sm font-medium">STRESS</button>
    <div class="flex flex-wrap gap-2">
      {#each Array(character.stress.max) as _, index}
        <button
          aria-label="character.stress-slot"
          class="w-6 h-3 rounded-md border border-muted-foreground {index < character.stress.marked
            ? 'bg-muted-foreground'
            : 'bg-transparent'} transition-colors"
          onclick={() => {
            if (index + 1 === character.stress.marked) {
              character.stress.marked = Math.max(0, character.stress.marked - 1);
            } else {
              character.stress.marked = index + 1;
            }
          }}
          type="button"
        ></button>
      {/each}
    </div>

    {#if character.stress.max === character.stress.marked}
      <button
        onclick={() => {
          if (character.hp.marked < character.hp.max) character.hp.marked++;
        }}
        class="p-2 text-xs text-nowrap bg-border rounded-md hover:bg-muted-foreground/20 grid place-items-center leading-none"
      >
        Mark HP
      </button>
    {/if}
  </div>
{/if}
