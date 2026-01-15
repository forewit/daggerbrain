<script lang="ts">
	import { renderMarkdown } from '$lib/utils';
	import type { Armor } from '@shared/types/compendium.types';
	import Shield from '@lucide/svelte/icons/shield';

	let { armor }: { armor: Armor } = $props();
</script>

<div class="flex flex-col gap-4">
	<!-- Description -->
	{#if armor.description_html}
		<div class="text-sm text-muted-foreground">
			{@html renderMarkdown(armor.description_html)}
		</div>
	{/if}

	<!-- Stats Badges -->
	<div class="-mt-1 mb-1 grid gap-3">
		<div class="flex justify-around gap-4 sm:justify-start">
			<div class="flex flex-wrap items-center justify-center gap-1">
				<span class="text-center text-xs font-medium text-muted-foreground">Armor Score</span>
				<div
					class="flex items-center gap-1 rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap"
				>
					{armor.max_armor}<Shield class="size-3.5" />
				</div>
			</div>
			<div class="flex flex-wrap items-center justify-center gap-1">
				<span class="text-center text-xs font-medium text-muted-foreground">Damage Thresholds</span>
				<div class="rounded-full border bg-foreground/5 px-2 py-1 text-xs text-nowrap">
					{armor.damage_thresholds.major} / {armor.damage_thresholds.severe}
				</div>
			</div>
		</div>

		<!-- Features -->
		{#if armor.features.length > 0}
			<div class="flex flex-col gap-3">
				{#each armor.features as feature}
					<div class="text-sm text-muted-foreground">
						<p class="text-sm font-medium text-foreground">{feature.title}</p>
						{@html renderMarkdown(feature.description_html)}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
