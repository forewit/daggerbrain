<!-- src/lib/components/app/campaigns/campaign-vault.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Label from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { HomebrewType } from '$lib/types/homebrew-types';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import type { DomainIds } from '$lib/types/compendium-types';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Plus from '@lucide/svelte/icons/plus';
	import HomebrewItemsCombobox from './homebrew-items-combobox.svelte';
	import Anvil from '@lucide/svelte/icons/anvil';

	let { campaignId, class: className }: { campaignId: string; class?: string } = $props();

	const campaignContext = getCampaignContext();
	const vaultItems = $derived(campaignContext.vaultItems);
	const homebrew = getHomebrewContext();

	// Configuration for homebrew types
	const HOMEBREW_TYPE_CONFIG: Record<
		HomebrewType,
		{
			name: string;
			getItems: (
				homebrew: ReturnType<typeof getHomebrewContext>
			) => Array<{ id: string; name: string }>;
			getItemName: (homebrew: ReturnType<typeof getHomebrewContext>, id: string) => string | null;
		}
	> = {
		weapon: {
			name: 'Weapon',
			getItems: (h) => [
				...Object.entries(h.primary_weapons).map(([id, item]) => ({ id, name: item.title })),
				...Object.entries(h.secondary_weapons).map(([id, item]) => ({ id, name: item.title }))
			],
			getItemName: (h, id) => h.primary_weapons[id]?.title || h.secondary_weapons[id]?.title || null
		},
		armor: {
			name: 'Armor',
			getItems: (h) => Object.entries(h.armor).map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => h.armor[id]?.title || null
		},
		loot: {
			name: 'Loot',
			getItems: (h) => Object.entries(h.loot).map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => h.loot[id]?.title || null
		},
		consumable: {
			name: 'Consumable',
			getItems: (h) =>
				Object.entries(h.consumables).map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => h.consumables[id]?.title || null
		},
		beastform: {
			name: 'Beastform',
			getItems: (h) => Object.entries(h.beastforms).map(([id, item]) => ({ id, name: item.name })),
			getItemName: (h, id) => h.beastforms[id]?.name || null
		},
		class: {
			name: 'Class',
			getItems: (h) => Object.entries(h.classes).map(([id, item]) => ({ id, name: item.name })),
			getItemName: (h, id) => h.classes[id]?.name || null
		},
		subclass: {
			name: 'Subclass',
			getItems: (h) => Object.entries(h.subclasses).map(([id, item]) => ({ id, name: item.name })),
			getItemName: (h, id) => h.subclasses[id]?.name || null
		},
		'domain-cards': {
			name: 'Domain Card',
			getItems: (h) =>
				Object.values(h.domain_cards)
					.flatMap((domain) => Object.entries(domain))
					.map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => {
				for (const domainId of Object.keys(h.domain_cards) as DomainIds[]) {
					const card = h.domain_cards[domainId]?.[id];
					if (card) return card.title;
				}
				return null;
			}
		},
		'ancestry-cards': {
			name: 'Ancestry Card',
			getItems: (h) =>
				Object.entries(h.ancestry_cards).map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => h.ancestry_cards[id]?.title || null
		},
		'community-cards': {
			name: 'Community Card',
			getItems: (h) =>
				Object.entries(h.community_cards).map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => h.community_cards[id]?.title || null
		},
		'transformation-cards': {
			name: 'Transformation Card',
			getItems: (h) =>
				Object.entries(h.transformation_cards).map(([id, item]) => ({ id, name: item.title })),
			getItemName: (h, id) => h.transformation_cards[id]?.title || null
		}
	};

	function getHomebrewTypeName(type: HomebrewType): string {
		return HOMEBREW_TYPE_CONFIG[type]?.name || type;
	}

	// Dialog state
	let showAddVaultDialog = $state(false);
	let selectedItem = $state('');

	async function handleAddToVault() {
		if (!campaignId || !selectedItem) return;

		// Parse the value format: `${type}:${id}`
		const [homebrewType, homebrewId] = selectedItem.split(':');
		if (!homebrewType || !homebrewId) return;

		try {
			await campaignContext.addToVault(homebrewType as HomebrewType, homebrewId);
			showAddVaultDialog = false;
			selectedItem = '';
		} catch (err) {
			// Error handling is done in addToVault
		}
	}

	async function handleRemoveFromVault(vaultId: string) {
		if (!campaignId) return;
		try {
			await campaignContext.removeFromVault(vaultId);
		} catch (err) {
			// Error handling is done in removeFromVault
		}
	}

	function getItemName(item: { homebrew_type: HomebrewType; homebrew_id: string }): string | null {
		const config = HOMEBREW_TYPE_CONFIG[item.homebrew_type];
		return config?.getItemName(homebrew, item.homebrew_id) || null;
	}

	function getItemHref(item: { homebrew_type: HomebrewType; homebrew_id: string }): string {
		return `/homebrew/${item.homebrew_type}/${item.homebrew_id}`;
	}

	const sortedVaultItems = $derived.by(() => {
		return vaultItems
			.map((item) => {
				const name = getItemName(item);
				if (!name) return null;
				return { ...item, name, href: getItemHref(item) };
			})
			.filter((item): item is NonNullable<typeof item> => item !== null)
			.sort((a, b) => {
				const typeA = getHomebrewTypeName(a.homebrew_type);
				const typeB = getHomebrewTypeName(b.homebrew_type);
				return typeA !== typeB ? typeA.localeCompare(typeB) : a.name.localeCompare(b.name);
			});
	});
