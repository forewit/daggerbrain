<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import Check from '@lucide/svelte/icons/check';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let primary_class = $derived(context.primary_class);
	let editingIndex = $state<number | null>(null);

	function addQuestion() {
		if (character) {
			character.background_question_answers.push({ question: '', answer: '' });
			editingIndex = character.background_question_answers.length - 1;
		}
	}

	function removeQuestion(index: number) {
		if (character) {
			character.background_question_answers.splice(index, 1);
			if (editingIndex === index) {
				editingIndex = null;
			} else if (editingIndex !== null && editingIndex > index) {
				editingIndex--;
			}
		}
	}

	function resetQuestions() {
		if (character && primary_class) {
			character.background_question_answers = primary_class.background_questions.map(
				(question) => ({
					question,
					answer: ''
				})
			);
			editingIndex = null;
		}
	}
</script>

{#if character && primary_class}
	{#each character.background_question_answers as item, i}
		<div class="flex flex-col gap-3 rounded-md bg-primary/50 p-3">
			<div class="flex items-start justify-between gap-2">
				{#if editingIndex === i}
					<Textarea
						bind:value={item.question}
						placeholder="Enter your question..."
						class="min-h-16 grow"
					/>
					<Button onclick={() => (editingIndex = null)} size="icon" variant="ghost">
						<Check class="size-4" />
					</Button>
				{:else}
					<Button
						class="h-auto grow items-start p-0 text-left whitespace-normal"
						variant="link"
						onclick={() => (editingIndex = i)}
					>
						<p class="grow text-sm">{item.question || 'Untitled question'}</p>
						<SquarePen class="mx-1 mt-1 size-4" />
					</Button>
				{/if}
			</div>
			<Textarea bind:value={item.answer} placeholder="Your answer..." class="min-h-24" />
			{#if editingIndex === i}
				<div class="flex justify-center sm:justify-end">
					<Button
						variant="link"
						onclick={() => removeQuestion(i)}
						class="-my-2 w-min px-1 text-destructive"
					>
						Remove
					</Button>
				</div>
			{/if}
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
