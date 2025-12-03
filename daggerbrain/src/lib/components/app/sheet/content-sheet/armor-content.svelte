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
		<p class="text-xs text-muted-foreground italic">
			Tier {context.get_tier_from_level(armor.level_requirement)} Armor
		</p>
	{/if}
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4">
	{#if armor.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html armor.description_html}</p>
	{/if}

	<!-- Stats Table -->
	<table class="w-full border-collapse text-sm">
		<tbody>
			<tr class="border-b">
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Base Armor Score</th>
				<td class="py-2 text-right">
					{armor.max_armor}
					<Shield class="-mt-0.5 ml-0.5 inline-block size-3.5" />
				</td>
			</tr>
			<tr>
				<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Base Damage Thresholds</th
				>
				<td class="py-2 text-right"
					>{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}</td
				>
			</tr>
		</tbody>
	</table>

	<!-- Features -->
	{#if armor.features.length > 0}
		<div class="rounded-lg border bg-primary/5 px-4 py-3">
			<div class="flex items-center justify-between">
				<p class="text-sm">Features</p>
			</div>
			<div class="mt-3 space-y-3">
				{#each armor.features as feature}
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
						<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<Collapsible.Root bind:open={whatIsArmorOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight class={cn('size-4 transition-transform', whatIsArmorOpen && 'rotate-90')} />
			<p class="text-sm font-medium">More info</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			{#if armor.id !== 'unarmored'}
				<ul class="list-disc space-y-3 pt-2 pl-5 text-xs text-muted-foreground italic">
					<li>
						An armor's <b>base armor score</b> indicates how many Armor Slots it provides its wearer
						before additional bonuses are added to calculate their total Armor Score. A PC's Armor Score
						can't exceed 12.
					</li>
					<li>
						An armor's <b>base thresholds</b> determine its wearer's Major and Severe damage thresholds
						before adding bonuses to calculate their final damage thresholds. When recording your character's
						damage thresholds, you always add your character's level to those values.
					</li>
					<li>
						An armor's <b>feature</b> is a special rule that stays in effect while the armor is equipped.
					</li>
					<li>
						While <b>unarmored</b>, your character's base Armor Score is 0, their Major threshold is
						equal to their level, and their Severe threshold is equal to twice their level.
					</li>
				</ul>
			{/if}
		</Collapsible.Content>
	</Collapsible.Root>
</div>
