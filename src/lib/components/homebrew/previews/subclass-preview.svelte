<script lang="ts">
	import type { Subclass } from '@convex/schemas/compendium';
	import SubclassCardComponent from '$lib/components/compendium-items/cards/subclass-card.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getSourcesContext } from '$lib/state/sources.svelte';
	import { merge_compendium_content } from '$lib/utils';

	let {
		subclass,
		formTab = $bindable<'foundation' | 'specialization' | 'mastery'>('foundation')
	}: {
		subclass: Subclass;
		formTab?: 'foundation' | 'specialization' | 'mastery';
	} = $props();

	const homebrew = getHomebrewContext();
	const sources = getSourcesContext();
	const previewCompendium = $derived(
		merge_compendium_content(sources.compendium, homebrew.compendium ?? merge_compendium_content())
	);

	let choices = $state({});
	let tokens = $state(0);
	let experiences = ['Example experience 1', 'Example experience 2'];
</script>

<Tabs.Root bind:value={formTab} class="flex max-w-[300px] min-w-[300px] flex-col gap-2">
	<Tabs.List class="mx-auto bg-background shadow">
		<Tabs.Trigger value="foundation">Foundation</Tabs.Trigger>
		<Tabs.Trigger value="specialization">Specialization</Tabs.Trigger>
		<Tabs.Trigger value="mastery">Mastery</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="foundation">
		<SubclassCardComponent
			card={{ type: 'foundation', ...subclass, ...subclass.foundation_card }}
			compendium={previewCompendium}
			enable_choices
			enable_tokens
			bind:choices
			bind:tokens
			{experiences}
			variant="card"
		/>
	</Tabs.Content>

	<Tabs.Content value="specialization">
		<SubclassCardComponent
			card={{ type: 'specialization', ...subclass, ...subclass.specialization_card }}
			compendium={previewCompendium}
			enable_choices
			enable_tokens
			bind:choices
			bind:tokens
			{experiences}
			variant="card"
		/>
	</Tabs.Content>

	<Tabs.Content value="mastery">
		<SubclassCardComponent
			card={{ type: 'mastery', ...subclass, ...subclass.mastery_card }}
			compendium={previewCompendium}
			enable_choices
			enable_tokens
			bind:choices
			bind:tokens
			{experiences}
			variant="card"
		/>
	</Tabs.Content>
</Tabs.Root>
