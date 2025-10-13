<script lang="ts">
  import "../app.css";
  import { onDestroy, onMount } from "svelte";
  import { setAppContext } from "$lib/ts/app.svelte";
  import { ModeWatcher, setMode } from "mode-watcher";
  import { cn } from "$lib/utils";
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/stores";

  let { children } = $props();

  const app = setAppContext();

  setMode("dark");

  onDestroy(() => {
    app.destroy();
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#1a1625" />
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<ModeWatcher />

<!-- nav bar -->
<header
  class={cn(
    "pt-[calc(max(env(safe-area-inset-top),--spacing(3)))] pl-[calc(env(safe-area-inset-left)+--spacing(2))] pr-[calc(env(safe-area-inset-right)+--spacing(2))]",
    "fixed w-full top-0 z-45 flex justify-center"
  )}
>
  <nav class=" shadow bg-muted rounded-full max-w-6xl w-full h-16 flex items-center">
    <a href="/" class="text-lg font-medium flex items-center gap-2 px-4">
      <img src="/assets/logos/daggerbrain.png" alt="Daggerbrain" class="size-6" />
      Daggerbrain
    </a>
    <div class="grow sm:max-w-0"></div>
    <Button variant="ghost" href="/characters" class=" rounded-none h-full">Characters</Button>
    <Button variant="ghost" href="/rules" class=" rounded-none h-full pr-6 sm:pr-4">Rules</Button>
  </nav>
</header>

<div
  style="scrollbar-width: none;"
  class={cn(app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw", "relative overflow-x-hidden overflow-y-auto")}
>
  <div class="min-h-full w-full flex flex-col">
    <!-- page -->
    <main class="grow pt-[calc(max(env(safe-area-inset-top),--spacing(3)))] mt-16">
      {@render children?.()}
    </main>

    {#if app.showFooter}
      <!-- footer -->
      <footer
        class={cn(
          "pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "bg-muted/50 sticky"
        )}
      >
        <div class="max-w-6xl mx-auto px-4 pt-6 pb-8 flex flex-wrap justify-between gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <img
                src="/assets/logos/compatible_with_DH.png"
                alt="Compatible with Daggerheart"
                class="size-6"
              />
              <p class="text-xs text-muted-foreground italic">
                Daggerheart™ Compatible. Terms at <a
                  href="https://www.daggerheart.com"
                  class="underline">Daggerheart.com</a
                >
              </p>
            </div>

            <p class="text-xs italic text-muted-foreground max-w-[450px]">
              Daggerbrain includes materials from the Daggerheart System Reference Document 1.0, ©
              Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL)
              License. More information can be found at <a
                href="https://www.daggerheart.com"
                class="underline">https://www.daggerheart.com</a
              >. There are no previous modifications by others
            </p>
          </div>

          <p class="text-xs text-muted-foreground text-right">&copy; 2025 Daggerbrain</p>
        </div>
      </footer>
    {/if}
  </div>
</div>
