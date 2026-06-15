<script lang="ts">
	import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark';
	import Info from '@lucide/svelte/icons/info';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import { Switch } from '$lib/components/ui/switch';
	import { getEncounterContext } from '$lib/state/encounters.svelte';
	import { cn } from '$lib/utils';

	let { class: className = '' }: { class?: string } = $props();

	const encounterCtx = getEncounterContext();

	const encounter = $derived(encounterCtx.encounter);
	const derived_battle_points = $derived(encounterCtx.derived_battle_points);

	let popoverOpen = $state(false);
	let dialogOpen = $state(false);
</script>

{#if encounter && derived_battle_points}
	<Dialog.Root bind:open={popoverOpen}>
		<Dialog.Trigger
			class={cn(
				'flex h-9 items-center gap-2 rounded-full border bg-background pr-3.5 pl-3 shadow hover:bg-background/80',
				className
			)}
		>
			<Info class="size-4" />

			<p class="text-sm font-medium text-nowrap">Battle Points</p>
			<div class="flex items-center gap-1">
				<p
					class={cn(
						'font-eveleth text-lg',
						derived_battle_points.difficulty === 'Easy' && 'text-emerald-400',
						derived_battle_points.difficulty === 'Normal' && 'text-foreground',
						derived_battle_points.difficulty === 'Hard' && 'text-accent',
						derived_battle_points.difficulty === 'Deadly' && 'text-destructive'
					)}
				>
					{derived_battle_points.battle_points_spent}
				</p>
				<span class="text-xs text-muted-foreground">/</span>
				<span class="font-eveleth text-xs text-muted-foreground"
					>{derived_battle_points.battle_points_budget}</span
				>
			</div>
		</Dialog.Trigger>

		<Dialog.Content
			/*side="bottom" sideOffset={4} align="end"*/ class="flex max-h-[90%] w-[320px] flex-col px-0"
		>
			<Dialog.Header class="px-6"
				><Dialog.Title>Battle Points Calculator</Dialog.Title></Dialog.Header
			>
			<div class="flex flex-col overflow-y-auto px-6">
				<div class="mt-1 mb-3 flex justify-around gap-2">
					<div class="flex h-8 items-center gap-1 rounded-full border bg-primary shadow">
						<Button
							variant="ghost"
							size="icon"
							class="size-8 rounded-l-full pl-1"
							disabled={encounter.encounter_tier <= 1}
							onclick={() => encounter.encounter_tier--}
						>
							<Minus class="size-3.5" />
						</Button>
						<span class="text-xs font-medium">Tier</span>
						<span class="w-2 text-center text-xs font-medium">{encounter.encounter_tier}</span>
						<Button
							variant="ghost"
							size="icon"
							class="size-8 rounded-r-full pr-1"
							disabled={encounter.encounter_tier >= 4}
							onclick={() => encounter.encounter_tier++}
						>
							<Plus class="size-3.5" />
						</Button>
					</div>

					<div class="flex h-8 items-center gap-1 rounded-full border bg-primary shadow">
						<Button
							variant="ghost"
							size="icon"
							class="size-8 rounded-l-full pl-1"
							disabled={encounter.number_of_players <= 1}
							onclick={() => encounter.number_of_players--}
						>
							<Minus class="size-3.5" />
						</Button>
						<span class="w-3 text-center text-xs font-medium">{encounter.number_of_players}</span>
						<span class="text-xs font-medium">Players</span>
						<Button
							variant="ghost"
							size="icon"
							class="size-8 rounded-r-full pr-1"
							disabled={encounter.number_of_players >= 12}
							onclick={() => encounter.number_of_players++}
						>
							<Plus class="size-3.5" />
						</Button>
					</div>
				</div>

				<div class="mt-4 mb-1.5 flex items-center justify-between border-b border-primary/40 pb-1">
					<p class="text-md font-bold">Budget</p>
					<p class="font-eveleth text-lg">{derived_battle_points.battle_points_budget}</p>
				</div>

				<div class="grid grid-cols-[1fr_auto] items-center gap-0.5 text-xs text-muted-foreground">
					<p>3 x Player count + 2</p>
					<p class="text-right font-eveleth text-sm">{encounter.number_of_players * 3 + 2}</p>

					{#if derived_battle_points.total_lower_tier_adversaries > 0}
						<p>+1 per lower tier adversary</p>
						<p class="text-right font-eveleth text-sm">
							+{derived_battle_points.total_lower_tier_adversaries}
						</p>
					{/if}

					{#if derived_battle_points.counts.Bruiser === 0 && derived_battle_points.counts.Horde === 0 && derived_battle_points.counts.Leader === 0 && derived_battle_points.counts.Solo === 0}
						<p>No Bruisers, Hordes, Leaders, or Solos</p>
						<p class="text-right font-eveleth text-sm">+1</p>
					{/if}

					{#if derived_battle_points.counts.Solo >= 2}
						<p>Two or more Solos</p>
						<p class="text-right font-eveleth text-sm">-2</p>
					{/if}

					<label
						class="mt-1 -ml-1 flex h-8 w-min cursor-pointer items-center gap-2 rounded-full bg-card px-3 text-xs text-nowrap text-foreground shadow"
					>
						Add 1d4 damage
						<Switch
							class="inline data-[state=unchecked]:bg-muted"
							bind:checked={encounter.bonus_damage}
						/>
					</label>
					<p class={cn('text-right font-eveleth text-sm', !encounter.bonus_damage && 'opacity-0')}>
						{encounter.bonus_damage ? -2 : 0}
					</p>

					<div
						class=" mt-1.5 -ml-1 flex h-8 w-min items-center gap-1 rounded-full bg-card text-xs font-medium text-nowrap text-foreground shadow"
					>
						<Button
							variant="ghost"
							size="icon"
							class="size-8 rounded-l-full pl-1"
							onclick={() => encounter.extra_battle_points--}
						>
							<Minus class="size-3.5 stroke-3" />
						</Button>
						Extra Battle Points
						<Button
							variant="ghost"
							size="icon"
							class="size-8 rounded-r-full pr-1"
							onclick={() => encounter.extra_battle_points++}
						>
							<Plus class="size-3.5 stroke-3" />
						</Button>
					</div>
					<p
						class={cn(
							'text-right font-eveleth text-sm',
							encounter.extra_battle_points === 0 && 'hidden'
						)}
					>
						{encounter.extra_battle_points > 0
							? `+${encounter.extra_battle_points}`
							: encounter.extra_battle_points}
					</p>
				</div>

				<div class="mt-6 mb-1.5 flex items-center justify-between border-b border-primary/40 pb-1">
					<p class="text-md font-bold">Battle Points Spent</p>
					<p class="font-eveleth text-lg">{derived_battle_points.battle_points_spent}</p>
				</div>

				<div class="grid grid-cols-[1fr_auto] items-center gap-0.5 text-xs text-muted-foreground">
					{#if derived_battle_points.minion_battle_points_spent > 0}
						{@const minion_points = derived_battle_points.minion_battle_points_spent}
						<p>{minion_points}x Group of Minions</p>
						<p class="text-right font-eveleth text-sm">{minion_points}</p>
					{/if}

					{#if derived_battle_points.counts.Social > 0 || derived_battle_points.counts.Support > 0}
						{@const count =
							derived_battle_points.counts.Social + derived_battle_points.counts.Support}
						<p>{count}x Social or Support</p>
						<p class="text-right font-eveleth text-sm">{count}</p>
					{/if}

					{#if derived_battle_points.counts.Horde > 0 || derived_battle_points.counts.Ranged > 0 || derived_battle_points.counts.Skulk > 0 || derived_battle_points.counts.Standard > 0}
						{@const count =
							derived_battle_points.counts.Horde +
							derived_battle_points.counts.Ranged +
							derived_battle_points.counts.Skulk +
							derived_battle_points.counts.Standard}
						<p>{count}x Hordes, Ranged, Skulks, or Standard</p>
						<p class="text-right font-eveleth text-sm">{2 * count}</p>
					{/if}

					{#if derived_battle_points.counts.Leader > 0}
						{@const count = derived_battle_points.counts.Leader}
						<p>{count}x Leaders</p>
						<p class="text-right font-eveleth text-sm">{count * 3}</p>
					{/if}

					{#if derived_battle_points.counts.Bruiser > 0}
						{@const count = derived_battle_points.counts.Bruiser}
						<p>{count}x Bruisers</p>
						<p class="text-right font-eveleth text-sm">{count * 4}</p>
					{/if}

					{#if derived_battle_points.counts.Solo > 0}
						{@const count = derived_battle_points.counts.Solo}
						<p>{count}x Solos</p>
						<p class="text-right font-eveleth text-sm">{count * 5}</p>
					{/if}
				</div>
			</div>

			<Dialog.Footer class="flex grow flex-row items-center justify-between gap-2 px-6">
				<Button
					variant="ghost"
					class="mr-auto size-8 rounded-full p-0"
					onclick={() => {
						popoverOpen = false;
						dialogOpen = true;
					}}
				>
					<CircleQuestionMark />
				</Button>
				<div
					class={cn(
						'flex items-center gap-3 rounded px-2 text-sm font-bold',
						derived_battle_points.difficulty === 'Easy' && 'bg-emerald-400/15 text-emerald-400',
						derived_battle_points.difficulty === 'Normal' && 'bg-foreground/10 text-foreground',
						derived_battle_points.difficulty === 'Hard' && 'bg-accent/15 text-accent',
						derived_battle_points.difficulty === 'Deadly' && 'bg-destructive/15 text-destructive'
					)}
				>
					{derived_battle_points.difficulty}
					<div class="flex items-center gap-1">
						<p
							class={cn(
								'font-eveleth text-lg',
								derived_battle_points.difficulty === 'Easy' && 'text-emerald-400',
								derived_battle_points.difficulty === 'Normal' && 'text-foreground',
								derived_battle_points.difficulty === 'Hard' && 'text-accent',
								derived_battle_points.difficulty === 'Deadly' && 'text-destructive'
							)}
						>
							{derived_battle_points.battle_points_spent}
						</p>
						<span class="text-xs text-muted-foreground">/</span>
						<span class="font-eveleth text-xs text-muted-foreground"
							>{derived_battle_points.battle_points_budget}</span
						>
					</div>
				</div>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Content class="flex max-h-[90%] flex-col px-0">
			<Dialog.Header class="px-6">
				<Dialog.Title>Building Balanced Encounters</Dialog.Title>
			</Dialog.Header>

			<div class="space-y-4 overflow-y-auto px-6 text-sm text-muted-foreground">
				<p class="italic">Environments do not affect your battle points.</p>

				<p>
					When planning a battle, start with
					<strong class="text-foreground">
						[(3 x the number of PCs in combat) + 2] Battle Points
					</strong>
					and make the following adjustments:
				</p>

				<ul class="space-y-1">
					<li><strong class="mr-1 text-foreground">-1</strong> for an easier or shorter fight</li>
					<li>
						<strong class="mr-1 text-foreground">-2</strong> if you're using 2 or more Solo adversaries
					</li>
					<li>
						<strong class="mr-1 text-foreground">-2</strong> if you add +1d4 (or a static +2) to all adversaries'
						damage rolls
					</li>
					<li>
						<strong class="mr-1 text-foreground">+1</strong> if you choose an adversary from a lower tier
					</li>
					<li>
						<strong class="mr-1 text-foreground">+1</strong> if you don't include any Bruisers, Hordes,
						Leaders, or Solos
					</li>
					<li><strong class="mr-1 text-foreground">+2</strong> for a harder or longer fight</li>
				</ul>

				<p>Then spend your Battle Points to add an adversary to the encounter:</p>

				<ul class="space-y-1">
					<li>
						<strong class="text-foreground">Spend 1 point</strong> for each group of Minions equal to
						the size of the party.
					</li>
					<li>
						<strong class="mr-1 text-foreground">Spend 1 point</strong> for each Social or Support adversary.
					</li>
					<li>
						<strong class="mr-1 text-foreground">Spend 2 points</strong> for each Horde, Ranged, Skulk,
						or Standard adversary.
					</li>
					<li>
						<strong class="mr-1 text-foreground">Spend 3 points</strong> for each Leader adversary.
					</li>
					<li>
						<strong class="mr-1 text-foreground">Spend 4 points</strong> for each Bruiser adversary.
					</li>
					<li>
						<strong class="mr-1 text-foreground">Spend 5 points</strong> for each Solo adversary.
					</li>
				</ul>
				<p class="mt-6 text-lg font-bold text-foreground">Difficulty</p>
				<p class="italic">
					When calculating difficulty, any "extra battle points" are ignored for the budget.
				</p>
				<ul class="space-y-1">
					<li>
						<strong class="rounded bg-emerald-400/15 px-1.5 py-0.5 text-xs text-emerald-400"
							>Easy</strong
						> if the total Battle Points spent is less than the budget.
					</li>
					<li>
						<strong class="rounded bg-foreground/10 px-1.5 py-0.5 text-xs text-foreground"
							>Normal</strong
						> if the total Battle Points spent equals the budget.
					</li>
					<li>
						<strong class="rounded bg-accent/15 px-1.5 py-0.5 text-xs text-accent">Hard</strong> if the
						total Battle Points spent exceeds the budget by 1 point.
					</li>
					<li>
						<strong class="rounded bg-destructive/15 px-1.5 py-0.5 text-xs text-destructive"
							>Deadly</strong
						> if the total Battle Points spent exceeds the budget by 2 or more points.
					</li>
				</ul>
			</div>

			<Dialog.Footer class="px-6">
				<Dialog.Close class={cn(buttonVariants({ variant: 'outline' }))}>Close</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
