<script lang="ts">
  import { cn } from "$lib/utils";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { getCharacterContext } from "$lib/ts/character.svelte";

  let { class: className = "" } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  let expanded = $state(true);
</script>

{#if character}
  <div
    class={cn(
      "text-left flex flex-col relative p-4 gap-4 border-2 rounded-md transition-all",
      className
    )}
  >
    <button
      onclick={() => (expanded = !expanded)}
      class="z-20 flex items-center text-nowrap text-muted-foreground p-2 absolute bg-background -top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 font-medium"
    >
      {#if expanded}
        <ChevronDown class="w-k h-4" />
      {:else}
        <ChevronRight class="w-k h-4" />
      {/if}
      Experiences
    </button>

    {#if expanded}
      <div class="flex flex-col gap-4">
        {#each character.experiences as experience, i}
          {#if experience.trim() !== ""}
            <p class="font-medium text-[1rem] text-sm">
              <span class="text-muted-foreground font-medium mr-3 ml-1"
                >+{context.experience_modifiers[i]}</span
              >
              {experience}
            </p>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
{/if}
