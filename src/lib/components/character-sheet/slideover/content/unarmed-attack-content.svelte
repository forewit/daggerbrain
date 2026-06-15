<script lang="ts">
	import type { DamageType, Range } from '@convex/schemas/rules';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn, capitalize } from '$lib/utils';
	import { renderMarkdown } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Hand from '@lucide/svelte/icons/hand';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import WeaponsRules from '$lib/components/rule-snippets/weapons-rules.svelte';

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);

	let moreInfoOpen = $state(false);

	// Get weapon from inventory
	let unarmedAttack = $derived(derived_character_data?.derived_unarmed_attack);

	const damageTypeMap: Record<DamageType, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};
</script>

{#if unarmedAttack}
	<Sheet.Header>
		<Sheet.Title>{unarmedAttack.title}</Sheet.Title>
	</Sheet.Header>

	<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
		{#if unarmedAttack.description_html.trim().length > 0}
			<p class="py-4 text-sm">{@html renderMarkdown(unarmedAttack.description_html)}</p>
		{/if}

		<!-- Stats Table -->
		<table class="w-full border-collapse text-sm">
			<tbody>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Range</th>
					<td class="py-2 text-right">{unarmedAttack.range}</td>
				</tr>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Trait</th>
					<td class="py-2 text-right"
						>{unarmedAttack.available_traits.map(capitalize).join(' / ')}</td
					>
				</tr>

				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage</th>
					<td class="py-2 text-right"
						>{unarmedAttack.damage_dice}{#if unarmedAttack.damage_bonus > 0}+{unarmedAttack.damage_bonus}{/if}</td
					>
				</tr>
				<tr class="border-b">
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage Type</th>
					<td class="py-2 text-right"
						>{unarmedAttack.available_damage_types.map((t) => damageTypeMap[t]).join(' / ')}</td
					>
				</tr>
				<tr>
					<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Burden</th>
					<td class="py-2 text-right">
						{unarmedAttack.burden}
						<Hand class="-mt-0.5 ml-0.5 inline-block size-3.5" />
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Features -->
		{#if unarmedAttack.features.length > 0}
			<div class="rounded-lg border bg-primary/5 px-4 py-3">
				<div class="flex items-center justify-between">
					<p class="text-sm">Features</p>
				</div>
				<div class="mt-3 space-y-3">
					{#each unarmedAttack.features as feature}
						<div class="border-l-2 border-accent/30 pl-3">
							<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">
								{@html renderMarkdown(feature.description_html)}
							</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<Collapsible.Root bind:open={moreInfoOpen} class="pt-2">
			<Collapsible.Trigger class="flex items-center gap-1">
				<ChevronRight class={cn('size-4 transition-transform', moreInfoOpen && 'rotate-90')} />
				<p class="text-sm font-medium">More info</p>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<WeaponsRules class="pt-2 pl-5" />
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
{/if}
