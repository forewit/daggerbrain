<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { JUST_JAMES } from "$lib/ts/constants";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";
  import type { Character } from "$lib/ts/types";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import type { Card } from "$lib/ts/types";
  import Deck from "$lib/components/app/sheet/deck.svelte";


  let character: Character = $state(JUST_JAMES);

  const app = getAppContext();


  let heritageCards: Card<any>[] = $derived(
    [
      character.heritage.ancestry_card,
      character.heritage.community_card,
      character.transformation_card,
    ].filter(Boolean) as Card<any>[]
  );

  onMount(() => {
    //  pwa instructions credit: https://github.com/philfung/add-to-homescreen
    //@ts-ignore
    window.AddToHomeScreenInstance = window.AddToHomeScreen({
      appName: "Daggerbrain", // Name of the app. [Required]
      appNameDisplay: "inline", // or "standalone"
      appIconUrl: "/icon512_rounded.png", // App icon link (square, at least 40 x 40 pixels) [Required]
      assetUrl: "https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.5/dist/assets/img/", // Link to directory of library image assets [Required]
      maxModalDisplayCount: -1, // If set, the modal will only show this many times [Optional. Default: -1 (no limit).]
      displayOptions: { showMobile: true, showDesktop: false }, // show on mobile/desktop [Optional] Default: show everywhere
      allowClose: true, // allow the user to close the modal by tapping outside of it. [Optional. Default: true]
      showArrow: true, // show the arrow on the modal [Optional. Default: true]
      // (Debugging: Use this.clearModalDisplayCount() to reset the count)
    });
    //@ts-ignore
    window.AddToHomeScreenInstance.show(); // popup is only shown if web app is not already added to homescreen
  });
</script>


<svelte:head>
  <!-- pwa instructions credit: https://github.com/philfung/add-to-homescreen -->
  <link rel="stylesheet" href="/add-to-homescreen/add-to-homescreen.css" />
  <script type="text/javascript" src="/add-to-homescreen/add-to-homescreen.min.js"></script>
</svelte:head>

<main
  style="scrollbar-width: none;"
  class={cn(
    app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
    "relative snap-y snap-mandatory overflow-y-auto overflow-x-hidden"
  )}
>
  <!-- Background -->
  <div
    class={cn(
      "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "relative mb-12"
    )}
  >
    <Sheet bind:character class="max-w-2xl mx-auto mb-6" />

    <!-- deck -->
    <Deck title="Heritage Cards" cards={heritageCards}/>

    <!-- domain cards -->
    <Deck title="Domain Card Loadout" cards={character.domain_card_loadout} class="mb-12"/>
  </div>
</main>
