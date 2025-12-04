<script lang="ts">
	import type { Consumable } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ConsumableRules from '../../rules/consumable-rules.svelte';

	let { consumable }: { consumable: Consumable } = $props();

	let whatIsConsumablesOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>{consumable.title}</Sheet.Title>
	<p class="text-xs text-muted-foreground italic">Consumable</p>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	<!-- Description -->
	<div class="rounded-lg border bg-primary/5 px-4 py-3">
		<p class="text-sm">Description</p>
		{#if consumable.description_html.trim().length > 0}
			<div class="mt-3">
				<div class="border-l-2 border-accent/30 pl-3">
					<p class="text-xs text-muted-foreground">{@html consumable.description_html}</p>
				</div>
			</div>
		{:else}
			<p class="mt-2 text-right text-xs text-muted-foreground italic">None</p>
		{/if}
	</div>

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
