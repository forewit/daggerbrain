<script lang="ts">
	import type { AllTierLevelUpOptionId, LevelUpChoice, LevelUpOption } from '@convex/schemas/rules';
	import { cn, renderMarkdown } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Square from '@lucide/svelte/icons/square';
	import SquareCheck from '@lucide/svelte/icons/square-check';
	import Check from '@lucide/svelte/icons/check';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import * as Select from '$lib/components/ui/select/';
	import * as Collapsible from '$lib/components/ui/collapsible/';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let {
		tier_number,
		options,
		open = $bindable(),
		choices = $bindable(),
		chosen_options,
		on_close = () => {}
	}: {
		tier_number: number;
		options: Partial<Record<AllTierLevelUpOptionId, LevelUpOption>>;
		open?: boolean;
		choices: { A: LevelUpChoice; B: LevelUpChoice };
		chosen_options: { A?: LevelUpOption; B?: LevelUpOption };
		on_close?: () => void;
	} = $props();

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);

	function calculate_disabled(
		option_id: AllTierLevelUpOptionId,
		option: LevelUpOption,
		tier_number: number
	): { disabled: boolean; rule_disabled: boolean } {
		const options_used = derived_character_data?.level_up_options_used;
		if (!options_used) return { disabled: true, rule_disabled: false };

		const base_disabled =
			options_used[option_id] >= option.max ||
			(!!choices.A.option_id && !!choices.B.option_id) ||
			chosen_options.A?.costs_two_choices ||
			chosen_options.B?.costs_two_choices ||
			(option.costs_two_choices && (!!choices.A.option_id || !!choices.B.option_id));

		let rule_disabled = false;
		if (tier_number === 3) {
			rule_disabled =
				(option_id === 'tier_3_multiclass' &&
					(options_used['tier_4_multiclass'] >= 1 ||
						options_used['tier_3_subclass_upgrade'] >= 1)) ||
				(option_id === 'tier_3_subclass_upgrade' && options_used['tier_3_multiclass'] >= 1);
		} else if (tier_number === 4) {
			rule_disabled =
				(option_id === 'tier_4_multiclass' &&
					(options_used['tier_3_multiclass'] >= 1 ||
						options_used['tier_4_subclass_upgrade'] >= 1)) ||
				(option_id === 'tier_4_subclass_upgrade' && options_used['tier_4_multiclass'] >= 1);
		}

		return { disabled: base_disabled || rule_disabled, rule_disabled };
	}

	function handle_option_click(option_id: AllTierLevelUpOptionId) {
		if (!choices.A.option_id) {
			choices.A.option_id = option_id;
		} else if (!choices.B.option_id) {
			choices.B.option_id = option_id;
		}
		if (
			(!!choices.A.option_id && !!choices.B.option_id) ||
			chosen_options.A?.costs_two_choices ||
			chosen_options.B?.costs_two_choices
		) {
			on_close();
		}
	}
</script>

<Select.Group>
	<Collapsible.Root bind:open>
		<Collapsible.Trigger class="w-full">
			<Select.GroupHeading class="my-0.5 flex items-center gap-2 py-1 text-accent hover:bg-muted">
				<ChevronRight class={cn('size-4 stroke-3 opacity-50', open && 'rotate-90')} />
				Tier {tier_number} Options
			</Select.GroupHeading>
		</Collapsible.Trigger>
		<Collapsible.Content>
			{#each Object.entries(options) as [option_id, option]}
				{@const { disabled, rule_disabled } = calculate_disabled(
					option_id as AllTierLevelUpOptionId,
					option,
					tier_number
				)}

				<button
					{disabled}
					class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm select-none hover:cursor-pointer hover:bg-muted disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
					onclick={() => handle_option_click(option_id as AllTierLevelUpOptionId)}
				>
					<div class="flex w-14 shrink-0 justify-end">
						<div class={cn('relative flex w-min gap-1')}>
							{#if rule_disabled}
								<span
									class="absolute top-1/2 -right-1 -left-1 h-[1px] -translate-y-1/2 bg-foreground"
								></span>
							{/if}
							{#each Array(option.max) as _, i}
								{@const Icon =
									i <
									(derived_character_data?.level_up_options_used[
										option_id as AllTierLevelUpOptionId
									] ?? 0)
										? SquareCheck
										: Square}
								{@const double = option.costs_two_choices}

								{#if double}
									<div
										class="flex gap-1 rounded-xs outline-2 outline-offset-1 outline-muted-foreground"
									>
										<Icon class="size-4" />
										<Icon class="size-4" />
									</div>
								{:else}
									<Icon class="size-4" />
								{/if}
							{/each}
						</div>
					</div>
					<p class={cn('grow')}>
						{@html renderMarkdown(option.title || '')}
					</p>
					<div class="size-4">
						{#if (option_id === choices.A.option_id && option_id === choices.B.option_id) || (option_id === choices.A.option_id && option.costs_two_choices) || (option_id === choices.B.option_id && option.costs_two_choices)}
							<CheckCheck class="size-4" />
						{:else if option_id === choices.A.option_id || option_id === choices.B.option_id}
							<Check class="size-4" />
						{/if}
					</div>
				</button>
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>
</Select.Group>
