<script lang="ts">
  import Tier1Options from "$lib/components/app/builder/leveling/tier-1-options.svelte";
  import Tier2Options from "$lib/components/app/builder/leveling/tier-2-options.svelte";
  import LevelSelect from "$lib/components/app/builder/leveling/level-select.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte.js";

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <LevelSelect
        bind:level={character.level}
        bind:level_up_choices={character.level_up_choices}
      />

      <!-- tier 1 options -->
      <Tier1Options bind:character />

      {#if character.level >= 2}
        <Dropdown title="Tier 2" class="bg-accent/10 text-accent border-accent/20">
          <div class="flex flex-col gap-2">
            <p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
            <p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
          </div>
        </Dropdown>
        <Dropdown
          title="Level 2"
          highlighted={!character.level_up_choices[2] ||
            character.level_up_choices[2].filter((choice) => choice !== null).length < 2}
          subtitle={character.level_up_choices[2]?.map((choice) => choice.short_title).join(", ")}
        >
          <Tier2Options bind:character bind:level_up_choices={character.level_up_choices} level={2} experiences={character.experiences} />
        </Dropdown>
      {/if}

      {#if character.level >= 3}
        <Dropdown
          title="Level 3"
          highlighted={!character.level_up_choices[3] ||
            character.level_up_choices[3].filter((choice) => choice !== null).length < 2}
          subtitle={character.level_up_choices[3]?.map((choice) => choice.short_title).join(", ")}
        >
          <Tier2Options bind:character bind:level_up_choices={character.level_up_choices} level={3} experiences={character.experiences} />
        </Dropdown>
      {/if}

      {#if character.level >= 4}
        <Dropdown
          title="Level 4"
          highlighted={!character.level_up_choices[4] ||
            character.level_up_choices[4].filter((choice) => choice !== null).length < 2}
          subtitle={character.level_up_choices[4]?.map((choice) => choice.short_title).join(", ")}
        >
          <Tier2Options bind:character bind:level_up_choices={character.level_up_choices} level={4} experiences={character.experiences} />
        </Dropdown>
      {/if}

      {#if character.level >= 5}
        <Dropdown title="Tier 3" class="bg-accent/10 text-accent border-accent/20">
          <div class="flex flex-col gap-2">
            <p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
            <p class="text-xs">•&emsp;Clear all marked character traits</p>
            <p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
          </div>
        </Dropdown>
        <Dropdown title="Level 5 Options" />
      {/if}

      {#if character.level >= 6}
        <Dropdown title="Level 6 Options" />
      {/if}

      {#if character.level >= 7}
        <Dropdown title="Level 7 Options" />
      {/if}

      {#if character.level >= 8}
        <Dropdown title="Tier 4" class="bg-accent/10 text-accent border-accent/20">
          <div class="flex flex-col gap-2">
            <p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
            <p class="text-xs">•&emsp;Clear all marked character traits</p>
            <p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
          </div>
        </Dropdown>
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
