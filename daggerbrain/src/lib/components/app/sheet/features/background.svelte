<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';

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
				<p class="text-[1rem] font-medium">Background Questions</p>
				{#each character.background_question_answers as item}
					<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-3">
						<p class="text-sm font-medium">{item.question || 'Untitled question'}</p>
						{#if item.answer}
							<p class="pl-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
						{:else}
							<p class="pl-2 text-sm text-muted-foreground/50 italic">No answer provided</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Connections -->
		{#if character.connection_answers.length > 0}
			<div class="flex flex-col gap-3">
				<p class="text-[1rem] font-medium">Connections</p>
				{#each character.connection_answers as item}
					<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-3">
						<p class="text-sm font-medium">{item.question || 'Untitled connection'}</p>
						{#if item.answer}
							<p class="pl-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
						{:else}
							<p class="pl-2 text-sm text-muted-foreground/50 italic">No answer provided</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		{#if character.background_question_answers.length === 0 && character.connection_answers.length === 0}
			<p class="py-4 text-center text-sm text-muted-foreground">
				No background questions or connections have been filled out yet.
			</p>
		{/if}
	{:else}
		<p class="py-4 text-center text-sm text-muted-foreground italic">
			Select a class to see background information.
		</p>
	{/if}
</div>
