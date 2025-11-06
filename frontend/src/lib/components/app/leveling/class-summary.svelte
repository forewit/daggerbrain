<script lang="ts">
  import Banner from "$lib/components/app/cards/class-banner.svelte";
  import { DOMAINS } from "$lib/ts/content/domains/domains";
  import type { Class, DomainIds } from "$lib/ts/character/types";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import * as Select from "$lib/components/ui/select/";
  import DomainBanner from "$lib/components/app/cards/domain-banner.svelte";

  let {
    character_class,
    class: className = "",
    bannerClasses = "",
    children,
    multiclass = false,
    domain_id_selection: domain_selection = $bindable(null),
    hide_starting_stats = false,
  }: {
    character_class: Class;
    class?: string;
    bannerClasses?: string;
    children?: Snippet;
    multiclass?: boolean;
    hide_starting_stats?: boolean;
    domain_id_selection?: DomainIds | null;
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
              else domain_selection = value as DomainIds;
            }}
          >
            <Select.Trigger
              highlighted={domain_selection === null}
              class="w-full truncate bg-muted-foreground/8 hover:bg-muted-foreground/5"
            >
              <p class="truncate">
                {domain_selection
                  ? DOMAINS[domain_selection].name
                  : "Select a domain"}
              </p>
            </Select.Trigger>
            <Select.Content class="rounded-md " align="start">
              <Select.Item value="" class="justify-center hover:cursor-pointer text-sm"
                >-- none selected --</Select.Item
              >
              <Select.Label>Domains</Select.Label>
              <!-- primary domain -->
              <Select.Item value={character_class.primary_domain_id}
                >{DOMAINS[character_class.primary_domain_id].name}</Select.Item
              >
              <!-- secondary domain -->
              <Select.Item value={character_class.secondary_domain_id}
                >{DOMAINS[character_class.secondary_domain_id]
                  .name}</Select.Item
              >
            </Select.Content>
          </Select.Root>
        {:else}
          <p class="text-xs text-muted-foreground">
            <b class="text-foreground"><i>Domains:</i></b>
            {DOMAINS[character_class.primary_domain_id].name} /
            {DOMAINS[character_class.secondary_domain_id].name}
          </p>

          {#if !hide_starting_stats}
            <p class="text-xs text-muted-foreground">
              <b class="text-foreground"><i>Evasion:</i></b>
              {character_class.starting_evasion}
            </p>
            <p class="text-xs text-muted-foreground">
              <b class="text-foreground"><i>HP:</i></b>
              {character_class.starting_max_hp}
            </p>
          {/if}
        {/if}
      </div>
    </div>

    {#if multiclass && domain_selection !== null}
      <DomainBanner domain_id={domain_selection} />
    {:else}
      <Banner {character_class} class={bannerClasses} />
    {/if}
  </div>
  {@render children?.()}
</div>
