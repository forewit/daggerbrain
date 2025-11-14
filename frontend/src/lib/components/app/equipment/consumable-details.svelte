<script lang="ts">
  import type { Consumable } from "$lib/ts/character/types";

  let { consumable }: { consumable: Consumable } = $props();
</script>

<div class="flex flex-col gap-4">
  <!-- Description -->
  {#if consumable.description_html}
    <div class="text-sm text-muted-foreground">
      {@html consumable.description_html}
    </div>
  {/if}
</div>

