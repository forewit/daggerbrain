<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { page } from "$app/state";
  import { cn, capitalize, handleImageUpload } from "$lib/utils";
  import Settings from "@lucide/svelte/icons/settings";
  import Button from "$lib/components/ui/button/button.svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { onMount } from "svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import { goto } from "$app/navigation";
  import { uploadCharacterImage } from "$lib/ts/images.remote";

  let { data, children } = $props();

  const context = getCharacterContext();
  const character = $derived(context.character);

  const tabs = ["edit", "heritage", "class", "traits", "experiences", "equipment"];
  let activeTab = $derived(page.url.pathname.split("/").filter(t=>!!t).pop() || "edit");
  let fileInput = $state<HTMLInputElement>();

  async function onImageUploadSuccess(dataUrl: string) {
    if (!character) return;
    
    try {
      // Upload to R2 and get URL
      const result = await uploadCharacterImage({
        characterId: character.uid,
        imageData: dataUrl
      });
      
      // Update character with R2 URL instead of base64
      character.image = result.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    }
  }

  function triggerImageUpload() {
    fileInput?.click();
  }

  function scrollToActiveTab(instant?: boolean) {
    const el = document.getElementById(activeTab);
    el?.scrollIntoView({
      behavior: instant ? "instant" : "smooth",
      inline: "center",
      block: "end"
    });
  }

  onMount(() => {
    scrollToActiveTab(true);
    // window.addEventListener("resize", scrollToActiveTab);

    // return () => {
    //   window.removeEventListener("resize", scrollToActiveTab);
    // };
  });
</script>

{#if character}
  <!-- tabs -->
  <div
    class={cn(
      //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
      "@container grid grid-cols-[1fr_repeat(7,auto)_1fr] items-center",
      "snap-x snap-mandatory overflow-x-auto ",
      "bg-muted/50 mt-3 h-20"
    )}
    style="scrollbar-width: none;"
  >
    <div class="border-y h-12 bg-muted shrink-0 w-[50vw] @3xl:w-0 snap-align-none"></div>

    {#each tabs as tab, i}
      <Button
        id={tab}
        variant="ghost"
        class={cn(
          "focus-visible:ring-foreground",
          "border-y h-12 bg-muted hover:bg-muted",
          "pr-3 pl-6.5 transition-colors duration-100 font-normal hover:text-foreground relative snap-center rounded-none shadow-none",
          activeTab === tab &&
            "border-accent/10 hover:text-accent text-accent bg-accent-muted hover:bg-accent-muted",
          i === 0 && "@3xl:rounded-l-full"
        )}
        onclick={() => goto(`/characters/${character.uid}/${tab}/`).then(() => scrollToActiveTab())}
      >
        {#if i === 0}
          <Settings class="size-4" />
          Home
        {:else}
          {i}. {capitalize(tab)}
        {/if}

        <span
          class={cn(
            "transition-all transition-discreet duration-100 absolute left-0 ",
            "size-0 border-y-24 border-l-12 border-y-transparent border-l-muted",
            i === 0 && "@3xl:hidden"
          )}
        ></span>
        <span
          style="z-index: {tabs.length - i}"
          class={cn(
            "transition-colors duration-100 absolute right-0 translate-x-full",
            "size-0 border-y-24 border-l-12 border-y-transparent border-l-muted",
            activeTab === tab && "border-l-accent-muted"
          )}
        ></span>
      </Button>
    {/each}

    <Button
      href={`/characters/${character.uid}/`}
      variant="link"
      class="snap-center focus-visible:ring-foreground border-y pl-7 pr-7 font-normal bg-muted @3xl:rounded-r-full h-12"
    >
      Sheet
      <ExternalLink class="size-4" />
    </Button>

    <div class="border-y h-12 bg-muted shrink-0 w-[50vw] @3xl:w-0 snap-align-none"></div>
  </div>

  <!-- page -->
  <div class="@container">
    <div class="max-w-3xl mx-auto @3xl:grid @3xl:grid-cols-[auto_1fr_auto] gap-4 items-center m-3">
      <Button
        disabled={tabs.indexOf(activeTab) === 0}
        href={`/characters/${character.uid}/${tabs[tabs.indexOf(activeTab) - 1]}`}
        variant="ghost"
        class="border-b-0 @3xl:border-b border-accent/10 hidden @3xl:flex text-accent size-12 rounded-full p-0 justify-self-center bg-accent/10 hover:bg-accent/20"
      >
        <ChevronLeft class="size-6 -ml-[1px]" />
      </Button>

      <!-- image and name -->
      <main class="max-w-2xl flex gap-3 px-4 @3xl:px-0 mx-auto @3xl:mx-0">
        <button
          class="transition-colors h-[90px] w-[90px] shrink-0 p-1 aspect-square rounded-lg border-2 overflow-hidden cursor-pointer hover:border-primary/50 group"
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
  <div class="h-36"></div>
{/if}
