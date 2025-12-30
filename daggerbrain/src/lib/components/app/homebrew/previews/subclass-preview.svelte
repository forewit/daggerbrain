<script lang="ts">
	import type { Subclass } from '$lib/types/compendium-types';
	import SubclassCard from '$lib/components/app/cards/full-cards/subclass-card.svelte';

	let { subclass }: { subclass: Subclass } = $props();
</script>

<div class="mx-auto flex w-[300px] flex-col gap-4 rounded-lg border p-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{subclass.name}</h3>
	</div>

	<!-- Description -->
	{#if subclass.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html subclass.description_html}</p>
	{/if}

	<!-- Foundation Card -->
	<div class="rounded-lg border bg-primary/5 px-4 py-3">
		<p class="text-sm font-medium mb-2">Foundation Card</p>
		<SubclassCard card={subclass.foundation_card} variant="responsive" />
	</div>

	<!-- Specialization Card -->
	<div class="rounded-lg border bg-primary/5 px-4 py-3">
		<p class="text-sm font-medium mb-2">Specialization Card</p>
		<SubclassCard card={subclass.specialization_card} variant="responsive" />
	</div>

	<!-- Mastery Card -->
	<div class="rounded-lg border bg-primary/5 px-4 py-3">
		<p class="text-sm font-medium mb-2">Mastery Card</p>
		<SubclassCard card={subclass.mastery_card} variant="responsive" />
	</div>
</div>

