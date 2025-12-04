<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Tent from '@lucide/svelte/icons/tent';
	import ClockFading from '@lucide/svelte/icons/clock-fading';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import DowntimeRules from '../../rules/downtime-rules.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	// Calculate tier from character level
	let tier = $derived.by(() => {
		if (!character) return 1;
		const tierStr = context.get_tier_from_level(character.level);
		return parseInt(tierStr);
	});

	let moreInfoOpen = $state(false);

	// Short Rest checkbox states
	let shortRestTendToWounds = $state(false);
	let shortRestClearStress = $state(false);
	let shortRestRepairArmor = $state(false);
	let shortRestPrepare = $state(false);

	// Long Rest checkbox states
	let longRestTendToAllWounds = $state(false);
	let longRestClearAllStress = $state(false);
	let longRestRepairAllArmor = $state(false);
	let longRestPrepare = $state(false);
	let longRestWorkOnProject = $state(false);

	// Count selected options for each rest type
	let shortRestSelectedCount = $derived.by(() => {
		return [
			shortRestTendToWounds,
			shortRestClearStress,
			shortRestRepairArmor,
			shortRestPrepare
		].filter(Boolean).length;
	});

	let longRestSelectedCount = $derived.by(() => {
		return [
			longRestTendToAllWounds,
			longRestClearAllStress,
			longRestRepairAllArmor,
			longRestPrepare,
			longRestWorkOnProject
		].filter(Boolean).length;
	});

	// Enable buttons when at least 1 option is selected
	let canTakeShortRest = $derived(shortRestSelectedCount >= 1);
	let canTakeLongRest = $derived(longRestSelectedCount >= 1);

	// Check if max selections reached for each rest type
	let shortRestMaxReached = $derived(shortRestSelectedCount >= context.max_short_rest_actions);
	let longRestMaxReached = $derived(longRestSelectedCount >= context.max_long_rest_actions);

	function takeShortRest() {
		// TODO: Implement short rest logic
		console.log('Taking short rest with:', {
			tendToWounds: shortRestTendToWounds,
			clearStress: shortRestClearStress,
			repairArmor: shortRestRepairArmor,
			prepare: shortRestPrepare
		});
		// Reset checkboxes after taking rest
		shortRestTendToWounds = false;
		shortRestClearStress = false;
		shortRestRepairArmor = false;
		shortRestPrepare = false;
	}

	function takeLongRest() {
		// TODO: Implement long rest logic
		console.log('Taking long rest with:', {
			tendToAllWounds: longRestTendToAllWounds,
			clearAllStress: longRestClearAllStress,
			repairAllArmor: longRestRepairAllArmor,
			prepare: longRestPrepare,
			workOnProject: longRestWorkOnProject
		});
		// Reset checkboxes after taking rest
		longRestTendToAllWounds = false;
		longRestClearAllStress = false;
		longRestRepairAllArmor = false;
		longRestPrepare = false;
		longRestWorkOnProject = false;
	}
</script>

