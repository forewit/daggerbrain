<script lang="ts">
	import D4 from '$lib/components/dice/svg-components/d4.svelte';
	import D6 from '$lib/components/dice/svg-components/d6.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { cn } from '$lib/utils';

	const characterCtx = getCharacterContext();
	const derived_character_data = $derived(characterCtx.derived_character_data);
	const character = $derived(characterCtx.character);

	let current_unstoppable_value = $derived(
		parseInt(character?.feature_choices['unstoppable_active']?.[1] || '1') || 1
	);

	let max_unstoppable_value = $derived((character?.level ?? 0) < 5 ? 4 : 6);

	$effect(() => {
		if (!character) return;
		if (character.feature_choices['unstoppable_active']?.[0] === 'yes') {
			const current = current_unstoppable_value;
			if (current > max_unstoppable_value) {
				character.feature_choices['unstoppable_active'] = ['yes', String(max_unstoppable_value)];
			}
		}
	});
</script>

{#if character && derived_character_data?.hasUnstoppableClassFeature}
	<div class="-mb-2 flex items-center gap-2 border-y py-2">
		<div class="ml-2 flex h-8 items-center">
			<Switch
				id="unstoppable-switch"
				checked={character.feature_choices['unstoppable_active']?.[0] === 'yes'}
				disabled={!characterCtx.canEdit}
				class={cn(!characterCtx.canEdit && 'pointer-events-none')}
				onCheckedChange={(checked) => {
					if (checked) {
						character.feature_choices['unstoppable_active'] = ['yes', '1'];
					} else {
						character.feature_choices['unstoppable_active'] = ['no', '-1'];
					}
				}}
			/>
		</div>

		{#if character.feature_choices['unstoppable_active']?.[0] === 'yes'}
			<div class="flex items-center gap-2">
				<!-- Minus Button -->
				{#if characterCtx.canEdit}
					<Button
						type="button"
						onclick={() => {
							if (!character) return;
							const current = current_unstoppable_value;
							const newValue = Math.max(1, current - 1);
							character.feature_choices['unstoppable_active'] = ['yes', String(newValue)];
						}}
						disabled={current_unstoppable_value === 1}
						size="icon"
						variant="outline"
						class="h-auto rounded-full p-0"
					>
						−
					</Button>
				{/if}
				<!-- Die SVG and Value -->
				{#if character.level < 5}
					<D4 showLabel customLabel={current_unstoppable_value.toString()} />
				{:else}
					<D6 showLabel customLabel={current_unstoppable_value.toString()} />
				{/if}

				<!-- Plus Button -->
				{#if characterCtx.canEdit}
					<Button
						type="button"
						onclick={() => {
							if (!character) return;
							const current = current_unstoppable_value;
							const newValue = Math.min(max_unstoppable_value, current + 1);
							character.feature_choices['unstoppable_active'] = ['yes', String(newValue)];
						}}
						disabled={current_unstoppable_value === max_unstoppable_value}
						size="icon"
						variant="outline"
						class="h-auto rounded-full p-0"
					>
						+
					</Button>
				{/if}
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
			<Label
				for="unstoppable-switch"
				class={cn(
					'cursor-pointer text-xs font-normal',
					!characterCtx.canEdit && 'pointer-events-none'
				)}
			>
				Become Unstoppable
			</Label>
		{/if}
	</div>
{/if}
