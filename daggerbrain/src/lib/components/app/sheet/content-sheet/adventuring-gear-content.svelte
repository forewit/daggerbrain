<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);
	let adventuringGear = $derived(character?.inventory.adventuring_gear || []);

	let whatIsAdventuringGearOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>Adventuring Gear</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4">
	{#if adventuringGear.length > 0}
		<!-- Adventuring Gear Table -->
		<table class="w-full border-collapse text-sm">
			<tbody>
				{#each adventuringGear as gear, index (index)}
					<tr class="border-b">
						<td class="py-2 pr-4 text-left text-muted-foreground">
							{gear.title}
							{#if gear.quantity > 1}
								<span class="ml-1 text-xs text-muted-foreground italic">×{gear.quantity}</span>
							{/if}
						</td>
						<td class="py-2 text-right">
							<Button
								variant="ghost"
								size="sm"
								class="h-auto"
								onclick={() =>
									context.removeFromInventory({ id: gear.title }, 'adventuring_gear', index)}
							>
								<CircleMinus class="size-3.5" />
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="py-4 text-center text-sm text-muted-foreground italic">No adventuring gear</p>
	{/if}

	<!-- todo: fill out -->
	<!-- <Collapsible.Root bind:open={whatIsAdventuringGearOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', whatIsAdventuringGearOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">What is Adventuring Gear?</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<p class="pl-5 pt-2 text-xs text-muted-foreground italic">
				Adventuring gear is...
			</p>
		</Collapsible.Content>
	</Collapsible.Root> -->
</div>