<Sheet.Header>
	<Sheet.Title class="flex  gap-2">
		<Tent class="size-5" />
		Downtime
	</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	<!-- Short Rest Section -->
	<div class="space-y-2">
		<p class="text-sm font-bold">
			Short Rest
			<span class="ml-1 text-xs text-muted-foreground">
				({shortRestSelectedCount}/{context.max_short_rest_actions})
			</span>
		</p>

		<div
			class={cn('flex flex-col gap-3 rounded-xl border bg-primary-muted/30 p-3 text-sm text-wrap')}
		>
			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					shortRestTendToWounds && 'text-foreground',
					!shortRestMaxReached || shortRestTendToWounds
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={shortRestTendToWounds}
					disabled={shortRestMaxReached && !shortRestTendToWounds}
				/>
				<p>
					<span class="font-semibold">Tend to Wounds:</span>
					Clear 1d4+{tier} HP
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					shortRestClearStress && 'text-foreground',
					!shortRestMaxReached || shortRestClearStress
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={shortRestClearStress}
					disabled={shortRestMaxReached && !shortRestClearStress}
				/>
				<p>
					<span class="font-semibold">Clear Stress:</span>
					Clear 1d4+{tier} Stress
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					shortRestRepairArmor && 'text-foreground',
					!shortRestMaxReached || shortRestRepairArmor
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={shortRestRepairArmor}
					disabled={shortRestMaxReached && !shortRestRepairArmor}
				/>
				<p>
					<span class="font-semibold">Repair Armor:</span>
					Clear 1d4+{tier} Armor Slots
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					shortRestPrepare && 'text-foreground',
					!shortRestMaxReached || shortRestPrepare
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={shortRestPrepare}
					disabled={shortRestMaxReached && !shortRestPrepare}
				/>
				<p>
					<span class="font-semibold">Prepare:</span>
					Gain 1 Hope (2 if with party)
				</p>
			</Label>

			<Button
				onclick={takeShortRest}
				variant={canTakeShortRest ? 'default' : 'outline'}
				hidden={!canTakeShortRest}
				size="sm"
			>
				<ClockFading class="size-4" />
				Rest
			</Button>
		</div>
	</div>

	<!-- Long Rest Section -->
	<div class="space-y-2">
		<p class="text-sm font-bold">
			Long Rest
			<span class="ml-1 text-xs text-muted-foreground">
				({longRestSelectedCount}/{context.max_long_rest_actions})
			</span>
		</p>

		<div
			class={cn('flex flex-col gap-3 rounded-xl border bg-primary-muted/30 p-3 text-sm text-wrap')}
		>
			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					longRestTendToAllWounds && 'text-foreground',
					!longRestMaxReached || longRestTendToAllWounds
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={longRestTendToAllWounds}
					disabled={longRestMaxReached && !longRestTendToAllWounds}
				/>
				<p>
					<span class="font-semibold">Tend to All Wounds:</span>
					Clear all HP
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					longRestClearAllStress && 'text-foreground',
					!longRestMaxReached || longRestClearAllStress
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={longRestClearAllStress}
					disabled={longRestMaxReached && !longRestClearAllStress}
				/>
				<p>
					<span class="font-semibold">Clear All Stress:</span>
					Clear all Stress
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					longRestRepairAllArmor && 'text-foreground',
					!longRestMaxReached || longRestRepairAllArmor
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={longRestRepairAllArmor}
					disabled={longRestMaxReached && !longRestRepairAllArmor}
				/>
				<p>
					<span class="font-semibold">Repair All Armor:</span>
					Clear all Armor Slots
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					longRestPrepare && 'text-foreground',
					!longRestMaxReached || longRestPrepare
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={longRestPrepare}
					disabled={longRestMaxReached && !longRestPrepare}
				/>

				<p>
					<span class="font-semibold">Prepare:</span>
					Gain 1 Hope (2 if with party)
				</p>
			</Label>

			<Label
				class={cn(
					'text-xs font-normal text-muted-foreground',
					longRestWorkOnProject && 'text-foreground',
					!longRestMaxReached || longRestWorkOnProject
						? 'cursor-pointer'
						: 'cursor-not-allowed opacity-50'
				)}
			>
				<Checkbox
					bind:checked={longRestWorkOnProject}
					disabled={longRestMaxReached && !longRestWorkOnProject}
				/>
				<p>
					<span class="font-semibold">Work on a Project:</span>
					Advance a long-term project
				</p>
			</Label>

			<Button
				onclick={takeLongRest}
				variant={canTakeLongRest ? 'default' : 'outline'}
				hidden={!canTakeLongRest}
				size="sm"
			>
				<ClockFading class="size-4" />
				Rest
			</Button>
		</div>
	</div>

	<Collapsible.Root bind:open={moreInfoOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight class={cn('size-4 transition-transform', moreInfoOpen && 'rotate-90')} />
			<p class="text-sm font-medium">More info</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<DowntimeRules class="pt-2 pl-5" />
		</Collapsible.Content>
	</Collapsible.Root>
</div>
