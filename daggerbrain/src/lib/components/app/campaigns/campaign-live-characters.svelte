<!-- src/lib/components/app/campaigns/campaign-live-characters.svelte -->
<script lang="ts">
	import CharacterPreview from './character-preview.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { cn } from '$lib/utils';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import { getUserContext } from '$lib/state/user.svelte';

	let { isGM = false }: { isGM?: boolean } = $props();

	const campaignContext = getCampaignContext();
	const user = getUserContext();

	// Filter to only show assigned (non-claimable) characters
	const characterList = $derived(
		Object.values(campaignContext.characters).filter((char) => !char.claimable)
	);

	// Toggle state for previews
	let showPreviews = $state(false);
</script>

<div
	class="mt-8 flex flex-col items-center border-accent/10 bg-accent/5 px-2 py-8 sm:mx-auto sm:rounded-3xl sm:border sm:px-8 sm:py-6"
>
	<div class="mb-8 flex items-center justify-center gap-4 sm:mb-6">
		<p class="text-center font-eveleth text-accent">Characters</p>
		<label
			class={cn(
				buttonVariants({ variant: 'outline', size: 'sm' }),
				'cursor-pointer gap-3 rounded-full border-accent/10 px-4 text-accent hover:text-accent',
				showPreviews && ' bg-accent/5  hover:bg-accent/10 '
			)}
		>
			Previews
			<Switch
				class="data-[state=checked]:bg-accent/50 data-[state=unchecked]:bg-accent/15"
				checked={showPreviews}
				onCheckedChange={(checked: boolean | undefined) => (showPreviews = checked ?? false)}
			/>
		</label>
	</div>

	<div
		class="grid grid-cols-[400px] gap-6 min-[916px]:grid-cols-[repeat(2,400px)] min-[1348px]:grid-cols-[repeat(3,400px)]"
	>
		{#if characterList.length > 0 && campaignContext.campaignId !== undefined}
			{#if showPreviews}
				<!-- Character Previews Grid -->
				{#each characterList as character}
					{@const canEdit = isGM || user.user?.clerk_id === character.owner_user_id}
					<CharacterPreview {character} campaignId={campaignContext.campaignId} {canEdit} />
				{/each}
			{:else}
				<!-- Active Characters Grid -->
				{#each characterList as char}
					{@const playerName =
						char.owner_name || (char.owner_user_id === user.user?.clerk_id ? 'you' : 'Anonymous')}
					{@const canEdit = isGM || user.user?.clerk_id === char.owner_user_id}
					<div class="mx-auto w-full overflow-hidden rounded-lg shadow">
						<a
							href={`/characters/${char.id}/`}
							class="flex gap-2 rounded-t-lg border bg-background p-1 hover:bg-background/80"
						>
							<div class="size-19 shrink-0 overflow-hidden rounded-lg border-2">
								<img
									src={char.image_url || '/images/portrait-placeholder.png'}
									alt={char.name.trim() || 'Unnamed Character'}
									class="h-full w-full object-cover"
								/>
							</div>
							<div class="grow truncate">
								<p class="truncate text-lg font-bold">
									{char.name.trim() || 'Unnamed Character'}
								</p>
								<p class="truncate text-xs text-muted-foreground">
									HP: {char.marked_hp} / {char.max_hp}
									&ensp;•&ensp; Stress: {char.marked_stress} / {char.max_stress}
									&ensp;•&ensp; Hope: {char.marked_hope}
								</p>
								{#if !char.claimable}
									<div
										class="mt-1.5 w-min truncate rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-center text-xs text-accent"
									>
										Player: {playerName}
									</div>
								{/if}
							</div>
						</a>
						<div class="flex bg-muted">
							<Button
								variant="ghost"
								size="sm"
								class="hover:text-text grow rounded-none border"
								href={`/characters/${char.id}/`}
							>
								View
							</Button>
							{#if canEdit}
								<Button
									variant="ghost"
									size="sm"
									class="hover:text-text grow rounded-none border border-x-0"
									href={`/characters/${char.id}/edit`}
								>
									Edit
								</Button>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		{:else}
			<p class="py-8 text-center text-xs text-accent/80">No active characters in this campaign</p>
		{/if}
	</div>
</div>
