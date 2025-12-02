<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import SquarePen from '@lucide/svelte/icons/square-pen';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let primary_class = $derived(context.primary_class);
	let editingQuestionIndex = $state<number | null>(null);
	let questionTextareaRef = $state<HTMLTextAreaElement | null>(null);

	function addConnection() {
		if (character) {
			character.connection_answers.push({ question: '', answer: '' });
			// Start editing the new connection
			editingQuestionIndex = character.connection_answers.length - 1;
			// Focus the textarea after it's rendered
			setTimeout(() => {
				if (questionTextareaRef) {
					questionTextareaRef.focus();
				}
			}, 0);
		}
	}

	function removeConnection(index: number) {
		if (character) {
			character.connection_answers.splice(index, 1);
			if (editingQuestionIndex === index) {
				editingQuestionIndex = null;
			} else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
				editingQuestionIndex--;
			}
		}
	}

	function resetConnections() {
		if (character && primary_class) {
			character.connection_answers = primary_class.connection_questions.map((question) => ({
				question,
				answer: ''
			}));
			editingQuestionIndex = null;
		}
	}

	function startEditing(index: number) {
		editingQuestionIndex = index;
		// Focus the textarea after it's rendered
		// setTimeout(() => {
		//   if (questionTextareaRef) {
		//     questionTextareaRef.focus();
		//     questionTextareaRef.select();
		//   }
		// }, 0);
	}

	function stopEditing() {
		editingQuestionIndex = null;
	}
</script>

{#if character && primary_class}
	{#each character.connection_answers as item, i}
		<div class="flex flex-col gap-3 rounded-md bg-primary/50 p-3">
			<div class="flex items-start justify-between gap-2">
				{#if editingQuestionIndex === i}
					<Textarea
						bind:ref={questionTextareaRef}
						bind:value={item.question}
						placeholder="Enter your connection question..."
						class="min-h-16 grow"
						onblur={(e: FocusEvent) => {
							setTimeout(() => {
								if (editingQuestionIndex === i) stopEditing();
							}, 1000);
						}}
					/>
				{:else}
					<Button
						class="h-auto grow items-start p-0 text-left whitespace-normal"
						variant="link"
						onclick={() => startEditing(i)}
					>
						<p class="grow text-sm">{item.question || 'Untitled question'}</p>
						<SquarePen class="mx-1 mt-1 size-4" />
					</Button>
				{/if}
			</div>
			<Textarea bind:value={item.answer} placeholder="Your answer..." class="min-h-24" />
			{#if editingQuestionIndex === i}
				<div class="flex justify-center sm:justify-end">
					<Button
						variant="link"
						onclick={() => removeConnection(i)}
						class="-my-2 w-min px-1 text-destructive"
					>
						Remove
					</Button>
				</div>
			{/if}
		</div>
	{/each}

	<div class="flex items-center justify-between gap-4">
		<Button variant="outline" onclick={addConnection} class="flex items-center gap-2">
			<Plus class="size-4" />
			Add Connection
		</Button>
		<Button variant="link" onclick={resetConnections} class="text-muted-foreground">Reset?</Button>
	</div>
{:else}
	<p class="text-sm text-muted-foreground italic">
		Select a class to see your connection questions.
	</p>
{/if}
