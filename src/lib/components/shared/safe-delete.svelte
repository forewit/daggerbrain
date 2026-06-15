<script lang="ts">
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn } from '$lib/utils';

	let {
		open = false,
		itemName,
		itemLabel,
		deleteLabel,
		confirmationWord = 'delete',
		onDelete,
		class: className = ''
	}: {
		open?: boolean;
		class?: string;
		itemName: string;
		itemLabel: string;
		deleteLabel: string;
		confirmationWord?: string;
		onDelete: () => void | Promise<void>;
	} = $props();

	let confirmation = $state('');
	let isDeleting = $state(false);

	$effect(() => {
		if (!open) {
			confirmation = '';
			isDeleting = false;
		}
	});

	async function handleDelete(event?: SubmitEvent) {
		event?.preventDefault();
		if (confirmation !== confirmationWord || isDeleting) return;

		isDeleting = true;
		try {
			await onDelete();
		} catch (error) {
			isDeleting = false;
		}
	}
</script>

<form
	class={cn(
		'my-2 flex flex-col gap-2 rounded border border-destructive/20 bg-destructive/5 p-3',
		className
	)}
	onsubmit={handleDelete}
>
	<p class="font-bold text-destructive">Danger Zone</p>
	<p class="text-xs text-destructive">
		Type "{confirmationWord}" to delete <strong>{itemName || itemLabel}</strong>.
	</p>
	<div class="flex gap-2">
		<Input bind:value={confirmation} class="border-destructive/20 bg-card/50" />
		<Button
			type="submit"
			variant="destructive"
			class="w-min"
			disabled={confirmation !== confirmationWord || isDeleting}
		>
			{#if isDeleting}
				<Loader2 class="size-4 animate-spin" />
				Deleting...
			{:else}
				{deleteLabel}
			{/if}
		</Button>
	</div>
</form>
