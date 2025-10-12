<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { page } from "$app/state";
  import { cn, capitalize } from "$lib/utils";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data, children } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

  const tabs = ["settings", "heritage", "class", "experiences", "equipment"];
  let activeTab = $derived(page.url.pathname.split("/").pop() || "settings");

  $effect(() => {
    const el = document.getElementById(activeTab);
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  });
</script>

{#if character}
  <div class={cn("pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]", "bg-muted/50")}>
    <div
      class="snap-x snap-mandatory overflow-x-auto max-w-6xl mx-auto h-12 flex items-center"
      style="scrollbar-width: none;"
    >
      {#each tabs as tab}
        <Button
          id={tab}
          variant="ghost"
          href={`/characters/${character.uid}/${tab}`}
          class={cn(
            "group overflow-hidden relative snap-center rounded-none h-full px-10 shadow-none border-x border-primary/50",
            activeTab === tab && "text-accent bg-primary/50 hover:bg-primary/50 border-none"
          )}
        >
          {capitalize(tab)}
          <span
            class={cn(
              "absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 size-4 bg-primary/50 group-hover:bg-accent rotate-45",
              activeTab === tab && "bg-accent "
            )}
          ></span>
        </Button>
      {/each}
      <div class="min-w-8"></div>
      <Button href={`/characters/${character.uid}/`} variant="link" class="ml-auto">
        View Character
        <ExternalLink class="size-4" />
      </Button>
      <div class="min-w-8"></div>
    </div>
  </div>

  {@render children?.()}
{/if}
