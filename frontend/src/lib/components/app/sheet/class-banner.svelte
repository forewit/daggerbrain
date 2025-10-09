<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Class } from "./types";

  let { class: className = "", characterClass }: { class?: string; characterClass: Class } =
    $props();
</script>

<div class={cn("flex flex-col", className)}>
  <p>{characterClass.primary_domain}</p>
  <p>{characterClass.secondary_domain}</p>
</div>
