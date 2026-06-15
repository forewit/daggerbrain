<script lang="ts">
	import type { DeathMoveId } from '@convex/schemas/characters';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Button from '$lib/components/ui/button/button.svelte';
	import DeathMoveRules from '$lib/components/rule-snippets/death-move-rules.svelte';
	import Hp from '$lib/components/character-sheet/standalone/hp.svelte';
	import Stress from '$lib/components/character-sheet/standalone/stress.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getDiceContext } from '$lib/state/dice.svelte';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Skull from '@lucide/svelte/icons/skull';
	import { Confetti } from 'svelte-confetti';
	import { fade, slide } from 'svelte/transition';

	let {
		open = false,
		isDead: initialIsDead = false,
		onClear
	}: {
		open?: boolean;
		isDead?: boolean;
		onClear?: () => void;
	} = $props();

	type RiskItAllOutcome = 'hope' | 'fear' | 'critical';

	type MoveCard = {
		id: DeathMoveId;
		title: string;
		description: string;
	};

	const characterCtx = getCharacterContext();
	const diceCtx = getDiceContext();
	const DICE_Z_INDEX = '60';

	const deathMoves: MoveCard[] = [
		{
			id: 'blaze_of_glory',
			title: 'Blaze of Glory',
			description:
				'Take one final action that automatically critically succeeds, then cross through the veil of death.'
		},
		{
			id: 'avoid_death',
			title: 'Avoid Death',
			description:
				'Drop unconscious temporarily, then roll your Hope Die. If it is less than or equal to your level, gain a scar.'
		},
		{
			id: 'risk_it_all',
			title: 'Risk It All',
			description:
				'Roll Duality Dice. Hope higher: clear HP or Stress equal to the Hope Die. Fear higher: death. Matching results: clear all HP and Stress.'
		}
	];

	const deathMoveLabels: Record<DeathMoveId, string> = {
		blaze_of_glory: 'Blaze of Glory',
		avoid_death: 'Avoid Death',
		risk_it_all: 'Risk It All'
	};

	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const isDead = $derived(initialIsDead || Boolean(character?.death_state?.is_dead));
	const maxHope = $derived(derived_character_data?.max_hope ?? 0);
	const totalHopeSlots = $derived(maxHope + (character?.scars ?? 0));
	const canEdit = $derived(characterCtx.canEdit);

	let moreInfoOpen = $state(false);
	let selectedDeathMove = $state<DeathMoveId | null>(null);
	let rollingMove = $state<DeathMoveId | null>(null);
	let hasDiceLayerOverride = $state(false);
	let pendingFatalMove = $state<DeathMoveId | null>(null);
	let pendingFatalScarCount = $state<number | null>(null);
	let pendingRiskAllocationTotal = $state<number | null>(null);
	let pendingRiskRolledHope = $state<number | null>(null);
	let riskHpAllocation = $state(0);
	let riskStressAllocation = $state(0);
	let avoidDeathOutcome = $state<{ hope: number; scarDelta: number; becomesDead: boolean } | null>(
		null
	);
	let riskItAllOutcome = $state<{ hope: number; fear: number; result: RiskItAllOutcome } | null>(
		null
	);

	const remainingRiskAllocation = $derived.by(() => {
		if (pendingRiskAllocationTotal === null) return 0;
		return Math.max(0, pendingRiskAllocationTotal - riskHpAllocation - riskStressAllocation);
	});

	const maxRiskHpAllocation = $derived.by(() => {
		if (!character) return 0;
		return character.marked_hp;
	});

	const maxRiskStressAllocation = $derived.by(() => {
		if (!character) return 0;
		return character.marked_stress;
	});

	const riskPreviewMarkedHp = $derived.by(() => {
		if (!character) return 0;
		return Math.max(0, character.marked_hp - riskHpAllocation);
	});

	const riskPreviewMarkedStress = $derived.by(() => {
		if (!character) return 0;
		return Math.max(0, character.marked_stress - riskStressAllocation);
	});

	$effect(() => {
		if (!character?.death_state?.is_dead) return;
		selectedDeathMove = character.death_state.death_move;
	});

	$effect(() => {
		if (!isDead) return;
		rollingMove = null;
		pendingFatalMove = null;
		pendingFatalScarCount = null;
		pendingRiskAllocationTotal = null;
		pendingRiskRolledHope = null;
		riskHpAllocation = 0;
		riskStressAllocation = 0;
	});

	$effect(() => {
		if (diceCtx.diceOnScreen) return;
		if (!hasDiceLayerOverride) return;

		diceCtx.setLayerZIndexOverride(null);
		hasDiceLayerOverride = false;
	});

	$effect(() => {
		if (open) return;
		if (!hasDiceLayerOverride) return;

		diceCtx.setLayerZIndexOverride(null);
		hasDiceLayerOverride = false;
		if (diceCtx.isRolling) {
			diceCtx.cancelActiveRoll();
			return;
		}
		diceCtx.fadeDisplayedDiceNow();
	});

	$effect(() => {
		const unsubscribe = diceCtx.onRollEnd((roll) => {
			if (rollingMove === null) return;

			if (rollingMove === 'avoid_death') {
				const hopeDie = roll.dice.find((die) => die.type === 'hope' && die.result !== undefined);
				rollingMove = null;
				if (!hopeDie?.result) return;
				resolveAvoidDeath(hopeDie.result);
				return;
			}

			const hopeDie = roll.dice.find((die) => die.type === 'hope' && die.result !== undefined);
			const fearDie = roll.dice.find((die) => die.type === 'fear' && die.result !== undefined);
			rollingMove = null;

			if (!hopeDie?.result || !fearDie?.result) return;
			resolveRiskItAll(hopeDie.result, fearDie.result);
		});

		return unsubscribe;
	});

	$effect(() => {
		if (diceCtx.isRolling) return;
		if (diceCtx.diceOnScreen) return;
		if (rollingMove === null) return;

		rollingMove = null;
	});

	function resetTransientState() {
		rollingMove = null;
		pendingFatalMove = null;
		pendingFatalScarCount = null;
		pendingRiskAllocationTotal = null;
		pendingRiskRolledHope = null;
		riskHpAllocation = 0;
		riskStressAllocation = 0;
		avoidDeathOutcome = null;
		riskItAllOutcome = null;
	}

	function selectDeathMove(moveId: DeathMoveId) {
		if (!canEdit || isDead) return;

		resetTransientState();
		selectedDeathMove = selectedDeathMove === moveId ? null : moveId;
	}

	function prepareRoll(moveId: DeathMoveId) {
		if (!character || !canEdit || isDead) return false;
		if (rollingMove !== null) return false;

		resetTransientState();
		selectedDeathMove = moveId;
		rollingMove = moveId;
		if (!hasDiceLayerOverride) {
			diceCtx.setLayerZIndexOverride(DICE_Z_INDEX);
			hasDiceLayerOverride = true;
		}
		return true;
	}

	async function rollAvoidDeath() {
		if (!prepareRoll('avoid_death')) return;
		await diceCtx.roll({
			name: 'Avoid Death',
			dice: [{ type: 'hope' }]
		});
	}

	async function rollRiskItAll() {
		if (!prepareRoll('risk_it_all')) return;
		await diceCtx.roll({
			name: 'Risk It All',
			dice: [{ type: 'hope' }, { type: 'fear' }]
		});
	}

	function markDead(moveId: DeathMoveId) {
		if (!character) return;

		character.death_state = {
			is_dead: true,
			death_move: moveId
		};
		selectedDeathMove = moveId;
		resetTransientState();
		onClear?.();
	}

	function closeSheet() {
		resetTransientState();
		onClear?.();
	}

	function confirmFatalOutcome() {
		if (!character || pendingFatalMove === null) return;
		if (pendingFatalMove === 'avoid_death' && pendingFatalScarCount !== null) {
			while (character.scars < pendingFatalScarCount) {
				characterCtx.addScar();
			}
			while (character.scars > pendingFatalScarCount) {
				characterCtx.removeScar();
			}
		}
		markDead(pendingFatalMove);
	}

	function resolveAvoidDeath(hopeResult: number) {
		if (!character) return;

		const gainsScar = hopeResult <= character.level;
		if (!gainsScar) {
			avoidDeathOutcome = { hope: hopeResult, scarDelta: 0, becomesDead: false };
			return;
		}

		const nextScars =
			totalHopeSlots > 0 ? Math.min(totalHopeSlots, character.scars + 1) : character.scars + 1;
		const becomesDead = totalHopeSlots > 0 && nextScars >= totalHopeSlots;
		avoidDeathOutcome = { hope: hopeResult, scarDelta: 1, becomesDead };

		if (becomesDead) {
			pendingFatalMove = 'avoid_death';
			pendingFatalScarCount = nextScars;
			return;
		}
	}

	function applyAvoidDeathScar() {
		if (!character || !avoidDeathOutcome || avoidDeathOutcome.scarDelta !== 1) return;
		if (avoidDeathOutcome.becomesDead) return;

		characterCtx.addScar();
		closeSheet();
	}

	function applyRiskCriticalSuccess() {
		if (!character || riskItAllOutcome?.result !== 'critical') return;

		character.marked_hp = 0;
		character.marked_stress = 0;
		closeSheet();
	}

	function resolveRiskItAll(hopeResult: number, fearResult: number) {
		if (!character) return;

		if (hopeResult === fearResult) {
			riskItAllOutcome = { hope: hopeResult, fear: fearResult, result: 'critical' };
			return;
		}

		if (fearResult > hopeResult) {
			riskItAllOutcome = { hope: hopeResult, fear: fearResult, result: 'fear' };
			pendingFatalMove = 'risk_it_all';
			return;
		}

		riskItAllOutcome = { hope: hopeResult, fear: fearResult, result: 'hope' };
		const allocatableTotal = Math.min(hopeResult, character.marked_hp + character.marked_stress);

		if (allocatableTotal <= 0) return;

		pendingRiskRolledHope = hopeResult;
		pendingRiskAllocationTotal = allocatableTotal;
		riskHpAllocation = 0;
		riskStressAllocation = 0;
	}

	function adjustRiskAllocation(resource: 'hp' | 'stress', delta: number) {
		if (pendingRiskAllocationTotal === null || delta === 0) return;

		if (resource === 'hp') {
			if (delta > 0) {
				if (remainingRiskAllocation <= 0 || riskHpAllocation >= maxRiskHpAllocation) return;
				riskHpAllocation += 1;
				return;
			}

			if (riskHpAllocation <= 0) return;
			riskHpAllocation -= 1;
			return;
		}

		if (delta > 0) {
			if (remainingRiskAllocation <= 0 || riskStressAllocation >= maxRiskStressAllocation) return;
			riskStressAllocation += 1;
			return;
		}

		if (riskStressAllocation <= 0) return;
		riskStressAllocation -= 1;
	}

	function applyRiskAllocation() {
		if (!character || pendingRiskAllocationTotal === null) return;

		const nextHp = Math.max(0, character.marked_hp - riskHpAllocation);
		const nextStress = Math.max(0, character.marked_stress - riskStressAllocation);
		character.marked_hp = nextHp;
		character.marked_stress = nextStress;

		closeSheet();
	}
