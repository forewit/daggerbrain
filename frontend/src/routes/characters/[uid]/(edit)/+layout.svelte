<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { page } from "$app/state";
  import { cn, capitalize, handleImageUpload } from "$lib/utils";
  import Settings from "@lucide/svelte/icons/settings";
  import Button from "$lib/components/ui/button/button.svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { onMount } from "svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  let { data, children } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

  const tabs = ["edit", "heritage", "class", "experiences", "equipment"];
  let activeTab = $derived(page.url.pathname.split("/").pop() || "edit");

  let fileInput = $state<HTMLInputElement>();

  function onImageUploadSuccess(dataUrl: string) {
    if (character) {
      character.image = dataUrl;
    }
  }

  function triggerImageUpload() {
    fileInput?.click();
  }

  function scrollToActiveTab(event?: Event) {
    const el = document.getElementById(activeTab);
    el?.scrollIntoView({
      behavior: event ? "instant" : "smooth",
      inline: "center",
      block: "center",
    });
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
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
      "@container grid grid-cols-[1fr_repeat(6,128px)_1fr] items-center",
      "snap-x snap-mandatory overflow-x-auto ",
      "bg-muted/50 mt-3 h-18 "
    )}
    style="scrollbar-width: none;"
  >
    <div class="shrink-0 w-[50vw] @3xl:w-0"></div>

    {#each tabs as tab, i}
      <Button
        id={tab}
        variant="ghost"
        href={`/characters/${character.uid}/${tab}`}
        class={cn(
          "border-b h-12 w-[calc(var(--container-3xl)/6)] max-w-[calc(var(--container-3xl)/6)] bg-muted hover:bg-muted",
          "pr-1 transition-all duration-300 font-normal hover:text-foreground relative snap-center rounded-none shadow-none",
          activeTab === tab &&
            "border-accent/10 hover:text-accent text-accent bg-accent-muted hover:bg-accent-muted",
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
            activeTab === tab && "border-l-accent-muted"
          )}
        ></span>
      </Button>
    {/each}

    <Button
      href={`/characters/${character.uid}/`}
      variant="link"
      class="border-b pl-8 pr-7 font-normal bg-muted rounded-r-full h-12 w-[calc(var(--container-3xl)/6)]"
    >
      Sheet
      <ExternalLink class="size-4" />
    </Button>

    <div class="shrink-0 w-[50vw] @3xl:w-0"></div>
  </div>

  <!-- page -->
  <div class="@container pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
    <div class="max-w-3xl mx-auto @3xl:grid @3xl:grid-cols-[auto_1fr_auto] gap-4 items-center m-3">
      <Button
        disabled={tabs.indexOf(activeTab) === 0}
        href={`/characters/${character.uid}/${tabs[tabs.indexOf(activeTab) - 1]}`}
        variant="ghost"
        class="border-b border-accent/10 hidden @3xl:flex text-accent size-12 rounded-full p-0 justify-self-center bg-accent/10 hover:bg-accent/20"
      >
        <ChevronLeft class="size-6 -ml-[1px]" />
      </Button>

      <!-- image and name -->
      <main class="max-w-2xl flex gap-3 px-4 @3xl:px-0 mx-auto @3xl:mx-0">
        <button
          class="h-[90px] w-[90px] shrink-0 p-1 aspect-square rounded-lg border-2 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
          onclick={triggerImageUpload}
        >
          <img
            class="h-full w-full rounded-md object-cover"
            src={character.image}
            alt={character.name}
          />
        </button>
        <div class="flex flex-col gap-1 mt-1">
          <p class="text-sm font-medium">Character Name</p>
          <Input bind:value={character.name} class="w-[240px]" />
        </div>

        <!-- hidden file input for image upload -->
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          onchange={(event) => handleImageUpload(event, onImageUploadSuccess)}
          class="hidden"
        />
      </main>

      {#if tabs.indexOf(activeTab) < tabs.length - 1}
        <Button
          href={`/characters/${character.uid}/${tabs[tabs.indexOf(activeTab) + 1]}`}
          variant="ghost"
          class="border-b border-accent/10 hidden @3xl:flex text-accent size-12 rounded-full  p-0 justify-self-center bg-accent/10 hover:bg-accent/20"
        >
          <ChevronRight class="size-6 -mr-[1px]" />
        </Button>
      {:else}
        <Button
          href={`/characters/${character.uid}/`}
          variant="ghost"
          class={cn(
            "border-b border-accent/10 hidden @3xl:flex text-accent size-12 rounded-full  p-0 justify-self-center bg-accent/10 hover:bg-accent/20"
          )}
        >
          <ExternalLink class="size-4 -mr-[1px]" />
        </Button>
      {/if}
    </div>
  </div>

  {@render children?.()}
{/if}
