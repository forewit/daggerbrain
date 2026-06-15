<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import { renderMarkdown, addBonusDamageDie } from '$lib/utils';
	import type { Adversary } from '@convex/schemas/compendium';
	import type { AdversaryInstance } from '@convex/schemas/encounters';
	import ConditionChip from '$lib/components/conditions/condition-chip.svelte';
	import RollButton from '$lib/components/dice/roll-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import DamageThresholds from '$lib/components/character-sheet/standalone/damage-thresholds.svelte';
	import Hp from '$lib/components/character-sheet/standalone/hp.svelte';
	import Stress from '$lib/components/character-sheet/standalone/stress.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Activity from '@lucide/svelte/icons/activity';
	import SimpleContainer from '$lib/components/character-sheet/embelishments/simple-container.svelte';

	let {
		adversary,
		class: className = '',
		disabled = false,
		instances = $bindable([]),
		addBonusDamage = false,
		enableMassiveDamage = false,
		onOpenConditions,
		movesOpen = $bindable(true),
		featuresOpen = $bindable(true),
		instanceOpenStates = $bindable([])
	}: {
		adversary: Adversary;
		class?: string;
		disabled?: boolean;
		instances?: AdversaryInstance[];
		addBonusDamage?: boolean;
		enableMassiveDamage?: boolean;
		onOpenConditions?: (instanceIndex: number) => void;
		movesOpen?: boolean;
		featuresOpen?: boolean;
		instanceOpenStates?: boolean[];
	} = $props();

	const damageDice = $derived(
		addBonusDamage
			? addBonusDamageDie(adversary.standard_attack.damage_dice)
			: adversary.standard_attack.damage_dice
	);
	$effect(() => {
		if (instances.length === 0) {
			instances.push({
				name: '',
				conditions: [],
				marked_hp: 0,
				marked_stress: 0
			});
		}

		if (instanceOpenStates.length !== instances.length) {
			instanceOpenStates = instances.map((_, index) => instanceOpenStates[index] ?? true);
		}
	});
</script>

<div
	class={cn(
		'flex max-w-[400px] min-w-[310px] flex-col gap-2 rounded-lg bg-background pt-3 pb-4',
		className
	)}