</script>

<Sheet.Header>
	<Sheet.Title class="flex gap-2">Death Move</Sheet.Title>
</Sheet.Header>

{#if character}
	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		<div out:fade={{ duration: 200 }} in:fade={{ delay: 200 }}>
			<div class="space-y-3">
				<p class="text-sm font-bold">Choose One</p>

				<div class="flex flex-col gap-3">
					{#each deathMoves as move (move.id)}
						<button
							type="button"
							class={cn(
								'group relative overflow-hidden rounded-xl border text-left text-sm transition-all duration-400',
								selectedDeathMove === move.id
									? 'border-primary bg-primary/15'
									: 'border-border bg-primary/5 hover:border-primary/40 hover:bg-primary/10',
								(!canEdit || isDead) && 'cursor-default opacity-80'
							)}
							onclick={() => selectDeathMove(move.id)}
							disabled={!canEdit || isDead}
						>
							<div
								class={cn(
									'relative p-4 transition-all duration-400',
									selectedDeathMove !== move.id &&
										selectedDeathMove !== null &&
										'border-muted-foreground opacity-50 hover:opacity-100',
									selectedDeathMove === move.id && 'scale-103'
								)}
							>
								<p class="font-semibold">{move.title}</p>
								<p class="mt-1 text-xs text-muted-foreground">{move.description}</p>
								<div
									class={cn(
										'blaze-sparks pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0',
										selectedDeathMove === move.id && 'opacity-75'
									)}
								>
									<Confetti
										amount={42}
										size={6}
										x={[-0.14, 0.14]}
										y={[-0.5, 0.5]}
										delay={[0, 2200]}
										duration={2600}
										fallDistance="0px"
										rounded
										noGravity
										infinite
										xSpread={0.5}
										disableForReducedMotion
										colorArray={['#ffd76a', '#ffb347', '#ff8a3d', '#ff6b2c', '#fff1b5']}
									/>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

			{#if selectedDeathMove !== null}
				<div transition:fade class="mt-8 flex flex-col gap-3">
					<p class="text-sm font-bold">Then</p>
					{#if selectedDeathMove === 'blaze_of_glory'}
						<div class="space-y-3 rounded-xl border border-primary bg-primary-muted p-3 text-sm">
							<p class="text-xs text-muted-foreground">
								Choose this when the character accepts death after one final critical success.
							</p>
							<Button onclick={() => markDead('blaze_of_glory')} disabled={!canEdit || isDead}>
								Die in a Blaze of Glory
							</Button>
						</div>
					{/if}

					{#if selectedDeathMove === 'avoid_death'}
						<div class="space-y-3 rounded-xl border border-primary bg-primary-muted p-3 text-sm">
							<p class="text-xs text-muted-foreground">
								Roll your Hope Die. On a result less than or equal to {character?.level ?? 0}, gain
								a scar.
							</p>

							<Button
								onclick={rollAvoidDeath}
								disabled={!canEdit || isDead || rollingMove !== null}
							>
								Roll Hope Die
							</Button>

							{#if avoidDeathOutcome}
								<div
									transition:slide
									class="flex items-start justify-between gap-3 rounded-lg border bg-background/80 p-3 text-xs text-muted-foreground"
								>
									<div>
										<p class="font-semibold text-foreground">Hope: {avoidDeathOutcome.hope}</p>
										{#if avoidDeathOutcome.scarDelta === 0}
											<p>Your journey continues.</p>
										{:else if avoidDeathOutcome.becomesDead}
											<p>This scar would cross out the last Hope slot.</p>
										{:else}
											<p>You will remember this forever.</p>
										{/if}
									</div>
									{#if pendingFatalMove !== 'avoid_death'}
										<div class="flex justify-end">
											{#if avoidDeathOutcome.scarDelta === 0}
												<Button size="sm" onclick={closeSheet}>Close</Button>
											{:else}
												<Button size="sm" onclick={applyAvoidDeathScar}>Gain a Scar</Button>
											{/if}
										</div>
									{/if}
								</div>
							{/if}

							{#if pendingFatalMove === 'avoid_death'}
								<div class="rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-xs">
									<p class="font-semibold text-destructive">Final Hope slot crossed out</p>
									<p class="mt-1 text-muted-foreground">
										Confirm to apply the scar and persist this character as dead.
									</p>
									<div class="mt-3 flex gap-2">
										<Button variant="destructive" size="sm" onclick={confirmFatalOutcome}
											>Confirm Death</Button
										>
										<Button variant="outline" size="sm" onclick={resetTransientState}>Cancel</Button
										>
									</div>
								</div>
							{/if}
						</div>
					{/if}

					{#if selectedDeathMove === 'risk_it_all'}
						<div class="space-y-3 rounded-xl border border-primary bg-primary-muted p-3 text-sm">
							<p class="text-xs text-muted-foreground">
								Roll Duality Dice to see whether Hope, Fear, or matching results decide the outcome.
							</p>

							<Button onclick={rollRiskItAll} disabled={!canEdit || isDead || rollingMove !== null}>
								Roll Duality Dice
							</Button>

							{#if riskItAllOutcome}
								<div
									transition:slide
									class="flex items-start justify-between gap-3 rounded-lg border bg-background/80 p-3 text-xs text-muted-foreground"
								>
									<div>
										<p class="font-semibold text-foreground">
											Hope {riskItAllOutcome.hope} vs Fear {riskItAllOutcome.fear}
										</p>
										{#if riskItAllOutcome.result === 'critical'}
											<p>Critical Success!</p>
										{:else if riskItAllOutcome.result === 'fear'}
											<p>Fear has won</p>
										{:else}
											<p>Hope has won!</p>
										{/if}
									</div>
									{#if riskItAllOutcome.result === 'critical'}
										<div class="flex justify-end">
											<Button size="sm" onclick={applyRiskCriticalSuccess}>Clear HP + Stress</Button
											>
										</div>
									{/if}
									{#if pendingFatalMove === 'risk_it_all'}
										<div class="flex justify-end">
											<Button variant="destructive" size="sm" onclick={confirmFatalOutcome}
												>Confirm Death</Button
											>
										</div>
									{/if}
								</div>
							{/if}

							{#if pendingRiskAllocationTotal !== null}
								<div class="space-y-3 rounded-lg border bg-background/80 p-3 text-xs">
									<div class="flex items-start justify-between gap-3">
										<div class="space-y-1">
											<p class="font-semibold text-foreground">
												Clear up to {pendingRiskRolledHope} HP or Stress
											</p>
										</div>
									</div>

									<div class="grid gap-3">
										<div class="">
											<div class="flex items-center gap-3">
												<Hp
													class="flex-1 flex-col gap-y-2 opacity-70 *:justify-center sm:flex-row sm:*:justify-start"
													disabled
													max={derived_character_data?.max_hp ?? 0}
													marked={riskPreviewMarkedHp}
												/>

												<div class="flex items-center">
													<Button
														variant="outline"
														size="sm"
														onclick={() => adjustRiskAllocation('hp', -1)}
														disabled={riskHpAllocation <= 0}
													>
														-
													</Button>
													<p class="w-8 text-center font-eveleth text-sm">{riskHpAllocation}</p>

													<Button
														variant="outline"
														size="sm"
														onclick={() => adjustRiskAllocation('hp', 1)}
														disabled={remainingRiskAllocation <= 0 ||
															riskHpAllocation >= maxRiskHpAllocation}
													>
														+
													</Button>
												</div>
											</div>
										</div>

										<div class="">
											<div class="flex items-center gap-2">
												<Stress
													class="flex-1 flex-col gap-y-2 opacity-70 *:justify-center sm:flex-row sm:*:justify-start"
													disabled
													max={derived_character_data?.max_stress ?? 0}
													marked={riskPreviewMarkedStress}
												/>

												<div class="flex items-center">
													<Button
														variant="outline"
														size="sm"
														onclick={() => adjustRiskAllocation('stress', -1)}
														disabled={riskStressAllocation <= 0}
													>
														-
													</Button>
													<p class="w-8 text-center font-eveleth text-sm">{riskStressAllocation}</p>
													<Button
														variant="outline"
														size="sm"
														onclick={() => adjustRiskAllocation('stress', 1)}
														disabled={remainingRiskAllocation <= 0 ||
															riskStressAllocation >= maxRiskStressAllocation}
													>
														+
													</Button>
												</div>
											</div>
										</div>
									</div>

									<div class="flex gap-2">
										<Button
											size="sm"
											onclick={applyRiskAllocation}
											disabled={riskStressAllocation <= 0 && riskHpAllocation <= 0}
										>
											Apply Healing
										</Button>
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- <Collapsible.Root bind:open={moreInfoOpen} class="pt-8">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight class={cn('size-4 transition-transform', moreInfoOpen && 'rotate-90')} />
				<p class="text-sm font-medium">More info</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<DeathMoveRules class="pt-2 pl-5" />
			</Collapsible.Content>
		</Collapsible.Root> -->
	</div>
{/if}

<style>
	.blaze-sparks :global(.confetti-holder) {
		width: 100%;
		height: 100%;
	}

	.blaze-sparks :global(.confetti) {
		top: auto;
		bottom: -0.25rem;
	}

	.blaze-sparks :global(.confetti:nth-child(6n + 1)) {
		left: 6%;
	}

	.blaze-sparks :global(.confetti:nth-child(6n + 2)) {
		left: 24%;
	}

	.blaze-sparks :global(.confetti:nth-child(6n + 3)) {
		left: 41%;
	}

	.blaze-sparks :global(.confetti:nth-child(6n + 4)) {
		left: 58%;
	}

	.blaze-sparks :global(.confetti:nth-child(6n + 5)) {
		left: 76%;
	}

	.blaze-sparks :global(.confetti:nth-child(6n)) {
		left: 94%;
	}
</style>
