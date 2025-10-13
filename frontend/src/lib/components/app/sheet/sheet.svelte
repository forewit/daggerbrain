<script lang="ts">
  import { cn } from "$lib/utils";
  import Traits from "./traits.svelte";
  import type { Character, Card } from "$lib/ts/types";
  import Banner from "./banner.svelte";
  import Level from "./level.svelte";
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

  let {
    class: className = "",
    characterUid = $bindable(),
  }: { class?: string; characterUid: string } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === characterUid));

  let heritageCards: Card<any>[] = $derived(
    [
      character?.heritage.ancestry_card,
      character?.heritage.community_card,
      character?.transformation_card,
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
                class="min-w-[72px] relative grid place-items-center text-xs font-medium pl-4 pr-3 rounded-l-full bg-accent/10 hover:bg-accent/20 h-full text-accent overflow-hidden group"
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
              class="h-full shrink truncate justify-start gap-2 grow border-none rounded-l-none rounded-r-full"
              variant="outline"
            >
              <p class="truncate text-xs text-left">
                {character.class?.name || "No class"}&ensp;•&ensp;{character.subclass?.name ||
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
                {character.heritage.ancestry_card?.title || "No ancestry"}&ensp;•&ensp;{character
                  .heritage.community_card?.title || "No community"}
              </p>
            </div>
          </div>
        </div>

        <!-- class banner -->
        {#if character.class}
          <Banner characterClass={character.class} />
        {/if}
      </div>

      <!-- traits -->
      <Traits traits={character.traits} class="mx-2 " />

      <!-- evasion and armor -->
      <div
        class="grid grid-cols-1 sm:grid-cols-[auto_auto] place-items-center mx-auto gap-x-6 gap-y-2"
      >
        <div class="flex gap-2">
          <Evasion evasion={character.evasion} />
          <Armor bind:armor={character.armor} />
        </div>
        <Thresholds thresholds={character.damage_thresholds} class="my-2" />
      </div>

      <!-- hp and stress -->
      <div class="mx-2 flex flex-col gap-2">
        <Hp bind:hp={character.hp} class="justify-center sm:justify-start" />
        <Stress {characterUid} class="justify-center sm:justify-start" />
      </div>

      <!-- hope -->
      <Hope {characterUid} />

      <!-- class features -->
      {#if character.class}
        <ClassFeatures bind:characterClass={character.class} class="mx-2" />
      {/if}
    </div>

    <!-- heritage cards -->
    <Deck title="Heritage Cards" cards={heritageCards} class="mt-2" />

    <!-- domain cards -->
    <Deck title="Domain Card Loadout" cards={character.domain_card_loadout} />
  </div>
{/if}
