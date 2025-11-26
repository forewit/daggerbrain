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

	let trait_option_indices = $derived.by(() => {
		if (!character) return {};
		const indices: Record<string, number | null> = {};
		const used: Set<number> = new Set();
		for (const trait of Object.keys(character.selected_traits)) {
			const val = character.selected_traits[trait as keyof Traits];
			if (val === null) {
				indices[trait] = null;
			} else {
				let foundIdx = null;
				for (let i = 0; i < TRAIT_OPTIONS.length; i++) {
					if (TRAIT_OPTIONS[i] === val && !used.has(i)) {
						foundIdx = i;
						used.add(i);
						break;
					}
				}
				indices[trait] = foundIdx; // do not fallback: only assign an index if available
			}
		}
		return indices;
	});

	function isOptionIndexDisabled(currentTrait: string, idx: number): boolean {
		return Object.entries(trait_option_indices).some(([t, i]) => t !== currentTrait && i === idx);
	}
</script>

{#if character}
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
			'@container mx-auto max-w-2xl'
		)}
	>
		<div class="m-4 flex flex-col gap-2">
			{#if context.primary_class}
				<Dialog.Root>
					<Dialog.Trigger class={cn(buttonVariants({ variant: 'link' }), 'ml-auto')}>
						Suggested traits?
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header
							><Dialog.Title
								>Suggested Traits: {character.derived_descriptors.primary_class_name}</Dialog.Title
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
							value={(trait_option_indices[trait] ?? '').toString()}
							onValueChange={(value) => {
								if (value === '') {
									trait_option_indices[trait] = null;
									character.selected_traits[trait as keyof Traits] = null;
								} else {
									const idx = parseInt(value);
									trait_option_indices[trait] = idx;
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
										disabled={isOptionIndexDisabled(trait, j)}
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
