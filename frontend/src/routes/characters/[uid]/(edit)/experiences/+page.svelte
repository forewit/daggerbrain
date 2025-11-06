<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

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
        subtitle={character.experiences.filter((experience) => experience !== "").join(", ")}
      >
        <div class="text-sm italic flex flex-col gap-2">
          <p>
            An Experience is a word or phrase used to encapsulate a specific set of skills
            personality traits or aptitudes your character has acquired over the course of their
            life When your PC makes a move they can spend a Hope to add a relevant Experience's
            modifier to an action or reaction roll.
          </p>
          <p>You get two Experiences at character creation each with a +2 modifier.</p>
        </div>
        {#each character.experiences as experience, i}
          <div class="mt-4 bg-primary/50 p-2 rounded-md">
            <p class="text-xs italic pb-1 px-2">Experience name</p>
            <div class="flex items-center">
              <Input bind:value={character.experiences[i]} placeholder="Name" />
              <p class="font-medium pr-4 pl-5">
                +{context.experience_modifiers[i]}
              </p>
            </div>
          </div>
        {/each}
      </Dropdown>

      <Label>Description</Label>
      <Label>Background Questions</Label>
      <Label>Connections</Label>
    </div>
  </div>
{/if}
