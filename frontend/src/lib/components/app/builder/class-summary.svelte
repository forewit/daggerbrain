<script lang="ts">
  import Banner from "$lib/components/app/sheet/banner.svelte";
  import { DOMAINS } from "$lib/ts/constants";
  import type { Class } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  let {
    character_class,
    class: className = "",
    bannerClasses = "",
    children,
  }: {
    character_class: Class;
    class?: string;
    bannerClasses?: string;
    children?: Snippet;
  } = $props();
</script>

<div class={cn("flex flex-col gap-3", className)}>
  <div class="flex text-left gap-3">
    <div class="grow max-w-[120px]">
      <img src={character_class.image_url} alt="art" class="h-full object-cover" />
    </div>
    <div class="grow flex flex-col gap-2 grow-4">
      <p class="text-lg font-medium">{character_class.name}</p>
      <p class="-mt-2 text-xs italic text-muted-foreground">
        {@html character_class.description_html}
      </p>

      <div class="flex flex-col gap-1">
        <p class="text-xs text-muted-foreground">
          <b class="text-foreground"><i>Domains:</i></b>
          {DOMAINS[character_class.primary_domain as keyof typeof DOMAINS].name} /
          {DOMAINS[character_class.secondary_domain as keyof typeof DOMAINS].name}
        </p>
        <p class="text-xs text-muted-foreground">
          <b class="text-foreground"><i>Evasion:</i></b>
          {character_class.starting_evasion}
        </p>
        <p class="text-xs text-muted-foreground">
          <b class="text-foreground"><i>HP:</i></b>
          {character_class.starting_max_hp}
        </p>
      </div>
    </div>

    <Banner {character_class} class={bannerClasses} />
  </div>
  {@render children?.()}
</div>
