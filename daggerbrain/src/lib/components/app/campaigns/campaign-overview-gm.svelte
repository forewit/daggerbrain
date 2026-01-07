<!-- src/lib/components/app/campaigns/campaign-overview-gm.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Label from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { toast } from 'svelte-sonner';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getCampaignContext } from '$lib/state/campaigns.svelte';
	import type { HomebrewType } from '$lib/types/homebrew-types';
	import CampaignCharacters from './campaign-characters.svelte';

	let {
		campaignId,
		user
	}: {
		campaignId: string;
		user: ReturnType<typeof import('$lib/state/user.svelte').getUserContext>;
	} = $props();

	const campaignContext = getCampaignContext();

	// Get data from context
	const campaign = $derived(campaignContext.campaign);
	const campaignState = $derived(campaignContext.campaignState);
	const vaultItems = $derived(campaignContext.vaultItems);

	const homebrew = getHomebrewContext();

	// Local state for notes (for change tracking)
	let localNotes = $state('');
	let saving = $state(false);

	// Update local state when campaignState changes
	$effect(() => {
		if (campaignState) {
			localNotes = campaignState.notes ?? '';
		}
	});

	const hasChanges = $derived((campaignState?.notes ?? '') !== localNotes);

	// Homebrew vault dialog
	let showAddVaultDialog = $state(false);
	let selectedHomebrewType = $state<HomebrewType | ''>('');
	let selectedHomebrewId = $state('');

	async function handleSave() {
		if (!campaignId || !hasChanges) return;

		saving = true;
		try {
			await campaignContext.updateState({
				notes: localNotes || null
			});
			// State will be updated via WebSocket message handler
			// The $effect watching campaignState will sync localNotes automatically
			toast.success('Changes saved');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to save changes');
		} finally {
			saving = false;
		}
	}

	function handleReset() {
		if (!campaignState) return;
		localNotes = campaignState.notes ?? '';
	}

	async function handleAddToVault() {
		if (!campaignId || !selectedHomebrewType || !selectedHomebrewId) return;

		try {
			await campaignContext.addToVault(selectedHomebrewType, selectedHomebrewId);
			showAddVaultDialog = false;
			selectedHomebrewType = '';
			selectedHomebrewId = '';
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

	// Get available homebrew items for the selected type
	const availableHomebrewItems = $derived.by(() => {
		if (!selectedHomebrewType) return [];

		switch (selectedHomebrewType) {
			case 'weapon':
				return [
					...Object.entries(homebrew.primary_weapons).map(([id, item]) => ({
						id,
						name: item.title,
						type: 'primary_weapon' as const
					})),
					...Object.entries(homebrew.secondary_weapons).map(([id, item]) => ({
						id,
						name: item.title,
						type: 'secondary_weapon' as const
					}))
				];
			case 'armor':
				return Object.entries(homebrew.armor).map(([id, item]) => ({
					id,
					name: item.title,
					type: 'armor' as const
				}));
			case 'loot':
				return Object.entries(homebrew.loot).map(([id, item]) => ({
					id,
					name: item.title,
					type: 'loot' as const
				}));
			case 'consumable':
				return Object.entries(homebrew.consumables).map(([id, item]) => ({
					id,
					name: item.title,
					type: 'consumable' as const
				}));
			case 'beastform':
				return Object.entries(homebrew.beastforms).map(([id, item]) => ({
					id,
					name: item.name,
					type: 'beastform' as const
				}));
			case 'class':
				return Object.entries(homebrew.classes).map(([id, item]) => ({
					id,
					name: item.name,
					type: 'class' as const
				}));
			case 'subclass':
				return Object.entries(homebrew.subclasses).map(([id, item]) => ({
					id,
					name: item.name,
					type: 'subclass' as const
				}));
			case 'domain-cards':
				return Object.values(homebrew.domain_cards)
					.flatMap((domain) => Object.entries(domain))
					.map(([id, item]) => ({
						id,
						name: item.title,
						type: 'domain-cards' as const
					}));
			case 'ancestry-cards':
				return Object.entries(homebrew.ancestry_cards).map(([id, item]) => ({
					id,
					name: item.title,
					type: 'ancestry-cards' as const
				}));
			case 'community-cards':
				return Object.entries(homebrew.community_cards).map(([id, item]) => ({
					id,
					name: item.title,
					type: 'community-cards' as const
				}));
			case 'transformation-cards':
				return Object.entries(homebrew.transformation_cards).map(([id, item]) => ({
					id,
					name: item.title,
					type: 'transformation-cards' as const
				}));
			default:
				return [];
		}
	});

	// Get display name for homebrew type
	function getHomebrewTypeName(type: HomebrewType): string {
		const names: Record<HomebrewType, string> = {
			weapon: 'Weapon',
			armor: 'Armor',
			loot: 'Loot',
			consumable: 'Consumable',
			beastform: 'Beastform',
			class: 'Class',
			subclass: 'Subclass',
			'domain-cards': 'Domain Card',
			'ancestry-cards': 'Ancestry Card',
			'community-cards': 'Community Card',
			'transformation-cards': 'Transformation Card'
		};
		return names[type] || type;
	}
</script>

{#if campaign}
	<!-- Characters Section -->
	<CampaignCharacters />

	<!-- Notes Section -->
	<div class="rounded border bg-card p-4">
		<h2 class="mb-4 text-lg font-semibold">Notes</h2>
		<Textarea bind:value={localNotes} class="min-h-[200px]" placeholder="Add campaign notes..." />
	</div>

	<!-- Homebrew Vault Section -->
	<div class="rounded border bg-card p-4">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Homebrew Vault</h2>
			<Button variant="outline" size="sm" onclick={() => (showAddVaultDialog = true)}>
				Add Item
			</Button>
		</div>

		{#if vaultItems.length === 0}
			<p class="text-sm text-muted-foreground">No items in vault yet.</p>
		{:else}
			<div class="flex flex-col gap-2">
				{#each vaultItems as item}
					<div class="flex items-center justify-between rounded border bg-muted p-2">
						<div>
							<span class="font-medium">{getHomebrewTypeName(item.homebrew_type)}</span>
							<span class="ml-2 text-sm text-muted-foreground">{item.homebrew_id}</span>
						</div>
						<Button variant="ghost" size="sm" onclick={() => handleRemoveFromVault(item.id)}>
							Remove
						</Button>
					</div>
				{/each}
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
				</Dialog.Description>
			</Dialog.Header>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					if (selectedHomebrewType && selectedHomebrewId) {
						handleAddToVault();
					}
				}}
			>
				<div class="flex flex-col gap-4 py-4">
					<div class="flex flex-col gap-2">
						<Label.Root>Homebrew Type</Label.Root>
						<Select.Root
							type="single"
							value={selectedHomebrewType}
							onValueChange={(v) => {
								selectedHomebrewType = (v || '') as HomebrewType | '';
								selectedHomebrewId = ''; // Reset selection when type changes
							}}
						>
							<Select.Trigger class="w-full">
								<p class="truncate">
									{selectedHomebrewType
										? getHomebrewTypeName(selectedHomebrewType)
										: 'Select type...'}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="weapon">Weapon</Select.Item>
								<Select.Item value="armor">Armor</Select.Item>
								<Select.Item value="loot">Loot</Select.Item>
								<Select.Item value="consumable">Consumable</Select.Item>
								<Select.Item value="beastform">Beastform</Select.Item>
								<Select.Item value="class">Class</Select.Item>
								<Select.Item value="subclass">Subclass</Select.Item>
								<Select.Item value="domain-cards">Domain Card</Select.Item>
								<Select.Item value="ancestry-cards">Ancestry Card</Select.Item>
								<Select.Item value="community-cards">Community Card</Select.Item>
								<Select.Item value="transformation-cards">Transformation Card</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					{#if selectedHomebrewType && availableHomebrewItems.length > 0}
						<div class="flex flex-col gap-2">
							<Label.Root>Item</Label.Root>
							<Select.Root
								type="single"
								value={selectedHomebrewId}
								onValueChange={(v) => (selectedHomebrewId = v || '')}
							>
								<Select.Trigger class="w-full">
									<p class="truncate">
										{selectedHomebrewId
											? availableHomebrewItems.find((i) => i.id === selectedHomebrewId)?.name ||
												'Unknown'
											: 'Select item...'}
									</p>
								</Select.Trigger>
								<Select.Content>
									{#each availableHomebrewItems as item}
										<Select.Item value={item.id}>{item.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					{:else if selectedHomebrewType && availableHomebrewItems.length === 0}
						<p class="text-sm text-muted-foreground">
							No {getHomebrewTypeName(selectedHomebrewType).toLowerCase()}s available.
						</p>
					{/if}
				</div>

				<Dialog.Footer class="flex gap-3">
					<Dialog.Close
						type="button"
						class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}
					>
						Cancel
					</Dialog.Close>
					<Button
						type="submit"
						disabled={!selectedHomebrewType ||
							!selectedHomebrewId ||
							availableHomebrewItems.length === 0}
					>
						Add
					</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
