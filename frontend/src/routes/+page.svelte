<script lang="ts">
  import AncestryCard from "$lib/components/app/cards/ancestry-card.svelte";
  import CommunityCard from "$lib/components/app/cards/community-card.svelte";
  import DomainCard from "$lib/components/app/cards/domain-card.svelte";
  import SubclassCard from "$lib/components/app/cards/subclass-card.svelte";
  import TransformationCard from "$lib/components/app/cards/transformation-card.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import {
    ANCESTRY_CARDS,
    BONE_DOMAIN_CARDS,
    COMMUNITY_CARDS,
    SUBCLASS_CARDS,
    TRANSFORMATION_CARDS,
  } from "$lib/ts/cards";
  import { cn } from "$lib/utils";

  const app = getAppContext();
</script>

<!-- Background -->
<div
  class={cn(
    "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    "max-w-6xl mx-auto px-4 py-2"
  )}
>
  <p class="text-2xl font-bold py-2">Welcome</p>
  <p class="text-xs italic font-muted-foreground">Under construction</p>

  <div class="flex gap-3">
    <SubclassCard
      card={SUBCLASS_CARDS.executioners_guild_foundation}
      variant="card"
      class="w-40"
    />
    <DomainCard card={BONE_DOMAIN_CARDS.untouchable} variant="card" class="w-40" />
    <TransformationCard card={TRANSFORMATION_CARDS.werewolf} variant="card" class="w-40" />

    <CommunityCard card={COMMUNITY_CARDS.warborne} variant="card" class="w-40" />
    <AncestryCard card={ANCESTRY_CARDS.half_clank} variant="card" class="w-40" />
  </div>
</div>
