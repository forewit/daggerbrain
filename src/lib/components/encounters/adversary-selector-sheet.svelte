<script lang="ts">
	import type { CompendiumContent } from '@convex/schemas/compendium';
	import type { SourceKey } from '@convex/schemas/rules';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import AdversaryCatalog from '$lib/components/catalogs/adversary-catalog.svelte';
	import { cn } from '$lib/utils';

	let {
		open = $bindable(false),
		onSelect,
		title = 'Select Adversary',
		description = 'Browse and select an adversary',
		disabledIds = [],
		compendium,
		available_source_keys
	}: {
		open?: boolean;
		onSelect: (adversaryId: string) => void;
		title?: string;
		description?: string;
		disabledIds?: string[];
		compendium: CompendiumContent;
		available_source_keys: SourceKey[];
	} = $props();

	function handleSelect(adversaryId: string) {
		onSelect(adversaryId);
		open = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="min-w-[calc(min(95vw,420px))]">
		<Sheet.Header>
			<Sheet.Title>{title}</Sheet.Title>
			<Sheet.Description>{description}</Sheet.Description>
		</Sheet.Header>

		<div class="flex flex-col gap-4 overflow-y-auto px-4 pb-6">
			<AdversaryCatalog
				onSelect={handleSelect}
				{disabledIds}
				{compendium}
				{available_source_keys}
			/>
		</div>

		<Sheet.Footer>
			<Sheet.Close class={cn(buttonVariants({ variant: 'outline' }), 'w-min')}>Close</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
