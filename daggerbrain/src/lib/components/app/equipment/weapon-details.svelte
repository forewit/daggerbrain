<script lang="ts">
	import { capitalize } from '$lib/utils';
	import type { Weapon } from '$lib/types/compendium-types';
	import Hand from '@lucide/svelte/icons/hand';

	let { weapon }: { weapon: Weapon } = $props();
</script>

<div class="flex flex-col gap-4">
	<!-- Description -->
	{#if weapon.description_html}
		<div class="text-sm text-muted-foreground">
			{@html weapon.description_html}
		</div>
	{/if}

	<!-- Stats Badges -->
	<div class="-mt-1 mb-1 grid gap-3">
		<div class="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-3">

			<!-- Pair 1 -->
			<div class="flex flex-nowrap gap-4">
			  <div class="flex flex-col items-center justify-center gap-1">
				<span class="text-xs font-medium text-muted-foreground">Burden</span>
				<div class="flex items-center gap-1 rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
				  {weapon.burden}<Hand class="size-3.5" />
				</div>
			  </div>
		  
			  <div class="flex flex-col items-center justify-center gap-1">
				<span class="text-xs font-medium text-muted-foreground">Damage</span>
				<div class="rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
				  {weapon.damage_dice + (weapon.damage_bonus > 0 ? `+${weapon.damage_bonus}` : '')}
				  {weapon.available_damage_types.map(capitalize).join('/')}
				</div>
			  </div>
			</div>
		  
			<!-- Pair 2 -->
			<div class="flex flex-nowrap gap-4">
			  <div class="flex flex-col items-center justify-center gap-1">
				<span class=" text-xs font-medium text-muted-foreground">Range</span>
				<div class="rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
				  {weapon.range}
				</div>
			  </div>
		  
			  <div class="flex flex-col items-center justify-center gap-1">
				<span class="text-xs font-medium text-muted-foreground">Trait</span>
				<div class="rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
				  {weapon.available_traits.map(capitalize).join(', ')}
				</div>
			  </div>
			</div>
		  
		  </div>

		<!-- Features -->
		{#if weapon.features.length > 0}
			<div class="flex flex-col gap-3">
				{#each weapon.features as feature}
					<div class="text-sm text-muted-foreground">
						<p class="text-sm font-medium text-foreground">{feature.title}</p>
						{@html feature.description_html}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
