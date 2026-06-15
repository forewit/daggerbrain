<script lang="ts">
	import type { PrimaryWeapon } from '@convex/schemas/compendium';
	import type { DamageType } from '@convex/schemas/rules';
	import Hand from '@lucide/svelte/icons/hand';
	import { capitalize, level_to_tier, renderMarkdown } from '$lib/utils';

	const damageTypeLabels: Record<DamageType, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	let { weapon }: { weapon: PrimaryWeapon } = $props();
</script>

<div
	class="flex max-w-[500px] min-w-[300px] flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm"
>
	<div class="flex flex-col gap-1">
		<p class="text-lg font-medium">{weapon.title || 'Unnamed primary weapon'}</p>
		<p class="text-xs text-muted-foreground italic">
			Tier {level_to_tier(weapon.level_requirement)}
			{weapon.type} Primary Weapon
		</p>
	</div>

	{#if weapon.description_html.trim().length > 0}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(weapon.description_html)}
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-3 text-xs">
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Attack</p>
			<p>
				{weapon.attack_roll_bonus >= 0 ? `+${weapon.attack_roll_bonus}` : weapon.attack_roll_bonus}
			</p>
		</div>
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Damage</p>
			<p>
				{weapon.damage_dice}{weapon.damage_bonus > 0
					? `+${weapon.damage_bonus}`
					: weapon.damage_bonus < 0
						? weapon.damage_bonus
						: ''}
			</p>
		</div>
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Range</p>
			<p>{weapon.range}</p>
		</div>
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Burden</p>
			<p class="inline-flex items-center gap-1">
				{weapon.burden}
				<Hand class="size-3.5" />
			</p>
		</div>
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Traits</p>
			<p>{weapon.available_traits.map(capitalize).join(', ') || 'None'}</p>
		</div>
		<div class="rounded-lg border bg-muted px-3 py-2">
			<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
				Damage Types
			</p>
			<p>
				{weapon.available_damage_types.map((type) => damageTypeLabels[type]).join(', ') || 'None'}
			</p>
		</div>
	</div>

	<div class="flex flex-col gap-3 border-t pt-4">
		<p class="text-sm font-medium">Features</p>
		{#if weapon.features.length > 0}
			{#each weapon.features as feature}
				<div class="flex flex-col gap-1">
					<p class="text-sm font-medium">{feature.title || 'Unnamed feature'}</p>
					<div class="text-xs text-muted-foreground">
						{@html renderMarkdown(feature.description_html || '')}
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-xs text-muted-foreground italic">No features added</p>
		{/if}
	</div>
</div>
