<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let { consumable }: { consumable: Consumable } = $props();

	let whatIsConsumablesOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>{consumable.title}</Sheet.Title>
	<p class="text-muted-foreground text-xs italic">Consumable</p>
</Sheet.Header>

<div class="px-4 flex flex-col gap-6 overflow-y-auto">
	<!-- Description -->
	<div class="rounded-lg bg-primary/5 px-4 py-3 border">
		<p class="text-sm">Description</p>
		{#if consumable.description_html.trim().length > 0}
			<div class="mt-3">
				<div class="border-l-2 border-accent/30 pl-3">
					<p class="text-muted-foreground text-xs">{@html consumable.description_html}</p>
				</div>
			</div>
		{:else}
			<p class="text-muted-foreground italic text-xs mt-2 text-right">None</p>
		{/if}
	</div>

	<Collapsible.Root bind:open={whatIsConsumablesOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', whatIsConsumablesOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">What are Consumables?</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<p class="pl-5 pt-2 text-xs text-muted-foreground italic">
				Consumables are loot that can only be used once. You can hold up to five of each consumable at a time. Using a consumable doesn't require a roll unless required by the GM or the demands of the fiction.
			</p>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
