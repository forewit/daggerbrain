<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let primary_class = $derived(context.primary_class);

	let backgroundQuestionsOpen = $state(true);
	let connectionQuestionsOpen = $state(false);
	let characterDescriptionOpen = $state(false);
</script>

{#if character && primary_class}
	<!-- Background Questions -->
	{#if character.background_question_answers.length > 0}
		<Collapsible.Root bind:open={backgroundQuestionsOpen}>
			<Collapsible.Trigger class="flex items-center gap-1 ">
				<ChevronRight
					class={cn('size-4 transition-transform', backgroundQuestionsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Background Questions</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div class="ml-5 flex flex-col gap-3 pt-2">
					{#each character.background_question_answers as item, i}
						<div class="flex flex-col gap-1">
							<p class="text-xs text-muted-foreground">{item.question || 'Untitled question'}</p>
							{#if context.canEdit}
							<Textarea bind:value={character.background_question_answers[i].answer} />
							{:else}
							<p class="text-xs text-muted-foreground italic">{item.answer || 'No answer'}</p>
							{/if}
						</div>
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Connections -->
	{#if character.connection_answers.length > 0}
		<Collapsible.Root bind:open={connectionQuestionsOpen} class="pt-4">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight
					class={cn('size-4 transition-transform', connectionQuestionsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Connection Questions</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div class="ml-5 flex flex-col gap-3 pt-2">
					{#each character.connection_answers as item, i}
						<div class="flex flex-col gap-1">
							<p class="text-xs text-muted-foreground">
								{item.question || 'Untitled connection'}
							</p>
							{#if context.canEdit}
							<Textarea bind:value={character.connection_answers[i].answer} />
							{:else}
							<p class="text-xs text-muted-foreground italic">{item.answer || 'No answer'}</p>
							{/if}
						</div>
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Character Descriptions -->
	<Collapsible.Root bind:open={characterDescriptionOpen} class="pt-4">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', characterDescriptionOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">Character Description</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="ml-5 flex flex-col gap-3 pt-2">
				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Clothes that are:</p>
					{#if context.canEdit}
					<Input
						bind:value={character.character_descriptions.clothes}
						placeholder={primary_class.character_description_suggestions.clothes}
					/>
					{:else}
					<p class="text-xs text-muted-foreground italic">{character.character_descriptions.clothes || 'No answer'}</p>
					{/if}
				</div>
				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Eyes like:</p>
					{#if context.canEdit}
					<Input
						bind:value={character.character_descriptions.eyes}
						placeholder={primary_class.character_description_suggestions.eyes}
					/>
					{:else}
					<p class="text-xs text-muted-foreground italic">{character.character_descriptions.eyes || 'No answer'}</p>
					{/if}					
				</div>
				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Body that's:</p>

						{#if context.canEdit}
					<Input
						bind:value={character.character_descriptions.body}
						placeholder={primary_class.character_description_suggestions.body}
					/>
					{:else}
					<p class="text-xs text-muted-foreground italic">{character.character_descriptions.body || 'No answer'}</p>
					{/if}
					
				</div>

				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Skin the color of:</p>
					{#if context.canEdit}
					<Input
						bind:value={character.character_descriptions.skin}
						placeholder={primary_class.character_description_suggestions.skin}
					/>
					{:else}
					<p class="text-xs text-muted-foreground italic">{character.character_descriptions.skin || 'No answer'}</p>
					{/if}
				</div>

				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Attitude like:</p>
					{#if context.canEdit}
					<Input
						bind:value={character.character_descriptions.attitude}
						placeholder={primary_class.character_description_suggestions.attitude}
					/>
					{:else}
					<p class="text-xs text-muted-foreground italic">{character.character_descriptions.attitude || 'No answer'}</p>
					{/if}
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
{:else}
	<p class="py-4 text-center text-xs text-muted-foreground italic">
		Select a class to see background information.
	</p>
{/if}
