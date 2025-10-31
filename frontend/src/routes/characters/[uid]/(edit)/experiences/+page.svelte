<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import { EXPERIENCES } from "$lib/ts/constants/rules";
  import { getCharacterContext } from "$lib/ts/character.svelte.js";

  let { data } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
  <div
    class={cn(
      //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <Dropdown
        title="Experiences"
        subtitle={character.experiences
          .filter((experience) => experience !== "")
          .join(", ")}
      >
        <div class="text-sm italic flex flex-col gap-2">
          {@html EXPERIENCES.description_html}
        </div>
        {#each character.experiences as experience, i}
          <div class="flex items-center mt-4 bg-primary/50 rounded-lg p-4">
            <Input bind:value={character.experiences[i]} placeholder="Name" />
            <p class="font-medium pr-4 pl-5">+{character.derived_stats.experience_modifiers[i]}</p>
          </div>
        {/each}
      </Dropdown>

      <Label>Description</Label>
      <Label>Background Questions</Label>
      <Label>Connections</Label>
    </div>
  </div>
{/if}
