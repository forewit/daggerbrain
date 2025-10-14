<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { ANCESTRY_CARDS, COMMUNITY_CARDS, TRANSFORMATION_CARDS } from "$lib/ts/constants.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";

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
    <div class="mx-4 mb-4 flex flex-col gap-4">
      <Dropdown title="Ancestry" subtitle={character.heritage.ancestry_card?.title}>
        <p class="text-sm italic">
          Ancestries represent your character's lineage which affects their physical appearance and
          access to certain special abilities.
        </p>
      </Dropdown>

      <Dropdown title="Community" subtitle={character.heritage.community_card?.title}>
        <p class="text-sm italic">
          Communities represent a key aspect of the culture class or environment of origin that has
          had the most influence over your character's upbringing
        </p>
      </Dropdown>

      <Dropdown title="Transformation" subtitle={character.transformation_card?.title}>
        <p class="text-sm italic">
          Transformations represent changes or augmentations to characters in Daggerheart. These are
          optional aspects of a character's identity that may be given out by the GM during a
          campaign for narrative purposes. GMs may also present transformations as an option at
          character creation, at their discretion.
        </p>
      </Dropdown>
    </div>
  </div>
{/if}
