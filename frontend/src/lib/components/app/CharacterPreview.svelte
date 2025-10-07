<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Button from "../ui/button/button.svelte";

  let { class: className = "", characterUid = "" } = $props();

  const app = getAppContext();

  const character = $derived(app.characters.find((c) => c.uid === characterUid));
</script>

<div class={cn("w-100 h-60 border rounded-lg p-4", className)}>
  {#if character !== undefined}
    <div class="flex flex-col h-full">
      <div class="flex-1">
        <a href="/characters/{characterUid}" class="text-blue-400 hover:text-blue-300 text-lg font-medium">
          {character.name}
        </a>
      </div>
      <div class="mt-auto">
        <Button variant="link" onclick={()=> app.deleteCharacter(characterUid)}>Delete</Button>
      </div>
    </div>
  {/if}
</div>
