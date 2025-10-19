<script lang="ts">
  import { cn } from "$lib/utils";
  import Traits from "./traits.svelte";
  import type { Character, Card } from "$lib/ts/types";
  import Banner from "./banner.svelte";
  import Level from "./level-up.svelte";
  import Thresholds from "./thresholds.svelte";
  import Armor from "./armor.svelte";
  import Evasion from "./evasion.svelte";
  import Hp from "./hp.svelte";
  import Stress from "./stress.svelte";
  import Hope from "./hope.svelte";
  import ClassFeatures from "./class-features.svelte";
  import Deck from "./deck.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Pencil from "@lucide/svelte/icons/pencil";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { handleImageUpload } from "$lib/utils";
  import Experiences from "./experiences.svelte";

  let {
    class: className = "",
    characterUid = $bindable(),
  }: { class?: string; characterUid: string } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === characterUid));

  let heritageCards: Card<any>[] = $derived(
    [
      character?.ancestry_card,
      character?.community_card,
      character?.transformation_card,
      ...(character?.additional_cards || []),
    ].filter(Boolean) as Card<any>[]
  );

  let classCards: Card<any>[] = $derived(
    [
      character?.derieved_stats.primary_class_mastery_level && character?.derieved_stats.primary_class_mastery_level >=  1 && character?.primary_subclass?.foundation_card,
      character?.derieved_stats.primary_class_mastery_level && character?.derieved_stats.primary_class_mastery_level >= 2 && character?.primary_subclass?.specialization_card,
      character?.derieved_stats.primary_class_mastery_level && character?.derieved_stats.primary_class_mastery_level >= 3 && character?.primary_subclass?.mastery_card,
      // should get the matching cards from the vault based on the indicies in domain card loadout
      ...(character?.derieved_stats.domain_card_vault.filter((card, i) => character?.ephemeral_stats.domain_card_loadout.includes(i)) || []),
    ].filter(Boolean) as Card<any>[]
  );

  let fileInput = $state<HTMLInputElement>();

  function onImageUploadSuccess(dataUrl: string) {
    if (character) {
      character.image = dataUrl;
    }
  }

  function triggerImageUpload() {
    fileInput?.click();
  }
</script>

{#if character}
  <div class={cn("flex flex-col gap-6", className)}>
    <!-- hidden file input for image upload -->
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      onchange={(event) => handleImageUpload(event, onImageUploadSuccess)}
      class="hidden"
    />

    <!-- main content -->
    <div
      class="w-full min-w-[260px] max-w-2xl mx-auto flex flex-col gap-6 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
    >
      <!-- top bar -->
      <div class="flex gap-2 px-2 pr-6">
        <div class="grow truncate relative">

          <!-- level class subclass -->
          <div class="flex overflow-hidden items-center mt-4 mb-2.5 truncate max-w-[400px] h-9">
            <Dialog.Root>
              <Dialog.Trigger
                class="border-b border-accent/10 min-w-[72px] relative grid place-items-center text-xs font-medium pl-4 pr-3 rounded-l-full bg-accent/10 hover:bg-accent/20 h-full text-accent overflow-hidden group"
              >
                <span class="transition-transform duration-200 group-hover:-translate-y-[150%]">
                  Level {character.level}
                </span>
                <span
                  class="absolute inset-0 grid place-items-center text-xs font-medium transition-transform duration-200 translate-y-full group-hover:translate-y-0"
                >
                  Level up?
                </span>
              </Dialog.Trigger>
              <Dialog.Content>Test</Dialog.Content>
            </Dialog.Root>

            <Button
              href={`/characters/${character.uid}/class/`}
              class={cn(
                "h-full truncate grow justify-start gap-2  rounded-l-none rounded-r-full",
                "border-0 border-b"
              )}
              variant="outline"
            >
              <p class="truncate text-xs text-left">
                {character.primary_class?.name || "No class"}&ensp;•&ensp;{character.primary_subclass?.name ||
                  "No subclass"}
              </p>
              <div class="grow"></div>
              <Pencil class="size-3 mr-1 stroke-3" />
            </Button>
          </div>

          <div class="flex gap-3 ml-1">
            <!-- character image -->
            <button
              class="h-[90px] w-[90px] shrink-0 p-1 aspect-square rounded-lg border-2 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
              onclick={triggerImageUpload}
            >
              <img
                class="h-full w-full rounded-md object-cover"
                src={character.image}
                alt={character.name}
              />
            </button>

            <!-- name and heritage -->
            <div class="grow flex flex-col gap-2 truncate">
              <p class="text-2xl font-bold truncate">{character.name}</p>
              <p class="text-xs text-muted-foreground truncate">
                {character.ancestry_card?.title || "No ancestry"}&ensp;•&ensp;{character
                  .community_card?.title || "No community"}
              </p>
            </div>
          </div>
        </div>

        <!-- class banner -->
        {#if character.primary_class}
          <Banner primary_class={character.primary_class} />
        {/if}
      </div>

      <!-- traits -->
      <Traits traits={character.derieved_stats.traits} class="mx-2 " />

      <!-- evasion and armor -->
      <div
        class="grid grid-cols-1 sm:grid-cols-[auto_auto] place-items-center mx-auto gap-x-6 gap-y-2"
      >
        <div class="flex gap-2">
          <Evasion evasion={character.derieved_stats.evasion} />
          <Armor bind:marked_armor={character.ephemeral_stats.marked_armor} max_armor={character.derieved_stats.max_armor} />
        </div>
        <Thresholds thresholds={character.derieved_stats.damage_thresholds} class="my-2" />
      </div>

      <!-- hp and stress -->
      <div class="mx-2 flex flex-col gap-2">
        <Hp bind:marked_hp={character.ephemeral_stats.marked_hp} max_hp={character.derieved_stats.max_hp} class="justify-center sm:justify-start" />
        <Stress {characterUid} class="justify-center sm:justify-start" />
      </div>

      <!-- hope -->
      <Hope {characterUid} />

      <!-- class features -->
      {#if character.primary_class}
        <ClassFeatures character_class={character.primary_class} class="mx-2" />
      {/if}
      {#if character.secondary_class}
        <ClassFeatures character_class={character.secondary_class} class="mx-2" />
      {/if}

      <!-- experiences -->
      {#if character.experiences.some((experience) => experience.title !== "")}
        <Experiences bind:experiences={character.experiences} class="mx-2" />
      {/if}
    </div>

    <!-- heritage cards -->
    <Deck title="Heritage Cards" cards={heritageCards} class="mt-2" />

    <!-- domain cards -->
    <Deck title="Class Cards" cards={classCards} />
  </div>
{/if}
