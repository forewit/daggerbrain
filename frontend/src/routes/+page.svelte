<script lang="ts">
  import AncestryCard from "$lib/components/app/cards/ancestry-card.svelte";
  import CommunityCard from "$lib/components/app/cards/community-card.svelte";
  import DomainCard from "$lib/components/app/cards/domain-card.svelte";
  import SubclassCard from "$lib/components/app/cards/subclass-card.svelte";
  import TransformationCard from "$lib/components/app/cards/transformation-card.svelte";
  import Traits from "$lib/components/app/sheet/traits.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import {
    ANCESTRY_CARDS,
    BONE_DOMAIN_CARDS,
    COMMUNITY_CARDS,
    SUBCLASS_CARDS,
    TRANSFORMATION_CARDS,
  } from "$lib/ts/constants/cards";
  import { TRAITS } from "$lib/ts/constants/constants";
  import { cn } from "$lib/utils";

  const app = getAppContext();
</script>

<!-- Background -->
<div
  class={cn(
    //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    "max-w-6xl mx-auto px-4 py-2"
  )}
>
  <p class="text-2xl font-bold py-2">Welcome</p>
  <p class="text-xs italic font-muted-foreground">Under construction</p>

  <div class="w-[70px]">
    <div class="w-full h-[70px] relative">
      <div class="absolute inset-0 border-[2px] rounded-[6px] fancy-border"></div>
      <div class="absolute inset-[1px] border-2  rounded-[18px] rounded-b-[6px] fancy-border"></div>

      <div class="grid justify-center text-center py-3.5 px-4 gap-2 z-10">
        <p class="text-lg font-bold leading-none">+2</p>
        <p class="text-sm font-medium leading-none">{TRAITS.agility.name}</p>
      </div>
    </div>
    <div class="text-center mt-1">
      {#each TRAITS.agility.examples as example}
        <p class="text-xs text-muted-foreground">{example}</p>
      {/each}
    </div>
  </div>
</div>

<style>
  .fancy-border {
    background-image: url("/images/card/gold.jpg");
    background-size: cover;
    mask: /*4*/
      linear-gradient(#000 0 0) padding-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude; /*5*/
  }
</style>
