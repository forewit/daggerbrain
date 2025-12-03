<script lang="ts">
	import type { Armor } from '$lib/types/compendium-types';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Shield from '@lucide/svelte/icons/shield';
	import { getCharacterContext } from '$lib/state/character.svelte';

	let { armor }: { armor: Armor } = $props();

	const context = getCharacterContext();
	let whatIsArmorOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>{armor.title}</Sheet.Title>
	{#if armor.id !== 'unarmored'}
		<p class="text-muted-foreground text-xs italic">Tier {context.get_tier_from_level(armor.level_requirement)} Armor</p>
	{/if}
</Sheet.Header>

<div class="px-4 flex flex-col gap-6 overflow-y-auto">
	{#if armor.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html armor.description_html}</p>
	{/if}

	<!-- Stats Table -->
	<table class="w-full border-collapse text-sm">
		<tbody>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left text-muted-foreground font-normal">Base Armor Score</th>
				<td class="py-2 text-right">
					{armor.max_armor}
					<Shield class="size-3.5 inline-block ml-0.5 -mt-0.5" />
				</td>
			</tr>
			<tr>
				<th class="py-2 pr-4 text-left text-muted-foreground font-normal">Base Damage Thresholds</th>
				<td class="py-2 text-right">{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}</td>
			</tr>
		</tbody>
	</table>

	<!-- Features -->
	<div class="rounded-lg bg-primary/5 px-4 py-3 border">
		<div class="flex items-center justify-between">
			<p class="text-sm text-muted-foreground">Features</p>
			{#if armor.features.length > 0}
				<span class="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">{armor.features.length}</span>
			{/if}
		</div>
		{#if armor.features.length > 0}
			<div class="mt-3 space-y-3">
				{#each armor.features as feature}
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="font-medium text-sm">{feature.title}</p>
						<p class="text-muted-foreground text-xs mt-0.5">{@html feature.description_html}</p>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-muted-foreground italic text-xs mt-2 text-right">None</p>
		{/if}
	</div>

	<Collapsible.Root bind:open={whatIsArmorOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', whatIsArmorOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">What is Armor?</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			{#if armor.id !== 'unarmored'}
				<ul class="list-disc space-y-3 italic pl-5 pt-2 text-xs text-muted-foreground">
					<li>
						An armor's <b>base armor score</b> indicates how many Armor Slots it provides its wearer before
						additional bonuses are added to calculate their total Armor Score. A PC's Armor Score
						can't exceed 12.
					</li>
					<li>
						An armor's <b>base thresholds</b> determine its wearer's Major and Severe damage thresholds
						before adding bonuses to calculate their final damage thresholds. When recording your
						character's damage thresholds, you always add your character's level to those values.
					</li>
					<li>An armor's <b>feature</b> is a special rule that stays in effect while the armor is equipped.</li>
					<li>While <b>unarmored</b>, your character's base Armor Score is 0, their Major threshold is equal to
						their level, and their Severe threshold is equal to twice their level.
					</li>
				</ul>
			{/if}
		</Collapsible.Content>
	</Collapsible.Root>
</div>
