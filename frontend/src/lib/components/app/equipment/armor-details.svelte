<script lang="ts">
  import type { Armor } from "$lib/ts/character/types";
  import Shield from "@lucide/svelte/icons/shield";

  let { armor }: { armor: Armor } = $props();
</script>

<div class="flex flex-col gap-4">
  <!-- Description -->
  {#if armor.description_html}
    <div class="text-sm text-muted-foreground">
      {@html armor.description_html}
    </div>
  {/if}

  <!-- Stats Badges -->
  <div class="grid gap-4">
    <div class="flex justify-around sm:justify-start gap-4">
      <div class="flex flex-wrap items-center justify-center gap-1">
        <span class="text-xs font-medium text-muted-foreground">Armor Score</span>
        <div class="text-nowrap text-xs flex items-center gap-1 bg-foreground/5 border rounded-full px-2 py-1">
          {armor.max_armor}<Shield class="size-3.5" />
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-1">
        <span class="text-xs font-medium text-muted-foreground">Damage Thresholds</span>
        <div class="text-nowrap text-xs bg-foreground/5 border rounded-full px-2 py-1">
          {armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
        </div>
      </div>
    </div>

    <!-- Features -->
    {#if armor.features.length > 0}
      <div class="flex flex-col gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
        {#each armor.features as feature}
          <div class="text-sm text-muted-foreground">
            <p class="text-sm font-medium text-foreground">{feature.title}</p>
            {@html feature.description_html}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
