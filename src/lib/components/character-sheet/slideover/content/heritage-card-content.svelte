<script lang="ts">
	import HeritageCardCatalog from '$lib/components/catalogs/heritage-card-catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { AncestryCard, CommunityCard, TransformationCard } from '@convex/schemas/compendium';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import type { Card } from '@convex/schemas/rules';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);

	const additionalAncestryCards = $derived(derived_character_data?.additional_ancestry_cards || {});
	const additionalCommunityCards = $derived(
		derived_character_data?.additional_community_cards || {}
	);
	const additionalTransformationCards = $derived(
		derived_character_data?.additional_transformation_cards || {}
	);

	function handleCardClick({ id, type, card }: Card) {
		if (!character) return;

		// Check if card is already in the appropriate list
		let alreadyExists = false;
		if (type === 'ancestry_card') {
			alreadyExists = character.additional_ancestry_card_ids.includes(id);
			if (!alreadyExists) {
				character.additional_ancestry_card_ids = [...character.additional_ancestry_card_ids, id];
			}
		} else if (type === 'community_card') {
			alreadyExists = character.additional_community_card_ids.includes(id);
			if (!alreadyExists) {
				character.additional_community_card_ids = [...character.additional_community_card_ids, id];
			}
		} else if (type === 'transformation_card') {
			alreadyExists = character.additional_transformation_card_ids.includes(id);
			if (!alreadyExists) {
				character.additional_transformation_card_ids = [
					...character.additional_transformation_card_ids,
					id
				];
			}
		}
	}

	function removeCard({
		type,
		id
	}: {
		type: 'Ancestry' | 'Community' | 'Transformation';
		id: string;
	}) {
		if (!character) return;

		if (type === 'Ancestry') {
			character.additional_ancestry_card_ids = character.additional_ancestry_card_ids.filter(
				(card_id) => card_id !== id
			);
		} else if (type === 'Community') {
			character.additional_community_card_ids = character.additional_community_card_ids.filter(
				(card_id) => card_id !== id
			);
		} else if (type === 'Transformation') {
			character.additional_transformation_card_ids =
				character.additional_transformation_card_ids.filter((card_id) => card_id !== id);
		}
	}
</script>

{#if characterCtx.canEdit}
	<Sheet.Header>
		<Sheet.Title>Customize Your Character Cards</Sheet.Title>
		<Sheet.Description class="text-xs italic"
			>Manually add Ancestry, Community, or Transformation to your character.</Sheet.Description
		>
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		<!-- Added Heritage Cards Table -->
		{#if Object.entries(additionalAncestryCards).length > 0 || Object.entries(additionalCommunityCards).length > 0 || Object.entries(additionalTransformationCards).length > 0}
			<div class="flex flex-col gap-2">
				<table class="w-full border-collapse text-sm">
					<tbody>
						{#snippet row({
							card,
							type,
							id
						}:
							| { card: AncestryCard; type: 'Ancestry'; id: string }
							| { card: CommunityCard; type: 'Community'; id: string }
							| {
									card: TransformationCard;
									type: 'Transformation';
									id: string;
							  })}
							<tr class="border-b">
								<td class="py-2 pr-4 text-left">
									<div class="flex flex-col gap-0.5">
										<span class="font-medium">{card.title}</span>
										<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
											{#if card.source_key === 'Homebrew'}
												<HomebrewBadge class="-mt-0.5 size-4" />
											{:else if card.source_key === 'Campaign'}
												<CampaignBadge class="-mt-0.5 size-4" />
											{/if}
											{type}
										</span>
									</div>
								</td>
								<td class="py-2 text-right">
									<Button
										variant="ghost"
										size="sm"
										class="h-auto"
										onclick={() => removeCard({ type, id })}
									>
										<CircleMinus class="size-3.5" />
									</Button>
								</td>
							</tr>
						{/snippet}
						{#each Object.entries(additionalAncestryCards) as [id, card] (id)}
							{@render row({ card, id, type: 'Ancestry' })}
						{/each}
						{#each Object.entries(additionalCommunityCards) as [id, card] (id)}
							{@render row({ card, id, type: 'Community' })}
						{/each}
						{#each Object.entries(additionalTransformationCards) as [id, card] (id)}
							{@render row({ card, id, type: 'Transformation' })}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Heritage Card Catalog -->
		<div class="flex flex-col gap-2">
			<h3 class="text-sm font-medium">Browse Character Cards</h3>
			<HeritageCardCatalog
				compendium={characterCtx.character_compendium}
				onSelect={handleCardClick}
			/>
		</div>
	</div>
{/if}
