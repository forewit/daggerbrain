<script lang="ts">
  import { cn } from "$lib/utils";
  import Traits from "./traits.svelte";
  import type { Character } from "./types";
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

  let { class: className = "", character = $bindable() }: { class?: string; character: Character } =
    $props();
</script>

<div class={cn("flex flex-col w-full gap-6", className)}>
  <!-- top bar -->
  <div class="flex gap-2 px-2">
    <!-- character image -->
    <div class="h-[120px] rounded-md border-4 mt-2">
      <img
        class="h-full rounded-md aspect-square object-cover"
        src={character.image}
        alt={character.name}
      />
    </div>

    <!-- name, level, class, subclass -->
    <div class="grow flex flex-col gap-1 mt-2">
      <p class="text-2xl font-bold">{character.name}</p>
      <div class="flex gap-x-2 gap-y-1 items-center flex-wrap text-sm text-muted-foreground">
        <Level level={character.level} />
        <p>{character.heritage.ancestry.name}</p>
        <p class="hidden sm:block">•</p>
        <p class="hidden sm:block">{character.heritage.community.name}</p>
      </div>
      <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <p>{character.class.name}</p>
        <p class="hidden sm:block">•</p>
        <p class="hidden sm:block">{character.subclass.name}</p>
      </div>
    </div>

    <!-- class banner -->
    <Banner characterClass={character.class} />
  </div>

  <!-- traits -->
  <Traits traits={character.traits} class="mx-auto sm:mx-0" />

  <!-- evasion and armor -->
  <div class="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center sm:justify-start mx-auto">
    <div class="flex gap-2">
      <Evasion evasion={character.evasion} />
      <Armor armor={character.armor} />
    </div>
    <Thresholds thresholds={character.damage_thresholds} class="my-2" />
  </div>

  <!-- hp and stress -->
  <div class="mx-2 flex flex-col gap-2">
    <Hp hp={character.hp} />
    <Stress {character} />
  </div>

  <!-- hope -->
   <Hope {character} />

   <!-- class features -->
  <ClassFeatures characterClass={character.class} class="mx-2"/>
</div>
