<script lang="ts">
	import * as Select from '$lib/components/ui/select/';
	import { cn } from '$lib/utils';

	let {
		selected_ids = $bindable(),
		max = 2,
		options,
		width,
		onSelectionChange: onSelectionChange = () => {},
		class: className = '',
		term = 'Option',
		term_plural = 'Options'
	}: {
		selected_ids: string[];
		max: number;
		options: { selection_id: string; title: string; short_title: string }[];
		width: number;
		onSelectionChange?: (value: string[]) => void;
		class?: string;
		term?: string;
		term_plural?: string;
	} = $props();

	let open = $state(false);
</script>

<Select.Root
	type="multiple"
	bind:open
	value={selected_ids}
	onValueChange={(value) => {
		selected_ids = value.filter((value) => !!value);
		onSelectionChange(selected_ids);
		if (selected_ids.length >= max) open = false;
	}}
>
	<Select.Trigger highlighted={selected_ids.length < max} class={cn('w-full truncate', className)}>
		<p class="truncate">
			{#if selected_ids.length === 0}
				Select {max} {max === 1 ? term : term_plural}
			{:else}
				{selected_ids
					.map(
						(id) =>
							options.find((o) => o.selection_id === id)?.short_title.trim() || `Unnamed ${term}`
					)
					.join(', ')}
				{#if selected_ids.length < max}
					, (Choose {max - selected_ids.length} more)
				{/if}
			{/if}
		</p>
	</Select.Trigger>
	<Select.Content class="rounded-md" align="start">
		<div style="max-width: {width}px;" class="p-2">
			<Select.Item
				value=""
				disabled={selected_ids.length === 0}
				onclick={() => {
					selected_ids = [];
					open = true;
				}}
				class="justify-center font-bold text-destructive hover:cursor-pointer"
			>
				-- Clear selection --
			</Select.Item>

			<Select.Label>Select {max} {max === 1 ? term : term_plural}</Select.Label>
			{#each options as option}
				<Select.Item
					disabled={selected_ids.some((o) => o === option.selection_id) ||
						selected_ids.length >= max}
					class="hover:cursor-pointer"
					value={option.selection_id}
				>
					{option.title.trim() || `Unnamed ${term}`}
				</Select.Item>
			{/each}
		</div>
	</Select.Content>
</Select.Root>
