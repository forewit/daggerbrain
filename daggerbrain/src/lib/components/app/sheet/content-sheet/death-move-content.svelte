<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Skull from '@lucide/svelte/icons/skull';

	let moreInfoOpen = $state(false);

	// Death move selection (only one can be selected)
	let selectedDeathMove = $state<string | null>(null);

	// Enable button when a death move is selected
	let canMakeDeathMove = $derived(selectedDeathMove !== null);

	function makeDeathMove() {
		if (!selectedDeathMove) return;
		
		// TODO: Implement death move logic
		console.log('Making death move:', selectedDeathMove);
		
		// Reset selection after making death move
		selectedDeathMove = null;
	}
</script>

<Sheet.Header>
	<Sheet.Title class="flex gap-2">
		Death Move
	</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4">
	<!-- Death Move Selection Section -->
	<div class="space-y-2">
			<p class="text-sm font-bold">Choose One</p>
			
		<div class="flex flex-col gap-3 rounded-xl border bg-primary/5 p-3 text-sm text-wrap">
			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					selectedDeathMove === 'blaze_of_glory' && 'text-foreground',
					selectedDeathMove === 'blaze_of_glory' ? 'cursor-pointer' : 'cursor-pointer'
				)}
			>
				<Checkbox
					checked={selectedDeathMove === 'blaze_of_glory'}
					onCheckedChange={() => {
						selectedDeathMove = selectedDeathMove === 'blaze_of_glory' ? null : 'blaze_of_glory';
					}}
				/>
				<p>
					<span class="font-semibold">Blaze of Glory:</span>
					Take one final action that automatically critically succeeds, then cross through the veil of death.
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					selectedDeathMove === 'avoid_death' && 'text-foreground',
					selectedDeathMove === 'avoid_death' ? 'cursor-pointer' : 'cursor-pointer'
				)}
			>
				<Checkbox
					checked={selectedDeathMove === 'avoid_death'}
					onCheckedChange={() => {
						selectedDeathMove = selectedDeathMove === 'avoid_death' ? null : 'avoid_death';
					}}
				/>
				<p>
					<span class="font-semibold">Avoid Death:</span>
					Drop unconscious temporarily. Roll Hope Die; if ≤ level, gain a scar (permanently cross out a Hope slot).
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					selectedDeathMove === 'risk_it_all' && 'text-foreground',
					selectedDeathMove === 'risk_it_all' ? 'cursor-pointer' : 'cursor-pointer'
				)}
			>
				<Checkbox
					checked={selectedDeathMove === 'risk_it_all'}
					onCheckedChange={() => {
						selectedDeathMove = selectedDeathMove === 'risk_it_all' ? null : 'risk_it_all';
					}}
				/>
				<p>
					<span class="font-semibold">Risk It All:</span>
					Roll Duality Dice. Hope higher: clear HP/Stress equal to Hope Die. Fear higher: death. Matching: clear all HP and Stress.
				</p>
			</Label>

			<Button
				onclick={makeDeathMove}
				variant={canMakeDeathMove ? 'default' : 'outline'}
				hidden={!canMakeDeathMove}
				size="sm"
			>
				<Skull class="size-4" />
				Make Death Move
			</Button>
		</div>
	</div>

	<Collapsible.Root bind:open={moreInfoOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight class={cn('size-4 transition-transform', moreInfoOpen && 'rotate-90')} />
			<p class="text-sm font-medium">More info</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="flex flex-col gap-6 pt-2 pb-6 pl-5">
				<p class="text-xs text-muted-foreground">
					When a PC marks their last Hit Point, they must make a death move by choosing one of the
					following options:
				</p>

				<!-- Blaze of Glory -->
				<div class="space-y-2">
					<h3 class="text-sm font-bold">Blaze of Glory:</h3>
					<p class="pl-6 text-xs text-muted-foreground">
						Your character embraces death and goes out in a blaze of glory. Take one final action. It
						automatically critically succeeds (with GM approval), and then you cross through the veil of
						death.
					</p>
				</div>

				<!-- Avoid Death -->
				<div class="space-y-2">
					<h3 class="text-sm font-bold">Avoid Death:</h3>
					<p class="pl-6 text-xs text-muted-foreground">
						Your character avoids death and faces the consequences. They temporarily drop unconscious, and
						then you work with the GM to describe how the situation worsens. While unconscious, your
						character can't move or act, and they can't be targeted by an attack. They return to
						consciousness when an ally clears 1 or more of their marked Hit Points or when the party
						finishes a long rest. After your character falls unconscious, roll your Hope Die. If its value
						is equal to or less than your character's level, they gain a scar: permanently cross out a
						Hope slot and work with the GM to determine its lasting narrative impact and how, if possible,
						it can be restored. If you ever cross out your last Hope slot, your character's journey ends.
					</p>
				</div>

				<!-- Risk It All -->
				<div class="space-y-2">
					<h3 class="text-sm font-bold">Risk It All:</h3>
					<p class="pl-6 text-xs text-muted-foreground">
						Roll your Duality Dice. If the Hope Die is higher, your character stays on their feet and
						clears a number of Hit Points or Stress equal to the value of the Hope Die (you can divide the
						Hope Die value between Hit Points and Stress however you'd prefer). If the Fear Die is higher,
						your character crosses through the veil of death. If the Duality Dice show matching results,
						your character stays up and clears all Hit Points and Stress.
					</p>
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
