<script lang="ts">
	import type { CompendiumContentIds } from '@convex/schemas/compendium';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getCampaignContext } from '$lib/state/campaign.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { cn } from '$lib/utils';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Plus from '@lucide/svelte/icons/plus';
	import HomebrewItemsCombobox from '$lib/components/campaigns/homebrew-items-combobox.svelte';

	let { class: className = '' }: { class?: string } = $props();

	type VaultType = keyof CompendiumContentIds;

	const campaignCtx = getCampaignContext();
	const homebrewCtx = getHomebrewContext();
	const campaign = $derived(campaignCtx.campaign);

	const TYPE_CONFIG: Record<
		VaultType,
		{
			name: string;
			routeType: string;
			getItemName: (id: string) => string | null;
		}
	> = {
		primary_weapons: {
			name: 'Primary Weapon',
			routeType: 'primary-weapon',
			getItemName: (id) => homebrewCtx.compendium?.primary_weapons[id]?.title ?? null
		},
		secondary_weapons: {
			name: 'Secondary Weapon',
			routeType: 'secondary-weapon',
			getItemName: (id) => homebrewCtx.compendium?.secondary_weapons[id]?.title ?? null
		},
		armor: {
			name: 'Armor',
			routeType: 'armor',
			getItemName: (id) => homebrewCtx.compendium?.armor[id]?.title ?? null
		},
		loot: {
			name: 'Loot',
			routeType: 'loot',
			getItemName: (id) => homebrewCtx.compendium?.loot[id]?.title ?? null
		},
		consumables: {
			name: 'Consumable',
			routeType: 'consumable',
			getItemName: (id) => homebrewCtx.compendium?.consumables[id]?.title ?? null
		},
		beastforms: {
			name: 'Beastform',
			routeType: 'beastform',
			getItemName: (id) => homebrewCtx.compendium?.beastforms[id]?.title ?? null
		},
		classes: {
			name: 'Class',
			routeType: 'class',
			getItemName: (id) => homebrewCtx.compendium?.classes[id]?.title ?? null
		},
		subclasses: {
			name: 'Subclass',
			routeType: 'subclass',
			getItemName: (id) => homebrewCtx.compendium?.subclasses[id]?.title ?? null
		},
		domains: {
			name: 'Domain',
			routeType: 'domain',
			getItemName: (id) => homebrewCtx.compendium?.domains[id]?.title ?? null
		},
		domain_cards: {
			name: 'Domain Card',
			routeType: 'domain-cards',
			getItemName: (id) => homebrewCtx.compendium?.domain_cards[id]?.title ?? null
		},
		ancestry_cards: {
			name: 'Ancestry Card',
			routeType: 'ancestry-cards',
			getItemName: (id) => homebrewCtx.compendium?.ancestry_cards[id]?.title ?? null
		},
		community_cards: {
			name: 'Community Card',
			routeType: 'community-cards',
			getItemName: (id) => homebrewCtx.compendium?.community_cards[id]?.title ?? null
		},
		transformation_cards: {
			name: 'Transformation Card',
			routeType: 'transformation-cards',
			getItemName: (id) => homebrewCtx.compendium?.transformation_cards[id]?.title ?? null
		},
		adversaries: {
			name: 'Adversary',
			routeType: 'adversary',
			getItemName: (id) => homebrewCtx.compendium?.adversaries[id]?.title ?? null
		},
		environments: {
			name: 'Environment',
			routeType: 'environment',
			getItemName: (id) => homebrewCtx.compendium?.environments[id]?.title ?? null
		}
	};

	let showAddVaultDialog = $state(false);
	let selectedItem = $state('');

	const sortedVaultItems = $derived.by(() => {
		if (!campaign) return [];

		return Object.entries(campaign.homebrew_vault)
			.flatMap(([type, ids]) =>
				(ids as readonly string[]).map((id) => {
					const vaultType = type as VaultType;
					const config = TYPE_CONFIG[vaultType];
					const name = config.getItemName(id);
					if (!name) return null;

					return {
						id,
						type: vaultType,
						name,
						typeName: config.name,
						href: `/homebrew/${config.routeType}/${id}`
					};
				})
			)
			.filter((item): item is NonNullable<typeof item> => item !== null)
			.sort((left, right) =>
				left.typeName !== right.typeName
					? left.typeName.localeCompare(right.typeName)
					: left.name.localeCompare(right.name)
			);
	});

	function handleAddToVault() {
		if (!campaign || !selectedItem) return;
		const [type, id] = selectedItem.split(':') as [VaultType | undefined, string | undefined];
		if (!type || !id) return;

		campaignCtx.addToVault(type, id as never);
		showAddVaultDialog = false;
		selectedItem = '';
	}
