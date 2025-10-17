<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Dropdown from "$lib/components/app/builder/dropdown.svelte";
  import { EXPERIENCES } from "$lib/ts/rules.js";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <Dropdown
        title="Experiences"
        subtitle={character.experiences
          .filter((experience) => experience.title !== "")
          .map((experience) => experience.title)
          .join(" | ")}
      >
        <div class="text-sm italic flex flex-col gap-2">
          {@html EXPERIENCES.description_html}
        </div>
        {#each character.experiences as experience, index}
        <div class="mt-4 flex flex-col gap-3 bg-primary/50 rounded-lg p-4 relative">
          <div class="flex gap-4 items-center">
            <p class="font-medium">+{experience.modifier}</p>
            <Input bind:value={experience.title} placeholder="Name" />
          </div>
          <Textarea bind:value={experience.description} placeholder="Description" />
        </div>
        {/each}
      </Dropdown>

      <Label>Description</Label>
      <Label>Background Questions</Label>
      <Label>Connections</Label>
    </div>
  </div>
{/if}
