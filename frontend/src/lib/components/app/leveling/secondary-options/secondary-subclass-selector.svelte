<script lang="ts">
  import type { Character, Card } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import * as Select from "$lib/components/ui/select/";
  import SubclassCard from "$lib/components/app/cards/full-cards/subclass-card.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let {
    selected_upgrade = $bindable(),
    option_id,
    options_used,
    width,
  }: {
    selected_upgrade: "primary" | "secondary" | null;
    option_id: string;
    options_used: Record<string, number>;
    width: number;
  } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);

  // Calculate which card to show for tier-4 primary subclass upgrade
  // This is complex logic that depends on the level order of tier_3_subclass_upgrade and tier_4_subclass_upgrade
  function get_card_to_show(): Card<"subclass_specialization"> | Card<"subclass_mastery"> | null {
    if (selected_upgrade !== "primary" || !context.primary_subclass || !character) return null;

    // Only applies when both tier_3 and tier_4 subclass upgrades are used
    if (
      options_used["tier_3_subclass_upgrade"] >= 1 &&
      options_used["tier_4_subclass_upgrade"] >= 1
    ) {
      // Find levels where tier_3_subclass_upgrade and tier_4_subclass_upgrade were used
      const tier_3_subclass_upgrade_level = Object.values(character.level_up_choices).findIndex(
        (choice) =>
          choice.A.option_id === "tier_3_subclass_upgrade" ||
          choice.B.option_id === "tier_3_subclass_upgrade"
      );
      const tier_4_subclass_upgrade_level = Object.values(character.level_up_choices).findIndex(
        (choice) =>
          choice.A.option_id === "tier_4_subclass_upgrade" ||
          choice.B.option_id === "tier_4_subclass_upgrade"
      );

      // Complex logic: if current option is tier_4 and tier_3 was used first, OR
      // if current option is tier_3 and tier_4 was used first, show mastery
      if (
        (option_id === "tier_4_subclass_upgrade" &&
          tier_3_subclass_upgrade_level < tier_4_subclass_upgrade_level) ||
        (option_id === "tier_3_subclass_upgrade" &&
          tier_4_subclass_upgrade_level < tier_3_subclass_upgrade_level)
      ) {
        return context.primary_subclass.mastery_card;
      } else {
        return context.primary_subclass.specialization_card;
      }
    }

    // Default: show specialization card
    return context.primary_subclass.specialization_card;
  }
</script>

{#if character}
  <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md" bind:clientWidth={width}>
    <p class="py-1 px-2 text-xs italic text-muted-foreground">
      Take the next card for your subclass. If you have only the foundation card, take a
      specialization; if you have a specialization already, take a mastery.
    </p>

    <Select.Root
      value={selected_upgrade || ""}
      type="single"
      onValueChange={(value) => {
        if (value === "") selected_upgrade = null;
        else {
          selected_upgrade = value as "primary" | "secondary";
        }
      }}
    >
      <Select.Trigger class="w-full truncate" highlighted={selected_upgrade === null}>
        {selected_upgrade === "primary"
          ? context.primary_class?.name + " • " + context.primary_subclass?.name
          : selected_upgrade === "secondary"
            ? context.secondary_class?.name + " • " + context.secondary_subclass?.name
            : "Select a subclass to upgrade"}
      </Select.Trigger>
      <Select.Content class="rounded-md" align="start">
        <div style="max-width: {width}px;" class="p-2">
          <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
            -- none selected --
          </Select.Item>
          <Select.Label>Choose a subclass to upgrade</Select.Label>
          {#if context.primary_subclass && context.primary_class}
            <Select.Item value="primary">
              {context.primary_class.name} • {context.primary_subclass.name}
            </Select.Item>
          {/if}
          {#if context.secondary_subclass && context.secondary_class}
            <Select.Item value="secondary">
              {context.secondary_class.name} • {context.secondary_subclass.name}
            </Select.Item>
          {/if}
        </div>
      </Select.Content>
    </Select.Root>

    {#if selected_upgrade !== null && context.primary_subclass}
      <p class="p-2">
        {#if selected_upgrade === "primary"}
          {@const card_to_show = get_card_to_show()}
          {#if card_to_show}
            <SubclassCard card={card_to_show} />
          {/if}
        {:else if selected_upgrade === "secondary" && context.secondary_subclass}
          <SubclassCard card={context.secondary_subclass.specialization_card} />
        {/if}
      </p>
    {/if}
  </div>
{/if}
