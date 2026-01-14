<!-- src/lib/components/app/campaigns/campaign-notes.svelte -->
<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils/markdown';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Pencil from '@lucide/svelte/icons/pencil';

	let { class: className = '', isGM = false }: { class?: string, isGM?: boolean } = $props();

	const campaignContext = getCampaignContext();
	const campaignState = $derived(campaignContext.campaignState);

	// Local state for notes (for change tracking)
	let localNotes = $state('');

	// Update local state when campaignState changes
	$effect(() => {
		if (campaignState) {
			localNotes = campaignState.notes ?? '';
		}
	});

	// Sync notes to campaign state when local notes change (with debounce handled by context)
	function handleNotesChange() {
		if (!campaignContext.campaignState) return;

		// Enforce 10k character limit (matches server-side validation)
		const trimmedNotes = localNotes.length > 10000 ? localNotes.slice(0, 10000) : localNotes;
		if (trimmedNotes !== localNotes) {
			localNotes = trimmedNotes;
		}

		// Direct state mutation - auto-save is handled by the context's debounced effect
		campaignContext.campaignState = {
			...campaignContext.campaignState,
			notes: trimmedNotes || null
		};
	}

	let showPreview = $state(false);
	const MAX_NOTES_LENGTH = 10000;
	const notesLength = $derived(localNotes.length);
	const remainingChars = $derived(MAX_NOTES_LENGTH - notesLength);
</script>

<div class={cn("rounded-2xl bg-primary/10 shadow-xl p-4", className)}>
	<div class="mb-2 flex items-center justify-between">
	<h2 class="text-lg font-semibold">
		{#if isGM}
		Public Notes
		{:else}
		Campaign Notes
		{/if}
	</h2>
	{#if isGM}
	<Button variant="ghost" size="sm" onclick={() => (showPreview = !showPreview)}>
		{#if showPreview}
		<Pencil class="size-4" />
		{:else}
		<Eye class="size-4" />
		{/if}

	</Button>
	{/if}
	</div>
	{#if showPreview || !isGM}
	<div class="py-2 px-2 text-sm text-muted-foreground">
		{@html renderMarkdown(localNotes || 'No notes')}
	</div>
	{:else}
	<Textarea
		bind:value={localNotes}
		oninput={handleNotesChange}
		class=" bg-background"
		placeholder="Add campaign notes..."
	/>
	{/if}
</div>
