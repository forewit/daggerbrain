<script lang="ts">
	import * as Select from '$lib/components/ui/select/';
	import { cn } from '$lib/utils';

	let {
		selected_experiences = $bindable(),
		max = 2,
		experiences,
		width,
		class: className = ''
	}: {
		selected_experiences: number[] | undefined;
		max: number;
		experiences: string[];
		width: number;
		class?: string;
	} = $props();

	let open = $state(false);
	const selectedValues = $derived(selected_experiences ?? []);
</script>

<Select.Root
	type="multiple"
	bind:open
	value={selectedValues.map((i) => i.toString())}
	onValueChange={(value) => {
		selected_experiences = value.filter((value) => value).map((value) => parseInt(value));
		if ((selected_experiences?.length ?? 0) >= max) open = false;
	}}
>
	<Select.Trigger
		highlighted={selectedValues.length < max}
		class={cn('w-full truncate', className)}
	>
		<p class="truncate">
			{#if max === 1}
				{#if selectedValues.length === 0}
					Select 1 Experience
				{:else}
					{experiences[0].trim() || 'Unnamed Experience'}
				{/if}
			{:else if selectedValues.length === 0}
				Select {max} Experiences
			{:else}
				{selectedValues.map((i) => experiences[i].trim() || 'Unnamed Experience').join(', ')}
				{#if selectedValues.length < max}
					, (Choose {max - selectedValues.length} more)
				{/if}
			{/if}
		</p>
	</Select.Trigger>
	<Select.Content class="rounded-md" align="start">
		<div style="max-width: {width}px;" class="p-2">
			<Select.Item
				value=""
				disabled={selectedValues.length === 0}
				onclick={() => {
					selected_experiences = [];
					open = true;
				}}
				class="justify-center font-bold text-destructive hover:cursor-pointer"
			>
				-- Clear selection --
			</Select.Item>

			<Select.Label>Select {max} {max === 1 ? 'Experience' : 'Experiences'}</Select.Label>
			{#each experiences as experience, j}
				<Select.Item
					disabled={selectedValues.some((i) => i === j) || selectedValues.length >= max}
					class="hover:cursor-pointer"
					value={j.toString()}
				>
					{experience.trim() || 'Unnamed Experience'}
				</Select.Item>
			{/each}
		</div>
	</Select.Content>
</Select.Root>
