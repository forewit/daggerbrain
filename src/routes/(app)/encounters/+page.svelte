<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '@convex/_generated/api';
	import type { Id } from '@convex/_generated/dataModel';
	import { BLANK_ENCOUNTER } from '@convex/constants/constants';
	import { artEncounters } from '$lib/assets/images';
	import Plus from '@lucide/svelte/icons/plus';
	import Swords from '@lucide/svelte/icons/swords';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import SafeDelete from '$lib/components/shared/safe-delete.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Footer from '$lib/components/navigation/footer.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { cn } from '$lib/utils';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { fade } from 'svelte/transition';

	const userContext = getUserContext();
	const convexClient = useConvexClient();
	const encountersQuery = useQuery(api.functions.encounters.list, {});
	const encounters = $derived(encountersQuery.data ?? []);

	let encounterToDelete = $state<{ id: Id<'encounters'>; name: string } | null>(null);
	let showDeleteDialog = $state(false);
	let creatingEncounter = $state(false);

	async function handleCreateEncounter() {
		creatingEncounter = true;
		try {
			const id = await convexClient.mutation(api.functions.encounters.add, BLANK_ENCOUNTER);
			goto(`/encounters/${id}`);
		} catch (error) {
			console.error('Failed to create encounter', error);
			creatingEncounter = false;
		}
	}

	function handleDeleteEncounter(encounterId: Id<'encounters'>, encounterName: string) {
		encounterToDelete = { id: encounterId, name: encounterName };
		showDeleteDialog = true;
	}

	async function confirmDelete() {
		if (!encounterToDelete) return;

		try {
			await convexClient.mutation(api.functions.encounters.remove, { id: encounterToDelete.id });
		} catch (error) {
			console.error('Failed to delete encounter', error);
			return;
		}

		encounterToDelete = null;
		showDeleteDialog = false;
	}

	const isLoading = $derived(
		userContext.isLoading || encountersQuery.isLoading || creatingEncounter
	);
	const loadError = $derived(userContext.error || encountersQuery.error);
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="encounters-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artEncounters}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="encounters-fade-container bottom-2 h-full w-full object-cover object-[50%_70%]"
		/>
	</div>

	<Loader isLoading={isLoading || creatingEncounter} />

	{#if !creatingEncounter}
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="flex w-full max-w-6xl flex-col space-y-4 px-4 py-4">
				<div class="flex items-center justify-between gap-2">
					<p class="flex h-9 items-center gap-2 text-2xl font-bold">Encounters</p>

					<div class="flex gap-2">
						<Button variant="outline" onclick={handleCreateEncounter}>
							<Plus />
							New Encounter
						</Button>
					</div>
				</div>

				{#if isLoading}
					<div></div>
				{:else if loadError}
					<LoadError />
				{:else if encounters.length === 0}
					<Button class="mx-auto my-24" onclick={handleCreateEncounter}>
						<Swords />
						Create your first encounter!
					</Button>
				{:else}
					<div in:fade class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each encounters as { id, encounter }}
							<div class="mx-auto w-full max-w-[500px] overflow-hidden rounded shadow">
								<a
									href={`/encounters/${id}`}
									class="flex gap-2 bg-primary-muted p-2 pb-3 pl-3.5 hover:bg-primary-muted/80"
								>
									<div class="flex grow flex-col truncate">
										<p class="truncate text-lg font-bold">
											{encounter.name.trim() || 'Unnamed Encounter'}
										</p>
										<p class="truncate text-xs text-muted-foreground">
											{encounter.items.filter((item) => item.type === 'adversary').length} Adversaries
											&ensp;&bull;&ensp;
											{encounter.items.filter((item) => item.type === 'environment').length} Environments
										</p>
									</div>
								</a>
								<div class="flex border-t border-background">
									<Button
										variant="outline"
										size="sm"
										class="grow rounded-none border-none"
										href={`/encounters/${id}`}
									>
										Edit
									</Button>
									<Button
										variant="outline"
										size="sm"
										class="grow rounded-none border-none text-destructive hover:text-destructive"
										onclick={() => handleDeleteEncounter(id, encounter.name)}
									>
										Delete
									</Button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<Footer />

<Dialog.Root bind:open={showDeleteDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Encounter</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete <strong
					>{encounterToDelete?.name.trim() || 'Unnamed Encounter'}</strong
				>? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<SafeDelete
			open={showDeleteDialog}
			itemName={encounterToDelete?.name.trim() || ''}
			itemLabel="Unnamed Encounter"
			deleteLabel="Delete Encounter"
			onDelete={confirmDelete}
		/>
	</Dialog.Content>
</Dialog.Root>

<style>
	.encounters-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
