<script lang="ts">
	import type { Loot } from '$lib/types/compendium-types';

	let { loot }: { loot: Loot } = $props();
</script>

<div class="mx-auto flex w-[300px] flex-col gap-4 rounded-lg border p-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<h3 class="text-lg font-semibold">{loot.title}</h3>
	</div>

	<!-- Description -->
	{#if loot.description_html.trim().length > 0}
		<p class="py-4 text-sm">{@html loot.description_html}</p>
	{/if}

	<!-- Character Modifiers -->
	{#if loot.character_modifiers.length > 0}
		<div class="rounded-lg border bg-primary/5 px-4 py-3">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium">Character Modifiers</p>
			</div>
			<div class="mt-3 space-y-3">
				{#each loot.character_modifiers as modifier}
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="text-xs text-muted-foreground">
							{modifier.behaviour} {modifier.target}
							{#if modifier.type === 'flat'}: {modifier.value}{/if}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Weapon Modifiers -->
	{#if loot.weapon_modifiers.length > 0}
		<div class="rounded-lg border bg-primary/5 px-4 py-3">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium">Weapon Modifiers</p>
			</div>
			<div class="mt-3 space-y-3">
				{#each loot.weapon_modifiers as modifier}
					<div class="border-l-2 border-accent/30 pl-3">
						<p class="text-xs text-muted-foreground">
							{modifier.behaviour} {modifier.target_weapon} {modifier.target_stat}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

