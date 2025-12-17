<script lang="ts">
	import type {
		CharacterModifier,
		CharacterCondition,
		DomainIds,
		TraitIds
	} from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import HomebrewCharacterConditionEditor from './homebrew-character-condition-editor.svelte';
	import { cn, capitalize } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import Search from '@lucide/svelte/icons/search';

	let { modifier = $bindable() }: { modifier: CharacterModifier } = $props();

	const compendium = getCompendiumContext();

	// Behaviour options
	const behaviourOptions = ['bonus', 'base', 'override'] as const;

	// Type options
	const typeOptions = [
		'derived_from_trait',
		'flat',
		'derived_from_proficiency',
		'derived_from_level'
	] as const;

	// Target options (simple enum targets)
	const simpleTargetOptions = [
		'evasion',
		'max_hp',
		'max_stress',
		'max_experiences',
		'major_damage_threshold',
		'severe_damage_threshold',
		'primary_class_mastery_level',
		'secondary_class_mastery_level',
		'max_loadout',
		'max_hope',
		'proficiency',
		'max_armor',
		'max_burden',
		'spellcast_roll_bonus',
		'max_short_rest_actions',
		'max_long_rest_actions'
	] as const;

	// Trait options
	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	// Domain options
	const domainOptions: DomainIds[] = [
		'arcana',
		'blade',
		'bone',
		'codex',
		'grace',
		'midnight',
		'sage',
		'splendor',
		'valor'
	];

	let isOpen = $state(false);
	let conditionEditorsOpen = $state<Record<number, boolean>>({});

	// Search state for domain cards
	let domainCardSearch = $state('');

	// Get all domain cards flattened
	let allDomainCards = $derived(
		Object.values(compendium.domain_cards).flatMap((domainCards) => Object.values(domainCards))
	);

	// Filtered domain cards
	let filteredDomainCards = $derived(
		allDomainCards.filter((card) => {
			if (!domainCardSearch) return true;
			const searchLower = domainCardSearch.toLowerCase();
			return (
				card.title.toLowerCase().includes(searchLower) ||
				card.compendium_id.toLowerCase().includes(searchLower)
			);
		})
	);

	// Get current type
	let currentType = $derived(modifier.type || 'flat');

	// Get current target
	let currentTarget = $derived(modifier.target || 'evasion');

	// Initialize modifier if needed
	$effect(() => {
		if (!modifier) {
			modifier = {
				behaviour: 'bonus',
				character_conditions: [],
				type: 'flat',
				value: 0,
				target: 'evasion'
			};
		}
	});

	// Update type
	function updateType(newType: string) {
		// Preserve base properties
		const baseProps = {
			behaviour: modifier.behaviour,
			character_conditions: modifier.character_conditions,
			target: modifier.target
		};

		// Set type-specific properties
		if (newType === 'derived_from_trait') {
			modifier = {
				...baseProps,
				type: 'derived_from_trait',
				trait: 'agility',
				multiplier: 1
			} as CharacterModifier;
		} else if (newType === 'flat') {
			modifier = {
				...baseProps,
				type: 'flat',
				value: 0
			} as CharacterModifier;
		} else if (newType === 'derived_from_proficiency') {
			modifier = {
				...baseProps,
				type: 'derived_from_proficiency',
				multiplier: 1
			} as CharacterModifier;
		} else if (newType === 'derived_from_level') {
			modifier = {
				...baseProps,
				type: 'derived_from_level',
				multiplier: 1
			} as CharacterModifier;
		}
	}

	// Update target
	function updateTarget(newTarget: string) {
		// Preserve base properties
		const baseProps = {
			behaviour: modifier.behaviour,
			character_conditions: modifier.character_conditions,
			type: modifier.type
		};

		// Preserve type-specific properties
		const typeProps: any = {};
		if (modifier.type === 'derived_from_trait') {
			typeProps.trait = modifier.trait;
			typeProps.multiplier = modifier.multiplier;
		} else if (modifier.type === 'flat') {
			typeProps.value = modifier.value;
		} else if (modifier.type === 'derived_from_proficiency' || modifier.type === 'derived_from_level') {
			typeProps.multiplier = modifier.multiplier;
		}

		// Set target-specific properties
		if (newTarget === 'trait') {
			modifier = {
				...baseProps,
				...typeProps,
				target: 'trait',
				trait: 'agility'
			} as CharacterModifier;
		} else if (newTarget === 'experience_from_domain_card_choice_selection') {
			modifier = {
				...baseProps,
				...typeProps,
				target: 'experience_from_domain_card_choice_selection',
				domain_card_id: '',
				choice_id: ''
			} as CharacterModifier;
		} else if (newTarget === 'experience_from_ancestry_card_choice_selection') {
			modifier = {
				...baseProps,
				...typeProps,
				target: 'experience_from_ancestry_card_choice_selection',
				choice_id: ''
			} as CharacterModifier;
		} else {
			// Simple target
			modifier = {
				...baseProps,
				...typeProps,
				target: newTarget as any
			} as CharacterModifier;
		}
	}

	// Add condition
	function addCondition() {
		const newCondition: CharacterCondition = {
			type: 'armor_equipped',
			value: false
		};
		modifier = {
			...modifier,
			character_conditions: [...modifier.character_conditions, newCondition]
		};
	}

	// Remove condition
	function removeCondition(index: number) {
		modifier = {
			...modifier,
			character_conditions: modifier.character_conditions.filter((_, i) => i !== index)
		};
	}

	// Get domain name helper
	function getDomainName(domainId: DomainIds): string {
		return (
			compendium.domains[domainId]?.name || domainId.charAt(0).toUpperCase() + domainId.slice(1)
		);
	}
