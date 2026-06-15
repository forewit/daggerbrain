<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getLocalstorageContext } from '$lib/state/localstorage.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { renderMarkdown } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Eye from '@lucide/svelte/icons/eye';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const characterCtx = getCharacterContext();
	const localstorageCtx = getLocalstorageContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const primary_class = $derived(derived_character_data?.primary_class);

	const fallbackShowPreview = true;
	const fallbackBackgroundQuestionsOpen = true;
	const fallbackConnectionQuestionsOpen = false;
	const fallbackCharacterDescriptionOpen = false;

	let showPreview = $state(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_background_preferences[characterCtx.id]
					?.showPreview ?? fallbackShowPreview)
			: fallbackShowPreview
	);
	let backgroundQuestionsOpen = $state(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_background_preferences[characterCtx.id]
					?.backgroundQuestionsOpen ?? fallbackBackgroundQuestionsOpen)
			: fallbackBackgroundQuestionsOpen
	);
	let connectionQuestionsOpen = $state(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_background_preferences[characterCtx.id]
					?.connectionQuestionsOpen ?? fallbackConnectionQuestionsOpen)
			: fallbackConnectionQuestionsOpen
	);
	let characterDescriptionOpen = $state(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_background_preferences[characterCtx.id]
					?.characterDescriptionOpen ?? fallbackCharacterDescriptionOpen)
			: fallbackCharacterDescriptionOpen
	);

	$effect(() => {
		if (!characterCtx.id) return;

		localstorageCtx.app_preferences.character_background_preferences[characterCtx.id] = {
			showPreview,
			backgroundQuestionsOpen,
			connectionQuestionsOpen,
			characterDescriptionOpen
		};
	});
</script>

{#if character && primary_class}
	{#if characterCtx.canEdit}
		<div class="-mb-6.5 flex justify-end">
			<Button variant="ghost" size="sm" class="px-2" onclick={() => (showPreview = !showPreview)}>
				{#if showPreview}
					<Pencil class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
			</Button>
		</div>
	{/if}
	{#if character.background_questions.length > 0}
		<Collapsible.Root bind:open={backgroundQuestionsOpen}>
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight
					class={cn('size-4 transition-transform', backgroundQuestionsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Background Questions</p>
			</Collapsible.Trigger>

			<Collapsible.Content>
				<div class="ml-5 flex flex-col gap-3 pt-2">
					{#each character.background_questions as item, i}
						<div class="flex flex-col gap-1">
							<p class="text-xs text-muted-foreground">{item.question || 'Untitled question'}</p>
							{#if showPreview || !characterCtx.canEdit}
								<div class="text-sm text-muted-foreground">
									{@html renderMarkdown(item.answer || 'No answer')}
								</div>
							{:else}
								<Textarea bind:value={character.background_questions[i].answer} />
							{/if}
						</div>
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	{#if character.connection_questions.length > 0}
		<Collapsible.Root bind:open={connectionQuestionsOpen} class="pt-4">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight
					class={cn('size-4 transition-transform', connectionQuestionsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Connection Questions</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div class="ml-5 flex flex-col gap-3 pt-2">
					{#each character.connection_questions as item, i}
						<div class="flex flex-col gap-1">
							<p class="text-xs text-muted-foreground">{item.question || 'Untitled connection'}</p>
							{#if showPreview || !characterCtx.canEdit}
								<div class="text-sm text-muted-foreground">
									{@html renderMarkdown(item.answer || 'No answer')}
								</div>
							{:else}
								<Textarea bind:value={character.connection_questions[i].answer} />
							{/if}
						</div>
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<Collapsible.Root bind:open={characterDescriptionOpen} class="pt-4">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', characterDescriptionOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">Character Description</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="ml-5 flex flex-col gap-3 pt-2 pb-4">
				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Clothes that are:</p>
					{#if showPreview || !characterCtx.canEdit}
						<p class="text-xs text-muted-foreground italic">
							{character.character_descriptions.clothes || 'No answer'}
						</p>
					{:else}
						<Input
							bind:value={character.character_descriptions.clothes}
							placeholder={primary_class.character_description_suggestions.clothes}
						/>
					{/if}
				</div>
				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Eyes like:</p>
					{#if showPreview || !characterCtx.canEdit}
						<p class="text-xs text-muted-foreground italic">
							{character.character_descriptions.eyes || 'No answer'}
						</p>
					{:else}
						<Input
							bind:value={character.character_descriptions.eyes}
							placeholder={primary_class.character_description_suggestions.eyes}
						/>
					{/if}
				</div>
				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Body that's:</p>
					{#if showPreview || !characterCtx.canEdit}
						<p class="text-xs text-muted-foreground italic">
							{character.character_descriptions.body || 'No answer'}
						</p>
					{:else}
						<Input
							bind:value={character.character_descriptions.body}
							placeholder={primary_class.character_description_suggestions.body}
						/>
					{/if}
				</div>

				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Skin the color of:</p>
					{#if showPreview || !characterCtx.canEdit}
						<p class="text-xs text-muted-foreground italic">
							{character.character_descriptions.skin || 'No answer'}
						</p>
					{:else}
						<Input
							bind:value={character.character_descriptions.skin}
							placeholder={primary_class.character_description_suggestions.skin}
						/>
					{/if}
				</div>

				<div class="flex items-center gap-1">
					<p class="w-30 text-xs text-muted-foreground">Attitude like:</p>
					{#if showPreview || !characterCtx.canEdit}
						<p class="text-xs text-muted-foreground italic">
							{character.character_descriptions.attitude || 'No answer'}
						</p>
					{:else}
						<Input
							bind:value={character.character_descriptions.attitude}
							placeholder={primary_class.character_description_suggestions.attitude}
						/>
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
