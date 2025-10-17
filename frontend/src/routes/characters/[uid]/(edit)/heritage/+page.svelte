<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import * as Collapsible from "$lib/components/ui/collapsible/index";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import AncestryCard from "$lib/components/app/cards/ancestry-card.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CommunityCard from "$lib/components/app/cards/transformation-card.svelte";
  import { ANCESTRIES, COMMUNITIES, TRANSFORMATIONS } from "$lib/ts/constants.js";
  import TransformationCard from "$lib/components/app/cards/transformation-card.svelte";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

  let ancestryOpen = $state(false);
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <Dropdown title="Ancestry" subtitle={character.heritage.ancestry_card?.title}>
        <div class="flex flex-col gap-4">
          <p class="text-sm italic">
            {@html ANCESTRIES.description_html}
          </p>
          {#if character.heritage.ancestry_card}
            <AncestryCard card={character.heritage.ancestry_card} />
            <Button>Change your ancestry</Button>
          {:else}
            <Button>Choose an ancestry</Button>
          {/if}
        </div>
      </Dropdown>

      <Dropdown title="Community" subtitle={character.heritage.community_card?.title}>
        <div class="flex flex-col gap-4">
          <p class="text-sm italic">
            {@html COMMUNITIES.description_html}
          </p>
          {#if character.heritage.community_card}
            <CommunityCard card={character.heritage.community_card} />
            <Button>Change your community</Button>
          {:else}
            <Button>Choose a community</Button>
          {/if}
        </div>
      </Dropdown>

      <Dropdown title="Transformation" subtitle={character.transformation_card?.title}>
        <div class="flex flex-col gap-4">
          <p class="text-sm italic">
            {@html TRANSFORMATIONS.description_html}
          </p>
          {#if character.transformation_card}
            <TransformationCard card={character.transformation_card} />
            <Button>Change your transformation</Button>
          {:else}
            <Button>Choose a transformation</Button>
          {/if}
        </div>
      </Dropdown>
    </div>
  </div>
{/if}
