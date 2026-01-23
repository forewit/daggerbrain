<script lang="ts">
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { Input } from '$lib/components/ui/input';
	import RollButton from '../../dice/roll-button.svelte';

	let {
		onExperienceClick = () => {}
	}: {
		onExperienceClick?: () => void;
	} = $props();

	const context = getCharacterContext();
	let character = $derived(context.character);

	let expanded = $state(true);
</script>

{#if character}
	<table class="w-full border-collapse">
		<colgroup>
			<col class="w-14" />
			<col />
		</colgroup>
		<thead>
			<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
				<th class="px-4 py-2 text-left">Mod.</th>
				<th class="py-2 pr-4 text-left">Experience</th>
			</tr>
		</thead>
		<tbody>
			{#each character.experiences as experience, i}
				<tr
					class="cursor-pointer text-xs"
					onclick={(e) => {
						// Don't trigger onclick if clicking on interactive elements (but allow the row itself)
						const target = e.target as HTMLElement;
						const interactive = target.closest('button, select, input');
						if (interactive && interactive !== e.currentTarget) {
							return;
						}
						onExperienceClick();
					}}
					role="button"
					tabindex="0"
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							onExperienceClick();
						}
					}}
				>
					<td class="px-4 py-2">
						<!-- <div
							class="ml-auto w-min rounded-full border bg-foreground/5 px-2 py-1 text-xs sm:mx-auto"
						>
							{#if context.experience_modifiers[i] > 0}
								+{context.experience_modifiers[i]}
							{:else}
								{context.experience_modifiers[i]}
							{/if}
						</div> -->
						<RollButton
							class="ml-auto sm:mx-auto"
							name="Experience"
							type="duality"
							modifier={context.experience_modifiers[i]}
						/>
					</td>
					<td class="py-2 pr-4">
						<p class="text-xs text-muted-foreground italic">
							{experience.trim() === '' ? 'Unnamed Experience' : experience}
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
