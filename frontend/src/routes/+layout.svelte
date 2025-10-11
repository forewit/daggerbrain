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

<div
  style="scrollbar-width: none;"
  class={cn(app.pwa ? "h-lvh w-lvw" : "h-dvh w-dvw", "relative overflow-y-auto overflow-x-hidden")}
>
  <!-- nav bar -->
  <div class="min-h-full w-full flex flex-col">
    <header
      class={cn(
        "pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
        "bg-muted sticky top-0 z-100"
      )}
    >
      <nav class="max-w-6xl mx-auto px-4 pt-1 h-12 flex items-center">
        <a href="/" class="text-lg font-medium flex items-center gap-2">
          <img src="/assets/logos/daggerbrain.png" alt="Daggerbrain" class="size-6" />
          Daggerbrain
        </a>
        <Button variant="link" href="/characters" class="font-normal ml-4 h-8">Characters</Button>
        <Button variant="link" href="/domains" class="font-normal h-8">Domains</Button>
      </nav>
    </header>

    <!-- page -->
    <main class="grow">
      {@render children?.()}
    </main>
    <!-- footer -->
    <footer
      class={cn(
        "pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
        "bg-muted sticky"
      )}
    >
      <div class="max-w-6xl mx-auto px-4 pt-6 pb-8 grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <img
              src="/assets/logos/compatible_with_DH.png"
              alt="Compatible with Daggerheart"
              class="size-6"
            />
            <p class="text-xs text-muted-foreground italic">
              Daggerheart™ Compatible. Terms at Daggerheart.com
            </p>
          </div>

          <p class="text-xs italic text-muted-foreground">
            This product includes materials from the Daggerheart System Reference Document 1.0, ©
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
  </div>
</div>
