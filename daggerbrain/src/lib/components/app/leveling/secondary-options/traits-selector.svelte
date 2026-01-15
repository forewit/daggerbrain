<script lang="ts">
	import type { Traits } from '@shared/types/compendium.types';
	import { TRAITS } from '@shared/constants/rules';
	import * as Select from '$lib/components/ui/select/';

	let {
		selected_traits = $bindable(),
		marked_traits = $bindable(),
		width
	}: {
		selected_traits: { A: keyof Traits | null; B: keyof Traits | null };
		marked_traits: Record<keyof Traits, boolean>;
		width: number;
	} = $props();
</script>

<div class="flex flex-col gap-2 rounded-md bg-primary/50 p-2">
	<p class="px-2 py-1 text-xs text-muted-foreground italic">Choose 2 unmarked character traits.</p>
	<div class="flex gap-2.5">
		<Select.Root
			type="single"
			value={selected_traits.A || ''}
			onValueChange={(value) => {
				if (value === '') {
					selected_traits.A = null;
				} else {
					selected_traits.A = value as keyof Traits;
				}
			}}
		>
			<Select.Trigger highlighted={selected_traits.A === null} class="w-full truncate">
				<p class="truncate">
					{selected_traits.A
						? TRAITS[selected_traits.A as keyof typeof TRAITS].name
						: 'Select a trait'}
				</p>
			</Select.Trigger>

			<Select.Content class="rounded-md " align="start">
				<div style="max-width: {width}px;" class="p-2">
					<Select.Item value="" class="justify-center text-sm hover:cursor-pointer">
						-- none selected --
					</Select.Item>
					<Select.Label>Traits</Select.Label>
					{#each Object.keys(TRAITS) as trait}
						<Select.Item disabled={marked_traits[trait as keyof Traits]} value={trait}
							>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
						>
					{/each}
				</div>
			</Select.Content>
		</Select.Root>
		<Select.Root
			type="single"
			value={selected_traits.B || ''}
			onValueChange={(value) => {
				const trait = value as keyof Traits;
				if (value === '') {
					selected_traits.B = null;
				} else {
					selected_traits.B = trait;
				}
			}}
		>
			<Select.Trigger highlighted={selected_traits.B === null} class="w-full truncate">
				<p class="truncate">
					{selected_traits.B
						? TRAITS[selected_traits.B as keyof typeof TRAITS].name
						: 'Select a trait'}
				</p>
			</Select.Trigger>
			<Select.Content class="rounded-md " align="end">
				<div style="max-width: {width}px;" class="p-2">
					<Select.Item value="" class="justify-center text-sm hover:cursor-pointer">
						-- none selected --
					</Select.Item>
					<Select.Label>Traits</Select.Label>
					{#each Object.keys(TRAITS) as trait}
						<Select.Item disabled={marked_traits[trait as keyof Traits]} value={trait}
							>{TRAITS[trait as keyof typeof TRAITS].name}</Select.Item
						>
					{/each}
				</div>
			</Select.Content>
		</Select.Root>
	</div>
</div>
