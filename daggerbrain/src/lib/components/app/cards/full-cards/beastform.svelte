<script lang="ts">
	import type { Beastform } from '$lib/types/compendium-types';
	import type { Snippet } from 'svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import ChoiceSelector from '$lib/components/app/leveling/secondary-options/choice-selector.svelte';
	import * as Select from '$lib/components/ui/select/';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { capitalize, cn, applyProficiencyToDice } from '$lib/utils';

	let {
		bind_choice_select = false,
		beastform = $bindable(),
		class: className = '',
		children
	}: {
		bind_choice_select?: boolean;
		beastform: Beastform;
		class?: string;
		children?: Snippet;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context?.character);
	let proficiency = $derived(context?.proficiency);
	const compendium = getCompendiumContext();

	let width = $state(300);

	// Apply proficiency to damage dice
	let damageDiceWithProficiency = $derived.by(() => {
		if (!proficiency) return beastform.attack.damage_dice;
		return applyProficiencyToDice(beastform.attack.damage_dice, proficiency);
	});

	// Get choices for this beastform if they exist
	let beastform_choices = $derived(
		character?.chosen_beastform?.compendium_id === beastform.compendium_id
			? character.chosen_beastform.choices || {}
			: {}
	);
</script>

<div class={cn('flex max-w-[400px] flex-col gap-4 rounded bg-card/50 px-3 py-1', className)}>
	<div class="flex flex-wrap gap-2">
		<!-- Header with Name and Category -->
		<div class="mt-1 flex grow items-center justify-between gap-1">
			<h3 class="text-sm font-semibold text-foreground">{beastform.name}</h3>
			<p class="text-right text-xs text-muted-foreground italic">{beastform.category}</p>
		</div>

		<!-- Stats Table -->
		<table class="grow text-xs">
			<tbody>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Bonus</th>
					<td class="py-2 text-right">
						<label
							class={cn(
								'flex cursor-pointer items-center justify-end gap-1',
								character?.chosen_beastform?.apply_beastform_bonuses && 'text-accent'
							)}
						>
							<span class="capitalize">{beastform.character_trait.trait}</span>
							<span
								>{beastform.character_trait.bonus < 0 ? '' : '+'}{beastform.character_trait
									.bonus},</span
							>
							Evasion
							<span>{beastform.evasion_bonus < 0 ? '' : '+'}{beastform.evasion_bonus}</span>
							{#if character?.chosen_beastform?.compendium_id === beastform.compendium_id}
								<span class="ml-2 inline-flex items-center">
									<Switch bind:checked={character.chosen_beastform.apply_beastform_bonuses} />
								</span>
							{/if}
						</label>
					</td>
				</tr>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Attack</th>
					<td class="py-2 text-right text-nowrap">
						<span class="capitalize">{beastform.attack.trait}</span>
						<span> {beastform.attack.range}</span>
						<span class="ml-1 rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
							{damageDiceWithProficiency}
							{#if beastform.attack.damage_bonus > 0}
								{beastform.attack.damage_bonus < 0 ? '' : '+'}{beastform.attack.damage_bonus}
							{/if}
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
				<p class="mb-2 text-xs text-muted-foreground">
					<span class="font-medium text-foreground">{feature.title}:</span>
					{@html feature.description_html}
				</p>
			{/each}
		{/if}
	</div>

	<!-- Choices (for special cases like legendary_hybrid, mythic_hybrid) -->
	{#if bind_choice_select && character?.chosen_beastform?.compendium_id === beastform.compendium_id}
		{@render legendary_beast_choices()}
		{@render legendary_hybrid_choices()}
		{@render mythic_beast_choices()}
		{@render mythic_hybrid_choices()}
	{/if}

	{@render children?.()}
</div>

{#snippet legendary_beast_choices()}
	{#if beastform.compendium_id === 'legendary_beast' && character && context}
		{@const available_forms = context
			.get_available_beastforms(character.level, [])
			.filter((bf) => bf.level_requirement === 1)}
		{@const current_choice = beastform_choices.legendary_beast_base_form?.[0] || ''}

		<div class="flex flex-col gap-2">
			<span class="text-xs font-medium">Base Form (Tier 1):</span>
			<Select.Root
				type="single"
				value={current_choice}
				onValueChange={(value: string) => {
					if (!character?.chosen_beastform) return;
					character.chosen_beastform.choices.legendary_beast_base_form = value ? [value] : [];
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
	{#if beastform.compendium_id === 'legendary_hybrid' && character && context && character.chosen_beastform}
		{@const available_forms = context
			.get_available_beastforms(character.level, [])
			.filter((bf) => bf.level_requirement <= 4)}
		{@const base_forms = beastform_choices.legendary_hybrid_base_forms || []}
		{@const base_form_0 = compendium.beastforms[base_forms[0] || '']}
		{@const base_form_1 = compendium.beastforms[base_forms[1] || '']}

		<div class="flex flex-col gap-2">
			<span class="text-xs font-medium">Base Forms (Tiers 1-2):</span>

			<!-- Base Form 0 -->
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">First Base Form:</span>
				<Select.Root
					type="single"
					value={base_forms[0] || ''}
					onValueChange={(value: string) => {
						if (!character?.chosen_beastform) return;
						const current = character.chosen_beastform.choices.legendary_hybrid_base_forms || [];
						character.chosen_beastform.choices.legendary_hybrid_base_forms = [
							value,
							current[1] || ''
						].filter(Boolean);
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{base_forms[0]
								? available_forms.find((f) => f.compendium_id === base_forms[0])?.name || 'Unknown'
								: 'Select first base form'}
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

			<!-- Base Form 1 -->
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">Second Base Form:</span>
				<Select.Root
					type="single"
					value={base_forms[1] || ''}
					onValueChange={(value: string) => {
						if (!character?.chosen_beastform) return;
						const current = character.chosen_beastform.choices.legendary_hybrid_base_forms || [];
						character.chosen_beastform.choices.legendary_hybrid_base_forms = [
							current[0] || '',
							value
						].filter(Boolean);
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{base_forms[1]
								? available_forms.find((f) => f.compendium_id === base_forms[1])?.name || 'Unknown'
								: 'Select second base form'}
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

			<!-- Advantages and Features Selection -->
			{#if base_form_0 && base_form_1}
				<div class="mt-2 flex flex-col gap-2">
					<span class="text-xs font-medium">Select 4 Advantages and 2 Features:</span>

					<!-- Advantages from Base Form 0 -->
					{#if base_form_0.advantages.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Advantages from {base_form_0.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.legendary_hybrid_base_forms_0_advantages
								}
								max={4}
								options={base_form_0.advantages.map((adv, i) => ({
									selection_id: i.toString(),
									title: adv,
									short_title: adv
								}))}
								term="Advantage"
								term_plural="Advantages"
								{width}
							/>
						</div>
					{/if}

					<!-- Advantages from Base Form 1 -->
					{#if base_form_1.advantages.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Advantages from {base_form_1.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.legendary_hybrid_base_forms_1_advantages
								}
								max={4}
								options={base_form_1.advantages.map((adv, i) => ({
									selection_id: i.toString(),
									title: adv,
									short_title: adv
								}))}
								term="Advantage"
								term_plural="Advantages"
								{width}
							/>
						</div>
					{/if}

					<!-- Features from Base Form 0 -->
					{#if base_form_0.features.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Features from {base_form_0.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.legendary_hybrid_base_forms_0_features
								}
								max={2}
								options={base_form_0.features.map((feat, i) => ({
									selection_id: i.toString(),
									title: feat.title,
									short_title: feat.title
								}))}
								term="Feature"
								term_plural="Features"
								{width}
							/>
						</div>
					{/if}

					<!-- Features from Base Form 1 -->
					{#if base_form_1.features.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Features from {base_form_1.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.legendary_hybrid_base_forms_1_features
								}
								max={2}
								options={base_form_1.features.map((feat, i) => ({
									selection_id: i.toString(),
									title: feat.title,
									short_title: feat.title
								}))}
								term="Feature"
								term_plural="Features"
								{width}
							/>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet mythic_beast_choices()}
	{#if beastform.compendium_id === 'mythic_beast' && character && context}
		{@const available_forms = context
			.get_available_beastforms(character.level, [])
			.filter((bf) => bf.level_requirement <= 4)}
		{@const current_choice = beastform_choices.mythic_beast_base_form?.[0] || ''}

		<div class="flex flex-col gap-2">
			<span class="text-xs font-medium">Base Form (Tiers 1-2):</span>
			<Select.Root
				type="single"
				value={current_choice}
				onValueChange={(value: string) => {
					if (!character?.chosen_beastform) return;
					character.chosen_beastform.choices.mythic_beast_base_form = value ? [value] : [];
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
	{#if beastform.compendium_id === 'mythic_hybrid' && character && context && character.chosen_beastform}
		{@const available_forms = context
			.get_available_beastforms(character.level, [])
			.filter((bf) => bf.level_requirement <= 7)}
		{@const base_forms = beastform_choices.mythic_hybrid_base_forms || []}
		{@const base_form_0 = compendium.beastforms[base_forms[0] || '']}
		{@const base_form_1 = compendium.beastforms[base_forms[1] || '']}
		{@const base_form_2 = compendium.beastforms[base_forms[2] || '']}

		<div class="flex flex-col gap-2">
			<span class="text-xs font-medium">Base Forms (Tiers 1-3):</span>

			<!-- Base Form 0 -->
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">First Base Form:</span>
				<Select.Root
					type="single"
					value={base_forms[0] || ''}
					onValueChange={(value: string) => {
						if (!character?.chosen_beastform) return;
						const current = character.chosen_beastform.choices.mythic_hybrid_base_forms || [];
						character.chosen_beastform.choices.mythic_hybrid_base_forms = [
							value,
							current[1] || '',
							current[2] || ''
						].filter(Boolean);
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{base_forms[0]
								? available_forms.find((f) => f.compendium_id === base_forms[0])?.name || 'Unknown'
								: 'Select first base form'}
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

			<!-- Base Form 1 -->
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">Second Base Form:</span>
				<Select.Root
					type="single"
					value={base_forms[1] || ''}
					onValueChange={(value: string) => {
						if (!character?.chosen_beastform) return;
						const current = character.chosen_beastform.choices.mythic_hybrid_base_forms || [];
						character.chosen_beastform.choices.mythic_hybrid_base_forms = [
							current[0] || '',
							value,
							current[2] || ''
						].filter(Boolean);
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{base_forms[1]
								? available_forms.find((f) => f.compendium_id === base_forms[1])?.name || 'Unknown'
								: 'Select second base form'}
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

			<!-- Base Form 2 -->
			<div class="flex flex-col gap-1">
				<span class="text-xs font-medium">Third Base Form:</span>
				<Select.Root
					type="single"
					value={base_forms[2] || ''}
					onValueChange={(value: string) => {
						if (!character?.chosen_beastform) return;
						const current = character.chosen_beastform.choices.mythic_hybrid_base_forms || [];
						character.chosen_beastform.choices.mythic_hybrid_base_forms = [
							current[0] || '',
							current[1] || '',
							value
						].filter(Boolean);
					}}
				>
					<Select.Trigger class="w-full">
						<p class="truncate">
							{base_forms[2]
								? available_forms.find((f) => f.compendium_id === base_forms[2])?.name || 'Unknown'
								: 'Select third base form'}
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

			<!-- Advantages and Features Selection -->
			{#if base_form_0 && base_form_1 && base_form_2}
				<div class="mt-2 flex flex-col gap-2">
					<span class="text-xs font-medium">Select 5 Advantages and 3 Features:</span>

					<!-- Advantages from Base Form 0 -->
					{#if base_form_0.advantages.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Advantages from {base_form_0.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.mythic_hybrid_base_forms_0_advantages
								}
								max={5}
								options={base_form_0.advantages.map((adv, i) => ({
									selection_id: i.toString(),
									title: adv,
									short_title: adv
								}))}
								term="Advantage"
								term_plural="Advantages"
								{width}
							/>
						</div>
					{/if}

					<!-- Advantages from Base Form 1 -->
					{#if base_form_1.advantages.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Advantages from {base_form_1.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.mythic_hybrid_base_forms_1_advantages
								}
								max={5}
								options={base_form_1.advantages.map((adv, i) => ({
									selection_id: i.toString(),
									title: adv,
									short_title: adv
								}))}
								term="Advantage"
								term_plural="Advantages"
								{width}
							/>
						</div>
					{/if}

					<!-- Advantages from Base Form 2 -->
					{#if base_form_2.advantages.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Advantages from {base_form_2.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.mythic_hybrid_base_forms_2_advantages
								}
								max={5}
								options={base_form_2.advantages.map((adv, i) => ({
									selection_id: i.toString(),
									title: adv,
									short_title: adv
								}))}
								term="Advantage"
								term_plural="Advantages"
								{width}
							/>
						</div>
					{/if}

					<!-- Features from Base Form 0 -->
					{#if base_form_0.features.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Features from {base_form_0.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.mythic_hybrid_base_forms_0_features
								}
								max={3}
								options={base_form_0.features.map((feat, i) => ({
									selection_id: i.toString(),
									title: feat.title,
									short_title: feat.title
								}))}
								term="Feature"
								term_plural="Features"
								{width}
							/>
						</div>
					{/if}

					<!-- Features from Base Form 1 -->
					{#if base_form_1.features.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Features from {base_form_1.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.mythic_hybrid_base_forms_1_features
								}
								max={3}
								options={base_form_1.features.map((feat, i) => ({
									selection_id: i.toString(),
									title: feat.title,
									short_title: feat.title
								}))}
								term="Feature"
								term_plural="Features"
								{width}
							/>
						</div>
					{/if}

					<!-- Features from Base Form 2 -->
					{#if base_form_2.features.length > 0}
						<div class="flex flex-col gap-1">
							<span class="text-xs font-medium">Features from {base_form_2.name}:</span>
							<ChoiceSelector
								class="w-full border-black/30 bg-white font-medium text-background hover:bg-black/10 data-[placeholder]:text-muted [&_svg:not([class*='text-'])]:text-muted"
								bind:selected_ids={
									character.chosen_beastform.choices.mythic_hybrid_base_forms_2_features
								}
								max={3}
								options={base_form_2.features.map((feat, i) => ({
									selection_id: i.toString(),
									title: feat.title,
									short_title: feat.title
								}))}
								term="Feature"
								term_plural="Features"
								{width}
							/>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
{/snippet}
