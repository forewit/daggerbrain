<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	export type HeadingItem = {
		id: string;
		text: string;
		level: number;
	};

	const mobilePlaceholderValue = '__jump_to__';

	let {
		headings,
		activeHeadingId,
		headerLevel,
		selectedHeadingId = $bindable(),
		onSelect
	}: {
		headings: HeadingItem[];
		activeHeadingId: string;
		headerLevel?: number;
		selectedHeadingId: string;
		onSelect: (id: string) => void;
	} = $props();

	let mobileSelectedHeadingId = $state(mobilePlaceholderValue);
	let visibleHeadings = $derived.by(() => {
		if (headerLevel === undefined) {
			return headings;
		}

		const maxLevel = Math.max(1, Math.floor(headerLevel));
		return headings.filter((heading) => heading.level <= maxLevel);
	});
	let mobileSelectedHeadingLabel = $derived(
		visibleHeadings.find((heading) => heading.id === mobileSelectedHeadingId)?.text ?? 'Jump to...'
	);

	$effect(() => {
		if (mobileSelectedHeadingId !== mobilePlaceholderValue) {
			mobileSelectedHeadingId = selectedHeadingId;
		}
	});
</script>

<div>
	<div class="mb-6 flex flex-col gap-3 lg:hidden">
		<Button href="/posts" variant="outline" class="w-fit shrink-0"><ArrowLeft />Back</Button>

		{#if visibleHeadings.length > 0}
			<div class="min-w-0">
				<Select.Root
					type="single"
					bind:value={mobileSelectedHeadingId}
					onValueChange={(value) => {
						if (value === mobilePlaceholderValue) {
							return;
						}

						onSelect(value);
					}}
				>
					<Select.Trigger class="w-full border-border bg-card text-foreground">
						{#if mobileSelectedHeadingId !== mobilePlaceholderValue}
							{mobileSelectedHeadingLabel}
						{:else}
							Jump to...
						{/if}
					</Select.Trigger>
					<Select.Content class="border-border bg-card text-foreground">
						<Select.Item value={mobilePlaceholderValue}>Jump to...</Select.Item>
						{#each visibleHeadings as heading}
							<Select.Item value={heading.id}>{heading.text}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
	</div>

	<aside class="mt-2 hidden self-start lg:sticky lg:top-6 lg:block">
		<Button href="/posts" size="sm" variant="outline" class="mb-6"><ArrowLeft />Back</Button>
		{#if visibleHeadings.length > 0}
			<nav aria-label="Table of contents">
				<p
					class="mr-4 mb-3 text-[0.75rem] font-bold tracking-[0.1em] text-muted-foreground uppercase"
				>
					On this page
				</p>
				{#each visibleHeadings as heading}
					<Button
						variant="ghost"
						aria-current={activeHeadingId === heading.id ? 'location' : undefined}
						class={cn(
							'block h-auto w-full rounded-none border-0 border-l-2 border-l-transparent bg-transparent pr-4 text-left',
							activeHeadingId === heading.id ? 'border-l-accent text-accent' : 'text-foreground'
						)}
						style={`padding-left: ${(heading.level - 1) * 0.75}rem;`}
						onclick={() => onSelect(heading.id)}
					>
						<span class="text-wrap">{heading.text}</span>
					</Button>
				{/each}
			</nav>
		{/if}
	</aside>
</div>
