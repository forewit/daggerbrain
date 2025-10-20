<script lang="ts">
  import Tier1Options from "$lib/components/app/builder/leveling/tier-1-options.svelte";
  import Tier2Options from "$lib/components/app/builder/leveling/tier-2-options.svelte";
  import LevelSelect from "$lib/components/app/builder/leveling/level-select.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

{#snippet tierBonuses(tier: 2 | 3 | 4)}
  <div
    class="relative flex flex-col gap-2 text-accent bg-accent/5 p-4 mx-4 rounded-lg border border-accent/20"
  >
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
      {#each Array(tier) as _}
        <span class="size-2 rounded-xs rotate-45 bg-accent"></span>
      {/each}
    </div>

    <p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
    <p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
  </div>
{/snippet}

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <LevelSelect bind:level={character.level} />

      <!-- tier 1 options -->
      <Tier1Options {character} />

      {#if character.level >= 2}
        {@render tierBonuses(2)}
        <Dropdown title="Level 2 Options">
          <Tier2Options {character} />
        </Dropdown>
      {/if}

      {#if character.level >= 3}
        <Dropdown title="Level 3 Options" />
      {/if}

      {#if character.level >= 4}
        <Dropdown title="Level 4 Options" />
      {/if}

      {#if character.level >= 5}
        {@render tierBonuses(3)}
        <Dropdown title="Level 5 Options" />
      {/if}

      {#if character.level >= 6}
        <Dropdown title="Level 6 Options" />
      {/if}

      {#if character.level >= 7}
        <Dropdown title="Level 7 Options" />
      {/if}

      {#if character.level >= 8}
        {@render tierBonuses(4)}
        <Dropdown title="Level 8 Options" />
      {/if}

      {#if character.level >= 9}
        <Dropdown title="Level 9 Options" />
      {/if}

      {#if character.level >= 10}
        <Dropdown title="Level 10 Options" />
      {/if}
    </div>
  </div>
{/if}
