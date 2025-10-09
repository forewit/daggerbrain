<script lang="ts">
    import { cn } from "$lib/utils";
  
    let { class: className = "", level }: { class?: string; level: number } =
      $props();
  </script>
  
  <div class={cn("rounded-md border-2 grid place-items-center h-6 w-6", className)}>
    <p class="text-foreground text-sm">{level}</p>
  </div>
  