<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, focusVisibleRingStyle } from "$lib/utils";
  import { onMount } from "svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";

  const app = getAppContext();

  let pwa = $state(false);
  onMount(() => {
    // check if pwa
    const displayModes = ["fullscreen", "standalone", "minimal-ui"];
    try {
      pwa = displayModes.some(
        (displayMode) => window.matchMedia(`(display-mode: ${displayMode})`).matches
      );
    } catch (e) {
      // In case matchMedia isn't supported or other errors, keep pwa=false
      pwa = false;
    }

    //  pwa instructions credit: https://github.com/philfung/add-to-homescreen
    //@ts-ignore
    window.AddToHomeScreenInstance = window.AddToHomeScreen({
      appName: "What are you doing?", // Name of the app. [Required]
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
  <title>Daggerbrain</title>
  <meta name="theme-color" content="#110f1c" />
  <!-- pwa instructions credit: https://github.com/philfung/add-to-homescreen -->
  <link rel="stylesheet" href="/add-to-homescreen/add-to-homescreen.css" />
  <script type="text/javascript" src="/add-to-homescreen/add-to-homescreen.min.js"></script>
</svelte:head>


<!-- Page -->
<main
  style="scrollbar-width: none;"
  class={cn(
    pwa ? "h-lvh w-lvw" : "h-dvh w-dvw",
    "relative snap-y snap-mandatory overflow-y-auto overflow-x-hidden"
  )}
>
  <div
    class={cn(
      "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "h-full w-full relative bg-[#110f1c]"
    )}
  >

</div>
</main>
