<script lang="ts">
  import type { Character } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import PrimaryClassSelector from "./secondary-options/primary-class-selector.svelte";
  import PrimarySubclassSelector from "./secondary-options/primary-subclass-selector.svelte";
  import Level1DomainCardsSelector from "./secondary-options/level-1-domain-cards-selector.svelte";

  let { character = $bindable(), class: className = "" }: { character: Character; class?: string } =
    $props();
</script>

<div class={cn("flex flex-col gap-4", className)}>
  <!-- Select a Class -->
  <Dropdown
    title="Class"
    highlighted={!character.primary_class}
    subtitle={character.primary_class
      ? character.primary_class.name + ", " + character.primary_class.source
      : ""}
  >
    <PrimaryClassSelector bind:character />
  </Dropdown>

  <!-- Select a Subclass -->
  <Dropdown
    highlighted={!character.primary_subclass}
    disabled={!character.primary_class}
    title="Subclass"
    subtitle={character.primary_subclass?.name}
  >
    <PrimarySubclassSelector bind:character />
  </Dropdown>

  <!-- Domain Cards -->
  <Dropdown
    title="Level 1"
    disabled={!character.primary_class}
    highlighted={character.level_up_domain_cards[1].A === null ||
      character.level_up_domain_cards[1].B === null}
    subtitle={[
      character.level_up_domain_cards[1].A?.title,
      character.level_up_domain_cards[1].B?.title,
    ]
      .filter((title) => title !== undefined)
      .join(", ")}
  >
    <Level1DomainCardsSelector bind:character />
  </Dropdown>
</div>
