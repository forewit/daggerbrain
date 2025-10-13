<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { page } from "$app/state";
  import { cn, capitalize } from "$lib/utils";
  import Settings from "@lucide/svelte/icons/settings";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data, children } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

  const tabs = ["home", "heritage", "class", "experiences", "equipment"];
  let activeTab = $derived(page.url.pathname.split("/").pop() || "home");

  $effect(() => {
    const el = document.getElementById(activeTab);
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  });
</script>

{#if character}
  <div
    class={cn("mt-4 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]", "bg-muted/50")}
  >
    <div
      class="snap-x snap-mandatory overflow-x-auto max-w-6xl mx-auto h-16 flex items-center"
      style="scrollbar-width: none;"
    >
      <div class="shrink-0 w-[50vw] min-[900px]:w-0"></div>

      {#each tabs as tab, i}
        <Button
          id={tab}
          variant="ghost"
          href={`/characters/${character.uid}/${tab}`}
          class={cn(
            "font-normal overflow-hidden hover:text-foreground relative snap-center rounded-none h-full px-10 shadow-none",
            activeTab === tab && "hover:text-accent text-accent"
          )}
        >
          {#if i === 0}
            <Settings class="size-4" />
          {/if}
          {i > 0 ? i + ". " : ""}{capitalize(tab)}
          <span
            class={cn(
              "absolute left-full -translate-x-1/2 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-accent/20 "
            )}
          ></span>
        </Button>
      {/each}
      <Button href={`/characters/${character.uid}/`} variant="link" class="font-normal px-10">
        Sheet
        <ExternalLink class="size-4" />
      </Button>

      <div class="shrink-0 w-[50vw] min-[900px]:w-0"></div>
    </div>
  </div>

  {@render children?.()}
{/if}
