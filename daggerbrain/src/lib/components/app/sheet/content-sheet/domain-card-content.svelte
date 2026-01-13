<script lang="ts">
	import DomainCardCatalog from '../../cards/domain-card-catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import type { DomainCard } from '$lib/types/compendium-types';
	import type { DomainCardId } from '$lib/types/character-types';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import HomebrewBadge from '../../homebrew/homebrew-badge.svelte';
	import CampaignBadge from '../../homebrew/campaign-badge.svelte';

	const context = getCharacterContext();
	const compendium = getCompendiumContext();
	let character = $derived(context.character);
	let additionalDomainCards = $derived(context.additional_domain_cards);
	let customizeOpen = $state(false);

	// Helper function to get DomainCardId from a card
	function getDomainCardId(card: DomainCard): DomainCardId {
		return { domainId: card.domain_id, cardId: card.compendium_id };
	}

	function handleCardClick(card: DomainCard) {
		if (!character) return;

		const cardId = getDomainCardId(card);

		// Check if card is already in additional_domain_card_ids
		const alreadyExists = character.additional_domain_card_ids.some(
			(id) => id.domainId === cardId.domainId && id.cardId === cardId.cardId
		);

		if (!alreadyExists) {
			character.additional_domain_card_ids = [...character.additional_domain_card_ids, cardId];
		}
	}

	function removeCard(card: DomainCard) {
		if (!character) return;

		const cardId = getDomainCardId(card);
		character.additional_domain_card_ids = character.additional_domain_card_ids.filter(
			(id) => !(id.domainId === cardId.domainId && id.cardId === cardId.cardId)
		);
	}

	// Get domain name for display
	function getDomainName(domainId: string): string {
		return (
			compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1)
		);
	}
</script>

{#if context.canEdit}
	<Sheet.Header>
		<Sheet.Title>Customize Your Vault</Sheet.Title>
		<Sheet.Description class="text-xs italic"
			>Manually add domain cards to your vault. Cards added here ignore the level requirement.</Sheet.Description
		>
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		{#if character}
			<Collapsible.Root bind:open={customizeOpen}>
				<Collapsible.Trigger
					class={cn(
						'flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm',
						customizeOpen && 'rounded-b-none'
					)}
				>
					<span>Customize</span>
					<ChevronLeft class={cn('size-4 transition-transform', customizeOpen && '-rotate-90')} />
				</Collapsible.Trigger>
				<Collapsible.Content class="space-y-2 rounded-b-md border bg-card/50 p-2">
					<div class="flex flex-col gap-2">
						<label for="bonus-max-loadout" class="text-xs font-medium text-muted-foreground"
							>Increase Loadout card limit</label
						>
						<Input
							id="bonus-max-loadout"
							type="number"
							inputmode="numeric"
							value={character.bonus_max_loadout.toString()}
							onchange={(e) => {
								if (!character) return;
								// Convert to number, defaulting to 0 for empty/invalid values
								const numValue =
									(e.target as HTMLInputElement).value === ''
										? 0
										: Number((e.target as HTMLInputElement).value);
								// Ensure we always set a valid number (never NaN or string)
								character.bonus_max_loadout = isNaN(numValue) ? 0 : Math.floor(numValue);
							}}
							placeholder="0"
						/>
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		{/if}

		<!-- Added Domain Cards Table -->
		{#if additionalDomainCards.length > 0}
			<div class="flex flex-col gap-2">
				<table class="w-full border-collapse text-sm">
					<tbody>
						{#each additionalDomainCards as card (card.compendium_id)}
							<tr class="border-b">
								<td class="py-2 pr-4 text-left">
									<div class="flex flex-col gap-0.5">
										<span class="font-medium">{card.title}</span>
										<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
											{#if card.source_id === 'Homebrew'}
												<HomebrewBadge
													type="domain-cards"
													id={card.compendium_id}
													class="-mt-0.5 size-4"
												/>
											{:else if card.source_id === 'Campaign'}
												<CampaignBadge type="domain-cards" id={card.compendium_id} class="-mt-0.5 size-4" />
											{/if}
											{getDomainName(card.domain_id)} • Level {card.level_requirement}
										</span>
									</div>
								</td>
								<td class="py-2 text-right">
									<Button variant="ghost" size="sm" class="h-auto" onclick={() => removeCard(card)}>
										<CircleMinus class="size-3.5" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Domain Card Catalog -->
		<div class="flex flex-col gap-2">
			<h3 class="text-sm font-medium">Browse Domain Cards</h3>
			<DomainCardCatalog onCardClick={handleCardClick} />
		</div>
	</div>
{/if}
