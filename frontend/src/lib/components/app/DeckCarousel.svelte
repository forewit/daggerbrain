<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import type { Deck } from "$lib/ts/types";
  import { cn } from "$lib/utils";

  let { class: className = "", deck = $bindable() }: { class?: string; deck: Deck } = $props();

  const app = getAppContext();
</script>

<div class={cn("border rounded-lg", className)}>
    <p>Ancestry: {deck.Ancestry.length}</p>
    <p>Community: {deck.Community.length}</p>
    <p>Subclass: {deck.Subclass.length}</p>
    <p>Domain: {deck.Domain.length}</p>
</div>
