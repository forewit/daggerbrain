<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-6xl mx-auto px-4 py-4 pt-6"
    )}
  >
    <div class="flex flex-col gap-4 text-nowrap">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 grow">
        {#if character.experiences.length >= 2}
          <div>
            <p class="font-medium pb-2">1st Experience</p>
            <div class="flex flex-col gap-3 bg-primary/50 rounded-lg p-4 relative">
              <div class="flex gap-4 items-center">
                <p class="font-medium">+{character.experiences[0].modifier}</p>
                <Input bind:value={character.experiences[0].title} placeholder="Name" />
              </div>
              <Textarea
                bind:value={character.experiences[0].description}
                placeholder="Description"
              />
            </div>
          </div>

          <div>
            <p class="font-medium pb-2">2nd Experience</p>
            <div class="flex flex-col gap-3 bg-primary/50 rounded-lg p-4 relative">
              <div class="flex gap-4 items-center">
                <p class="font-medium">+{character.experiences[1].modifier}</p>
                <Input bind:value={character.experiences[1].title} placeholder="Name" />
              </div>
              <Textarea
                bind:value={character.experiences[1].description}
                placeholder="Description"
              />
            </div>
          </div>
        {/if}
      </div>

      <Label>Description</Label>
      <Label>Background Questions</Label>
      <Label>Connections</Label>
    </div>
  </div>
{/if}
