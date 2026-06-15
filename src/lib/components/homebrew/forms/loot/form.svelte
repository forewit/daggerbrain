<script lang="ts">
	import { LootSchema, type Loot } from '@convex/schemas/compendium';
	import type { CardOption } from '@convex/schemas/rules';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import CharacterModifierForm from '../shared/character-modifier/form.svelte';
	import WeaponModifierForm from '../shared/weapon-modifier/form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';
	import { summarizeSuperformErrors } from '$lib/components/homebrew/forms/helpers';
	import { lootFormDataToItem, lootToFormData, normalizeLoot } from './normalize';
	import { summarizeLootFormErrors } from './errors';

	let {
		itemId,
		formId,
		item = $bindable(),
		hasChanges = $bindable(false),
		hasErrors = $bindable(false),
		unsavedItem = $bindable<Loot | null>(null),
		saving = $bindable(false),
		onSaveSuccess,
		onSaveError
	}: {
		itemId: string;
		formId: string;
		item: Loot;
		hasChanges?: boolean;
		hasErrors?: boolean;
		unsavedItem?: Loot | null;
		saving?: boolean;
		onSaveSuccess?: () => void;
		onSaveError?: () => void;
	} = $props();

	const homebrew = getHomebrewContext();
	const lootForm = superForm<Loot>(lootToFormData(item), {
		SPA: true,
		dataType: 'json',
		validators: zod4Client(LootSchema),
		resetForm: false,
		taintedMessage: false
	});

	let modifierCardOptions = $state<CardOption[]>([]);

	function buildFormData(formData = $form): Loot {
		return lootFormDataToItem(formData);
	}

	const { form, allErrors, tainted } = lootForm;
	const errorSummary = $derived(summarizeSuperformErrors($allErrors));
	const allErrorMessages = $derived(summarizeLootFormErrors(errorSummary));
	const formHasChanges = $derived(Boolean($tainted));

	$effect(() => {
		modifierCardOptions = [];
		lootForm.reset({ data: lootToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
	});

	$effect(() => {
		hasChanges = formHasChanges;
	});

	$effect(() => {
		hasErrors = $allErrors.length > 0;
	});

	$effect(() => {
		unsavedItem = buildFormData($form);
	});

	function addCharacterModifier() {
		$form.character_modifiers = [
			...$form.character_modifiers,
			{
				behaviour: 'bonus',
				character_conditions: [],
				type: 'flat',
				value: 0,
				target: 'evasion'
			}
		];
	}

	function removeCharacterModifier(index: number) {
		$form.character_modifiers = $form.character_modifiers.filter((_, current) => current !== index);
	}

	function addWeaponModifier() {
		$form.weapon_modifiers = [
			...$form.weapon_modifiers,
			{
				behaviour: 'bonus',
				character_conditions: [],
				weapon_conditions: [],
				target_weapon: 'all',
				target_stat: 'attack_roll',
				type: 'flat',
				value: 0
			}
		];
	}

	function removeWeaponModifier(index: number) {
		$form.weapon_modifiers = $form.weapon_modifiers.filter((_, current) => current !== index);
	}

	export async function handleSubmit(event?: SubmitEvent) {
		event?.preventDefault();
		saving = true;
		try {
			const validatedForm = await lootForm.validateForm({ update: true });
			if (!validatedForm.valid) {
				hasErrors = true;
				return;
			}
			const nextItem = normalizeLoot(buildFormData());
			await homebrew.updateItem({ type: 'loot', id: itemId as never, item: nextItem });
			item = nextItem;
			lootForm.reset({ data: lootToFormData(nextItem) });
			form.update((formData) => formData, { taint: 'untaint-all' });
			await tick();
			hasErrors = false;
			onSaveSuccess?.();
		} catch (error) {
			onSaveError?.();
			throw error;
		} finally {
			saving = false;
		}
	}

	export function handleReset() {
		modifierCardOptions = [];
		lootForm.reset({ data: lootToFormData(item) });
		form.update((formData) => formData, { taint: 'untaint-all' });
		hasErrors = false;
	}
</script>

<form id={formId} onsubmit={handleSubmit} onreset={handleReset} class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="loot-name">Name</label>
		<Input id="loot-name" bind:value={$form.title} placeholder="Loot name" />
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium text-muted-foreground" for="loot-description"
			>Description</label
		>
		<Textarea
			id="loot-description"
			bind:value={$form.description_html}
			placeholder="Loot description"
			rows={3}
		/>
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Character Modifiers</p>
			<Button type="button" size="sm" variant="outline" onclick={addCharacterModifier}>
				<Plus class="size-3.5" />
				Add
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each $form.character_modifiers as modifier, index (index)}
				<CharacterModifierForm
					bind:modifier={$form.character_modifiers[index]}
					bind:choiceOptions={modifierCardOptions}
					{errorSummary}
					path={['character_modifiers', index]}
					onRemove={() => removeCharacterModifier(index)}
				/>
			{:else}
				<p class="text-xs italic text-muted-foreground">No character modifiers added</p>
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Weapon Modifiers</p>
			<Button type="button" size="sm" variant="outline" onclick={addWeaponModifier}>
				<Plus class="size-3.5" />
				Add
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each $form.weapon_modifiers as modifier, index (index)}
				<WeaponModifierForm
					bind:modifier={$form.weapon_modifiers[index]}
					bind:choiceOptions={modifierCardOptions}
					{errorSummary}
					path={['weapon_modifiers', index]}
					onRemove={() => removeWeaponModifier(index)}
				/>
			{:else}
				<p class="text-xs italic text-muted-foreground">No weapon modifiers added</p>
			{/each}
		</div>
	</div>

	{#if allErrorMessages.length > 0}
		<ul class="list-inside list-disc space-y-1 pt-2">
			{#each allErrorMessages as error}
				<li class="text-xs text-destructive">{error}</li>
			{/each}
		</ul>
	{/if}
</form>
