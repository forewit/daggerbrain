<script lang="ts">
  import { cn } from "$lib/utils";
  import { getAppContext } from "$lib/ts/app.svelte";

  let { class: className = "", characterUid }: { class?: string; characterUid: string } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === characterUid));
</script>

{#if character}
  <div class={cn("flex flex-col justify-center text-center gap-3", className)}>
    <button onclick={()=>{character.ephemeral_stats.marked_hope = 0}} class="text-sm font-medium text-accent">HOPE</button>
    <div class="mt-1 justify-center flex flex-wrap gap-4">
      {#each Array(character.derieved_stats.max_hope) as _, index}
        <button
          aria-label="hope-slot"
          class={cn(
            "w-[16px] h-[16px] rounded-[2px] aspect-square border border-accent transition-all duration-300 transform rotate-45",
            index < character.ephemeral_stats.marked_hope ? "bg-accent" : "bg-transparent",
            character.ephemeral_stats.marked_hope === character.derieved_stats.max_hope &&
              "shadow-[0_0_8px_rgba(253,212,113,0.4),0_0_16px_rgba(253,212,113,0.2)]"
          )}
          onclick={() => {
            if (index + 1 === character.ephemeral_stats.marked_hope) {
              character.ephemeral_stats.marked_hope = Math.max(0, character.ephemeral_stats.marked_hope - 1);
            } else {
              character.ephemeral_stats.marked_hope = index + 1;
            }
          }}
          type="button"
        ></button>
      {/each}
    </div>

    {#if character.primary_class}
      <div class="relative mx-auto">
        <button
          class="text-sm p-3 relative"
          onclick={() => {
            if (character.ephemeral_stats.marked_hope >= 3) {
              character.ephemeral_stats.marked_hope -= 3;
            }
          }}
        >
          <span class="italic font-medium pr-1">{character.primary_class.hope_feature.title}:</span>
          {@html character.primary_class.hope_feature.description_html}
        </button>
      </div>
    {/if}
  </div>
{/if}
