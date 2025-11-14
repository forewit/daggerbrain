<script lang="ts">
  import { getCharacterContext } from "$lib/ts/character/character.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Plus from "@lucide/svelte/icons/plus";
  import SquarePen from "@lucide/svelte/icons/square-pen";
  import Bookmark from "@lucide/svelte/icons/bookmark";
  import Trash from "@lucide/svelte/icons/trash";

  const context = getCharacterContext();
  let character = $derived(context.character);
  let primary_class = $derived(context.primary_class);
  let editingQuestionIndex = $state<number | null>(null);
  let questionTextareaRef = $state<HTMLTextAreaElement | null>(null);

  function addQuestion() {
    if (character) {
      character.background_questions.push({ question: "", answer: "" });
      // Start editing the new question
      editingQuestionIndex = character.background_questions.length - 1;
      // Focus the textarea after it's rendered
      setTimeout(() => {
        if (questionTextareaRef) {
          questionTextareaRef.focus();
        }
      }, 0);
    }
  }

  function removeQuestion(index: number) {
    if (character) {
      character.background_questions.splice(index, 1);
      if (editingQuestionIndex === index) {
        editingQuestionIndex = null;
      } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
        editingQuestionIndex--;
      }
    }
  }

  function resetQuestions() {
    if (character && primary_class) {
      character.background_questions = primary_class.background_questions.map((question) => ({
        question,
        answer: "",
      }));
      editingQuestionIndex = null;
    }
  }

  function startEditing(index: number) {
    editingQuestionIndex = index;
    // Focus the textarea after it's rendered
    setTimeout(() => {
      if (questionTextareaRef) {
        questionTextareaRef.focus();
        questionTextareaRef.select();
      }
    }, 0);
  }

  function stopEditing() {
    editingQuestionIndex = null;
  }
</script>

{#if character && primary_class}
  {#each character.background_questions as item, i}
    <div class="bg-primary/50 p-3 rounded-md">
      <div class="flex gap-2 items-center justify-between mb-3">
        {#if editingQuestionIndex === i}
          <Textarea
            bind:ref={questionTextareaRef}
            bind:value={item.question}
            placeholder="Enter your question..."
            class="min-h-16 grow"
            onblur={(e: FocusEvent) => {
              setTimeout(() => {
                if (editingQuestionIndex === i) stopEditing();
              }, 1000);
            }}
          />

          <Button
            variant="link"
            onclick={() => removeQuestion(i)}
            class="text-destructive px-1 w-min"
          >
            <Trash class="size-4" />
            Delete
          </Button>
        {:else}
          <Button
            class="items-start grow text-left p-0 h-auto whitespace-normal"
            variant="link"
            onclick={() => startEditing(i)}
          >
            <p class="text-sm grow">{item.question || "Untitled question"}</p>
            <SquarePen class="size-4 mt-1 mx-1" />
          </Button>
        {/if}
      </div>
      <div class="">
        <Textarea
          bind:value={item.answer}
          placeholder="Your answer..."
          class="min-h-24"
        />
      </div>
    </div>
  {/each}

  <div class="flex items-center justify-between gap-4">
    <Button variant="outline" onclick={addQuestion} class="flex items-center gap-2">
      <Plus class="size-4" />
      Add Question
    </Button>
    <Button variant="link" onclick={resetQuestions} class="text-muted-foreground">Reset?</Button>
  </div>
{:else}
  <p class="text-sm text-muted-foreground italic">
    Select a class to see your background questions.
  </p>
{/if}
