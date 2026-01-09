<script lang="ts">
	import HeritageCardCatalog from '../../cards/heritage-card-catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import type {
		AncestryCard,
		CommunityCard,
		TransformationCard
	} from '$lib/types/compendium-types';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import HomebrewBadge from '../../homebrew/homebrew-badge.svelte';

	type HeritageCard = AncestryCard | CommunityCard | TransformationCard;

	const context = getCharacterContext();
	let character = $derived(context.character);
	let additionalAncestryCards = $derived(context.additional_ancestry_cards);
	let additionalCommunityCards = $derived(context.additional_community_cards);
	let additionalTransformationCards = $derived(context.additional_transformation_cards);

	// Combine all additional heritage cards for display
	let allAdditionalHeritageCards = $derived([
		...additionalAncestryCards,
		...additionalCommunityCards,
		...additionalTransformationCards
	]);

	function handleCardClick(card: HeritageCard) {
		if (!character) return;

		const cardId = card.compendium_id;

		// Check if card is already in the appropriate list
		let alreadyExists = false;
		if (card.card_type === 'ancestry') {
			alreadyExists = character.additional_ancestry_card_ids.includes(cardId);
			if (!alreadyExists) {
				character.additional_ancestry_card_ids = [
					...character.additional_ancestry_card_ids,
					cardId
				];
			}
		} else if (card.card_type === 'community') {
			alreadyExists = character.additional_community_card_ids.includes(cardId);
			if (!alreadyExists) {
				character.additional_community_card_ids = [
					...character.additional_community_card_ids,
					cardId
				];
			}
		} else if (card.card_type === 'transformation') {
			alreadyExists = character.additional_transformation_card_ids.includes(cardId);
			if (!alreadyExists) {
				character.additional_transformation_card_ids = [
					...character.additional_transformation_card_ids,
					cardId
				];
			}
		}
	}

	function removeCard(card: HeritageCard) {
		if (!character) return;

		const cardId = card.compendium_id;

		if (card.card_type === 'ancestry') {
			character.additional_ancestry_card_ids = character.additional_ancestry_card_ids.filter(
				(id) => id !== cardId
			);
		} else if (card.card_type === 'community') {
			character.additional_community_card_ids = character.additional_community_card_ids.filter(
				(id) => id !== cardId
			);
		} else if (card.card_type === 'transformation') {
			character.additional_transformation_card_ids =
				character.additional_transformation_card_ids.filter((id) => id !== cardId);
		}
	}

	function getCardTypeName(card: HeritageCard): string {
		return card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1);
	}
</script>

{#if context.canEdit}
<Sheet.Header>
	<Sheet.Title>Customize Your Character Cards</Sheet.Title>
	<Sheet.Description class="text-xs italic"
		>Manually add Ancestry, Community, or Transformation to your character.</Sheet.Description
	>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	<!-- Added Heritage Cards Table -->
	{#if allAdditionalHeritageCards.length > 0}
		<div class="flex flex-col gap-2">
			<table class="w-full border-collapse text-sm">
				<tbody>
					{#each allAdditionalHeritageCards as card (card.compendium_id)}
						<tr class="border-b">
							<td class="py-2 pr-4 text-left">
								<div class="flex flex-col gap-0.5">
									<span class="font-medium">{card.title}</span>
									<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
										{#if card.source_id === 'Homebrew'}
											<HomebrewBadge
												type={card.card_type === 'ancestry'
													? 'ancestry-cards'
													: card.card_type === 'community'
														? 'community-cards'
														: 'transformation-cards'}
												id={card.compendium_id}
												class="-mt-0.5 size-4"
											/>
										{/if}
										{getCardTypeName(card)}
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

	<!-- Heritage Card Catalog -->
	<div class="flex flex-col gap-2">
		<h3 class="text-sm font-medium">Browse Character Cards</h3>
		<HeritageCardCatalog onCardClick={handleCardClick} />
	</div>
</div>
{/if}