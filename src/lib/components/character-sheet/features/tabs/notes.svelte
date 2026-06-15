<script lang="ts">
	import { cn } from '$lib/utils';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getLocalstorageContext } from '$lib/state/localstorage.svelte';
	import { renderMarkdown } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Eye from '@lucide/svelte/icons/eye';

	const characterCtx = getCharacterContext();
	const localstorageCtx = getLocalstorageContext();
	const character = $derived(characterCtx.character);

	const fallbackShowPreview = false;

	let showPreview = $state(
		characterCtx.id
			? (localstorageCtx.app_preferences.character_notes_preferences[characterCtx.id]
					?.showPreview ?? fallbackShowPreview)
			: fallbackShowPreview
	);

	$effect(() => {
		if (!characterCtx.id) return;

		localstorageCtx.app_preferences.character_notes_preferences[characterCtx.id] = {
			showPreview
		};
	});
</script>

{#if character}
	<div class="flex justify-between">
		<p class="pb-2 text-sm font-medium">Character Notes</p>
		{#if characterCtx.canEdit}
			<Button variant="ghost" size="sm" class="px-2" onclick={() => (showPreview = !showPreview)}>
				{#if showPreview}
					<Pencil class="size-4" />
				{:else}
					<Eye class="size-4" />
				{/if}
			</Button>
		{/if}
	</div>

	{#if showPreview || !characterCtx.canEdit}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(character.notes || 'No notes')}
		</div>
	{:else}
		<Textarea bind:value={character.notes} class="min-h-48 resize-y" />
	{/if}
{/if}
