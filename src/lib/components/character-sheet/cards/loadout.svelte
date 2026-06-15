<script lang="ts">
	import CardCarousel from '$lib/components/utility/card-carousel.svelte';
	import Stress from '$lib/components/character-sheet/standalone/stress.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import type { DomainCard } from '@convex/schemas/compendium';
	import { cn } from '$lib/utils';
	import Tent from '@lucide/svelte/icons/tent';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import * as Dialog from '$lib/components/ui/dialog';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';

	let {
		class: className = '',
		openDomainCardCatalog = () => {}
	}: { class?: string; openDomainCardCatalog?: () => void } = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);

	let vault: {
		type: 'domain_card';
		id: string;
		card: DomainCard;
	}[] = $derived(
		(derived_character_data?.domain_card_vault ?? [])
			.filter(
				(vault_card) =>
					!derived_character_data?.domain_card_loadout.some(
						(loadout_card) => loadout_card.id === vault_card.id
					)
			)
			.map(({ id, ...card }) => ({ type: 'domain_card' as const, card, id }))
	);

	let loadout: {
		type: 'domain_card';
		id: string;
		card: DomainCard;
	}[] = $derived(
		(derived_character_data?.domain_card_loadout ?? []).map(({ id, ...card }) => ({
			type: 'domain_card' as const,
			card,
			id
		}))
	);

	let selectedVaultIndex = $state(0);
	let selectedVaultCard = $derived(vault[selectedVaultIndex]);

	let selectedLoadoutIndex = $state(0);

	$effect(() => {
		vault.length;
		if (vault.length === 0) {
			selectedVaultIndex = 0;
			return;
		}
		if (selectedVaultIndex > vault.length - 1) {
			selectedVaultIndex = vault.length - 1;
		}
	});

	$effect(() => {
		if (!derived_character_data) return;

		if (derived_character_data.domain_card_loadout.length === 0) {
			selectedLoadoutIndex = 0;
			return;
		}
		if (selectedLoadoutIndex > derived_character_data.domain_card_loadout.length - 1) {
			selectedLoadoutIndex = derived_character_data.domain_card_loadout.length - 1;
		}
	});

	let restMode = $state(false);
	let expanded = $state(true);

	let remainingStress = $derived(
		character && derived_character_data
			? derived_character_data.max_stress - character.marked_stress
			: 0
	);
</script>