>
	<div class="flex gap-2 truncate overflow-visible px-3 font-eveleth">
		<div class="flex flex-wrap items-center gap-2 gap-y-0 truncate">
			<p class="truncate font-eveleth">{adversary.title}</p>
			<p class="text-xs text-muted-foreground italic">Tier {adversary.tier}</p>
		</div>

		<div
			class={cn(
				' ml-auto font-eveleth text-[11px] font-medium uppercase',
				'flex h-6 items-center rounded-lg bg-background px-2.5',
				adversary.type === 'Bruiser' && 'bg-red-950',
				adversary.type === 'Horde' && 'bg-sky-950',
				adversary.type === 'Leader' && 'bg-fuchsia-950',
				adversary.type === 'Minion' && 'bg-gray-800',
				adversary.type === 'Ranged' && 'bg-violet-950',
				adversary.type === 'Skulk' && 'bg-stone-800',
				adversary.type === 'Social' && 'bg-teal-950',
				adversary.type === 'Solo' && 'bg-rose-900/50',
				adversary.type === 'Standard' && 'bg-primary/40',
				adversary.type === 'Support' && 'bg-lime-950'
			)}
		>
			{adversary.type}
		</div>
	</div>

	<div class=" flex gap-3 px-3">
		{#if adversary.image_url && adversary.image_url !== '/images/art/placeholder-art.webp'}
			<div class="max-h-24 min-h-24 max-w-24 min-w-24 overflow-hidden rounded-lg">
				<img src={adversary.image_url} alt={adversary.title} class="h-full object-cover" />
			</div>
		{/if}

		<div class="flex flex-col gap-3">
			{#if adversary.description}
				<div class="text-xs text-muted-foreground italic">
					{adversary.description}
				</div>
			{/if}

			<div class="mr-auto flex items-center gap-2 rounded-lg bg-muted-foreground px-2.5 py-0.5">
				<p class="text-[11px] font-bold text-background">DIFFICULTY</p>
				<p class="text-sm font-bold text-background">{adversary.difficulty}</p>
			</div>
		</div>
	</div>

	<Collapsible.Root bind:open={movesOpen} class="mt-2">
		<Collapsible.Trigger
			class="flex w-full items-center gap-1.5 border-y bg-primary-muted/30 px-3 py-2 text-left text-muted-foreground"
		>
			<ChevronRight class={cn('size-4 shrink-0 transition-transform', movesOpen && 'rotate-90')} />
			<p class="text-sm font-medium">Moves & Tactics</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="flex flex-col gap-2 px-3 pt-5 pb-2">
				{#if adversary.motives_tactics}
					<p class="text-xs">
						<span class="font-medium text-nowrap text-foreground">Motives & Tactics:</span>
						<span class="text-muted-foreground italic">{adversary.motives_tactics}</span>
					</p>
				{/if}

				<div class="justify- flex flex-wrap items-center gap-3 text-xs">
					<div class="flex items-center gap-2">
						<span class="font-medium">{adversary.standard_attack.name}:</span>
						<RollButton type="gm" modifier={adversary.attack_modifier} {disabled} />
					</div>
					<div class="flex items-center gap-2">
						<span class="text-muted-foreground italic">{adversary.standard_attack.range}</span>
						<RollButton
							type="base"
							diceString={damageDice}
							{disabled}
							modifier={adversary.standard_attack.damage_bonus}
							damageType={adversary.standard_attack.damage_type}
						/>
					</div>
				</div>

				{#each adversary.experiences as e, i}
					<div class="flex items-center gap-2">
						<p class="text-xs font-medium">{e}:</p>
						<RollButton {disabled} type="gm" modifier={adversary.experience_modifiers[i] ?? 0} />
					</div>
				{/each}
			</div>
			{#if adversary.type !== 'Minion'}
				<div class={cn('mx-auto my-1 w-[310px]', enableMassiveDamage && 'mb-8')}>
					<DamageThresholds
						thresholds={adversary.thresholds}
						massive_damage={enableMassiveDamage}
						class="origin-left translate-x-0.5 scale-85 "
					/>
				</div>
			{/if}
		</Collapsible.Content>
	</Collapsible.Root>

	{#if adversary.features.length > 0}
		<Collapsible.Root bind:open={featuresOpen}>
			<Collapsible.Trigger
				class="flex w-full items-center gap-1.5 border-y bg-primary-muted/30 px-3 py-2 text-left text-muted-foreground"
			>
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', featuresOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Features</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2 px-3 pt-4">
				{#each adversary.features as f}
					<div class="mb-1 flex flex-col gap-2">
						<p class=" flex items-center gap-2 text-sm font-medium">
							{f.name}
							{f.max_uses ? `(${f.max_uses})` : ''}
							<span
								class={cn(
									'rounded bg-primary-muted px-1.5 py-0.5 text-[10px] font-normal',
									f.type === 'Action' && 'bg-accent/10 text-accent',
									f.type === 'Reaction' && 'bg-sky-300/15 text-sky-300',
									f.type === 'Passive' && 'bg-primary/30 text-violet-300'
								)}>{f.type}</span
							>
						</p>

						<div class="ml-2 flex flex-col gap-2 text-xs text-muted-foreground [&_li]:mt-1">
							{@html renderMarkdown(f.description_html)}
						</div>
					</div>
				{/each}
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	{#each instances as instance, i}
		{@const number_label = instances.length > 1 ? ` #${i + 1}` : ''}
		{#if instanceOpenStates[i] !== undefined}
			<Collapsible.Root bind:open={instanceOpenStates[i]}>
				<div
					class={cn(
						adversary.max_hp > 0 && instance.marked_hp === adversary.max_hp && 'opacity-50'
					)}
				>
					<div
						class={cn(
							'bg- flex h-10 items-center border-y bg-primary-muted/30 py-2 pr-3 text-sm font-medium italic'
						)}
					>
						<Collapsible.Trigger class="h-full pr-2 pl-3 text-muted-foreground">
							<ChevronRight
								class={cn(
									'size-4 shrink-0 transition-transform',
									instanceOpenStates[i] && 'rotate-90'
								)}
							/>
						</Collapsible.Trigger>
						<!-- {#if adversary.max_hp > 0 && instance.marked_hp === adversary.max_hp}
								<p class="-mr-2 text-sm leading-none font-medium text-muted-foreground">(Dead)</p>
							{/if} -->
						<Input
							style="box-shadow: none;"
							bind:value={instance.name}
							{disabled}
							placeholder={instance.name.trim() === ''
								? adversary.title + number_label
								: instance.name}
							class={cn(
								'h-8 border-none bg-transparent pl-2 text-muted-foreground',
								disabled && 'pointer-events-none'
							)}
						/>

						{#if adversary.max_hp > 0 && instance.marked_hp === adversary.max_hp}
							<p class="pr-2 text-xs leading-none font-medium text-muted-foreground">(Dead)</p>
						{:else}
							<Button
								variant="ghost"
								{disabled}
								class="size-7 shrink-0 gap-1 px-2 text-muted-foreground not-italic"
								onclick={() => {
									onOpenConditions?.(i);
								}}
							>
								<Activity />
							</Button>
						{/if}
					</div>
					<Collapsible.Content
						class={cn(
							'mt-4 mb-2 flex flex-col gap-4',
							adversary.max_hp > 0 && instance.marked_hp === adversary.max_hp && 'opacity-50'
						)}
					>
						{#if instance.conditions.filter((c) => c.enabled).length > 0}
							<div class="flex flex-wrap items-center justify-center gap-1">
								{#each instance.conditions.filter((condition) => condition.enabled) as conditionId}
									{@const condition = conditionId}
									<button
										class="group h-auto rounded-full"
										onclick={() => {
											instance.conditions = instance.conditions.filter(
												(c) => c.name !== condition.name
											);
										}}
									>
										<ConditionChip
											{condition}
											class="pointer-events-none group-hover:bg-primary/20"
										/>
									</button>
								{/each}
							</div>
						{/if}
						<div class="flex flex-wrap justify-evenly gap-3">
							<Hp max={adversary.max_hp} bind:marked={instance.marked_hp} {disabled} />
							<Stress max={adversary.max_stress} bind:marked={instance.marked_stress} {disabled} />
						</div>
					</Collapsible.Content>
				</div>
			</Collapsible.Root>
		{/if}
	{/each}
</div>
