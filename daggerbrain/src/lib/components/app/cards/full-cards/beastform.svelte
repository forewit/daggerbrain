<script lang="ts">
	import type { Beastform } from '$lib/types/compendium-types';
	import type { Snippet } from 'svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import * as Select from '$lib/components/ui/select/';
	import { capitalize, cn, applyProficiencyToDice, level_to_tier } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils/markdown';

	let {
		show_choices = false,
		preview = false,
		beastform = $bindable(),
		class: className = '',
		children
	}: {
		show_choices?: boolean;
		preview?: boolean;
		beastform: Beastform;
		class?: string;
		children?: Snippet;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context?.character);
	let proficiency = $derived(context?.proficiency);
	const compendium = getCompendiumContext();

	// Local state for choices in preview mode
	let preview_choices = $state<Record<string, any>>({});

	// Helper functions to identify special beastform types by special_case field
	function isLegendaryBeast(bf: Beastform): boolean {
		return bf.special_case === 'legendary_beast';
	}

	function isLegendaryHybrid(bf: Beastform): boolean {
		return bf.special_case === 'legendary_hybrid';
	}

	function isMythicBeast(bf: Beastform): boolean {
		return bf.special_case === 'mythic_beast';
	}

	function isMythicHybrid(bf: Beastform): boolean {
		return bf.special_case === 'mythic_hybrid';
	}

	// Apply proficiency to damage dice
	let damageDiceWithProficiency = $derived.by(() => {
		const prof = preview ? 1 : proficiency;
		if (!prof) return beastform.attack.damage_dice;
		return applyProficiencyToDice(beastform.attack.damage_dice, prof);
	});

	// Get choices for this beastform if they exist
	let beastform_choices = $derived(
		preview
			? preview_choices
			: character?.chosen_beastform?.compendium_id === beastform.compendium_id
				? character.chosen_beastform.choices || {}
				: {}
	);
</script>

<div
	class={cn(
		'flex max-w-[calc(min(100%,400px))] flex-col gap-4 rounded border bg-card/50 p-3',
		className
	)}
