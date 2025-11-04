<script lang="ts">
  import Banner from "$lib/components/app/cards/class-banner.svelte";
  import { DOMAINS } from "$lib/ts/constants/constants";
  import type { Class } from "$lib/ts/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import * as Select from "$lib/components/ui/select/";
  import DomainBanner from "../cards/domain-banner.svelte";

  let {
    character_class,
    class: className = "",
    bannerClasses = "",
    children,
    multiclass = false,
    domain_selection = $bindable(null),
  }: {
    character_class: Class;
    class?: string;
    bannerClasses?: string;
    children?: Snippet;
    multiclass?: boolean;
    domain_selection?: keyof typeof DOMAINS | null;
  } = $props();
</script>

<div class={cn("flex flex-col gap-3", className)}>
  <div class="flex text-left gap-3">
    <div class="grow max-w-[120px] min-w-[60px]">
      <img src={character_class.image_url} alt="art" class="h-full object-cover" />
    </div>
    <div class="grow flex flex-col gap-2 grow-4">
      <p class="text-lg font-medium">{character_class.name}</p>
      <p class="-mt-2 text-xs italic text-muted-foreground">
        {@html character_class.description_html}
      </p>

      <div class="flex flex-col gap-2">
        {#if multiclass}
          <p class="text-xs font-medium">Multiclass domain</p>
          <Select.Root
            type="single"
            value={domain_selection ?? ""}
            onValueChange={(value) => {
              if (value === "") domain_selection = null;
              else domain_selection = value as keyof typeof DOMAINS;
            }}
          >
            <Select.Trigger
              highlighted={domain_selection === null}
              class="w-full truncate bg-muted-foreground/10 hover:bg-muted-foreground/8"
            >
              <p class="truncate">
                {domain_selection
                  ? DOMAINS[domain_selection as keyof typeof DOMAINS].name
                  : "Select a domain"}
              </p>
            </Select.Trigger>
            <Select.Content class="rounded-md " align="start">
              <Select.Item value="" class="justify-center hover:cursor-pointer text-sm"
                >-- none selected --</Select.Item
              >
              <Select.Label>Domains</Select.Label>
              <!-- primary domain -->
              <Select.Item value={character_class.primary_domain}
                >{DOMAINS[character_class.primary_domain as keyof typeof DOMAINS].name}</Select.Item
              >
              <!-- secondary domain -->
              <Select.Item value={character_class.secondary_domain}
                >{DOMAINS[character_class.secondary_domain as keyof typeof DOMAINS]
                  .name}</Select.Item
              >
            </Select.Content>
          </Select.Root>
        {:else}
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
        {/if}
      </div>
    </div>

    {#if multiclass && domain_selection !== null}
    <DomainBanner domain_name={domain_selection}  />

    {:else}
    <Banner {character_class} class={bannerClasses} />
    {/if}
  </div>
  {@render children?.()}
</div>
