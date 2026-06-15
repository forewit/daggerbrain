<script lang="ts">
	import type { TraitId, Traits } from '@convex/schemas/rules';
	import { TRAITS } from '@convex/constants/rules';
	import * as Select from '$lib/components/ui/select/';

	let {
		selected_traits = $bindable(),
		marked_traits,
		width
	}: {
		selected_traits: { A?: TraitId; B?: TraitId } | undefined;
		marked_traits: Traits;
		width: number;
	} = $props();

	const traitIds = Object.keys(TRAITS) as TraitId[];
	const currentSelections = $derived((selected_traits ?? {}) as { A?: TraitId; B?: TraitId });

	function updateSelectedTrait(slot: 'A' | 'B', value: string) {
		selected_traits = {
			...currentSelections,
			[slot]: value === '' ? undefined : (value as TraitId)
		};
	}

	function isTraitDisabled(slot: 'A' | 'B', trait: TraitId): boolean {
		const otherSlot = slot === 'A' ? 'B' : 'A';
		return Boolean(marked_traits[trait]) || currentSelections[otherSlot] === trait;
	}
</script>

<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2">
	<p class="px-2 py-1 text-xs text-muted-foreground italic">Choose 2 unmarked character traits.</p>
	<div class="flex gap-2.5">
		<Select.Root
			type="single"
			value={currentSelections.A || ''}
			onValueChange={(value) => updateSelectedTrait('A', value)}
		>
			<Select.Trigger
				highlighted={!currentSelections.A}
				class="w-full truncate bg-card/50 hover:bg-card/70"
			>
				<p class="truncate">
					{currentSelections.A ? TRAITS[currentSelections.A].name : 'Select a trait'}
				</p>
			</Select.Trigger>

			<Select.Content class="rounded-md " align="start">
				<div style="max-width: {width}px;" class="p-2">
					<Select.Item value="" class="justify-center text-sm hover:cursor-pointer">
						-- none selected --
					</Select.Item>
					<Select.Label>Traits</Select.Label>
					{#each traitIds as trait}
						<Select.Item disabled={isTraitDisabled('A', trait)} value={trait}
							>{TRAITS[trait].name}</Select.Item
						>
					{/each}
				</div>
			</Select.Content>
		</Select.Root>
		<Select.Root
			type="single"
			value={currentSelections.B || ''}
			onValueChange={(value) => updateSelectedTrait('B', value)}
		>
			<Select.Trigger
				highlighted={!currentSelections.B}
				class="w-full truncate bg-card/50 hover:bg-card/70"
			>
				<p class="truncate">
					{currentSelections.B ? TRAITS[currentSelections.B].name : 'Select a trait'}
				</p>
			</Select.Trigger>
			<Select.Content class="rounded-md " align="end">
				<div style="max-width: {width}px;" class="p-2">
					<Select.Item value="" class="justify-center text-sm hover:cursor-pointer">
						-- none selected --
					</Select.Item>
					<Select.Label>Traits</Select.Label>
					{#each traitIds as trait}
						<Select.Item disabled={isTraitDisabled('B', trait)} value={trait}
							>{TRAITS[trait].name}</Select.Item
						>
					{/each}
				</div>
			</Select.Content>
		</Select.Root>
	</div>
</div>