</script>

<Collapsible.Root bind:open={isOpen}>
	<Collapsible.Trigger
		class={cn(
			'flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm',
			isOpen && 'rounded-b-none'
		)}
	>
		<span>
			Character Modifier ({modifier.behaviour} - {modifier.type} - {modifier.target})
		</span>
		<ChevronLeft class={cn('size-4 transition-transform', isOpen && '-rotate-90')} />
	</Collapsible.Trigger>
	<Collapsible.Content class="flex flex-col gap-3 rounded-b-md border bg-card/50 p-3">
		<!-- Behaviour -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Behaviour</label>
			<Select.Root
				type="single"
				value={modifier.behaviour}
				onValueChange={(value) => {
					if (value) {
						modifier = { ...modifier, behaviour: value as 'bonus' | 'base' | 'override' };
					}
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">{modifier.behaviour}</p>
				</Select.Trigger>
				<Select.Content>
					{#each behaviourOptions as behaviour}
						<Select.Item value={behaviour}>{capitalize(behaviour)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Type -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Type</label>
			<Select.Root type="single" value={currentType} onValueChange={updateType}>
				<Select.Trigger class="w-full">
					<p class="truncate">{currentType.replace(/_/g, ' ')}</p>
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as type}
						<Select.Item value={type}>{type.replace(/_/g, ' ')}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Type-specific fields -->
		{#if currentType === 'derived_from_trait'}
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1">
					<label class="text-xs font-medium text-muted-foreground">Trait</label>
					<Select.Root
						type="single"
						value={modifier.trait}
						onValueChange={(value) => {
							if (value) {
								modifier = { ...modifier, trait: value as TraitIds };
							}
						}}
					>
						<Select.Trigger class="w-full">
							<p class="truncate">{capitalize(modifier.trait)}</p>
						</Select.Trigger>
						<Select.Content>
							{#each traitOptions as trait}
								<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-medium text-muted-foreground">Multiplier</label>
					<Input
						type="number"
						value={String(modifier.multiplier)}
						oninput={(e) => {
							modifier = { ...modifier, multiplier: Number(e.currentTarget.value) };
						}}
						step="0.1"
					/>
				</div>
			</div>
		{:else if currentType === 'flat'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Value</label>
				<Input
					type="number"
					value={String(modifier.value)}
					oninput={(e) => {
						modifier = { ...modifier, value: Number(e.currentTarget.value) };
					}}
				/>
			</div>
		{:else if currentType === 'derived_from_proficiency' || currentType === 'derived_from_level'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Multiplier</label>
				<Input
					type="number"
					value={String(modifier.multiplier)}
					oninput={(e) => {
						modifier = { ...modifier, multiplier: Number(e.currentTarget.value) };
					}}
					step="0.1"
				/>
			</div>
		{/if}

		<!-- Target -->
		<div class="flex flex-col gap-1">
			<label class="text-xs font-medium text-muted-foreground">Target</label>
			<Select.Root type="single" value={currentTarget} onValueChange={updateTarget}>
				<Select.Trigger class="w-full">
					<p class="truncate">{currentTarget.replace(/_/g, ' ')}</p>
				</Select.Trigger>
				<Select.Content>
					{#each simpleTargetOptions as target}
						<Select.Item value={target}>{target.replace(/_/g, ' ')}</Select.Item>
					{/each}
					<Select.Item value="trait">trait</Select.Item>
					<Select.Item value="experience_from_domain_card_choice_selection"
						>experience from domain card choice selection</Select.Item
					>
					<Select.Item value="experience_from_ancestry_card_choice_selection"
						>experience from ancestry card choice selection</Select.Item
					>
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Target-specific fields -->
		{#if currentTarget === 'trait'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Trait</label>
				<Select.Root
					type="single"
					value={modifier.trait}
					onValueChange={(value) => {
						if (value) {
							modifier = { ...modifier, trait: value as TraitIds };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">{capitalize(modifier.trait)}</p>
					</Select.Trigger>
					<Select.Content>
						{#each traitOptions as trait}
							<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{:else if currentTarget === 'experience_from_domain_card_choice_selection'}
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium text-muted-foreground">Domain Card</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input bind:value={domainCardSearch} placeholder="Search domain cards..." class="pl-9" />
				</div>
				<Select.Root
					type="single"
					value={modifier.domain_card_id || undefined}
					onValueChange={(value) => {
						if (value) {
							modifier = { ...modifier, domain_card_id: value };
						}
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{modifier.domain_card_id
								? filteredDomainCards.find((c) => c.compendium_id === modifier.domain_card_id)
										?.title || modifier.domain_card_id
								: 'Select domain card'}
						</p>
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						{#each filteredDomainCards.slice(0, 50) as card}
							<Select.Item value={card.compendium_id}>{card.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Choice ID</label>
				<Input
					value={modifier.choice_id || ''}
					oninput={(e) => {
						modifier = { ...modifier, choice_id: e.currentTarget.value };
					}}
					placeholder="choice_id"
				/>
			</div>
		{:else if currentTarget === 'experience_from_ancestry_card_choice_selection'}
			<div class="flex flex-col gap-1">
				<label class="text-xs font-medium text-muted-foreground">Choice ID</label>
				<Input
					value={modifier.choice_id || ''}
					oninput={(e) => {
						modifier = { ...modifier, choice_id: e.currentTarget.value };
					}}
					placeholder="choice_id"
				/>
			</div>
		{/if}

		<!-- Character Conditions -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<label class="text-xs font-medium text-muted-foreground">Character Conditions</label>
				<Button size="sm" variant="outline" onclick={addCondition}>
					<Plus class="size-3.5" />
					Add Condition
				</Button>
			</div>
			<div class="flex flex-col gap-2">
				{#each modifier.character_conditions as condition, index}
					<div class="flex items-start gap-2">
						<div class="flex-1">
							<HomebrewCharacterConditionEditor bind:condition={condition} />
						</div>
						<Button
							size="sm"
							variant="ghost"
							onclick={() => removeCondition(index)}
							class="mt-1"
						>
							<X class="size-4" />
						</Button>
					</div>
				{/each}
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
