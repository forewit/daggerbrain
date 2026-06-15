<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CharacterPortrait from '$lib/components/character-sheet/standalone/character-portrait.svelte';
	import CharacterPreview from '$lib/components/campaigns/character-preview.svelte';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { cn } from '$lib/utils';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Diamond from '@lucide/svelte/icons/diamond';
	import Heart from '@lucide/svelte/icons/heart';
	import Shield from '@lucide/svelte/icons/shield';
	import Zap from '@lucide/svelte/icons/zap';

	let {
		isGM,
		showPreviews = $bindable(false),
		class: className = ''
	}: {
		isGM: boolean;
		showPreviews?: boolean;
		class?: string;
	} = $props();

	const campaignCtx = getCampaignContext();
	const activeCharacters = $derived(campaignCtx.active_characters);
</script>

<div class={cn('relative flex max-w-full flex-col items-center px-2 pb-10', className)}>
	{#if activeCharacters.length > 0}
		<div class="flex w-full items-center justify-center gap-4 py-2 md:justify-start">
			<label
				class="flex h-7 cursor-pointer items-center gap-2 rounded-lg bg-background px-2 text-xs font-medium text-muted-foreground"
			>
				<Checkbox bind:checked={showPreviews} />
				Previews
			</label>
		</div>
	{/if}

	<div class="grid w-full max-w-[400px] min-w-[376px] gap-6">
		{#if activeCharacters.length > 0}
			{#if showPreviews}
				{#each activeCharacters as character}
					<CharacterPreview {character} />
				{/each}
			{:else}
				{#each activeCharacters as character}
					{@const characterData = character.character}
					{@const playerLabel = character.playerDisplayName || 'Anonymous'}
					<div class="mx-auto w-full overflow-hidden rounded-lg border bg-background p-2 shadow-lg">
						<div class="flex gap-2">
							<div class="size-19 shrink-0 overflow-hidden rounded-lg border-2">
								<CharacterPortrait
									src={characterData.image_url || '/images/art/portrait-placeholder.webp'}
									alt={characterData.name.trim() || 'Unnamed Character'}
									death_state={characterData.death_state}
									class="h-full w-full"
								/>
							</div>

							<div class="grow truncate pt-0.5">
								<div class="mr-2 flex items-center justify-between">
									<p class="truncate text-lg font-bold">
										{characterData.name.trim() || 'Unnamed Character'}
									</p>
								</div>

								<div class="flex items-center gap-4 truncate text-xs text-muted-foreground">
									<p class="flex items-center gap-1 text-accent">
										<Diamond class="size-3.5" />
										{characterData.marked_hope}
									</p>
									<p class="flex items-center gap-1">
										<Heart class="size-3.5" />
										{characterData.marked_hp} / {characterData.derived_descriptors.max_hp}
									</p>
									<p class="flex items-center gap-1">
										<Shield class="size-3.5" />
										{characterData.marked_armor} / {characterData.derived_descriptors.max_armor}
									</p>
									<p class="flex items-center gap-1">
										<Zap class="size-3.5" />
										{characterData.marked_stress} / {characterData.derived_descriptors.max_stress}
									</p>
								</div>

								<div
									class="mt-1 inline-flex rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs text-accent"
								>
									{playerLabel}
								</div>
							</div>
						</div>

						<div class="flex gap-2 bg-background pt-2">
							<Button
								variant="outline"
								size="sm"
								class="grow"
								href={`/characters/${character.characterId}`}
							>
								View
							</Button>

							{#if character.canEdit}
								<Button
									variant="outline"
									size="sm"
									class="grow"
									href={`/characters/${character.characterId}/edit`}
								>
									Edit
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		{:else}
			<p class="py-24 text-center text-sm text-muted-foreground italic">
				No active characters in this campaign.
			</p>
		{/if}
	</div>
</div>
