<script lang="ts">
	import CardCarousel from '$lib/components/app/cards/card-carousel.svelte';
	import Stress from '$lib/components/app/sheet/stress.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import type { DomainCard } from '$lib/types/compendium-types';
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

	const context = getCharacterContext();
	let character = $derived(context.character);

	let vault: DomainCard[] = $derived(
		(context.domain_card_vault || []).filter(
			(card) =>
				!context.domain_card_loadout.some(
					(loadoutCard) => loadoutCard.compendium_id === card.compendium_id
				)
		)
	);

	let selectedVaultIndex = $state(0);
	let selectedVaultCard = $derived(vault[selectedVaultIndex]);

	let selectedLoadoutIndex = $state(0);

	let restMode = $state(false);
	let expanded = $state(true);

	let remainingStress = $derived(character ? context.max_stress - character.marked_stress : 0);
</script>

{#if character}
	<div class={cn(!expanded && '-mb-4', className)}>
		<div class="z-20 mb-4 flex items-center justify-center gap-4">
			<button
				onclick={() => (expanded = !expanded)}
				class="flex items-center font-medium text-nowrap text-muted-foreground"
			>
				{#if expanded}
					<ChevronDown class="w-k h-4" />
				{:else}
					<ChevronRight class="w-k h-4" />
				{/if}
				Loadout
				<div
					class="ml-2 grid h-4.5 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-background"
				>
					{context.domain_card_loadout.length} / {context.max_loadout}
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
					<div class="flex flex-col">
						<!-- vault -->
						<div class="relative mb-5 shrink">
							<CardCarousel
								cards={vault}
								bind:selectedIndex={selectedVaultIndex}
								emptyMessage="Vault Empty"
								bind_token_count
								bind_choice_select
							/>
							{#if vault.length > 0}
								{#if restMode}
									<Button
										hidden={vault.length === 0 || selectedVaultCard.forced_in_vault}
										onclick={() => {
											if (!character) return;
											if (character.loadout_domain_card_ids.length < context.max_loadout) {
												character.loadout_domain_card_ids.push({
													domainId: selectedVaultCard.domain_id,
													cardId: selectedVaultCard.compendium_id
												});
											}
										}}
										class={cn(
											'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full',
											context.domain_card_loadout.length >= context.max_loadout &&
												'cursor-default border-3 border-destructive bg-muted hover:bg-muted'
										)}
										size="sm"
									>
										{#if context.domain_card_loadout.length >= context.max_loadout}
											Loadout is full
										{:else}
											<ArrowUp class="size-4" />
											Add to loadout
										{/if}
									</Button>
								{:else}
									<Button
										hidden={vault.length === 0 || selectedVaultCard.forced_in_vault}
										size="sm"
										onclick={() => {
											if (!character) return;
											if (
												character.loadout_domain_card_ids.length < context.max_loadout &&
												selectedVaultCard?.recall_cost <= remainingStress
											) {
												character.marked_stress += selectedVaultCard.recall_cost;
												character.loadout_domain_card_ids.push({
													domainId: selectedVaultCard.domain_id,
													cardId: selectedVaultCard.compendium_id
												});
											}
										}}
										class={cn(
											'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full',
											(selectedVaultCard?.recall_cost > remainingStress ||
												context.domain_card_loadout.length >= context.max_loadout) &&
												'cursor-default border-3 border-destructive bg-muted hover:bg-muted'
										)}
									>
										{#if context.domain_card_loadout.length >= context.max_loadout}
											Loadout is full
										{:else if selectedVaultCard?.recall_cost > remainingStress}
											Not enough stress slots
										{:else}
											<ArrowUp class="size-4" />
											Recall ({selectedVaultCard?.recall_cost} stress)
										{/if}
									</Button>
								{/if}
							{/if}
						</div>

						<!-- Rest Mode -->
						<div class="flex flex-col items-center justify-center gap-3 px-6">
							<Stress
								class={cn(
									'rounded-full bg-muted px-4 py-2',
									restMode && 'opacity-30'
									// character.ephemeral_stats.marked_stress >= character.derived_stats.max_stress &&
									//"border-3 border-destructive"
								)}
								displayOnly
							/>
							<Label
								class={cn(
									'flex h-10 w-min items-center rounded-full border px-3 text-nowrap hover:cursor-pointer',
									restMode ? 'bg-primary' : 'bg-muted text-muted-foreground'
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
					</div>
					<Dialog.Footer class="px-6">
						<Dialog.Close class={buttonVariants({ variant: 'link' })}>Close</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>

			<Button
				variant="ghost"
				class="text-muted-foreground/50"
				size="sm"
				onclick={openDomainCardCatalog}><Pencil /></Button
			>
		</div>
		{#if expanded}
			<div class="relative">
				<CardCarousel
					cards={context.domain_card_loadout}
					bind:selectedIndex={selectedLoadoutIndex}
					emptyMessage="Loadout Empty"
					bind_token_count
					bind_choice_select
				/>
				<Button
					hidden={context.domain_card_loadout.length === 0 ||
						(context.domain_card_loadout[selectedLoadoutIndex] &&
							context.domain_card_loadout[selectedLoadoutIndex].forced_in_loadout)}
					size="sm"
					onclick={() => {
						const selected_id = context.domain_card_loadout[selectedLoadoutIndex].compendium_id;
						const selected_domain_id = context.domain_card_loadout[selectedLoadoutIndex].domain_id;
						character.loadout_domain_card_ids = character.loadout_domain_card_ids.filter(
							(id) => id.cardId !== selected_id || id.domainId !== selected_domain_id
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
