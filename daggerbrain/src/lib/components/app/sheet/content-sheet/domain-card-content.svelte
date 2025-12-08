<script lang="ts">
	import DomainCardCatalog from '../../cards/domain-card-catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { DomainCard } from '$lib/types/compendium-types';
	import type { DomainCardId } from '$lib/types/character-types';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	const compendium = getCompendiumContext();
	let character = $derived(context.character);
	let additionalDomainCards = $derived(context.additional_domain_cards);

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
		return compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1);
	}
</script>

<Sheet.Header>
	<Sheet.Title>Customize Character Cards</Sheet.Title>
	<Sheet.Description class="text-xs italic">Manually add cards to your character.</Sheet.Description>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
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
									<span class="text-xs text-muted-foreground">
										{getDomainName(card.domain_id)} • Level {card.level_requirement}
									</span>
								</div>
							</td>
							<td class="py-2 text-right">
								<Button
									variant="ghost"
									size="sm"
									class="h-auto"
									onclick={() => removeCard(card)}
								>
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

