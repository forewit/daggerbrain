<script lang="ts">
	import type { Subclass } from '@shared/types/compendium.types';
	import SubclassCard from '$lib/components/app/cards/full-cards/subclass-card.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { renderMarkdown } from '$lib/utils';

	let {
		card,
		formTab = $bindable(),
		description
	}: {
		card: Subclass;
		formTab?: 'foundation' | 'specialization' | 'mastery';
		description: string;
	} = $props();
</script>

<div class="flex max-w-[300px] min-w-[300px] flex-col gap-2 rounded-lg bg-background p-4 shadow">
	<p class="text-medium text-center text-lg">{card.name}</p>
	<p class="text-center text-xs text-muted-foreground italic">
		{@html renderMarkdown(description)}
	</p>
	<Tabs.Root bind:value={formTab}>
		<Tabs.List>
			<Tabs.Trigger value="foundation">Foundation</Tabs.Trigger>
			<Tabs.Trigger value="specialization">Specialization</Tabs.Trigger>
			<Tabs.Trigger value="mastery">Mastery</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="foundation">
			<SubclassCard card={card.foundation_card} variant="card" />
		</Tabs.Content>
		<Tabs.Content value="specialization">
			<SubclassCard card={card.specialization_card} variant="card" />
		</Tabs.Content>
		<Tabs.Content value="mastery">
			<SubclassCard card={card.mastery_card} variant="card" />
		</Tabs.Content>
	</Tabs.Root>
</div>
