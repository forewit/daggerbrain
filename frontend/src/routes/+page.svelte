<script lang="ts">
  import AncestryCard from "$lib/components/app/cards/ancestry-card.svelte";
  import Dice from "$lib/components/app/dice/dice.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";

  const app = getAppContext();

  let rollFunction: ((rollString: string) => void) | undefined;
  let customRollString = $state("1d4+1d6+1d8+1d10+1d12+1d20");

  function handleRoll(rollFn: (rollString: string) => void) {
    rollFunction = rollFn;
  }

  function rollDice(rollString: string) {
    if (rollFunction) {
      rollFunction(rollString);
    }
  }

  function rollCustomDice() {
    if (customRollString.trim()) {
      rollDice(customRollString.trim());
    }
  }

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

<!-- Background -->
<div
  class={cn(
    "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
    "max-w-6xl mx-auto px-4 py-2"
  )}
>
  <p class="text-2xl font-bold py-2">Welcome</p>
  <p class="text-xs italic font-muted-foreground">Under construction</p>
</div>