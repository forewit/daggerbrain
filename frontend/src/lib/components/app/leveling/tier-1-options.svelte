<script lang="ts">
  import { cn } from "$lib/utils";
  import Dropdown from "./dropdown.svelte";
  import PrimaryClassSelector from "./secondary-options/primary-class-selector.svelte";
  import PrimarySubclassSelector from "./secondary-options/primary-subclass-selector.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import { SOURCES } from "$lib/ts/character/constants";
  import { DOMAINS } from "$lib/ts/content/domains/domains";
  import DomainCardSelector from "./secondary-options/domain-card-selector.svelte";
  import {
    get_available_domain_cards,
    get_previously_chosen_domain_card_ids,
  } from "./domain-card-utils";

  let { class: className = "" } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
  <div class={cn("flex flex-col gap-4", className)}>
    <!-- Select a Class -->
    <Dropdown
      title="Class"
      highlighted={!context.primary_class}
      subtitle={context.primary_class
        ? character.derived_descriptors.primary_class_name +
          " • " +
          SOURCES[context.primary_class.source_id].short_title
        : ""}
    >
      <PrimaryClassSelector />
    </Dropdown>

    <!-- Select a Subclass -->
    <Dropdown
      highlighted={!character.primary_subclass_id}
      disabled={!character.primary_class_id}
      title="Subclass"
      subtitle={character.derived_descriptors.primary_subclass_name}
    >
      <PrimarySubclassSelector />
    </Dropdown>

    <!-- Domain Cards -->
    <!--       subtitle={[
        context.level_up_domain_cards[1].A?.title,
        context.level_up_domain_cards[1].B?.title,
      ]
        .filter((title) => title !== undefined)
        .join(", ")} -->
    <Dropdown
      title="Level 1"
      disabled={!character.primary_class_id}
      highlighted={context.level_up_domain_cards[1].A === null ||
        context.level_up_domain_cards[1].B === null}
    >
      {#if context.primary_class !== null}
        {@const description_html = `<p>Choose up to 2 level 1 domain cards from the
            <b>${DOMAINS[context.primary_class.primary_domain_id].name}</b>
            and
            <b>${DOMAINS[context.primary_class.secondary_domain_id].name}</b>
            domains.</p>`}
        <div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
          <p class="py-1 px-2 text-xs italic text-muted-foreground">
            {@html description_html}
          </p>
          <DomainCardSelector
            bind:selected_card_id={character.level_up_domain_card_ids[1].A}
            available_cards={get_available_domain_cards(context, 1, 1, false)}
            previously_chosen_card_ids={get_previously_chosen_domain_card_ids(context, 1, [])}
            {description_html}
          />

          <DomainCardSelector
            bind:selected_card_id={character.level_up_domain_card_ids[1].B}
            available_cards={get_available_domain_cards(context, 1, 1, false)}
            previously_chosen_card_ids={get_previously_chosen_domain_card_ids(context, 1, [])}
            {description_html}
          />
        </div>
      {/if}
    </Dropdown>
  </div>
{/if}
