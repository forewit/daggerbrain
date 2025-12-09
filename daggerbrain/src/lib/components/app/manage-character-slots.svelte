<script lang="ts">
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { update_character_slots } from '$lib/remote/users.remote';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';
	import Button from '$lib/components/ui/button/button.svelte';

	let { onSave = () => {} } = $props();

	const user = getUserContext();

	let selectedCharacterIds = $state<string[]>([]);
	let saving = $state(false);

	// Initialize selected characters from active slots
	$effect(() => {
		if (user.user_slots && !saving) {
			selectedCharacterIds = user.getActiveSlotIds();
		}
	});

	function toggleCharacter(characterId: string, checked: boolean) {
		if (checked) {
			// Select (but limit to 3)
			if (selectedCharacterIds.length < 3) {
				selectedCharacterIds = [...selectedCharacterIds, characterId];
			} else {
				// Swap: remove first, add new
				selectedCharacterIds = [selectedCharacterIds[1], selectedCharacterIds[2], characterId];
			}
		} else {
			// Deselect
			selectedCharacterIds = selectedCharacterIds.filter((id) => id !== characterId);
		}
	}

	async function saveSlots() {
		saving = true;
		try {
			await update_character_slots(selectedCharacterIds);
			onSave();
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Failed to update character slots');
		} finally {
			saving = false;
		}
	}
</script>

<div class="flex flex-col gap-4 px-4 pb-4">
	<div class="text-sm text-muted-foreground">
		Selected: {selectedCharacterIds.length}/3
	</div>

	{#if user.loading}
		<div class="flex items-center justify-center py-8">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	{:else if user.all_characters.length === 0}
		<div class="py-8 text-center text-sm text-muted-foreground">
			No characters found. Create your first character to get started.
		</div>
	{:else}
		<div class="space-y-2 max-h-[400px] overflow-y-auto">
			{#each user.all_characters as char}
				{@const isSelected = selectedCharacterIds.includes(char.id)}
				<div class="flex items-center justify-between rounded-md border bg-primary/5 p-3">
					<div class="flex items-center gap-3 flex-1 min-w-0">
						<div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2">
							<img
								src={char.image_url || '/images/portrait-placeholder.png'}
								alt={char.name.trim() || 'Unnamed Character'}
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="text-left flex-1 min-w-0">
							<p class="text-sm font-medium truncate">
								{char.name.trim() || 'Unnamed Character'}
							</p>
							<p class="text-xs text-muted-foreground truncate">
								{char.derived_descriptors.ancestry_name || 'No ancestry'}
								&ensp;•&ensp;
								{char.derived_descriptors.primary_class_name || 'No class'}
								{#if char.derived_descriptors.primary_subclass_name}
									&ensp;•&ensp;
									{char.derived_descriptors.primary_subclass_name}
								{/if}
							</p>
						</div>
					</div>
					<Switch
						id={`character-${char.id}`}
						checked={isSelected}
						onCheckedChange={(checked) => toggleCharacter(char.id, checked)}
					/>
				</div>
			{/each}
		</div>

		<div class="flex justify-end gap-2 pt-4">
			<Button
				onclick={saveSlots}
				disabled={saving || selectedCharacterIds.length === 0}
			>
				{#if saving}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Save Changes
			</Button>
		</div>
	{/if}
</div>
