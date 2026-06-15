<script lang="ts">
	import type { CardOption } from '@convex/schemas/rules';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Dropdown from '$lib/components/utility/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { cn } from '$lib/utils';
	import { emptyArbitraryCardOption, emptyCardSelection } from './defaults';
	import {
		homebrewErrorsAt,
		homebrewHasErrorsBelow,
		type HomebrewErrorPath,
		type HomebrewErrorSummary
	} from '$lib/components/homebrew/forms/helpers';

	let {
		options = $bindable(),
		errorSummary,
		path = ['options']
	}: {
		options?: CardOption[];
		errorSummary: HomebrewErrorSummary;
		path?: HomebrewErrorPath;
	} = $props();

	const currentOptions = $derived(options ?? []);
	const arbitraryOptions = $derived(currentOptions.filter((option) => option.type === 'arbitrary'));
	const choiceTypeOptions = ['arbitrary', 'experience'] as const;

	function getOptionIndex(choiceIndex: number): number {
		return choiceIndex >= 0 && choiceIndex < currentOptions.length ? choiceIndex : -1;
	}

	function choicePath(choiceIndex: number, ...suffix: HomebrewErrorPath): HomebrewErrorPath {
		const optionIndex = getOptionIndex(choiceIndex);
		return optionIndex >= 0 ? [...path, optionIndex, ...suffix] : path;
	}

	function choiceHasErrors(choiceIndex: number): boolean {
		const optionIndex = getOptionIndex(choiceIndex);
		return optionIndex >= 0 && homebrewHasErrorsBelow(errorSummary, choicePath(choiceIndex));
	}

	function choiceNameError(choiceIndex: number): string | undefined {
		const optionIndex = getOptionIndex(choiceIndex);
		if (optionIndex < 0) return undefined;
		return homebrewErrorsAt(errorSummary, choicePath(choiceIndex, 'choice_id'))[0];
	}

	function choiceHasSelectionErrors(choiceIndex: number): boolean {
		const optionIndex = getOptionIndex(choiceIndex);
		if (optionIndex < 0) return false;
		return homebrewHasErrorsBelow(errorSummary, choicePath(choiceIndex, 'options'));
	}

	function selectionHasTitleError(choiceIndex: number, selectionIndex: number): boolean {
		const optionIndex = getOptionIndex(choiceIndex);
		if (optionIndex < 0) return false;
		return (
			homebrewErrorsAt(errorSummary, choicePath(choiceIndex, 'options', selectionIndex, 'title'))
				.length > 0
		);
	}

	function generateSelectionId(title: string) {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '_')
			.replace(/-/g, '_')
			.replace(/_+/g, '_')
			.replace(/^_|_$/g, '');
	}

	function nextId(prefix: string, usedIds: string[]) {
		let index = usedIds.length + 1;
		let id = `${prefix}_${index}`;
		const used = new Set(usedIds.map((usedId) => usedId.trim().toLowerCase()));

		while (used.has(id.toLowerCase())) {
			index += 1;
			id = `${prefix}_${index}`;
		}

		return id;
	}

	function isGeneratedChoiceId(choiceId: string) {
		return /^choice_\d+$/.test(choiceId.trim());
	}

	function getChoiceDisplayName(option: CardOption) {
		return isGeneratedChoiceId(option.choice_id) ? '' : option.choice_id;
	}

	function getChoiceLabel(option: CardOption) {
		return getChoiceDisplayName(option) || 'Unnamed Choice';
	}

	function getSelectionLabel(
		selection: Extract<CardOption, { type: 'arbitrary' }>['options'][number]
	) {
		return selection.title.trim() || selection.short_title.trim() || 'Unnamed Option';
	}

	function choiceIdsExcept(choiceToExclude?: CardOption) {
		return currentOptions
			.filter((option) => option !== choiceToExclude)
			.map((option) => option.choice_id);
	}

	function selectionIdsExcept(
		choice: Extract<CardOption, { type: 'arbitrary' }>,
		selectionIndexToExclude?: number
	) {
		return choice.options
			.filter((_, index) => index !== selectionIndexToExclude)
			.map((selection) => selection.selection_id);
	}

	function availableConditionalChoicesFor(optionToExclude: CardOption) {
		return arbitraryOptions.filter(
			(option) =>
				option !== optionToExclude &&
				option.choice_id.trim() !== '' &&
				option.options.some((selection) => selection.selection_id.trim() !== '')
		);
	}

	function addChoice() {
		const choiceId = nextId(
			'choice',
			currentOptions.map((option) => option.choice_id)
		);
		options = [...currentOptions, emptyArbitraryCardOption(choiceId, 'option_1')];
	}

	function removeChoice(choiceIndex: number) {
		const choiceToRemove = currentOptions[choiceIndex];
		if (!choiceToRemove) return;

		options = currentOptions
			.map((option) => {
				if (option === choiceToRemove) return null;
				if (option.conditional_choice?.choice_id === choiceToRemove.choice_id) {
					return { ...option, conditional_choice: null };
				}
				return option;
			})
			.filter((option): option is CardOption => option !== null);
	}

	function updateChoiceField(
		choiceIndex: number,
		field: 'choice_id' | 'max',
		value: string | number
	) {
		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate) return;

		const nextValue =
			field === 'choice_id' && typeof value === 'string'
				? generateSelectionId(value) || nextId('choice', choiceIdsExcept(choiceToUpdate))
				: value;

		options = currentOptions.map((option) =>
			option === choiceToUpdate ? { ...option, [field]: nextValue } : option
		);
	}

	function updateChoiceType(choiceIndex: number, type: (typeof choiceTypeOptions)[number]) {
		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate) return;

		options = currentOptions.map((option) => {
			if (option !== choiceToUpdate) return option;
			if (type === 'experience') {
				return {
					type: 'experience',
					choice_id: option.choice_id,
					max: option.max,
					conditional_choice: option.conditional_choice
				};
			}

			return {
				type: 'arbitrary',
				choice_id: option.choice_id,
				max: option.max,
				conditional_choice: option.conditional_choice,
				options: [emptyCardSelection('option_1')]
			};
		});
	}

	function addSelection(choiceIndex: number) {
		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate || choiceToUpdate.type !== 'arbitrary') return;
		const selectionId = nextId(
			'option',
			choiceToUpdate.options.map((selection) => selection.selection_id)
		);

		options = currentOptions.map((option) =>
			option === choiceToUpdate
				? {
						...option,
						options: [...option.options, emptyCardSelection(selectionId)]
					}
				: option
		);
	}

	function removeSelection(choiceIndex: number, selectionIndex: number) {
		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate || choiceToUpdate.type !== 'arbitrary') return;

		options = currentOptions.map((option) =>
			option === choiceToUpdate
				? {
						...option,
						options: option.options.filter((_, currentIndex) => currentIndex !== selectionIndex)
					}
				: option
		);
	}

	function updateSelectionField(
		choiceIndex: number,
		selectionIndex: number,
		field: 'title' | 'selection_id' | 'short_title',
		value: string
	) {
		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate || choiceToUpdate.type !== 'arbitrary') return;

		options = currentOptions.map((option) => {
			if (option !== choiceToUpdate || option.type !== 'arbitrary') return option;
			return {
				...option,
				options: option.options.map((selection, currentIndex) => {
					if (currentIndex !== selectionIndex) return selection;
					const updated = { ...selection, [field]: value };
					if (field === 'title') {
						updated.selection_id =
							generateSelectionId(value) ||
							nextId('option', selectionIdsExcept(option, selectionIndex));
						updated.short_title = value;
					}
					return updated;
				})
			};
		});
	}

	function updateConditionalChoice(
		choiceIndex: number,
		field: 'choice_id' | 'selection_id' | null,
		value: string | null
	) {
		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate) return;

		options = currentOptions.map((option) => {
			if (option !== choiceToUpdate) return option;
			if (field === null || value === null) {
				return { ...option, conditional_choice: null };
			}
			return {
				...option,
				conditional_choice: {
					choice_id: field === 'choice_id' ? value : (option.conditional_choice?.choice_id ?? ''),
					selection_id:
						field === 'selection_id' ? value : (option.conditional_choice?.selection_id ?? '')
				}
			};
		});
	}

	function toggleConditionalChoice(choiceIndex: number, checked: boolean) {
		if (!checked) {
			updateConditionalChoice(choiceIndex, null, null);
			return;
		}

		const choiceToUpdate = currentOptions[choiceIndex];
		if (!choiceToUpdate) return;
		const firstAvailableChoice = availableConditionalChoicesFor(choiceToUpdate)[0];
		if (!firstAvailableChoice || firstAvailableChoice.type !== 'arbitrary') return;

		options = currentOptions.map((option) =>
			option === currentOptions[choiceIndex]
				? {
						...option,
						conditional_choice: {
							choice_id: firstAvailableChoice.choice_id,
							selection_id: firstAvailableChoice.options[0]?.selection_id ?? ''
						}
					}
				: option
		);
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<p class="text-xs font-medium text-muted-foreground">Choices</p>
		<Button type="button" size="sm" variant="outline" onclick={addChoice}>
			<Plus class="size-3.5" />
			Add Choice
		</Button>
	</div>

	<div class="flex flex-col gap-3">
		{#each currentOptions as option, choiceIndex (choiceIndex)}
			{@const hasChoiceErrors = choiceHasErrors(choiceIndex)}
			{@const nameError = choiceNameError(choiceIndex)}
			{@const hasSelectionErrors = choiceHasSelectionErrors(choiceIndex)}
			{@const availableConditionalChoices = availableConditionalChoicesFor(option)}
			{@const canUseConditionalChoice = availableConditionalChoices.length > 0}
			{@const conditionalChoiceId = `conditional-choice-${choiceIndex}`}
			<Dropdown
				title={getChoiceLabel(option)}
				class={hasChoiceErrors
					? 'data-[open=false]:border data-[open=false]:border-destructive'
					: ''}
			>
				<div class="flex flex-col gap-4">
					<div class="flex gap-2">
						<div class="flex flex-1 flex-col gap-1">
							<label
								class={cn('text-xs text-muted-foreground', nameError && 'text-destructive')}
								for={`choice-name-${choiceIndex}`}
							>
								Name
							</label>
							<Input
								id={`choice-name-${choiceIndex}`}
								value={getChoiceDisplayName(option)}
								class={nameError ? 'border-destructive' : ''}
								oninput={(event) =>
									updateChoiceField(choiceIndex, 'choice_id', event.currentTarget.value)}
								placeholder="Name"
							/>
						</div>
						<div class="flex w-24 flex-col gap-1">
							<label class="text-xs text-muted-foreground" for={`choice-max-${choiceIndex}`}
								>Max Answers</label
							>
							<Input
								id={`choice-max-${choiceIndex}`}
								type="number"
								value={String(option.max)}
								min="1"
								oninput={(event) =>
									updateChoiceField(choiceIndex, 'max', Number(event.currentTarget.value))}
							/>
						</div>
					</div>

					<div class="flex flex-col gap-1">
						<p class="text-xs text-muted-foreground">Choice Type</p>
						<Select.Root
							type="single"
							value={option.type}
							onValueChange={(value) =>
								value && updateChoiceType(choiceIndex, value as (typeof choiceTypeOptions)[number])}
						>
							<Select.Trigger class="w-full">
								<p class="truncate">{option.type}</p>
							</Select.Trigger>
							<Select.Content>
								{#each choiceTypeOptions as choiceType}
									<Select.Item value={choiceType}>{choiceType}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-2">
							<Checkbox
								aria-label="Hidden until another choice is answered"
								checked={option.conditional_choice !== null}
								disabled={!canUseConditionalChoice}
								id={conditionalChoiceId}
								onCheckedChange={(checked) =>
									toggleConditionalChoice(choiceIndex, checked === true)}
							/>
							<label
								for={conditionalChoiceId}
								class={cn(
									'cursor-pointer text-xs text-muted-foreground',
									!canUseConditionalChoice && 'cursor-not-allowed opacity-50'
								)}
							>
								Hidden until another choice is answered
							</label>
						</div>

						{#if option.conditional_choice}
							{@const selectedConditionalChoice = arbitraryOptions.find(
								(currentOption) => currentOption.choice_id === option.conditional_choice?.choice_id
							)}
							{@const availableConditionalAnswers =
								selectedConditionalChoice?.type === 'arbitrary'
									? selectedConditionalChoice.options.filter((selection) => selection.selection_id)
									: []}
							{@const selectedConditionalAnswer =
								selectedConditionalChoice?.type === 'arbitrary'
									? selectedConditionalChoice.options.find(
											(selection) =>
												selection.selection_id === option.conditional_choice?.selection_id
										)
									: undefined}
							<div class="grid grid-cols-2 gap-2">
								<div class="flex flex-col gap-1">
									<p class="text-xs text-muted-foreground">Choice</p>
									<Select.Root
										type="single"
										value={option.conditional_choice.choice_id}
										onValueChange={(value) => {
											if (!value) return;
											const selectedChoice = arbitraryOptions.find(
												(currentOption) =>
													currentOption !== option && currentOption.choice_id === value
											);
											updateConditionalChoice(choiceIndex, 'choice_id', value);
											if (selectedChoice?.type === 'arbitrary') {
												updateConditionalChoice(
													choiceIndex,
													'selection_id',
													selectedChoice.options[0]?.selection_id ?? ''
												);
											}
										}}
									>
										<Select.Trigger class="w-full">
											<p class="truncate">
												{availableConditionalChoices.length === 0
													? 'Select'
													: selectedConditionalChoice
														? getChoiceLabel(selectedConditionalChoice)
														: 'Select a choice'}
											</p>
										</Select.Trigger>
										<Select.Content>
											{#if availableConditionalChoices.length === 0}
												<Select.Item value="" disabled>None</Select.Item>
											{:else}
												{#each availableConditionalChoices as otherChoice}
													<Select.Item value={otherChoice.choice_id}
														>{getChoiceLabel(otherChoice)}</Select.Item
													>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs text-muted-foreground">Required Answer</p>
									<Select.Root
										type="single"
										value={option.conditional_choice.selection_id}
										onValueChange={(value) =>
											value && updateConditionalChoice(choiceIndex, 'selection_id', value)}
									>
										<Select.Trigger class="w-full">
											<p class="truncate">
												{availableConditionalAnswers.length === 0
													? 'Select'
													: selectedConditionalChoice?.type === 'arbitrary'
														? selectedConditionalAnswer
															? getSelectionLabel(selectedConditionalAnswer)
															: 'Select an answer'
														: 'Select an answer'}
											</p>
										</Select.Trigger>
										<Select.Content>
											{#if availableConditionalAnswers.length === 0}
												<Select.Item value="" disabled>None</Select.Item>
											{:else if selectedConditionalChoice?.type === 'arbitrary'}
												{#each availableConditionalAnswers as selection}
													<Select.Item value={selection.selection_id}
														>{getSelectionLabel(selection)}</Select.Item
													>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								</div>
							</div>
						{/if}
					</div>

					{#if option.type === 'arbitrary'}
						<div class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<p
									class={cn(
										'text-xs text-muted-foreground',
										hasSelectionErrors && 'text-destructive'
									)}
								>
									Options
								</p>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onclick={() => addSelection(choiceIndex)}
								>
									<Plus class="size-3.5" />
									Add Option
								</Button>
							</div>
							<div class="flex flex-col gap-2">
								{#each option.options as selection, selectionIndex (selectionIndex)}
									{@const selectionHasNameError = selectionHasTitleError(
										choiceIndex,
										selectionIndex
									)}
									<div class="flex items-center gap-2">
										<div class="flex-1">
											<Input
												value={selection.title}
												placeholder="Name"
												class={selectionHasNameError ? 'border-destructive' : ''}
												oninput={(event) =>
													updateSelectionField(
														choiceIndex,
														selectionIndex,
														'title',
														event.currentTarget.value
													)}
											/>
										</div>
										<Button
											disabled={option.options.length === 1}
											type="button"
											size="sm"
											variant="ghost"
											class="shrink-0"
											onclick={() => removeSelection(choiceIndex, selectionIndex)}
										>
											<X class="size-4" />
										</Button>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<div class="flex justify-end pt-2">
						<Button
							type="button"
							size="sm"
							variant="link"
							class="text-destructive"
							onclick={() => removeChoice(choiceIndex)}
						>
							Delete Choice
						</Button>
					</div>
				</div>
			</Dropdown>
		{:else}
			<p class="text-xs italic text-muted-foreground">No choices added</p>
		{/each}
	</div>
</div>
