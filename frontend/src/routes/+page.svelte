<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, focusVisibleRingStyle } from "$lib/utils";
  import { onMount } from "svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";
  import Button from "$lib/components/ui/button/button.svelte";

  const app = getAppContext();

  onMount(() => {
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
    window.AddToHomeScreenInstance?.show(); // popup is only shown if web app is not already added to homescreen
  });
</script>

<svelte:head>
  <title>Daggerbrain</title>
  <!-- pwa instructions credit: https://github.com/philfung/add-to-homescreen -->
  <link rel="stylesheet" href="/add-to-homescreen/add-to-homescreen.css" />
  <script type="text/javascript" src="/add-to-homescreen/add-to-homescreen.min.js"></script>
</svelte:head>

<!-- Page -->
<main
  style="scrollbar-width: none;"
  class={cn(app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw", "relative overflow-y-auto overflow-x-hidden")}
>
  <div
    class={cn(
      "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "p-4 sm:p-6 pb-16"
    )}
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-6">
        <div class="text-center space-y-3 mb-6">
          <h1 class="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Daggerbrain
          </h1>
          <div class="h-0.5 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <p class="text-lg sm:text-xl text-foreground/80 leading-relaxed text-center">
          Character deck management system
        </p>
        
        <p class="text-sm text-muted-foreground max-w-md mx-auto text-center mt-2">
          Create, organize, and manage your character decks with ease
        </p>
        
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6">
          <Button 
            href="/characters" 
            size="lg"
          >
            View All Characters
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Button>
        </div>
      </div>
      
      <!-- Feature highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div class="bg-card border border-border rounded-lg p-4 card-shadow">
          <div class="text-2xl mb-2">🎨</div>
          <h3 class="text-sm font-semibold mb-1">Beautiful</h3>
          <p class="text-xs text-muted-foreground">Modern interface</p>
        </div>
        
        <div class="bg-card border border-border rounded-lg p-4 card-shadow">
          <div class="text-2xl mb-2">⚡</div>
          <h3 class="text-sm font-semibold mb-1">Fast</h3>
          <p class="text-xs text-muted-foreground">Instant interactions</p>
        </div>
        
        <div class="bg-card border border-border rounded-lg p-4 card-shadow">
          <div class="text-2xl mb-2">🎯</div>
          <h3 class="text-sm font-semibold mb-1">Simple</h3>
          <p class="text-xs text-muted-foreground">Easy to use</p>
        </div>
      </div>
    </div>
  </div>
</main>
