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
					<div class="flex flex-col gap-3 ml-5 pt-2">
						{#each character.background_question_answers as item, i}
							<div class="flex flex-col gap-1">
								<p class="text-xs text-muted-foreground">{item.question || 'Untitled question'}</p>
								<Textarea bind:value={character.background_question_answers[i].answer} />
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
					<div class="flex flex-col gap-3 ml-5 pt-2">
						{#each character.connection_answers as item, i}
							<div class="flex flex-col gap-1">
								<p class="text-xs text-muted-foreground">
									{item.question || 'Untitled connection'}
								</p>
								<Textarea bind:value={character.connection_answers[i].answer} />
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
				<div class="flex flex-col gap-3 ml-5 pt-2">
					<div class="flex gap-1 items-center">
						<p class="text-xs text-muted-foreground w-30">Clothes that are:</p>
						<Input
							bind:value={character.character_descriptions.clothes}
							placeholder={primary_class.character_description_suggestions.clothes}
						/>
					</div>
					<div class="flex gap-1 items-center">
						<p class="text-xs text-muted-foreground w-30">Eyes like:</p>
						<Input
							bind:value={character.character_descriptions.eyes}
							placeholder={primary_class.character_description_suggestions.eyes}
						/>
					</div>
					<div class="flex gap-1 items-center">
						<p class="text-xs text-muted-foreground w-30">Body that's:</p>
						<Input
							bind:value={character.character_descriptions.body}
							placeholder={primary_class.character_description_suggestions.body}
						/>
					</div>

					<div class="flex gap-1 items-center">
						<p class="text-xs text-muted-foreground w-30">Skin the color of:</p>
						<Input
							bind:value={character.character_descriptions.skin}
							placeholder={primary_class.character_description_suggestions.skin}
						/>
					</div>

					<div class="flex gap-1 items-center">
						<p class="text-xs text-muted-foreground w-30">Attitude like:</p>
						<Input
							bind:value={character.character_descriptions.attitude}
							placeholder={primary_class.character_description_suggestions.attitude}
						/>
					</div>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{:else}
		<p class="py-4 text-center text-xs text-muted-foreground italic">
			Select a class to see background information.
		</p>
	{/if}
