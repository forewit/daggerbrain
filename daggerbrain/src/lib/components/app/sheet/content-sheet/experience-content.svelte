<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ExperienceRules from '../../rules/experience-rules.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	let whatIsExperiencesOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>Experiences</Sheet.Title>
</Sheet.Header>

<div class="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
	{#if character}
		<!-- Experiences Table -->
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
					<th class="py-2 pl-4 text-left">Modifier</th>
					<th class="py-2 pr-4 text-right">Experience</th>
				</tr>
			</thead>
			<tbody>
				{#each character.experiences as experience, i}
					<tr class="border-b">
						<td class="px-4 py-2 text-left">
							{#if context.experience_modifiers[i] > 0}+{/if}{context.experience_modifiers[i]}
						</td>
						<td class="py-2 pr-4 text-right text-muted-foreground italic">
							{experience.trim() === '' ? 'Unnamed Experience' : experience}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<Collapsible.Root bind:open={whatIsExperiencesOpen} class="pt-2">
		<Collapsible.Trigger class="flex items-center gap-1">
			<ChevronRight
				class={cn('size-4 transition-transform', whatIsExperiencesOpen && 'rotate-90')}
			/>
			<p class="text-sm font-medium">More info</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<ExperienceRules class="pt-2 pl-5" />
		</Collapsible.Content>
	</Collapsible.Root>
</div>
