<script lang="ts">
	import Tier1Options from '$lib/components/app/leveling/tier-1-options.svelte';
	import Tier2Options from '$lib/components/app/leveling/tier-2-options.svelte';
	import Tier3Options from '$lib/components/app/leveling/tier-3-options.svelte';
	import Tier4Options from '$lib/components/app/leveling/tier-4-options.svelte';
	import LevelSelect from '$lib/components/app/leveling/level-select.svelte';
	import { cn } from '$lib/utils';
	import Dropdown from '$lib/components/app/leveling/dropdown.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);
</script>

{#if character}
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
			'mx-auto max-w-2xl'
		)}
	>
		<div class="m-4 flex flex-col gap-4">
			<LevelSelect
				bind:level={character.level}
				bind:level_up_choices={character.level_up_choices}
			/>

			<!-- tier 1 options -->
			<Tier1Options />

			{#if character.level >= 2}
				<Dropdown title="Tier 2" class="border-accent/20 bg-accent/10 text-accent">
					<div class="flex flex-col gap-2">
						<p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
						<p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
					</div>
				</Dropdown>
				<Tier2Options level={2} />
			{/if}

			{#if character.level >= 3}
				<Tier2Options level={3} />
			{/if}

			{#if character.level >= 4}
				<Tier2Options level={4} />
			{/if}

			{#if character.level >= 5}
				<Dropdown title="Tier 3" class="border-accent/20 bg-accent/10 text-accent">
					<div class="flex flex-col gap-2">
						<p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
						<p class="text-xs">•&emsp;Clear all marked character traits</p>
						<p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
					</div>
				</Dropdown>
				<Tier3Options level={5} />
			{/if}

			{#if character.level >= 6}
				<Tier3Options level={6} />
			{/if}

			{#if character.level >= 7}
				<Tier3Options level={7} />
			{/if}

			{#if character.level >= 8}
				<Dropdown title="Tier 4" class="border-accent/20 bg-accent/10 text-accent">
					<div class="flex flex-col gap-2">
						<p class="text-xs">•&emsp;Gain an additional Experience at +2</p>
						<p class="text-xs">•&emsp;Clear all marked character traits</p>
						<p class="text-xs">•&emsp;Gain a +1 bonus to your Proficiency</p>
					</div>
				</Dropdown>
				<Tier4Options level={8} />
			{/if}

			{#if character.level >= 9}
				<Tier4Options level={9} />
			{/if}

			{#if character.level >= 10}
				<Tier4Options level={10} />
			{/if}
		</div>
	</div>
{/if}
