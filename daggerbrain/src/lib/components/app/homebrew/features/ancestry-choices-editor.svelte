<script lang="ts">
	import type { AncestryCardChoice } from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';

	let {
		choices = $bindable(),
		featureCount = 0
	}: {
		choices: AncestryCardChoice[];
		featureCount: number;
	} = $props();

	const choiceTypeOptions = ['arbitrary', 'experience'] as const;

	function addChoice() {
		const newChoice: AncestryCardChoice = {
			choice_id: '',
			feature_index: 0,
			conditional_choice: null,
			type: 'arbitrary',
			max: 1,
			options: []
		};
		choices = [...choices, newChoice];
	}

	function removeChoice(index: number) {
		choices = choices.filter((_, i) => i !== index);
	}

	function addOption(choiceIndex: number) {
		const newOption = {
			selection_id: '',
			title: '',
			short_title: ''
		};
		choices = choices.map((choice, i) => {
			if (i === choiceIndex && choice.type === 'arbitrary') {
				return {
					...choice,
					options: [...choice.options, newOption]
				};
			}
			return choice;
		});
	}

	function removeOption(choiceIndex: number, optionIndex: number) {
		choices = choices.map((choice, i) => {
			if (i === choiceIndex && choice.type === 'arbitrary') {
				return {
					...choice,
					options: choice.options.filter((_, j) => j !== optionIndex)
				};
			}
			return choice;
		});
	}

	function updateChoiceField(choiceIndex: number, field: string, value: unknown) {
		choices = choices.map((choice, i) => {
			if (i === choiceIndex) {
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
		choices = choices.map((choice, i) => {
			if (i === choiceIndex && choice.type === 'arbitrary') {
				return {
					...choice,
					options: choice.options.map((option, j) => {
						if (j === optionIndex) {
							return { ...option, [field]: value };
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
		choices = choices.map((choice, i) => {
			if (i === choiceIndex) {
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
		{#each choices as choice, choiceIndex (choiceIndex)}
			<div class="rounded-lg border bg-muted p-3">
				<div class="mb-2 flex items-center justify-between">
					<p class="text-xs font-medium">Choice {choiceIndex + 1}</p>
					<Button type="button" size="sm" variant="ghost" onclick={() => removeChoice(choiceIndex)}>
						<X class="size-3.5" />
					</Button>
				</div>

				<div class="flex flex-col gap-3">
					<!-- Choice ID -->
					<div class="flex flex-col gap-1">
						<label for="ancestry-choice-id-{choiceIndex}" class="text-xs text-muted-foreground"
							>Choice ID</label
						>
						<Input
							id="ancestry-choice-id-{choiceIndex}"
							value={choice.choice_id}
							oninput={(e) => updateChoiceField(choiceIndex, 'choice_id', e.currentTarget.value)}
							placeholder="choice_id"
						/>
					</div>

					<!-- Feature Index -->
					<div class="flex flex-col gap-1">
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

					<!-- Max -->
					<div class="flex flex-col gap-1">
						<label for="ancestry-max-selections-{choiceIndex}" class="text-xs text-muted-foreground"
							>Max Selections</label
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

					<!-- Conditional Choice -->
					<div class="flex flex-col gap-2">
						<p class="text-xs text-muted-foreground">Conditional Choice (Optional)</p>
						<div class="grid grid-cols-2 gap-2">
							<div class="flex flex-col gap-1">
								<label
									for="ancestry-conditional-choice-id-{choiceIndex}"
									class="text-xs text-muted-foreground">Choice ID</label
								>
								<Input
									id="ancestry-conditional-choice-id-{choiceIndex}"
									value={choice.conditional_choice?.choice_id || ''}
									oninput={(e) =>
										updateConditionalChoice(
											choiceIndex,
											'choice_id',
											e.currentTarget.value || null
										)}
									placeholder="choice_id"
								/>
							</div>
							<div class="flex flex-col gap-1">
								<label
									for="ancestry-conditional-selection-id-{choiceIndex}"
									class="text-xs text-muted-foreground">Selection ID</label
								>
								<Input
									id="ancestry-conditional-selection-id-{choiceIndex}"
									value={choice.conditional_choice?.selection_id || ''}
									oninput={(e) =>
										updateConditionalChoice(
											choiceIndex,
											'selection_id',
											e.currentTarget.value || null
										)}
									placeholder="selection_id"
								/>
							</div>
						</div>
						<Button
							type="button"
							size="sm"
							variant="link"
							onclick={() => updateConditionalChoice(choiceIndex, null, null)}
							class="w-min text-xs"
						>
							Clear Conditional Choice
						</Button>
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
									<div class="rounded border bg-background p-2">
										<div class="mb-2 flex items-center justify-between">
											<p class="text-xs font-medium">Option {optionIndex + 1}</p>
											<Button
												type="button"
												size="sm"
												variant="ghost"
												onclick={() => removeOption(choiceIndex, optionIndex)}
											>
												<X class="size-3.5" />
											</Button>
										</div>
										<div class="flex flex-col gap-2">
											<Input
												value={option.selection_id}
												oninput={(e) =>
													updateOptionField(
														choiceIndex,
														optionIndex,
														'selection_id',
														e.currentTarget.value
													)}
												placeholder="selection_id"
											/>
											<Input
												value={option.title}
												oninput={(e) =>
													updateOptionField(
														choiceIndex,
														optionIndex,
														'title',
														e.currentTarget.value
													)}
												placeholder="Title"
											/>
											<Input
												value={option.short_title}
												oninput={(e) =>
													updateOptionField(
														choiceIndex,
														optionIndex,
														'short_title',
														e.currentTarget.value
													)}
												placeholder="Short Title"
											/>
										</div>
									</div>
								{:else}
									<p class="text-xs italic text-muted-foreground">No options added</p>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<p class="text-xs italic text-muted-foreground">No choices added</p>
		{/each}
	</div>
</div>
