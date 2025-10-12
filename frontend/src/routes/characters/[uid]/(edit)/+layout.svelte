<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { page } from "$app/state";
  import { cn } from "$lib/utils";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data, children } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
      "max-w-6xl mx-auto snap-x snap-mandatory overflow-x-auto",
      "flex items-center"
    )}
    style="scrollbar-width: none;"
  >
    <Button
      href={`/characters/${character.uid}/settings`}
      onclick={(e) => {
        const el = e.target as HTMLElement;
        el.scrollIntoView({ behavior: "smooth", inline: "center" });
      }}
      class="snap-center rounded-none h-10 px-10 shadow-none border-r bg-muted/50"
    >
      Home
    </Button>

    <Button
      href={`/characters/${character.uid}/heritage`}
      onclick={(e) => {
        const el = e.target as HTMLElement;
        el.scrollIntoView({ behavior: "smooth", inline: "center" });
      }}
      class="snap-center rounded-none h-10 px-10 shadow-none border-r bg-muted/50"
      >
      Heritage
    </Button>

    <Button
      href={`/characters/${character.uid}/class`}
      onclick={(e) => {
        const el = e.target as HTMLElement;
        el.scrollIntoView({ behavior: "smooth", inline: "center" });
      }}
      class="snap-center rounded-none h-10 px-10 shadow-none border-r bg-muted/50"
      >
      Class
    </Button>
    <Button
      href={`/characters/${character.uid}/experiences`}
      onclick={(e) => {
        const el = e.target as HTMLElement;
        el.scrollIntoView({ behavior: "smooth", inline: "center" });
      }}
      class="snap-center rounded-none h-10 px-10 shadow-none border-r bg-muted/50"
      >
      Experiences
    </Button>
    <Button
      href={`/characters/${character.uid}/equipment`}
      onclick={(e) => {
        const el = e.target as HTMLElement;
        el.scrollIntoView({ behavior: "smooth", inline: "center" });
      }}
      class="snap-center rounded-none h-10 px-10 shadow-none border-r bg-muted/50"
      >
      Equipment
    </Button>

    <Button href={`/characters/${character.uid}/`} variant="link"><ExternalLink /> View</Button>
  </div>

  {@render children?.()}
{/if}
