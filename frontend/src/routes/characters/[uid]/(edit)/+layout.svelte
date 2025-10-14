<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { page } from "$app/state";
  import { cn, capitalize } from "$lib/utils";
  import Settings from "@lucide/svelte/icons/settings";
  import Button from "$lib/components/ui/button/button.svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { onMount } from "svelte";

  let { data, children } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

  const tabs = ["edit", "heritage", "class", "experiences", "equipment"];
  let activeTab = $derived(page.url.pathname.split("/").pop() || "edit");

  function scrollToActiveTab(event?: Event) {
    const el = document.getElementById(activeTab);
    el?.scrollIntoView({ behavior: event ? "instant" : "smooth", inline: "center", block: "center" });
  }

  $effect(scrollToActiveTab);

  onMount(() => {
    window.addEventListener("resize", scrollToActiveTab);
    return () => {
      window.removeEventListener("resize", scrollToActiveTab);
    };
  });
</script>

{#if character}
  <!-- tabs -->
  <div
    class={cn("mt-3 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]", "bg-muted/50")}
  >
    <div
      class="snap-x snap-mandatory overflow-x-auto max-w-3xl mx-auto h-18 flex items-center"
      style="scrollbar-width: none;"
    >
      <div class="shrink-0 w-[50vw] md:w-0"></div>

      <!-- <div class="flex shrink-0 w-3xl items-center bg-muted rounded-full overflow-hidden"> -->
      {#each tabs as tab, i}
        <Button
          id={tab}
          variant="ghost"
          href={`/characters/${character.uid}/${tab}`}
          class={cn(
            "h-12 w-[128px]  bg-muted hover:bg-muted",
            "pr-1 transition-all duration-300  border-accent/10 grow font-normal hover:text-foreground relative snap-center rounded-none shadow-none",
            activeTab === tab && "hover:text-accent text-accent bg-accent/10 hover:bg-accent/10",
            i === 0 && "rounded-l-full"
          )}
        >
          {#if i === 0}
            <Settings class="size-4" />
            Home
          {:else}
            {i}. {capitalize(tab)}
          {/if}

          {#if i !== 0}
            <span
              class={cn(
                "transition-all duration-300 absolute left-0 ",
                "size-0 border-y-24 border-l-12 border-y-transparent border-l-muted"
              )}
            ></span>
          {/if}
          <span
            style="z-index: {tabs.length - i}"
            class={cn(
              "transition-all duration-300 absolute right-0 translate-x-full",
              "size-0 border-y-24 border-l-12 border-y-transparent border-l-muted",
              activeTab === tab && "border-l-accent/5"
            )}
          ></span>
        </Button>
      {/each}

      <Button
        href={`/characters/${character.uid}/`}
        variant="link"
        class="pl-8 pr-7 font-normal bg-muted rounded-r-full h-12 w-[128px]"
      >
        <p class="hidden md:block">Sheet</p>
        <ExternalLink class="size-4" />
      </Button>
      <!-- </div> -->

      <div class="shrink-0 w-[50vw] md:w-0"></div>
    </div>
  </div>

  <div class="max-w-3xl mx-auto md:grid md:grid-cols-[1fr_var(--container-2xl)_1fr]">
    <Button
      disabled={tabs.indexOf(activeTab) === 0}
      href={`/characters/${character.uid}/${tabs[tabs.indexOf(activeTab) - 1]}`}
      variant="ghost"
      class="hidden md:flex text-accent size-12 rounded-full  p-0 justify-self-center mt-12 bg-accent/10 hover:bg-accent/20"
    >
      <ChevronLeft class="size-6 -ml-[1px]" />
    </Button>

    <main class="md:max-w-2xl">
      {@render children?.()}
    </main>

    {#if tabs.indexOf(activeTab) < tabs.length - 1}
      <Button
        href={`/characters/${character.uid}/${tabs[tabs.indexOf(activeTab) + 1]}`}
        variant="ghost"
        class="hidden md:flex text-accent size-12 rounded-full  p-0 justify-self-center mt-12 bg-accent/10 hover:bg-accent/20"
      >
        <ChevronRight class="size-6 -mr-[1px]" />
      </Button>
    {:else}
      <Button
        href={`/characters/${character.uid}/`}
        variant="ghost"
        class="hidden md:flex text-accent size-12 rounded-full  p-0 justify-self-center mt-12 bg-accent/10 hover:bg-accent/20"
      >
        <ExternalLink class="size-4 -mr-[1px]" />
      </Button>
    {/if}
  </div>
{/if}
