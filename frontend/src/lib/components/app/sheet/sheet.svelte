<script lang="ts">
  import { cn } from "$lib/utils";
  import Traits from "./traits.svelte";
  import type { Character } from "./types";
  import ClassBanner from "./class-banner.svelte";
  let { class: className = "", character = $bindable() }: { class?: string; character: Character } =
    $props();
</script>


<div class={cn("flex flex-col w-full border-2 border-blue-300 rounded-md", className)}>
  <!-- Top Bar -->
  <div class="flex border-2 border-red-300 rounded-md">
    <!-- image -->
    <img class="h-24 w-24 aspect-square object-cover" src={character.image} alt={character.name} />

    <!-- name, level, class, subclass -->
    <div>
      <p>{character.name}</p>
      <div class="flex">
        <p>{character.level}</p>
        <p>{character.class.name}</p>
        <p>{character.subclass.name}</p>
      </div>
    </div>

    <!-- class banner -->
    <ClassBanner characterClass={character.class} />
  </div>

    <!-- Traits bar -->
     <div class="flex border-2 border-yellow-300 rounded-md">
        <Traits bind:traits={character.traits} />

     </div>
</div>
