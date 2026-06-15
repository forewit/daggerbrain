<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import type { Environment } from '@convex/schemas/compendium';
	import { cn } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		environment,
		class: className = '',
		detailsOpen = $bindable(true),
		featuresOpen = $bindable(true)
	}: {
		environment: Environment;
		class?: string;
		detailsOpen?: boolean;
		featuresOpen?: boolean;
	} = $props();
</script>

<div
	class={cn(
		'flex max-w-[400px] min-w-[310px] flex-col gap-2 rounded-lg bg-background pt-3 pb-4',
		className
	)}
>
	<div class="flex items-center justify-between gap-2 truncate overflow-visible px-3 font-eveleth">
		<div class="flex flex-wrap items-center gap-2 gap-y-0 truncate">
			<p class="truncate font-eveleth">{environment.title}</p>
			<p class="shrink-0 text-xs text-muted-foreground italic">Tier {environment.tier}</p>
		</div>

		<div
			class={cn(
				'flex h-6 items-center gap-2 rounded-lg bg-background px-2.5',
				environment.type === 'Exploration' && 'bg-emerald-900/80 text-emerald-100',
				environment.type === 'Social' && 'bg-purple-800/80 text-purple-100',
				environment.type === 'Traversal' && 'bg-stone-700/70 text-stone-100',
				environment.type === 'Event' && 'bg-rose-900/60 text-rose-100'
			)}
		>
			<p class="flex items-center font-eveleth text-[11px] uppercase">{environment.type}</p>
		</div>
	</div>

	<div class="flex gap-3 px-3 text-left">
		{#if environment.image_url && environment.image_url !== '/images/art/placeholder-art.webp'}
			<div class="max-h-24 min-h-24 max-w-24 min-w-24 shrink-0 grow overflow-hidden rounded-lg">
				<img src={environment.image_url} alt="" class="h-full object-cover" />
			</div>
		{/if}
		<div class="flex min-w-0 grow flex-col gap-3">
			{#if environment.description}
				<div class="text-xs text-muted-foreground italic">
					{@html renderMarkdown(environment.description)}
				</div>
			{/if}
			<div class="mr-auto flex h-6 items-center gap-2 rounded-lg bg-muted-foreground px-2.5">
				<p class="text-[11px] font-bold text-background">DIFFICULTY</p>
				<p class="text-sm font-bold text-background">
					{environment.relative_strength ? 'Special' : environment.difficulty}
				</p>
			</div>
		</div>
	</div>

	{#if environment.impulses || environment.potential_adversaries || environment.potential_adversaries_ids.length > 0}
		<Collapsible.Root bind:open={detailsOpen} class="mt-2">
			<Collapsible.Trigger
				class="flex w-full items-center gap-1.5 border-y bg-primary-muted/30 px-3 py-2 text-left text-muted-foreground"
			>
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', detailsOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Impulses & Adversaries</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2 px-3 pt-4 pb-2">
				{#if environment.impulses}
					<p class="text-xs">
						<span class="font-medium">Impulses:</span>
						<span class="text-muted-foreground italic">{environment.impulses}</span>
					</p>
				{/if}

				{#if environment.potential_adversaries || environment.potential_adversaries_ids.length > 0}
					<p class="text-xs">
						<span class="font-medium">Potential adversaries:</span>
						<span class="text-muted-foreground italic">
							{environment.potential_adversaries || 'See linked adversaries'}
						</span>
					</p>
				{/if}
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	{#if environment.features.length > 0}
		<Collapsible.Root bind:open={featuresOpen}>
			<Collapsible.Trigger
				class="flex w-full items-center gap-1.5 border-y bg-primary-muted/30 px-3 py-2 text-left text-muted-foreground"
			>
				<ChevronRight
					class={cn('size-4 shrink-0 transition-transform', featuresOpen && 'rotate-90')}
				/>
				<p class="text-sm font-medium">Features</p>
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col gap-2 px-3 pt-4 pb-2">
				{#each environment.features as feature}
					<div class="mb-1 flex flex-col gap-2">
						<p class="flex items-center gap-2 text-sm font-medium">
							{feature.name || 'Unnamed feature'}
							<span
								class={cn(
									'rounded bg-primary-muted px-1.5 py-0.5 text-[10px] font-normal',
									feature.type === 'Action' && 'bg-accent/10 text-accent',
									feature.type === 'Reaction' && 'bg-sky-300/15 text-sky-300',
									feature.type === 'Passive' && 'bg-primary/30 text-violet-300'
								)}>{feature.type}</span
							>
						</p>
						<div class="ml-2 flex flex-col gap-2 text-xs text-muted-foreground [&_li]:mt-1">
							{@html renderMarkdown(feature.description_html)}
						</div>
						{#if feature.questions}
							<p class="ml-2 border-l border-primary pl-2 text-xs text-muted-foreground italic">
								{feature.questions}
							</p>
						{/if}
					</div>
				{/each}
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}
</div>
