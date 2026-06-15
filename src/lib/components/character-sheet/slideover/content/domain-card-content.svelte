<script lang="ts">
	import DomainCardCatalog from '$lib/components/catalogs/domain-card-catalog.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';
	import type { Card } from '@convex/schemas/rules';
	import type { DomainCard } from '@convex/schemas/compendium';

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const additionalDomainCards = $derived(derived_character_data?.additional_domain_cards || {});
	const additionalDomainCardIds = $derived(
		character?.additional_domain_card_ids.map(({ card_id }) => card_id) || []
	);
	const compendium = $derived(characterCtx.character_compendium);

	let customizeOpen = $state(false);

	function handleCardClick(card: { type: 'domain_card'; id: string; card: DomainCard }) {
		if (!character) return;

		const card_id = card.id;
		const domain_id = card.card.domain_id;

		// Check if card is already in additional_domain_card_ids
		const alreadyExists = character.additional_domain_card_ids.some(
			(id) => id.card_id === card_id && id.domain_id === domain_id
		);

		if (!alreadyExists && domain_id) {
			character.additional_domain_card_ids = [
				...character.additional_domain_card_ids,
				{ domain_id, card_id }
			];

			const loadoutHasSpace =
				(derived_character_data?.domain_card_loadout.length ?? 0) <
				(derived_character_data?.max_loadout ?? 0);
			const alreadyInLoadout = character.loadout_domain_card_ids.some(
				(id) => id.card_id === card_id && id.domain_id === domain_id
			);

			if (loadoutHasSpace && !alreadyInLoadout && !card.card.forced_in_vault) {
				character.loadout_domain_card_ids = [
					...character.loadout_domain_card_ids,
					{ domain_id, card_id }
				];
			}
		}
	}

	function removeCard(card_id: string) {
		if (!character) return;

		const domain_id = additionalDomainCards[card_id]?.domain_id;

		character.additional_domain_card_ids = character.additional_domain_card_ids.filter(
			(id) => !(id.domain_id === domain_id && id.card_id === card_id)
		);
	}

	// Get domain name for display
	function getDomainName(domainId: string | undefined): string {
		if (!domainId) return 'Unknown';
		return compendium.domains[domainId]?.title || 'Unknown';
	}
</script>

{#if characterCtx.canEdit}
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
		{#if Object.entries(additionalDomainCards).length > 0}
			<div class="flex flex-col gap-2">
				<table class="w-full border-collapse text-sm">
					<tbody>
						{#each Object.entries(additionalDomainCards) as [id, card] (id)}
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
											{getDomainName(card.domain_id)} • Level {card.level_requirement}
										</span>
									</div>
								</td>
								<td class="py-2 text-right">
									<Button variant="ghost" size="sm" class="h-auto" onclick={() => removeCard(id)}>
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
			<DomainCardCatalog
				onSelect={handleCardClick}
				disabledIds={additionalDomainCardIds}
				compendium={characterCtx.character_compendium}
			/>
		</div>
	</div>
{/if}