</script>

<div class={cn('rounded-2xl bg-primary/10 shadow-xl', className)}>
	<div class="flex items-center justify-between px-4 pt-4">
		<h2 class="text-lg font-semibold">
			<!-- <Anvil class="size-5 inline -mt-0.5 mr-0.5" /> -->

			Homebrew Vault
		</h2>

		<Button variant="ghost" size="sm" onclick={() => (showAddVaultDialog = true)}>
			<!-- <Plus class="size-4" /> -->
			<Plus class="size-4" />
		</Button>
	</div>
	<p class="pt-4 pb-4 pl-4 text-xs text-muted-foreground sm:pt-0">
		Items in the vault will be available your player's character sheets.
	</p>

	{#if sortedVaultItems.length === 0}
		<p class="pt-2 pb-8 text-center text-sm text-muted-foreground">No items in vault yet.</p>
	{:else}
		<div class=" mx-4 mb-4 bg-background">
			<table class="w-full border-collapse">
				<colgroup>
					<col />
					<col class="w-32" />
					<col class="w-12" />
				</colgroup>
				<thead>
					<tr class="border-b bg-primary-muted text-xs text-muted-foreground">
						<th class="px-4 py-2 text-left">Name</th>
						<th class="py-2 pr-4 text-left">Type</th>
						<th class="py-2 pr-4 text-center"></th>
					</tr>
				</thead>
				<tbody>
					{#each sortedVaultItems as item (item.id)}
						<tr class="border-b">
							<td class="px-4 py-2">
								<a href={item.href} class="text-sm font-medium text-foreground hover:underline">
									{item.name.trim() || 'Unnamed Item'}
									<ExternalLink class="-mt-0.5 ml-0.5 inline size-4" />
								</a>
							</td>
							<td class="py-2 pr-4 text-sm text-muted-foreground">
								{getHomebrewTypeName(item.homebrew_type)}
							</td>
							<td class="py-2 pr-4 text-center">
								<Button
									variant="ghost"
									size="sm"
									class="h-auto p-0"
									onclick={() => handleRemoveFromVault(item.id)}
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

<!-- Add to Vault Dialog -->
<Dialog.Root bind:open={showAddVaultDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Homebrew to Vault</Dialog.Title>
			<Dialog.Description>
				Select a homebrew item from your collection to add to the campaign vault.

				<Button href="/homebrew" class="mt-2 flex w-min pl-0" variant="link"
					>Manage homebrew collection <ExternalLink class="size-4" /></Button
				>
			</Dialog.Description>
		</Dialog.Header>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				if (selectedItem) {
					handleAddToVault();
				}
			}}
		>
			<div class="flex flex-col gap-4 py-4">
				<div class="flex flex-col gap-2">
					<Label.Root>My Homebrew Collection</Label.Root>
					<HomebrewItemsCombobox bind:value={selectedItem} excludeItems={vaultItems} />
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
