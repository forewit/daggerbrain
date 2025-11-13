<script lang="ts">
  import { capitalize } from "$lib/utils";
  import type { Weapon } from "$lib/ts/character/types";
  import Hand from "@lucide/svelte/icons/hand";

  let { weapon }: { weapon: Weapon } = $props();
</script>


  <div class="flex flex-col gap-4">
    <!-- Description -->
    {#if weapon.description_html}
      <div class="text-sm text-muted-foreground">
        {@html weapon.description_html}
      </div>
    {/if}

    <!-- Stats Badges -->
    <div class="grid sm:grid-cols-[auto_1fr] gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-muted-foreground">Burden:</span>
          <div class="text-xs flex items-center gap-1 bg-foreground/5 border rounded-full px-2 py-1">
            {weapon.burden}<Hand class="size-3.5" />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-muted-foreground">Damage:</span>
          <div class="text-xs bg-foreground/5 border rounded-full px-2 py-1">
            {weapon.damage_dice}
            {weapon.available_damage_types.map(capitalize).join("/")}
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-muted-foreground">Range:</span>
          <div class="text-xs bg-foreground/5 border rounded-full px-2 py-1">
            {weapon.range}
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-muted-foreground">Trait:</span>
          <div class="text-xs bg-foreground/5 border rounded-full px-2 py-1">
            {weapon.available_traits.map(capitalize).join(", ")}
          </div>
        </div>
      </div>

      <!-- Features -->
      {#if weapon.features.length > 0}
        <div class="flex flex-col gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
          {#each weapon.features as feature}
            <div class="text-sm text-muted-foreground">
              <p class="text-sm font-medium text-foreground">{feature.title}</p>
              {@html feature.description_html}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
