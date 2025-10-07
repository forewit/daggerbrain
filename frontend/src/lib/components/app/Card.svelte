<script lang="ts">
    import { getAppContext } from "$lib/ts/app.svelte";
    import { cn } from "$lib/utils";
  
    let { class: className = "", card = $bindable() }: { class?: string; card: string } = $props();
  
    const app = getAppContext();
  </script>
    
  <div class={cn("w-20 h-40 border rounded-lg", className)}>
    <img src={card} alt="Card" />
  </div>
  