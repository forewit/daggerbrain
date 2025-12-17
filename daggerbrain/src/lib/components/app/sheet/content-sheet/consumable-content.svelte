<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ConsumableRules from '../../rules/consumable-rules.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { consumableId }: { consumableId: string } = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);
	let whatIsConsumablesOpen = $state(false);
	let customizeOpen = $state(false);

	// Get consumable from inventory
	let consumable = $derived.by(() => {
		return context.inventory_consumables.find((c) => c.id === consumableId) || null;
	});

	// Get the inventory item
	let inventoryItem = $derived.by(() => {
		if (!character || !consumableId) return null;
		return character.inventory.consumables[consumableId] || null;
	});

	// Form state - initialized from inventory item
	let customName = $state('');
	let customDescription = $state('');

	// Derived value for is save button disabled (if customizations match the existing consumable)
	let isSaveDisabled = $derived.by(() => {
		if (!consumable || !inventoryItem) return false;

		const formName = customName.trim();
		const savedName = (inventoryItem.custom_title ?? '').trim();
		const formDescription = customDescription.trim();
		const savedDescription = (inventoryItem.custom_description ?? '').trim();
		return formName === savedName && formDescription === savedDescription;
	});

	// Check if there are any customizations on the inventory item
	let hasCustomizations = $derived.by(() => {
		if (!inventoryItem) return false;
		return inventoryItem.custom_title !== null || inventoryItem.custom_description !== null;
	});

	// Update form when inventory item changes
	$effect(() => {
		if (inventoryItem) {
			customName = inventoryItem.custom_title === null ? '' : inventoryItem.custom_title;
			customDescription =
				inventoryItem.custom_description === null ? '' : inventoryItem.custom_description;
		} else {
			customName = '';
			customDescription = '';
		}
	});

	function handleSave() {
		if (!character || !inventoryItem || !consumableId) return;

		const item = character.inventory.consumables[consumableId];
		if (!item) return;

		// Update name (always valid - empty becomes null)
		const trimmedName = customName.trim();
		item.custom_title = trimmedName || null;
		// Update description (always valid - empty becomes null)
		const trimmedDescription = customDescription.trim();
		item.custom_description = trimmedDescription || null;
	}

	function handleClear() {
		customName = '';
		customDescription = '';
		handleSave();
	}
</script>

{#if consumable}
	<Sheet.Header>
		<Sheet.Title>{consumable.title}</Sheet.Title>
		<p class="text-xs text-muted-foreground italic">Consumable</p>
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		<!-- Description -->
		<div class="rounded-lg border bg-primary/5 px-4 py-3">
			<p class="text-sm">Description</p>
			{#if (consumable.description_html || '').trim().length > 0}
				<div class="mt-3">
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="text-xs text-muted-foreground">{@html consumable.description_html}</p>
					</div>
				</div>
			{:else}
				<p class="mt-2 text-right text-xs text-muted-foreground italic">None</p>
			{/if}
		</div>

		{#if inventoryItem}
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
				<Collapsible.Content class="flex flex-col gap-3 rounded-b-md border bg-card/50 p-2">
					<div class="flex flex-col gap-1">
						<label for="custom-name" class="text-xs font-medium text-muted-foreground">Name</label>
						<Input id="custom-name" bind:value={customName} placeholder="Name" />
					</div>
					<div class="flex flex-col gap-1">
						<label for="custom-description" class="text-xs font-medium text-muted-foreground"
							>Description</label
						>
						<Textarea
							id="custom-description"
							bind:value={customDescription}
							placeholder="Description"
							class="min-h-24"
						/>
					</div>
					<div class="flex gap-2">
						<Button size="sm" onclick={handleSave} hidden={isSaveDisabled}>Save</Button>
						{#if hasCustomizations}
							<Button
								size="sm"
								variant="link"
								class="ml-auto text-destructive"
								onclick={handleClear}>Clear</Button
							>
						{/if}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		{/if}

		<Collapsible.Root bind:open={whatIsConsumablesOpen} class="pt-2">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight
					class={cn('size-4 transition-transform', whatIsConsumablesOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">More info</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<ConsumableRules class="pt-2 pl-5" />
			</Collapsible.Content>
		</Collapsible.Root>
	</div>

	<Sheet.Footer>
		<Sheet.Close
			class={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'text-destructive')}
			onclick={() => {
				context.removeFromInventory({ id: consumableId }, 'consumable');
			}}
		>
			Remove
		</Sheet.Close>
	</Sheet.Footer>
{/if}
