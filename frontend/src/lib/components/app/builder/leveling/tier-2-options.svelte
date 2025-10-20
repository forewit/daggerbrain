<script lang="ts">
  import type { Character } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Square from "@lucide/svelte/icons/square";
  import SquareCheck from "@lucide/svelte/icons/square-check";
  import * as Select from "$lib/components/ui/select/";

  let {
    character,
    class: className = "",
    max_choices = 2,
    choices = $bindable<string[]>([]),
  }: { character: Character; class?: string; max_choices?: number; choices?: string[] } = $props();

  let tier_2_options: {
    id: string;
    title: string;
    short_title: string;
    max: number;
  }[] = [
    {
      id: "tier_2_trait_bonus",
      title: "Gain a +1 bonus to two unmarked character traits and mark them.",
      short_title: "Trait Bonus",
      max: 3,
    },
    {
      id: "tier_2_max_hp",
      title: "Permanently gain 1 Hit Point slot.",
      short_title: "+1 HP Slot",
      max: 2,
    },
    {
      id: "tier_2_max_stress",
      title: "Permanently gain 1 Stress slot.",
      short_title: "+1 HP Slot",
      max: 2,
    },
    {
      id: "tier_2_experience_bonus",
      title: "Permanently gain a +1 bonus to two Experiences.",
      short_title: "Experience Bonus",
      max: 1,
    },
  ];

  $effect(() => {
    if (choices.length !== max_choices) {
      choices = Array(max_choices).fill("");
    }
  });

  let allPreviousTier2Choices = $derived.by(() => {
    // return all previous tier 2 choices (matching ids from tier_2_options
    // this includes all chocies from character.level_X_choices from 2-10
    return [
      ...character.level_2_choices,
      ...character.level_3_choices,
      ...character.level_4_choices,
      ...character.level_5_choices,
      ...character.level_6_choices,
      ...character.level_7_choices,
      ...character.level_8_choices,
      ...character.level_9_choices,
      ...character.level_10_choices,
    ].filter((choice) => tier_2_options.some((option) => option.id === choice));
  });

  // previous choices are any choices of lover level or previous index in choices array

  // todo: disable option if character has already chosen it the max number of times
  // todo: show checkbox if character has already chosen it
</script>

<div class={cn("flex flex-col gap-4", className)}>
  {#each Array(max_choices) as _, i}
    <Select.Root type="single" bind:value={choices[i]}>
      <Select.Trigger>
        {tier_2_options.find((option) => option.id === choices[i])?.short_title ||
          "Select a tier 2 option"}
      </Select.Trigger>
      <Select.Content class="bg-primary-muted p-1 rounded-md max-w-2xl" align="start">
        {#each tier_2_options as option}
          <Select.Item
            value={option.id}
            class="bg-primary-muted hover:bg-primary data-[highlighted]:bg-primary/20 data-[highlighted]:text-foreground "
          >
            <div class="flex gap-1 w-24 justify-end">
              {#each Array(option.max) as _}
                {#if false}
                  <SquareCheck class="size-4" />
                {:else}
                  <Square class="size-4" />
                {/if}
              {/each}
            </div>
            {option.title}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  {/each}
</div>
