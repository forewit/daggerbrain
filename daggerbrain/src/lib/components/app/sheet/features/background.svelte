<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { Textarea } from '$lib/components/ui/textarea';

	let { class: className = '' }: { class?: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let primary_class = $derived(context.primary_class);
</script>

<div class={cn('flex flex-col gap-6', className)}>
	{#if character && primary_class}
		<!-- Background Questions -->
		{#if character.background_question_answers.length > 0}
			<div class="flex flex-col gap-3">
				<p class="text-sm font-medium">Background Questions</p>
				{#each character.background_question_answers as item, i}
					<p class="ml-2 text-xs text-muted-foreground">{item.question || 'Untitled question'}</p>
					<Textarea
						bind:value={character.background_question_answers[i].answer}
						class="ml-2"
					/>
				{/each}
			</div>
		{/if}

		<!-- Connections -->
		{#if character.connection_answers.length > 0}
			<div class="flex flex-col gap-3">
				<p class="text-sm font-medium">Connections</p>
				{#each character.connection_answers as item, i}
					<p class="ml-2 text-xs text-muted-foreground">{item.question || 'Untitled connection'}</p>
					<Textarea
						bind:value={character.connection_answers[i].answer}
						class="ml-2"
					/>
				{/each}
			</div>
		{/if}

		{#if character.background_question_answers.length === 0 && character.connection_answers.length === 0}
			<p class="py-4 text-center text-xs text-muted-foreground">
				No background questions or connections have been filled out yet.
			</p>
		{/if}
	{:else}
		<p class="py-4 text-center text-xs text-muted-foreground italic">
			Select a class to see background information.
		</p>
	{/if}
</div>
