<script lang="ts">
	import type { Loot } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let { loot }: { loot: Loot } = $props();

	let whatIsLootOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>{loot.title}</Sheet.Title>
	<p class="text-muted-foreground text-xs italic">Loot</p>
</Sheet.Header>

<div class="px-4 flex flex-col gap-6 overflow-y-auto">
	<!-- Description -->
	<div class="rounded-lg bg-primary/5 px-4 py-3 border">
		<p class="text-sm">Description</p>
		{#if loot.description_html.trim().length > 0}
			<div class="mt-3">
				<div class="border-l-2 border-accent/30 pl-3">
					<p class="text-muted-foreground text-xs">{@html loot.description_html}</p>
				</div>
			</div>
		{:else}
			<p class="text-muted-foreground italic text-xs mt-2 text-right">None</p>
		{/if}
	</div>

	<Collapsible.Root bind:open={whatIsLootOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', whatIsLootOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">What is Loot?</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<p class="pl-5 pt-2 text-xs text-muted-foreground italic">
				Loot is treasure and equipment found during adventures. Unlike consumables, loot items can be used repeatedly and may provide ongoing bonuses or special abilities.
			</p>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