>
	<div class="flex flex-wrap gap-2">
		<!-- Header with Name and Category -->
		<div class=" flex grow items-center justify-between gap-1">
			<h3 class="text-sm font-semibold text-foreground">{beastform.name}</h3>
			<p class="text-right text-xs text-muted-foreground italic">
				Tier {level_to_tier(beastform.level_requirement)}
				{beastform.category}
			</p>
		</div>

		<!-- Stats Table -->
		<table class="grow text-xs">
			<tbody>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Bonus</th>
					<td class="py-2 text-right">
						<div class="flex items-center justify-end gap-1">
							<span class="capitalize">{beastform.character_trait.trait}</span>
							<span
								>{beastform.character_trait.bonus < 0 ? '' : '+'}{beastform.character_trait
									.bonus},</span
							>
							Evasion
							<span>{beastform.evasion_bonus < 0 ? '' : '+'}{beastform.evasion_bonus}</span>
						</div>
					</td>
				</tr>
				<tr class="border-b">
					<th class="py-3 pr-4 text-left font-normal text-muted-foreground">Attack</th>
					<td class="py-3 text-right text-nowrap">
						<span class="capitalize">{beastform.attack.trait}</span>
						<span> {beastform.attack.range}</span>
						<span class="ml-1 rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
							{damageDiceWithProficiency +
								(beastform.attack.damage_bonus <= 0 ? '' : '+' + beastform.attack.damage_bonus)}

							<span class="lowercase">{beastform.attack.damage_type}</span>
						</span>
					</td>
				</tr>
				{#if beastform.advantages.length > 0}
					<tr>
						<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Advantages</th>
						<td class="py-2 text-right">{beastform.advantages.join(', ')}</td>
					</tr>
				{/if}
			</tbody>
		</table>
		<!-- Features -->
		{#if beastform.features.length > 0}
			{#each beastform.features as feature}
				<p class="text-xs text-muted-foreground">
					<span class="font-medium text-foreground">{feature.title}:</span>
					{@html renderMarkdown(feature.description_html)}
				</p>
			{/each}
		{/if}
	</div>

	<!-- Choices (for special cases like legendary_hybrid, mythic_hybrid) -->
	{#if show_choices && (preview || character?.chosen_beastform?.compendium_id === beastform.compendium_id)}
		{@render legendary_beast_choices()}
		{@render legendary_hybrid_choices()}
		{@render mythic_beast_choices()}
		{@render mythic_hybrid_choices()}
	{/if}

	{@render children?.()}
</div>

{#snippet legendary_beast_choices()}
	{#if isLegendaryBeast(beastform) && (preview || (character && context))}
		{@const level = preview ? 10 : character?.level || 10}
		{@const available_forms = preview
			? Object.values(compendium.beastforms).filter((bf) => bf.level_requirement === 1)
			: context.get_available_beastforms(level, []).filter((bf) => bf.level_requirement === 1)}
		{@const current_choice = beastform_choices.legendary_beast_base_form?.[0] || ''}

		<div class="flex flex-col gap-2">
			<span class="text-xs font-medium">Base Form (Tier 1):</span>
			<Select.Root
				type="single"
				value={current_choice}
				onValueChange={(value: string) => {
					if (preview) {
						preview_choices.legendary_beast_base_form = value ? [value] : [];
					} else if (character?.chosen_beastform) {
						character.chosen_beastform.choices.legendary_beast_base_form = value ? [value] : [];
					}
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">
						{current_choice
							? available_forms.find((f) => f.compendium_id === current_choice)?.name || 'Unknown'
							: 'Select Tier 1 beastform'}
					</p>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="" class="justify-center text-muted-foreground"
						>-- Select none --</Select.Item
					>
					{#each available_forms as form}
						<Select.Item value={form.compendium_id}>
							{form.name} ({form.category})
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}
{/snippet}

{#snippet legendary_hybrid_choices()}
	{#if isLegendaryHybrid(beastform) && (preview || (character && context && character.chosen_beastform))}
		{@const level = preview ? 10 : character?.level || 10}
		{@const available_forms = preview
			? Object.values(compendium.beastforms).filter((bf) => bf.level_requirement <= 4)
			: context.get_available_beastforms(level, []).filter((bf) => bf.level_requirement <= 4)}
		{@const base_forms = beastform_choices.legendary_hybrid_base_forms || []}
		{@const base_form_0 = compendium.beastforms[base_forms[0] || '']}
		{@const base_form_1 = compendium.beastforms[base_forms[1] || '']}

		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">Base Forms (Tiers 1-2):</span>
				<Select.Root
					type="multiple"
					value={base_forms.filter(Boolean)}
					onValueChange={(value: string[]) => {
						if (preview) {
							preview_choices.legendary_hybrid_base_forms = value.filter(Boolean);
						} else if (character?.chosen_beastform) {
							character.chosen_beastform.choices.legendary_hybrid_base_forms =
								value.filter(Boolean);
						}
					}}
				>
					<Select.Trigger class="w-full text-muted-foreground">
						<p class="truncate">
							{base_forms.length === 0
								? 'Select base forms (2 max)'
								: base_forms
										.map(
											(id: string) =>
												available_forms.find((f) => f.compendium_id === id)?.name || 'Unknown'
										)
										.join(', ')}
							{#if base_forms.length < 2}
								<span class="text-muted-foreground">
									({2 - base_forms.length} more)
								</span>
							{/if}
						</p>
					</Select.Trigger>
					<Select.Content>
						<Select.Item
							value=""
							disabled={base_forms.length === 0}
							class="justify-center text-destructive"
							onclick={() => {
								if (preview) {
									preview_choices.legendary_hybrid_base_forms = [];
								} else if (character?.chosen_beastform) {
									character.chosen_beastform.choices.legendary_hybrid_base_forms = [];
								}
							}}
						>
							-- Clear selection --
						</Select.Item>
						{#each available_forms as form}
							<Select.Item
								value={form.compendium_id}
								disabled={base_forms.length >= 2 && !base_forms.includes(form.compendium_id)}
							>
								{form.name} ({form.category})
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Advantages and Features Selection -->
			{#if base_form_0 && base_form_1}
				{@const all_advantages_raw = [
					...base_form_0.advantages.map((adv, i) => ({
						id: `0_${i}`,
						form_index: 0,
						advantage_index: i,
						label: adv
					})),
					...base_form_1.advantages.map((adv, i) => ({
						id: `1_${i}`,
						form_index: 1,
						advantage_index: i,
						label: adv
					}))
				]}
				{@const seen_labels = new Set<string>()}
				{@const all_advantages = all_advantages_raw.filter((adv) => {
					if (seen_labels.has(adv.label)) {
						return false;
					}
					seen_labels.add(adv.label);
					return true;
				})}
				{@const advantage_name_to_ids = new Map<string, string[]>()}
				{#each all_advantages_raw as adv}
					{@const ids = advantage_name_to_ids.get(adv.label) || []}
					{@const _unused = advantage_name_to_ids.set(adv.label, [...ids, adv.id])}
				{/each}
				{@const selected_advantages_0 =
					beastform_choices.legendary_hybrid_base_forms_0_advantages || []}
				{@const selected_advantages_1 =
					beastform_choices.legendary_hybrid_base_forms_1_advantages || []}
				{@const combined_advantage_selections = [
					...selected_advantages_0.map((i: string) => `0_${i}`),
					...selected_advantages_1.map((i: string) => `1_${i}`)
				]}
				{@const all_features = [
					...base_form_0.features.map((feat, i) => ({
						id: `0_${i}`,
						form_index: 0,
						feature_index: i,
						label: feat.title
					})),
					...base_form_1.features.map((feat, i) => ({
						id: `1_${i}`,
						form_index: 1,
						feature_index: i,
						label: feat.title
					}))
				]}
				{@const selected_features_0 =
					beastform_choices.legendary_hybrid_base_forms_0_features || []}
				{@const selected_features_1 =
					beastform_choices.legendary_hybrid_base_forms_1_features || []}
				{@const combined_feature_selections = [
					...selected_features_0.map((i: string) => `0_${i}`),
					...selected_features_1.map((i: string) => `1_${i}`)
				]}
				<div class="mt-2 flex flex-col gap-2">
					<div class="flex flex-col gap-1">
						<span class="text-xs font-medium">Advantages (Select 4):</span>
						<Select.Root
							type="multiple"
							value={combined_advantage_selections}
							onValueChange={(value: string[]) => {
								const form_0_selections: string[] = [];
								const form_1_selections: string[] = [];
								for (const val of value) {
									if (val.startsWith('0_')) {
										form_0_selections.push(val.replace('0_', ''));
									} else if (val.startsWith('1_')) {
										form_1_selections.push(val.replace('1_', ''));
									}
								}
								if (preview) {
									preview_choices.legendary_hybrid_base_forms_0_advantages = form_0_selections;
									preview_choices.legendary_hybrid_base_forms_1_advantages = form_1_selections;
								} else if (character?.chosen_beastform) {
									character.chosen_beastform.choices.legendary_hybrid_base_forms_0_advantages =
										form_0_selections;
									character.chosen_beastform.choices.legendary_hybrid_base_forms_1_advantages =
										form_1_selections;
								}
							}}
						>
							<Select.Trigger class="w-full text-muted-foreground">
								<p class="truncate">
									{combined_advantage_selections.length === 0
										? 'Select 4 advantages'
										: combined_advantage_selections
												.map((id) => all_advantages.find((a) => a.id === id)?.label || 'Unknown')
												.join(', ')}
									{#if combined_advantage_selections.length < 4}
										<span class="text-muted-foreground">
											({4 - combined_advantage_selections.length} more)
										</span>
									{/if}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item
									value=""
									disabled={combined_advantage_selections.length === 0}
									class="justify-center text-destructive"
									onclick={() => {
										if (preview) {
											preview_choices.legendary_hybrid_base_forms_0_advantages = [];
											preview_choices.legendary_hybrid_base_forms_1_advantages = [];
										} else if (character?.chosen_beastform) {
											character.chosen_beastform.choices.legendary_hybrid_base_forms_0_advantages =
												[];
											character.chosen_beastform.choices.legendary_hybrid_base_forms_1_advantages =
												[];
										}
									}}
								>
									-- Clear selection --
								</Select.Item>
								{#each all_advantages as adv}
									{@const ids_for_advantage = advantage_name_to_ids.get(adv.label) || []}
									{@const is_selected = ids_for_advantage.some((id) =>
										combined_advantage_selections.includes(id)
									)}
									<Select.Item
										value={adv.id}
										disabled={combined_advantage_selections.length >= 4 && !is_selected}
									>
										<span class="capitalize">{adv.label}</span>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex flex-col gap-1">
						<span class="text-xs font-medium">Features (Select 2):</span>
						<Select.Root
							type="multiple"
							value={combined_feature_selections}
							onValueChange={(value: string[]) => {
								const form_0_selections: string[] = [];
								const form_1_selections: string[] = [];
								for (const val of value) {
									if (val.startsWith('0_')) {
										form_0_selections.push(val.replace('0_', ''));
									} else if (val.startsWith('1_')) {
										form_1_selections.push(val.replace('1_', ''));
									}
								}
								if (preview) {
									preview_choices.legendary_hybrid_base_forms_0_features = form_0_selections;
									preview_choices.legendary_hybrid_base_forms_1_features = form_1_selections;
								} else if (character?.chosen_beastform) {
									character.chosen_beastform.choices.legendary_hybrid_base_forms_0_features =
										form_0_selections;
									character.chosen_beastform.choices.legendary_hybrid_base_forms_1_features =
										form_1_selections;
								}
							}}
						>
							<Select.Trigger class="w-full text-muted-foreground">
								<p class="truncate">
									{combined_feature_selections.length === 0
										? 'Select 2 features'
										: combined_feature_selections
												.map((id) => all_features.find((f) => f.id === id)?.label || 'Unknown')
												.join(', ')}
									{#if combined_feature_selections.length < 2}
										<span class="text-muted-foreground">
											({2 - combined_feature_selections.length} more)
										</span>
									{/if}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item
									value=""
									disabled={combined_feature_selections.length === 0}
									class="justify-center text-destructive"
									onclick={() => {
										if (preview) {
											preview_choices.legendary_hybrid_base_forms_0_features = [];
											preview_choices.legendary_hybrid_base_forms_1_features = [];
										} else if (character?.chosen_beastform) {
											character.chosen_beastform.choices.legendary_hybrid_base_forms_0_features =
												[];
											character.chosen_beastform.choices.legendary_hybrid_base_forms_1_features =
												[];
										}
									}}
								>
									-- Clear selection --
								</Select.Item>
								{#if base_form_0.features.length > 0}
									<Select.Label>{base_form_0.name}</Select.Label>
									{#each base_form_0.features as feat, i}
										<Select.Item
											value={`0_${i}`}
											disabled={combined_feature_selections.length >= 2 &&
												!combined_feature_selections.includes(`0_${i}`)}
										>
											{feat.title}
										</Select.Item>
									{/each}
								{/if}
								{#if base_form_1.features.length > 0}
									<Select.Label>{base_form_1.name}</Select.Label>
									{#each base_form_1.features as feat, i}
										<Select.Item
											value={`1_${i}`}
											disabled={combined_feature_selections.length >= 2 &&
												!combined_feature_selections.includes(`1_${i}`)}
										>
											{feat.title}
										</Select.Item>
									{/each}
								{/if}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet mythic_beast_choices()}
	{#if isMythicBeast(beastform) && (preview || (character && context))}
		{@const level = preview ? 10 : character?.level || 10}
		{@const available_forms = preview
			? Object.values(compendium.beastforms).filter((bf) => bf.level_requirement <= 4)
			: context.get_available_beastforms(level, []).filter((bf) => bf.level_requirement <= 4)}
		{@const current_choice = beastform_choices.mythic_beast_base_form?.[0] || ''}

		<div class="flex flex-col gap-2">
			<span class="text-xs font-medium">Base Form (Tiers 1-2):</span>
			<Select.Root
				type="single"
				value={current_choice}
				onValueChange={(value: string) => {
					if (preview) {
						preview_choices.mythic_beast_base_form = value ? [value] : [];
					} else if (character?.chosen_beastform) {
						character.chosen_beastform.choices.mythic_beast_base_form = value ? [value] : [];
					}
				}}
			>
				<Select.Trigger class="w-full">
					<p class="truncate">
						{current_choice
							? available_forms.find((f) => f.compendium_id === current_choice)?.name || 'Unknown'
							: 'Select Tier 1-2 beastform'}
					</p>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="" class="justify-center text-muted-foreground"
						>-- Select none --</Select.Item
					>
					{#each available_forms as form}
						<Select.Item value={form.compendium_id}>
							{form.name} ({form.category})
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}
{/snippet}

{#snippet mythic_hybrid_choices()}
	{#if isMythicHybrid(beastform) && (preview || (character && context && character.chosen_beastform))}
		{@const level = preview ? 10 : character?.level || 10}
		{@const available_forms = preview
			? Object.values(compendium.beastforms).filter((bf) => bf.level_requirement <= 7)
			: context.get_available_beastforms(level, []).filter((bf) => bf.level_requirement <= 7)}
		{@const base_forms = beastform_choices.mythic_hybrid_base_forms || []}
		{@const base_form_0 = compendium.beastforms[base_forms[0] || '']}
		{@const base_form_1 = compendium.beastforms[base_forms[1] || '']}
		{@const base_form_2 = compendium.beastforms[base_forms[2] || '']}

		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">Base Forms (Tiers 1-3):</span>
				<Select.Root
					type="multiple"
					value={base_forms.filter(Boolean)}
					onValueChange={(value: string[]) => {
						if (preview) {
							preview_choices.mythic_hybrid_base_forms = value.filter(Boolean);
						} else if (character?.chosen_beastform) {
							character.chosen_beastform.choices.mythic_hybrid_base_forms = value.filter(Boolean);
						}
					}}
				>
					<Select.Trigger class="w-full text-muted-foreground">
						<p class="truncate">
							{base_forms.length === 0
								? 'Select base forms (3 max)'
								: base_forms
										.map(
											(id: string) =>
												available_forms.find((f) => f.compendium_id === id)?.name || 'Unknown'
										)
										.join(', ')}
							{#if base_forms.length < 3}
								<span class="text-muted-foreground">
									({3 - base_forms.length} more)
								</span>
							{/if}
						</p>
					</Select.Trigger>
					<Select.Content>
						<Select.Item
							value=""
							disabled={base_forms.length === 0}
							class="justify-center text-destructive"
							onclick={() => {
								if (preview) {
									preview_choices.mythic_hybrid_base_forms = [];
								} else if (character?.chosen_beastform) {
									character.chosen_beastform.choices.mythic_hybrid_base_forms = [];
								}
							}}
						>
							-- Clear selection --
						</Select.Item>
						{#each available_forms as form}
							<Select.Item
								value={form.compendium_id}
								disabled={base_forms.length >= 3 && !base_forms.includes(form.compendium_id)}
							>
								{form.name} ({form.category})
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Advantages and Features Selection -->
			{#if base_form_0 && base_form_1 && base_form_2}
				{@const all_advantages_raw = [
					...base_form_0.advantages.map((adv, i) => ({
						id: `0_${i}`,
						form_index: 0,
						advantage_index: i,
						label: adv
					})),
					...base_form_1.advantages.map((adv, i) => ({
						id: `1_${i}`,
						form_index: 1,
						advantage_index: i,
						label: adv
					})),
					...base_form_2.advantages.map((adv, i) => ({
						id: `2_${i}`,
						form_index: 2,
						advantage_index: i,
						label: adv
					}))
				]}
				{@const seen_labels = new Set<string>()}
				{@const all_advantages = all_advantages_raw.filter((adv) => {
					if (seen_labels.has(adv.label)) {
						return false;
					}
					seen_labels.add(adv.label);
					return true;
				})}
				{@const advantage_name_to_ids = new Map<string, string[]>()}
				{#each all_advantages_raw as adv}
					{@const ids = advantage_name_to_ids.get(adv.label) || []}
					{@const _unused = advantage_name_to_ids.set(adv.label, [...ids, adv.id])}
				{/each}
				{@const selected_advantages_0 =
					beastform_choices.mythic_hybrid_base_forms_0_advantages || []}
				{@const selected_advantages_1 =
					beastform_choices.mythic_hybrid_base_forms_1_advantages || []}
				{@const selected_advantages_2 =
					beastform_choices.mythic_hybrid_base_forms_2_advantages || []}
				{@const combined_advantage_selections = [
					...selected_advantages_0.map((i: string) => `0_${i}`),
					...selected_advantages_1.map((i: string) => `1_${i}`),
					...selected_advantages_2.map((i: string) => `2_${i}`)
				]}
				{@const all_features = [
					...base_form_0.features.map((feat, i) => ({
						id: `0_${i}`,
						form_index: 0,
						feature_index: i,
						label: feat.title
					})),
					...base_form_1.features.map((feat, i) => ({
						id: `1_${i}`,
						form_index: 1,
						feature_index: i,
						label: feat.title
					})),
					...base_form_2.features.map((feat, i) => ({
						id: `2_${i}`,
						form_index: 2,
						feature_index: i,
						label: feat.title
					}))
				]}
				{@const selected_features_0 = beastform_choices.mythic_hybrid_base_forms_0_features || []}
				{@const selected_features_1 = beastform_choices.mythic_hybrid_base_forms_1_features || []}
				{@const selected_features_2 = beastform_choices.mythic_hybrid_base_forms_2_features || []}
				{@const combined_feature_selections = [
					...selected_features_0.map((i: string) => `0_${i}`),
					...selected_features_1.map((i: string) => `1_${i}`),
					...selected_features_2.map((i: string) => `2_${i}`)
				]}
				<div class="mt-2 flex flex-col gap-2">
					<div class="flex flex-col gap-1">
						<span class="text-xs font-medium">Advantages (Select 5):</span>
						<Select.Root
							type="multiple"
							value={combined_advantage_selections}
							onValueChange={(value: string[]) => {
								const form_0_selections: string[] = [];
								const form_1_selections: string[] = [];
								const form_2_selections: string[] = [];
								for (const val of value) {
									if (val.startsWith('0_')) {
										form_0_selections.push(val.replace('0_', ''));
									} else if (val.startsWith('1_')) {
										form_1_selections.push(val.replace('1_', ''));
									} else if (val.startsWith('2_')) {
										form_2_selections.push(val.replace('2_', ''));
									}
								}
								if (preview) {
									preview_choices.mythic_hybrid_base_forms_0_advantages = form_0_selections;
									preview_choices.mythic_hybrid_base_forms_1_advantages = form_1_selections;
									preview_choices.mythic_hybrid_base_forms_2_advantages = form_2_selections;
								} else if (character?.chosen_beastform) {
									character.chosen_beastform.choices.mythic_hybrid_base_forms_0_advantages =
										form_0_selections;
									character.chosen_beastform.choices.mythic_hybrid_base_forms_1_advantages =
										form_1_selections;
									character.chosen_beastform.choices.mythic_hybrid_base_forms_2_advantages =
										form_2_selections;
								}
							}}
						>
							<Select.Trigger class="w-full text-muted-foreground">
								<p class="truncate">
									{combined_advantage_selections.length === 0
										? 'Select 5 advantages'
										: combined_advantage_selections
												.map((id) => all_advantages.find((a) => a.id === id)?.label || 'Unknown')
												.join(', ')}
									{#if combined_advantage_selections.length < 5}
										<span class="text-muted-foreground">
											({5 - combined_advantage_selections.length} more)
										</span>
									{/if}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item
									value=""
									disabled={combined_advantage_selections.length === 0}
									class="justify-center text-destructive"
									onclick={() => {
										if (preview) {
											preview_choices.mythic_hybrid_base_forms_0_advantages = [];
											preview_choices.mythic_hybrid_base_forms_1_advantages = [];
											preview_choices.mythic_hybrid_base_forms_2_advantages = [];
										} else if (character?.chosen_beastform) {
											character.chosen_beastform.choices.mythic_hybrid_base_forms_0_advantages = [];
											character.chosen_beastform.choices.mythic_hybrid_base_forms_1_advantages = [];
											character.chosen_beastform.choices.mythic_hybrid_base_forms_2_advantages = [];
										}
									}}
								>
									-- Clear selection --
								</Select.Item>
								{#each all_advantages as adv}
									{@const ids_for_advantage = advantage_name_to_ids.get(adv.label) || []}
									{@const is_selected = ids_for_advantage.some((id) =>
										combined_advantage_selections.includes(id)
									)}
									<Select.Item
										value={adv.id}
										disabled={combined_advantage_selections.length >= 5 && !is_selected}
									>
										<span class="capitalize">{adv.label}</span>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex flex-col gap-1">
						<span class="text-xs font-medium">Features (Select 3):</span>
						<Select.Root
							type="multiple"
							value={combined_feature_selections}
							onValueChange={(value: string[]) => {
								const form_0_selections: string[] = [];
								const form_1_selections: string[] = [];
								const form_2_selections: string[] = [];
								for (const val of value) {
									if (val.startsWith('0_')) {
										form_0_selections.push(val.replace('0_', ''));
									} else if (val.startsWith('1_')) {
										form_1_selections.push(val.replace('1_', ''));
									} else if (val.startsWith('2_')) {
										form_2_selections.push(val.replace('2_', ''));
									}
								}
								if (preview) {
									preview_choices.mythic_hybrid_base_forms_0_features = form_0_selections;
									preview_choices.mythic_hybrid_base_forms_1_features = form_1_selections;
									preview_choices.mythic_hybrid_base_forms_2_features = form_2_selections;
								} else if (character?.chosen_beastform) {
									character.chosen_beastform.choices.mythic_hybrid_base_forms_0_features =
										form_0_selections;
									character.chosen_beastform.choices.mythic_hybrid_base_forms_1_features =
										form_1_selections;
									character.chosen_beastform.choices.mythic_hybrid_base_forms_2_features =
										form_2_selections;
								}
							}}
						>
							<Select.Trigger class="w-full text-muted-foreground">
								<p class="truncate">
									{combined_feature_selections.length === 0
										? 'Select 3 features'
										: combined_feature_selections
												.map((id) => all_features.find((f) => f.id === id)?.label || 'Unknown')
												.join(', ')}
									{#if combined_feature_selections.length < 3}
										<span class="text-muted-foreground">
											({3 - combined_feature_selections.length} more)
										</span>
									{/if}
								</p>
							</Select.Trigger>
							<Select.Content>
								<Select.Item
									value=""
									disabled={combined_feature_selections.length === 0}
									class="justify-center text-destructive"
									onclick={() => {
										if (preview) {
											preview_choices.mythic_hybrid_base_forms_0_features = [];
											preview_choices.mythic_hybrid_base_forms_1_features = [];
											preview_choices.mythic_hybrid_base_forms_2_features = [];
										} else if (character?.chosen_beastform) {
											character.chosen_beastform.choices.mythic_hybrid_base_forms_0_features = [];
											character.chosen_beastform.choices.mythic_hybrid_base_forms_1_features = [];
											character.chosen_beastform.choices.mythic_hybrid_base_forms_2_features = [];
										}
									}}
								>
									-- Clear selection --
								</Select.Item>
								{#if base_form_0.features.length > 0}
									<Select.Label>{base_form_0.name}</Select.Label>
									{#each base_form_0.features as feat, i}
										<Select.Item
											value={`0_${i}`}
											disabled={combined_feature_selections.length >= 3 &&
												!combined_feature_selections.includes(`0_${i}`)}
										>
											{feat.title}
										</Select.Item>
									{/each}
								{/if}
								{#if base_form_1.features.length > 0}
									<Select.Label>{base_form_1.name}</Select.Label>
									{#each base_form_1.features as feat, i}
										<Select.Item
											value={`1_${i}`}
											disabled={combined_feature_selections.length >= 3 &&
												!combined_feature_selections.includes(`1_${i}`)}
										>
											{feat.title}
										</Select.Item>
									{/each}
								{/if}
								{#if base_form_2.features.length > 0}
									<Select.Label>{base_form_2.name}</Select.Label>
									{#each base_form_2.features as feat, i}
										<Select.Item
											value={`2_${i}`}
											disabled={combined_feature_selections.length >= 3 &&
												!combined_feature_selections.includes(`2_${i}`)}
										>
											{feat.title}
										</Select.Item>
									{/each}
								{/if}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}
