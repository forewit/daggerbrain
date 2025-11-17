<script lang="ts">
  import { cn } from "$lib/utils";
  import Input from "$lib/components/ui/input/input.svelte";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import BackgroundQuestions from "$lib/components/app/descriptions/background-questions.svelte";
  import Connections from "$lib/components/app/descriptions/connections.svelte";

  const context = getCharacterContext();
  let character = $derived(context.character);

  // Check if experiences dropdown should be highlighted
  let experiencesHighlighted = $derived(character?.experiences.some((exp) => !exp.trim()) ?? false);

  // Check if background questions dropdown should be highlighted
  let backgroundQuestionsHighlighted = $derived(
    character?.background_questions.some((item) => !item.answer.trim()) ?? false
  );

  // Check if connections dropdown should be highlighted
  let connectionsHighlighted = $derived(
    character?.connections.some((item) => !item.answer.trim()) ?? false
  );
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
        subtitle={character.experiences.filter((experience) => experience.trim()).join(", ")}
        highlighted={experiencesHighlighted}
      >
        <div class="text-muted-foreground text-sm italic flex flex-col gap-2">
          <p>
            An Experience is a word or phrase used to encapsulate a specific set of skills
            personality traits or aptitudes your character has acquired over the course of their
            life When your PC makes a move they can spend a Hope to add a relevant Experience's
            modifier to an action or reaction roll.
          </p>
          <p>
            You get two Experiences at character creation each with a +2 modifier and gain more as
            you level up.
          </p>
        </div>
        {#each character.experiences as experience, i}
          <div class="mt-4 bg-primary/50 px-2 py-3 rounded-md flex items-center">
            <Input bind:value={character.experiences[i]} placeholder="Experience name..." />
            <p class="font-medium pr-4 pl-5">
              +{context.experience_modifiers[i]}
            </p>
          </div>
        {/each}
      </Dropdown>

      <Dropdown title="Background Questions" highlighted={backgroundQuestionsHighlighted}>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-muted-foreground italic">
            Answer any of the following background questions. You can also create your own
            questions.
          </p>
          <BackgroundQuestions />
        </div>
      </Dropdown>

      <Dropdown title="Connections" highlighted={connectionsHighlighted}>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-muted-foreground italic">
            Ask your fellow players one of the following questions for their character to answer, or
            create your own questions.
          </p>
          <Connections />
        </div>
      </Dropdown>
    </div>
  </div>
{/if}
