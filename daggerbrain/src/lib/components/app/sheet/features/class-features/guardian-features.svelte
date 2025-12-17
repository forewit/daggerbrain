<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	const context = getCharacterContext();
	let character = $derived(context.character);

	const compendium = getCompendiumContext();
	let guardian_class_id = $derived(compendium.classes.guardian.compendium_id);

	let current_unstoppable_value = $derived(
		parseInt(character?.class_choices[guardian_class_id]?.['unstoppable_active']?.[1] || '1') || 1
	);

	let max_unstoppable_value = $derived((character?.level ?? 0) < 5 ? 4 : 6);

	$effect(() => {
		if (!character) return;
		if (character.class_choices[guardian_class_id]?.['unstoppable_active']?.[0] === 'yes') {
			const current = current_unstoppable_value;
			if (current > max_unstoppable_value) {
				if (!character.class_choices[guardian_class_id])
					character.class_choices[guardian_class_id] = {};
				character.class_choices[guardian_class_id]['unstoppable_active'] = [
					'yes',
					String(max_unstoppable_value)
				];
			}
		}
	});
</script>

{#if character && (character.primary_class_id === guardian_class_id || character.secondary_class_id === guardian_class_id)}
	<div class="-mb-2 flex items-center gap-2 border-y py-2">
		<div class="ml-2 flex h-8 items-center">
			<Switch
				id="unstoppable-switch"
				checked={character.class_choices[guardian_class_id]?.['unstoppable_active']?.[0] === 'yes'}
				onCheckedChange={(checked) => {
					if (!character.class_choices[guardian_class_id])
						character.class_choices[guardian_class_id] = {};
					if (checked) {
						character.class_choices[guardian_class_id]['unstoppable_active'] = ['yes', '1'];
					} else {
						character.class_choices[guardian_class_id]['unstoppable_active'] = ['no', '-1'];
					}
				}}
			/>
		</div>

		{#if character.class_choices[guardian_class_id]?.['unstoppable_active']?.[0] === 'yes'}
			<div class="flex items-center gap-2">
				<!-- Minus Button -->
				<Button
					type="button"
					onclick={() => {
						if (!character) return;
						if (!character.class_choices[guardian_class_id])
							character.class_choices[guardian_class_id] = {};
						const current = current_unstoppable_value;
						const newValue = Math.max(1, current - 1);
						character.class_choices[guardian_class_id]['unstoppable_active'] = [
							'yes',
							String(newValue)
						];
					}}
					disabled={current_unstoppable_value === 1}
					size="icon"
					variant="outline"
					class="h-auto rounded-full p-0"
				>
					−
				</Button>

				<!-- Die SVG and Value -->
				<div class="flex items-center gap-2">
					{#if character.level < 5}
						<svg
							class="size-8 text-muted-foreground"
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
					{:else}
						<svg
							class="size-8 text-muted-foreground"
							version="1.1"
							viewBox="0 0 16.933 16.933"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
						>
							<defs>
								<path
									id="p9"
									d="m75.52 132.64c2.74-.49 4.95.51 7.51 1.33 3.76 1.32 7.55 2.58 11.33 3.84.13 8.58 0 17.16.07 25.75-5.8 1.14-11.61 2.24-17.39 3.46-1.71.26-3.32.78-5 .14-4.93-1.74-9.74-3.79-14.67-5.54-.13-8.62-.14-17.28.05-25.9 6.07-.84 12.06-2.07 18.1-3.08zm-14.37 4.01c4.15 1.69 8.39 4.02 12.81 4.81 5.59-.75 11.12-2.21 16.67-3.27-4.48-1.41-9-3.43-13.63-4.14-5.31.59-10.57 1.79-15.85 2.6zm-2.31.9c-.01 7.59 0 15.19-.07 22.79 4.57 1.93 9.18 3.7 13.85 5.37-.1-7.48.21-15.01-.11-22.47-4.26-2.4-9.16-3.78-13.67-5.69z"
								/>
								<path
									id="p12"
									d="m77 134.05c4.63.71 9.15 2.73 13.63 4.14-5.55 1.06-11.08 2.52-16.67 3.27-4.42-.79-8.66-3.12-12.81-4.81 5.28-.81 10.54-2.01 15.85-2.6z"
								/>
								<path
									id="p15"
									d="m58.84 137.55c4.51 1.91 9.41 3.29 13.67 5.69.32 7.46.01 14.99.11 22.47-4.67-1.67-9.28-3.44-13.85-5.37.07-7.6.06-15.2.07-22.79z"
								/>
							</defs>
							<use
								transform="matrix(.35278 0 0 .35278 -18.168 -44.278)"
								width="100%"
								height="100%"
								fill="currentColor"
								xlink:href="#p9"
							/>
							<use
								transform="matrix(.35278 0 0 .35278 -18.168 -44.278)"
								width="100%"
								height="100%"
								fill="transparent"
								xlink:href="#p12"
							/>
							<use
								transform="matrix(.35278 0 0 .35278 -18.168 -44.278)"
								width="100%"
								height="100%"
								fill="transparent"
								xlink:href="#p15"
							/>
						</svg>
					{/if}
					<span class="text-sm font-medium">{current_unstoppable_value}</span>
				</div>

				<!-- Plus Button -->
				<Button
					type="button"
					onclick={() => {
						if (!character) return;
						if (!character.class_choices[guardian_class_id])
							character.class_choices[guardian_class_id] = {};
						const current = current_unstoppable_value;
						const newValue = Math.min(max_unstoppable_value, current + 1);
						character.class_choices[guardian_class_id]['unstoppable_active'] = [
							'yes',
							String(newValue)
						];
					}}
					disabled={current_unstoppable_value === max_unstoppable_value}
					size="icon"
					variant="outline"
					class="h-auto rounded-full p-0"
				>
					+
				</Button>

				<!-- Descriptive Text -->
				<p class="text-xs text-muted-foreground">
					<span class="font-medium text-foreground">Unstoppable: </span>
					-1 phy damage severity, +{current_unstoppable_value} to damage, can't be
					<em>Restrained</em>
					or
					<em>Vulnerable</em>.
				</p>
			</div>
		{:else}
			<Label for="unstoppable-switch" class="cursor-pointer text-xs font-normal">
				Become Unstoppable
			</Label>
		{/if}
	</div>
{/if}
