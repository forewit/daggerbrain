<script lang="ts">
    import { getAppContext } from "$lib/ts/app.svelte";
    import { cn } from "$lib/utils";
  
    let { data } = $props();

    const app = getAppContext();
    const character = $derived(app.characters.find((c) => c.uid === data.uid));
  </script>
  
  
    <div
      class={cn(
        "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
        "max-w-6xl mx-auto p-2"
      )}
    >
      <p class="text-2xl font-bold py-2">Class</p>
      <!-- Only make changes here -->
       
       <!-- end chnages -->
    </div>
  