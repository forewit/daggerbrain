<script lang="ts">
	import type { AncestryCardChoice } from '@shared/types/compendium.types';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import Dropdown from '../../leveling/dropdown.svelte';
	import { tick } from 'svelte';

	let {
		choices = $bindable(),
		featureCount = 0,
		errors = new Map<number, string[]>()
	}: {
		choices: AncestryCardChoice[];
		featureCount: number;
		errors?: Map<number, string[]>;
	} = $props();

	const choiceTypeOptions = ['arbitrary', 'experience'] as const;

	// Track which dropdowns are open by stable index-based key
	let dropdownOpenStates = $state<Record<string, boolean>>({});

	let arbitraryChoices = $derived(choices.filter(c => c.type === 'arbitrary'));

	// Helper to get a stable key for a choice based on index
	function getChoiceKey(indexInFiltered: number): string {
		return `choice_${indexInFiltered}`;
	}

	function generateSelectionId(title: string): string {
		if (!title || title.trim() === '') return '';

		return title
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
			.replace(/\s+/g, '_') // Replace spaces with underscores
			.replace(/-/g, '_') // Replace hyphens with underscores
			.replace(/_+/g, '_') // Replace multiple underscores with single
			.replace(/^_|_$/g, ''); // Remove leading/trailing underscores
	}

	function addChoice() {
		const newChoice: AncestryCardChoice = {
			choice_id: '',
			feature_index: 0,
			conditional_choice: null,
			type: 'arbitrary',
			max: 1,
			options: [
				{
					selection_id: '',
					title: '',
					short_title: ''
				}
			]
		};
		choices = [...choices, newChoice];
		const newIndex = arbitraryChoices.length - 1;
		const stableKey = getChoiceKey(newIndex);
		dropdownOpenStates = { ...dropdownOpenStates, [stableKey]: true };

		tick().then(() => {
			dropdownOpenStates = { ...dropdownOpenStates, [stableKey]: false };
		});
	}

	function removeChoice(index: number) {
		// Find the actual choice in the filtered arbitrary choices
		const choiceToRemove = arbitraryChoices[index];
		if (!choiceToRemove) return;
		
		// Get the choice_id of the choice being removed
		const removedChoiceId = choiceToRemove.choice_id;
		
		// Remove the choice and clean up conditional_choice references
		choices = choices.map((choice) => {
			// If this is the choice being removed, exclude it
			if (choice === choiceToRemove) {
				return null; // Mark for removal
			}
			
			// If this choice has a conditional_choice pointing to the removed choice, clear it
			if (
				choice.conditional_choice &&
				choice.conditional_choice.choice_id === removedChoiceId
			) {
				return {
					...choice,
					conditional_choice: null
				};
			}
			
			return choice;
		}).filter((c): c is AncestryCardChoice => c !== null);
		
		// Clean up dropdown state
		const key = getChoiceKey(index);
		const next = { ...dropdownOpenStates };
		delete next[key];
		dropdownOpenStates = next;
	}

	function addOption(choiceIndex: number) {
		const newOption = {
			selection_id: '',
			title: '',
			short_title: ''
		};
		const choiceToUpdate = arbitraryChoices[choiceIndex];
		if (!choiceToUpdate) return;
		
		const actualIndex = choices.findIndex(c => c === choiceToUpdate);
		if (actualIndex === -1) return;
		
		choices = choices.map((choice, i) => {
			if (i === actualIndex && choice.type === 'arbitrary') {
				return {
					...choice,
					options: [...choice.options, newOption]
				};
			}
			return choice;
		});
	}

	function removeOption(choiceIndex: number, optionIndex: number) {
		const choiceToUpdate = arbitraryChoices[choiceIndex];
		if (!choiceToUpdate) return;
		
		const actualIndex = choices.findIndex(c => c === choiceToUpdate);
		if (actualIndex === -1) return;
		
		choices = choices.map((choice, i) => {
			if (i === actualIndex && choice.type === 'arbitrary') {
				return {
					...choice,
					options: choice.options.filter((_, j) => j !== optionIndex)
				};
			}
			return choice;
		});
	}

	function updateChoiceField(choiceIndex: number, field: string, value: unknown) {
		const choiceToUpdate = arbitraryChoices[choiceIndex];
		if (!choiceToUpdate) return;
		
		const actualIndex = choices.findIndex(c => c === choiceToUpdate);
		if (actualIndex === -1) return;
		
		choices = choices.map((choice, i) => {
			if (i === actualIndex) {
				return { ...choice, [field]: value };
			}
			return choice;
		});
	}

	function updateOptionField(
		choiceIndex: number,
		optionIndex: number,
		field: string,
		value: string
	) {
		const choiceToUpdate = arbitraryChoices[choiceIndex];
		if (!choiceToUpdate) return;
		
		const actualIndex = choices.findIndex(c => c === choiceToUpdate);
		if (actualIndex === -1) return;
		
		choices = choices.map((choice, i) => {
			if (i === actualIndex && choice.type === 'arbitrary') {
				return {
					...choice,
					options: choice.options.map((option, j) => {
						if (j === optionIndex) {
							const updated = { ...option, [field]: value };
							// Auto-generate selection_id from title
							if (field === 'title') {
								updated.selection_id = generateSelectionId(value);
								// Set short_title equal to title
								updated.short_title = value;
							}
							return updated;
						}
						return option;
					})
				};
			}
			return choice;
		});
	}

	function updateConditionalChoice(
		choiceIndex: number,
		field: 'choice_id' | 'selection_id' | null,
		value: string | null
	) {
		const choiceToUpdate = arbitraryChoices[choiceIndex];
		if (!choiceToUpdate) return;
		
		const actualIndex = choices.findIndex(c => c === choiceToUpdate);
		if (actualIndex === -1) return;
		
		choices = choices.map((choice, i) => {
			if (i === actualIndex) {
				if (field === null) {
					return { ...choice, conditional_choice: null };
				}
				if (value === null) {
					return { ...choice, conditional_choice: null };
				}
				return {
					...choice,
					conditional_choice: {
						choice_id: field === 'choice_id' ? value : choice.conditional_choice?.choice_id || '',
						selection_id:
							field === 'selection_id' ? value : choice.conditional_choice?.selection_id || ''
					}
				};
			}
			return choice;
		});
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
		{#each arbitraryChoices as choice, choiceIndex (choiceIndex)}
			{@const choiceKey = getChoiceKey(choiceIndex)}
			{@const choiceErrors = errors.get(choiceIndex) || []}

			<Dropdown
				title={choice.choice_id || 'Unnamed choice'}
				open={dropdownOpenStates[choiceKey] ?? false}
				onOpenChange={(v) => {
					dropdownOpenStates = { ...dropdownOpenStates, [choiceKey]: v };
				}}
				class={errors.has(choiceIndex)
					? 'data-[open=false]:border data-[open=false]:border-destructive'
					: ''}
			>
				<div class="flex flex-col gap-4">
					<div class="flex gap-2">
						<!-- Choice Name -->
						<div class="flex flex-col gap-1 flex-1">
							<label for="ancestry-choice-id-{choiceIndex}" class="text-xs text-muted-foreground"
								>Name</label
							>
							<Input
								id="ancestry-choice-id-{choiceIndex}"
								value={choice.choice_id}
								oninput={(e) => updateChoiceField(choiceIndex, 'choice_id', e.currentTarget.value)}
								placeholder="Name for this choice"
								class={choiceErrors.length > 0 ? 'border-destructive' : ''}
							/>
							{#if choiceErrors.length > 0}
								{#each choiceErrors as error}
									<p class="text-xs text-destructive">{error}</p>
								{/each}
							{/if}
						</div>

						<!-- Feature Index -->
						<div class="flex flex-col gap-1 w-32">
							<label for="ancestry-feature-index-{choiceIndex}" class="text-xs text-muted-foreground"
								>Feature Index</label
							>
							<Input
								id="ancestry-feature-index-{choiceIndex}"
								type="number"
								value={String(choice.feature_index)}
								oninput={(e) =>
									updateChoiceField(choiceIndex, 'feature_index', Number(e.currentTarget.value))}
								placeholder="0"
								min="0"
								max={Math.max(0, featureCount - 1)}
							/>
						</div>

						<!-- Max Answers -->
						<div class="flex flex-col gap-1 w-24">
							<label for="ancestry-max-selections-{choiceIndex}" class="text-xs text-muted-foreground"
								>Max Answers</label
							>
							<Input
								id="ancestry-max-selections-{choiceIndex}"
								type="number"
								value={String(choice.max)}
								oninput={(e) => updateChoiceField(choiceIndex, 'max', Number(e.currentTarget.value))}
								placeholder="1"
								min="1"
							/>
						</div>
					</div>

					<!-- Choice Type -->
					<div class="flex flex-col gap-1">
						<label for="ancestry-choice-type-{choiceIndex}" class="text-xs text-muted-foreground"
							>Choice Type</label
						>
						<Select.Root
							type="single"
							value={choice.type}
							onValueChange={(v) => {
								if (v) {
									const newType = v as 'arbitrary' | 'experience';
									updateChoiceField(choiceIndex, 'type', newType);
									if (newType === 'experience') {
										updateChoiceField(choiceIndex, 'options', []);
									} else if (newType === 'arbitrary') {
										// Always initialize options array when switching to arbitrary
										updateChoiceField(choiceIndex, 'options', []);
									}
								}
							}}
						>
							<Select.Trigger id="ancestry-choice-type-{choiceIndex}" class="w-full">
								<p class="truncate">{choice.type}</p>
							</Select.Trigger>
							<Select.Content>
								{#each choiceTypeOptions as type}
									<Select.Item value={type}>{type}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Conditional Choice -->
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-2">
							<Checkbox
								id="ancestry-conditional-checkbox-{choiceIndex}"
								checked={choice.conditional_choice !== null}
								onCheckedChange={(checked: boolean) => {
									if (!checked) {
										updateConditionalChoice(choiceIndex, null, null);
									} else {
										// Initialize with empty values when checked
										updateConditionalChoice(choiceIndex, 'choice_id', '');
									}
								}}
							/>
							<label
								for="ancestry-conditional-checkbox-{choiceIndex}"
								class="text-xs text-muted-foreground cursor-pointer"
							>
								Hidden until another choice is answered
							</label>
						</div>
						{#if choice.conditional_choice !== null}
							<div class="grid grid-cols-2 gap-2">
								<div class="flex flex-col gap-1 flex-1">
									<label
										for="ancestry-conditional-choice-select-{choiceIndex}"
										class="text-xs text-muted-foreground">Choice</label
									>
									<Select.Root
										type="single"
										value={choice.conditional_choice?.choice_id || ''}
										onValueChange={(value) => {
											if (value) {
												const selectedChoice = arbitraryChoices.find((c, idx) => idx !== choiceIndex && c.choice_id === value);
												updateConditionalChoice(choiceIndex, 'choice_id', value);
												// Auto-select first option if available
												if (selectedChoice?.type === 'arbitrary' && selectedChoice.options.length > 0) {
													updateConditionalChoice(choiceIndex, 'selection_id', selectedChoice.options[0].selection_id);
												}
											} else {
												updateConditionalChoice(choiceIndex, null, null);
											}
										}}
									>
										<Select.Trigger id="ancestry-conditional-choice-select-{choiceIndex}" class="w-full">
											<p class="truncate">
												{choice.conditional_choice?.choice_id || 'Select a choice'}
											</p>
										</Select.Trigger>
										<Select.Content>
											{#if arbitraryChoices.length <= 1}
												<Select.Item value="" disabled>None</Select.Item>
											{/if}
											{#each arbitraryChoices as otherChoice, otherIndex}
												{#if otherIndex !== choiceIndex && otherChoice.choice_id}
													<Select.Item value={otherChoice.choice_id}>
														{otherChoice.choice_id}
													</Select.Item>
												{/if}
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
								{#if choice.conditional_choice?.choice_id}
									{@const selectedConditionalChoice = arbitraryChoices.find((c) => c.choice_id === choice.conditional_choice?.choice_id)}
									{#if selectedConditionalChoice}
										<div class="flex flex-col gap-1 flex-1">
											<label
												for="ancestry-conditional-selection-select-{choiceIndex}"
												class="text-xs text-muted-foreground">Answer</label
											>
											<Select.Root
												type="single"
												value={choice.conditional_choice?.selection_id || ''}
												onValueChange={(value) => {
													if (value) {
														updateConditionalChoice(choiceIndex, 'selection_id', value);
													}
												}}
											>
												<Select.Trigger id="ancestry-conditional-selection-select-{choiceIndex}" class="w-full">
													<p class="truncate">
														{selectedConditionalChoice.options.find((opt) => opt.selection_id === choice.conditional_choice?.selection_id)?.title || 'Select an answer'}
													</p>
												</Select.Trigger>
												<Select.Content>
													{#each selectedConditionalChoice.options as option}
														<Select.Item value={option.selection_id}>
															{option.title}
														</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
										</div>
									{/if}
								{:else}
									<div class="flex flex-col gap-1 flex-1">
										<label
											for="ancestry-conditional-selection-select-{choiceIndex}"
											class="text-xs text-muted-foreground">Answer</label
										>
										<Select.Root
											type="single"
											value=""
											disabled={true}
										>
											<Select.Trigger id="ancestry-conditional-selection-select-{choiceIndex}" class="w-full" disabled>
												<p class="truncate">Select a choice first</p>
											</Select.Trigger>
										</Select.Root>
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Options (for arbitrary type) -->
					{#if choice.type === 'arbitrary'}
						<div class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<p class="text-xs text-muted-foreground">Options</p>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onclick={() => addOption(choiceIndex)}
								>
									<Plus class="size-3.5" />
									Add Option
								</Button>
							</div>
							<div class="flex flex-col gap-2">
								{#each choice.options as option, optionIndex (optionIndex)}
									<div class="flex items-center gap-2">
										<Input
											value={option.title}
											oninput={(e) =>
												updateOptionField(
													choiceIndex,
													optionIndex,
													'title',
													e.currentTarget.value
												)}
											onblur={(e) => {
												// Auto-generate selection_id from title on blur
												const title = e.currentTarget.value;
												if (title && title.trim() !== '') {
													const generatedId = generateSelectionId(title);
													if (generatedId && generatedId !== option.selection_id) {
														updateOptionField(choiceIndex, optionIndex, 'selection_id', generatedId);
													}
												}
											}}
											placeholder="Option title"
											class="flex-1"
										/>
										<Button
											type="button"
											size="sm"
											variant="ghost"
											onclick={() => removeOption(choiceIndex, optionIndex)}
											class="shrink-0"
										>
											<X class="size-4" />
										</Button>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Delete Choice Button -->
					<div class="flex justify-end pt-2">
						<Button
							type="button"
							size="sm"
							variant="link"
							onclick={() => removeChoice(choiceIndex)}
							class="text-destructive"
							title="Remove choice"
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