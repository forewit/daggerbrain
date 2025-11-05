<script lang="ts">
  import type { Character } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import Dropdown from "./dropdown.svelte";
  import PrimaryClassSelector from "./secondary-options/primary-class-selector.svelte";
  import PrimarySubclassSelector from "./secondary-options/primary-subclass-selector.svelte";
  import Level1DomainCardsSelector from "./secondary-options/level-1-domain-cards-selector.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let { class: className = "" } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
<div class={cn("flex flex-col gap-4", className)}>
  <!-- Select a Class -->
  <Dropdown
    title="Class"
    highlighted={!character.primary_class_id}
    subtitle={character.primary_class_id
      ? character.descriptors.primary_class_name + ", " + context.primary_class?.source
      : ""}
  >
    <PrimaryClassSelector />
  </Dropdown>

  <!-- Select a Subclass -->
  <Dropdown
    highlighted={!character.primary_subclass_id}
    disabled={!character.primary_class_id}
    title="Subclass"
    subtitle={character.descriptors.primary_subclass_name}
  >
    <PrimarySubclassSelector />
  </Dropdown>

  <!-- Domain Cards -->
  <Dropdown
    title="Level 1"
    disabled={!character.primary_class_id}
    highlighted={context.level_up_domain_cards[1].A === null ||
      context.level_up_domain_cards[1].B === null}
    subtitle={[
      context.level_up_domain_cards[1].A?.title,
      context.level_up_domain_cards[1].B?.title,
    ]
      .filter((title) => title !== undefined)
      .join(", ")}
  >
    <Level1DomainCardsSelector />
  </Dropdown>
</div>
{/if}