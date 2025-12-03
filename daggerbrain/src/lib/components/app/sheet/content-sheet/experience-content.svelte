<script lang="ts">
	import { getCharacterContext } from '$lib/state/character.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { cn } from '$lib/utils';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const context = getCharacterContext();
	let character = $derived(context.character);

	let whatIsExperiencesOpen = $state(false);
</script>

<Sheet.Header>
	<Sheet.Title>Experiences</Sheet.Title>
</Sheet.Header>

<div class="px-4 flex flex-col gap-6 overflow-y-auto">
	{#if character}
		<!-- Experiences Table -->
		<table class="w-full border-collapse text-sm">
			<thead>
				<tr class="border-b bg-card text-xs text-muted-foreground">
					<th class="px-4 py-2 text-left">Modifier</th>
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
			<p class="text-sm font-medium">What are Experiences?</p>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="pl-5 pt-2 text-xs text-muted-foreground italic space-y-3">
				<p>
					An Experience is a word or phrase used to encapsulate a specific set of skills, personality traits, or aptitudes your character has acquired over the course of their life. When your PC makes a move, they can spend a Hope to add a relevant Experience's modifier to an action or reaction roll.
				</p>
				<ul class="list-disc space-y-3 pl-4">
					<li>Your PC gets two Experiences at character creation, each with a +2 modifier.</li>
					<li>
						There's no set list of Experiences to choose from, but an Experience can't be too broadly applicable and it can't grant your character specific mechanical benefits, such as magic spells or special abilities. For example, "Lucky" and "Highly Skilled" are too broad, because they could be applied to virtually any roll. Likewise, "Supersonic Flight" and "Invulnerable" imply game-breaking special abilities.
					</li>
				</ul>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