{#if character && derived_character_data}
	<div class={cn(!expanded && '-mb-4', className)}>
		<div class="z-20 mx-auto mb-4 flex w-min items-center justify-center gap-4">
			<button
				disabled={true}
				onclick={() => (expanded = !expanded)}
				class="flex items-center font-medium text-nowrap text-foreground"
			>
				<!-- {#if expanded}
					<ChevronDown class="w-k h-4" />
				{:else}
					<ChevronRight class="w-k h-4" />
				{/if} -->
				Loadout
				<div
					class="ml-2 grid h-4.5 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-background"
				>
					{derived_character_data.domain_card_loadout.length} / {derived_character_data.max_loadout}
				</div>
			</button>

			<Dialog.Root>
				<Dialog.Trigger class={cn(buttonVariants({ size: 'sm' }), 'relative')}>
					<ArrowLeftRight class="size-3" />
					Vault
					<span
						class="absolute top-1 right-0 grid h-4.5 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-background"
					>
						{vault.length}
					</span>
				</Dialog.Trigger>
				<Dialog.Content
					class="flex max-h-[90%] min-w-[calc(100%-1rem)] flex-col overflow-y-auto px-0 md:min-w-3xl"
				>
					<Dialog.Header class="px-6">
						<Dialog.Title>Vault</Dialog.Title>
					</Dialog.Header>
					<div class="flex flex-col overflow-y-auto">
						<!-- vault -->
						<div class="relative mb-5 shrink">
							<CardCarousel
								cards={vault}
								compendium={characterCtx.character_compendium}
								bind:selectedIndex={selectedVaultIndex}
								bind:tokens={character.card_tokens}
								bind:choices={character.card_choices}
								bind:mixed_ancestry_choices={character.mixed_ancestry_choices}
								experiences={character.experiences}
								enable_choices
								enable_tokens
								enable_mixed_ancestry
								storageKey={characterCtx.id ? `character:${characterCtx.id}:vault` : undefined}
								emptyMessage="None"
							/>
							{#if vault.length > 0}
								{#if restMode}
									<Button
										hidden={vault.length === 0 || selectedVaultCard?.card.forced_in_vault}
										onclick={() => {
											if (
												character.loadout_domain_card_ids.length <
												derived_character_data.max_loadout
											) {
												character.loadout_domain_card_ids.push({
													domain_id: selectedVaultCard.card.domain_id,
													card_id: selectedVaultCard.id
												});
											}
										}}
										class={cn(
											'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full',
											derived_character_data.domain_card_loadout.length >=
												derived_character_data.max_loadout &&
												'cursor-default border-3 border-destructive bg-muted hover:bg-muted'
										)}
										size="sm"
									>
										{#if derived_character_data.domain_card_loadout.length >= derived_character_data.max_loadout}
											Loadout is full
										{:else}
											<ArrowUp class="size-4" />
											Add to loadout
										{/if}
									</Button>
								{:else}
									<Button
										hidden={vault.length === 0 || selectedVaultCard?.card.forced_in_vault}
										size="sm"
										onclick={() => {
											if (
												character.loadout_domain_card_ids.length <
													derived_character_data.max_loadout &&
												selectedVaultCard?.card.recall_cost <= remainingStress
											) {
												character.marked_stress += selectedVaultCard.card.recall_cost;
												character.loadout_domain_card_ids.push({
													domain_id: selectedVaultCard.card.domain_id,
													card_id: selectedVaultCard.id
												});
											}
										}}
										class={cn(
											'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full',
											(selectedVaultCard?.card.recall_cost > remainingStress ||
												derived_character_data.domain_card_loadout.length >=
													derived_character_data.max_loadout) &&
												'cursor-default border-3 border-destructive bg-muted hover:bg-muted'
										)}
									>
										{#if derived_character_data.domain_card_loadout.length >= derived_character_data.max_loadout}
											Loadout is full
										{:else if selectedVaultCard?.card.recall_cost > remainingStress}
											Not enough stress slots
										{:else}
											<ArrowUp class="size-4" />
											Recall ({selectedVaultCard?.card.recall_cost} stress)
										{/if}
									</Button>
								{/if}
							{/if}
						</div>

						<!-- Rest Mode -->
						{#if characterCtx.canEdit}
							<div class="flex flex-col items-center justify-center gap-3 px-6">
								<Stress
									class={cn(
										'bg- rounded-full px-4 py-2',
										restMode && 'opacity-30'
										// character.ephemeral_stats.marked_stress >= character.derived_stats.max_stress &&
										//"border-3 border-destructive"
									)}
									max={derived_character_data.max_stress}
									bind:marked={character.marked_stress}
									disabled
								/>
								<Label
									class={cn(
										'flex h-10 w-min items-center rounded-full border px-3 text-nowrap text-primary-foreground hover:cursor-pointer',
										restMode ? 'bg-primary' : 'bg-card text-muted-foreground'
									)}
								>
									<Switch
										bind:checked={restMode}
										class="data-[state=checked]:bg-primary-muted/50 data-[state=unchecked]:bg-foreground/20"
									/>
									<Tent class="size-4" />
									<p>Rest Mode</p>
								</Label>
							</div>
						{/if}
					</div>
					<Dialog.Footer class="px-6">
						<Dialog.Close class={buttonVariants({ variant: 'link' })}>Close</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>

			{#if characterCtx.canEdit}
				<Button variant="ghost" size="sm" onclick={openDomainCardCatalog}><Pencil /></Button>
			{/if}
		</div>
		{#if expanded}
			<div class="relative">
				<CardCarousel
					cards={loadout}
					compendium={characterCtx.character_compendium}
					bind:selectedIndex={selectedLoadoutIndex}
					bind:tokens={character.card_tokens}
					bind:choices={character.card_choices}
					bind:mixed_ancestry_choices={character.mixed_ancestry_choices}
					enable_choices
					enable_tokens
					enable_mixed_ancestry
					experiences={character.experiences}
					storageKey={characterCtx.id ? `character:${characterCtx.id}:loadout` : undefined}
					emptyMessage="Loadout Empty"
				/>
				<Button
					hidden={derived_character_data.domain_card_loadout.length === 0 ||
						(derived_character_data.domain_card_loadout[selectedLoadoutIndex] &&
							derived_character_data.domain_card_loadout[selectedLoadoutIndex].forced_in_loadout)}
					size="sm"
					onclick={() => {
						const selected_id = derived_character_data.domain_card_loadout[selectedLoadoutIndex].id;
						const selected_domain_id =
							derived_character_data.domain_card_loadout[selectedLoadoutIndex].domain_id;
						character.loadout_domain_card_ids = character.loadout_domain_card_ids.filter(
							(id) => id.card_id !== selected_id || id.domain_id !== selected_domain_id
						);
					}}
					class="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
				>
					Move to Vault
					<ArrowUpRight class="size-4" />
				</Button>
			</div>
		{/if}
	</div>
{/if}
