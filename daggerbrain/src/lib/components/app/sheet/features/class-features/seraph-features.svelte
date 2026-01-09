<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let seraph_class_id = $derived(compendium.classes.seraph.compendium_id);

	let prayer_dice_used = $derived(
		character
			? parseInt(character.class_choices[seraph_class_id]?.['prayer_dice_used']?.[0] || '0')
			: 0
	);
	let max_prayer_dice = $derived(context.traits['strength'] || 0);
</script>

{#if character && (character.primary_class_id === seraph_class_id || character.secondary_class_id === seraph_class_id)}
	<div class="-mb-2 flex items-center justify-center gap-2 border-y py-2">
		<p class="text-xs font-medium text-muted-foreground">Prayer dice:</p>

		<div class="flex flex-wrap gap-2">
			{#each Array(max_prayer_dice) as _, index}
				<button
					disabled={!context.canEdit}
					aria-label="Prayer dice {index + 1}"
					class={cn(index < prayer_dice_used ? 'text-accent' : 'text-muted-foreground/50', !context.canEdit && 'pointer-events-none')}
					onclick={() => {
						if (!character.class_choices[seraph_class_id])
							character.class_choices[seraph_class_id] = {};
						if (index + 1 === prayer_dice_used) {
							character.class_choices[seraph_class_id]['prayer_dice_used'] = [
								Math.max(0, prayer_dice_used - 1).toString()
							];
						} else {
							character.class_choices[seraph_class_id]['prayer_dice_used'] = [
								(index + 1).toString()
							];
						}
					}}
					type="button"
				>
					<svg
						class="size-6"
						version="1.1"
						viewBox="0 0 16.933 16.933"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
					>
						<defs>
							<path
								id="p7"
								d="m28.07 130.5c3.05 3.83 5.42 8.17 8.25 12.17 3.74 5.83 7.76 11.48 11.39 17.38-5.34 2.9-10.63 5.97-16.1 8.61-1.22.72-2.61-.07-3.83-.43-7.62-3.05-15.31-5.93-23-8.83 1.22-1.95 2.53-3.83 4.03-5.57 6.48-7.71 12.6-15.77 19.26-23.33zm-2.89 5.73c-6.14 7.35-12.03 14.9-18.14 22.27 7.54 2.99 15.14 5.84 22.71 8.74-.89-11.19-1.45-22.41-2.45-33.59-.71.86-1.41 1.72-2.12 2.58z"
							/>
							<path
								id="p13"
								d="m27.3 133.65c1 11.18 1.56 22.4 2.45 33.59-7.57-2.9-15.17-5.75-22.71-8.74 6.11-7.37 12-14.92 18.14-22.27.71-.86 1.41-1.72 2.12-2.58z"
							/>
						</defs>
						<use
							transform="matrix(.35278 0 0 .35278 -.86821 -44.392)"
							width="100%"
							height="100%"
							fill="currentColor"
							xlink:href="#p7"
						/>
						<use
							transform="matrix(.35278 0 0 .35278 -.86821 -44.392)"
							width="100%"
							height="100%"
							fill="transparent"
							xlink:href="#p13"
						/>
					</svg>
				</button>
			{/each}
		</div>
	</div>
{/if}
