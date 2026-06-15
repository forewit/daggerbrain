<script lang="ts">
	import { cn, renderMarkdown } from '$lib/utils';
	import type { LevelUpChoice } from '@convex/schemas/rules';
	import * as Select from '$lib/components/ui/select/';
	import { TIER_2_BASE_OPTIONS } from '@convex/constants/rules';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import {
		get_previously_chosen_domain_card_ids,
		get_available_domain_cards
	} from './domain-card-utils';
	import { calculate_highlighted } from './highlight-utils';
	import DomainCardSelector from './secondary-options/domain-card-selector.svelte';
	import TraitsSelector from './secondary-options/traits-selector.svelte';
	import ExperienceSelector from '$lib/components/utility/experience-select.svelte';
	import TierOptionsGroup from './tier-options-group.svelte';

	let {
		class: className = '',
		level
	}: {
		class?: string;
		level: number;
	} = $props();

	const characterCtx = getCharacterContext();
	const character = $derived(characterCtx.character);
	const derived_character_data = $derived(characterCtx.derived_character_data);

	function createBlankLevelUpChoice(): LevelUpChoice {
		return {
			marked_traits: {},
			selected_experiences: []
		};
	}

	$effect(() => {
		if (!character) return;
		const levelChoices =
			character.level_up_choices[level as keyof typeof character.level_up_choices];
		levelChoices.A ??= createBlankLevelUpChoice();
		levelChoices.B ??= createBlankLevelUpChoice();
	});

	const previously_chosen_domain_card_ids = $derived.by(() =>
		get_previously_chosen_domain_card_ids(characterCtx, level, ['tier_2_domain_card'])
	);

	let width: number = $state(300);
	let tier_2_options_open = $state(true);
	let select_open = $state(false);

	let choices = $derived.by(
		(): { A: LevelUpChoice; B: LevelUpChoice } =>
			(character?.level_up_choices[level as keyof typeof character.level_up_choices] as
				| { A: LevelUpChoice; B: LevelUpChoice }
				| undefined) ?? {
				A: createBlankLevelUpChoice(),
				B: createBlankLevelUpChoice()
			}
	);
	const chosen_options = $derived(
		derived_character_data?.level_up_chosen_options[
			level as keyof typeof derived_character_data.level_up_chosen_options
		] ?? {}
	);
	const level_up_domain_cards = $derived(
		character?.level_up_domain_card_ids[
			level as keyof typeof character.level_up_domain_card_ids
		] || {
			A: undefined,
			B: undefined
		}
	);
</script>

{#if character && derived_character_data}
	<div class={cn(className)}>
		<Dropdown
			title="Level {level}"
			highlighted={calculate_highlighted(characterCtx, level, ['tier_2'])}
			subtitle={[chosen_options.A?.short_title, chosen_options.B?.short_title]
				.filter((title) => title)
				.join(', ')}
		>
			<div class="flex flex-col gap-4" bind:clientWidth={width}>
				<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2">
					<p class="px-2 py-1 text-xs text-muted-foreground italic">
						Take an additional domain card of your level or lower from a domain you have access to.
					</p>

					<DomainCardSelector
						bind:selected_card_id={level_up_domain_cards.A}
						available_cards={get_available_domain_cards(characterCtx, level, 4, false)}
						previously_chosen_card_ids={previously_chosen_domain_card_ids}
						description_html="Take an additional domain card of your level or lower from a domain you have access to."
						auto_add_to_loadout
					/>
				</div>

				<Select.Root
					type="single"
					bind:open={select_open}
					onOpenChange={(open) => {
						if (open) tier_2_options_open = true;
					}}
				>
					<Select.Trigger
						highlighted={(!choices.A.option_id || !choices.B.option_id) &&
							!(chosen_options.A?.costs_two_choices || chosen_options.B?.costs_two_choices)}
						class="w-full truncate bg-card hover:bg-card/80"
					>
						<p class="truncate">
							{!choices.A.option_id && !choices.B.option_id
								? 'Select 2 level up options'
								: [chosen_options.A?.short_title, chosen_options.B?.short_title]
										.map((title) => title || '(Choose 1 more)')
										.join(', ')}
						</p>
					</Select.Trigger>
					<Select.Content class="rounded-md " align="start">
						<div style="max-width: {width}px;" class="p-2">
							<button
								disabled={!choices.A.option_id && !choices.B.option_id}
								class="flex w-full items-center justify-center gap-2 rounded-sm px-2 py-1.5 text-sm font-bold text-destructive select-none hover:cursor-pointer hover:bg-muted disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
								onclick={() => {
									choices.A = createBlankLevelUpChoice();
									choices.B = createBlankLevelUpChoice();
								}}
							>
								-- Clear selection --
							</button>
							<TierOptionsGroup
								tier_number={2}
								options={TIER_2_BASE_OPTIONS}
								on_close={() => (select_open = false)}
								bind:open={tier_2_options_open}
								bind:choices
								{chosen_options}
							/>
						</div>
					</Select.Content>
				</Select.Root>

				{#each ['A' as keyof typeof choices, 'B' as keyof typeof choices] as key}
					{#if choices[key].option_id === 'tier_2_traits'}
						<TraitsSelector
							bind:selected_traits={choices[key].marked_traits}
							marked_traits={derived_character_data.tier_2_marked_traits}
							{width}
						/>
					{:else if choices[key].option_id === 'tier_2_experience_bonus'}
						<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2">
							<p class="px-2 py-1 text-xs font-medium text-muted-foreground italic">
								Choose 2 Experiences.
							</p>
							<div class="flex gap-2.5">
								<ExperienceSelector
									bind:selected_experiences={choices[key].selected_experiences}
									max={2}
									class="bg-card/50 hover:bg-card/70"
									experiences={character.experiences}
									{width}
								/>
							</div>
						</div>
					{:else if choices[key].option_id === 'tier_2_domain_card'}
						<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2">
							<p class="px-2 py-1 text-xs text-muted-foreground italic">
								{@html renderMarkdown(chosen_options[key]?.title || '')}
							</p>
							<DomainCardSelector
								bind:selected_card_id={choices[key].selected_domain_card_id}
								available_cards={get_available_domain_cards(characterCtx, level, 4, false)}
								previously_chosen_card_ids={previously_chosen_domain_card_ids}
								description_html={chosen_options[key]?.title || ''}
								auto_add_to_loadout
							/>
						</div>
					{/if}
				{/each}
			</div>
		</Dropdown>
	</div>
{/if}
