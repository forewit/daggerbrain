<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { type Traits } from '$lib/types/compendium-types';
	import * as Select from '$lib/components/ui/select';
	import { capitalize } from '$lib/utils';
	import { cn } from '$lib/utils';
	import { TRAIT_OPTIONS } from '$lib/types/rules';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	const context = getCharacterContext();
	let character = $derived(context.character);

	// Map each trait to its selected option index (or null)
	let traitIndices = $derived.by(() => {
		if (!character) return {};
		const indices: Record<string, number | null> = {};
		const usedIndices = new Set<number>();

		for (const [trait, value] of Object.entries(character.selected_traits)) {
			if (value === null) {
				indices[trait] = null;
			} else {
				// Find first available index with this value
				const index = TRAIT_OPTIONS.findIndex((opt, i) => opt === value && !usedIndices.has(i));
				indices[trait] = index >= 0 ? index : null;
				if (index >= 0) usedIndices.add(index);
			}
		}
		return indices;
	});

	// Check if an option index is already used by another trait
	function isOptionDisabled(currentTrait: string, optionIndex: number): boolean {
		return Object.entries(traitIndices).some(
			([trait, index]) => trait !== currentTrait && index === optionIndex
		);
	}

	function clearAllTraits() {
		if (!character) return;
		character.selected_traits = {
			agility: null,
			strength: null,
			finesse: null,
			instinct: null,
			presence: null,
			knowledge: null
		};
	}

	let hasSelectedTraits = $derived.by(() => {
		if (!character) return false;
		return Object.values(character.selected_traits).some((val) => val !== null);
	});
</script>

{#if character}
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
			'@container mx-auto max-w-2xl'
		)}
	>
		<div class="m-4 flex flex-col gap-2">
			<div class="flex justify-between gap-2">
				<Button disabled={!hasSelectedTraits} variant="link" onclick={clearAllTraits}>
					Reset?
				</Button>
				{#if context.primary_class}
					<Dialog.Root>
						<Dialog.Trigger class={cn(buttonVariants({ variant: 'link' }))}>
							Suggested traits?
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header
								><Dialog.Title
									>Suggested Traits: {character.derived_character_summary
										.primary_class_name}</Dialog.Title
								></Dialog.Header
							>
							<Dialog.Description>
								<div class="flex flex-wrap gap-1">
									{#each Object.entries(context.primary_class.suggested_traits) as [trait, modifier], i}
										<p class="text-nowrap">
											{modifier && modifier > 0 ? '+' + modifier : modifier}
											{capitalize(trait)}{i <
											Object.entries(context.primary_class.suggested_traits).length - 1
												? ','
												: ''}
										</p>
									{/each}
								</div>
							</Dialog.Description>
							<Dialog.Footer>
								<Dialog.Close class={buttonVariants({ variant: 'link' })}>Cancel</Dialog.Close>
								<Dialog.Close
									class={buttonVariants()}
									onclick={() => {
										if (!context.primary_class) return;
										character.selected_traits = { ...context.primary_class.suggested_traits };
									}}
								>
									Use Suggested Traits
								</Dialog.Close>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			</div>

			<!-- traits -->
			<div class="grid grid-cols-1 justify-items-center gap-3 @xs:grid-cols-2 @lg:grid-cols-3">
				{#each Object.entries(character.selected_traits) as [trait, modifier], i}
					{@const total = context.traits[trait as keyof Traits] || 0}
					{@const bonus = total - (modifier || 0)}

					<div
						class="flex w-full max-w-[220px] min-w-[130px] flex-col items-center gap-2 rounded-xl border bg-primary-muted p-3"
					>
						<p class="text-sm font-bold">{capitalize(trait)}</p>
						<Select.Root
							type="single"
							value={(traitIndices[trait] ?? '').toString()}
							onValueChange={(value) => {
								if (value === '') {
									character.selected_traits[trait as keyof Traits] = null;
								} else {
									const idx = parseInt(value);
									character.selected_traits[trait as keyof Traits] = TRAIT_OPTIONS[idx];
								}
							}}
						>
							<Select.Trigger
								highlighted={modifier === null}
								class="w-full truncate bg-muted-foreground/8 hover:bg-muted-foreground/5"
							>
								<p class="truncate">
									{#if modifier === null}
										Select
									{:else}
										{modifier > 0 ? '+' + modifier : modifier}
									{/if}
								</p>
							</Select.Trigger>
							<Select.Content class="rounded-md">
								<Select.Item value="" class="justify-center text-sm hover:cursor-pointer">
									-- Select --
								</Select.Item>
								<Select.Label>Trait Options</Select.Label>
								{#each TRAIT_OPTIONS as option, j}
									<Select.Item
										class="hover:cursor-pointer"
										value={j.toString()}
										disabled={isOptionDisabled(trait, j)}
									>
										{option > 0 ? '+' + option : option}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<p class="text-sm text-muted-foreground">
							Bonus: {bonus > 0 ? '+' + bonus : bonus}
						</p>
						<p class="text-sm">
							Total: {total > 0 ? '+' + total : total}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