</script>

{#if campaign}
	<div class={cn('rounded-2xl border-y bg-primary-muted shadow-xl', className)}>
		<div class="mb-2 flex items-center justify-between px-4 pt-3">
			<h2 class="text-lg font-semibold">Homebrew Vault</h2>

			<Button variant="ghost" size="sm" class="px-2" onclick={() => (showAddVaultDialog = true)}>
				<Plus class="size-4" />
			</Button>
		</div>
		<p class="pt-4 pb-4 pl-4 text-xs text-muted-foreground sm:pt-0">
			Items in the vault will be available your player's character sheets.
		</p>

		{#if sortedVaultItems.length === 0}
			<div class="h-4"></div>
		{:else}
			<div class="mx-4 mb-4 bg-background">
				<table class="w-full border-collapse">
					<colgroup>
						<col />
						<col class="w-32" />
						<col class="w-12" />
					</colgroup>
					<thead>
						<tr class="border-b bg-primary/30 text-xs">
							<th class="px-4 py-2 text-left">Name</th>
							<th class="py-2 pr-4 text-left">Type</th>
							<th class="py-2 pr-4 text-center"></th>
						</tr>
					</thead>
					<tbody>
						{#each sortedVaultItems as item (`${item.type}:${item.id}`)}
							<tr class="border-b">
								<td class="px-4 py-2">
									<a href={item.href} class="text-sm font-medium text-foreground hover:underline">
										{item.name.trim() || 'Unnamed Item'}
										<ExternalLink class="-mt-0.5 ml-0.5 inline size-4" />
									</a>
								</td>
								<td class="py-2 pr-4 text-sm text-muted-foreground">{item.typeName}</td>
								<td class="py-2 pr-4 text-center">
									<Button
										variant="ghost"
										size="sm"
										class="h-auto p-0"
										onclick={() => campaignCtx.removeFromVault(item.id)}
									>
										<CircleMinus class="size-4" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<Dialog.Root bind:open={showAddVaultDialog}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Add Homebrew to Vault</Dialog.Title>
				<Dialog.Description>
					Select a homebrew item from your collection to add to the campaign vault.

					<Button href="/homebrew" class="mt-2 flex w-min pl-0" variant="link">
						Manage homebrew collection
						<ExternalLink class="size-4" />
					</Button>
				</Dialog.Description>
			</Dialog.Header>

			<form
				onsubmit={(event) => {
					event.preventDefault();
					if (selectedItem) {
						handleAddToVault();
					}
				}}
			>
				<div class="flex flex-col gap-4 py-4">
					<div class="flex flex-col gap-2">
						<p class="text-sm font-medium">My Homebrew Collection</p>
						<HomebrewItemsCombobox
							bind:value={selectedItem}
							excludeItems={sortedVaultItems.map((item) => ({ type: item.type, id: item.id }))}
						/>
					</div>
				</div>

				<Dialog.Footer class="flex gap-3">
					<Dialog.Close
						type="button"
						class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					>
						Cancel
					</Dialog.Close>
					<Button type="submit" disabled={!selectedItem}>Add</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
