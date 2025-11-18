<script lang="ts">
  import "../app.css";
  import { onDestroy } from "svelte";
import { setAppContext } from "$lib/ts/app.svelte";
import { ModeWatcher, setMode } from "mode-watcher";
import { cn } from "$lib/utils";
import { Button, buttonVariants } from "$lib/components/ui/button";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton
} from "svelte-clerk";
  import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";

  let { children, data } = $props();

  const app = setAppContext(data.initialCharacters ?? []);

  setMode("dark");

  onDestroy(() => {
    app.destroy();
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#1a1625" />
  <link rel="icon" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="mobile-web-app-capable" content="yes" />
  <!-- <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> -->
</svelte:head>

<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
  <ModeWatcher />

  <!-- nav bar -->
  <div style="scrollbar-width: none;" class="relative">
    <header
      class={cn(
        //pt-[calc(max(env(safe-area-inset-top),--spacing(3)))] pl-[calc(env(safe-area-inset-left)+--spacing(2))] pr-[calc(env(safe-area-inset-right)+--spacing(2))]        "pt-3 px-2",
        "sticky sm:relative w-full top-0 z-45 flex justify-center bg-primary-muted border-b shadow-lg"
      )}
    >
      <nav
        style="scrollbar-width: none;"
        class="overflow-x-auto max-w-6xl w-full h-16 flex items-center"
      >
        <a href="/" class="text-lg font-medium flex items-center gap-2 px-4 shrink-0">
          <img src="/images/logos/daggerbrain.svg" alt="Daggerbrain" class="size-6" />
          Daggerbrain
        </a>
        <div class="grow md:max-w-0"></div>
        <Button variant="link" href="/characters" class=" rounded-none h-full">Characters</Button>
        <Button variant="link" href="/rules" class=" rounded-none h-full">Rules</Button>
        <div class="flex items-center gap-2 pl-2">
          <SignedOut>
            <SignInButton mode="modal" class={cn(buttonVariants({ variant: "secondary" }))}>
  
                Sign In
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>

    <!-- page -->
    <main class="grow relative overflow-x-hidden">
      {@render children?.()}
    </main>

    {#if app.showFooter}
      <!-- footer -->
      <footer
        class={cn(
          //
          //"pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
          "bg-muted/50"
        )}
      >
        <div class="max-w-6xl mx-auto px-4 pt-6 pb-8 flex flex-wrap justify-between gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <img
                src="/images/logos/compatible_with_DH.png"
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
</ClerkProvider>
