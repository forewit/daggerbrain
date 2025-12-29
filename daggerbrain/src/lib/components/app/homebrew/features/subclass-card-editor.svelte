<script lang="ts">
	import type {
		SubclassFoundationCard,
		SubclassSpecializationCard,
		SubclassMasteryCard,
		Feature,
		TraitIds
	} from '$lib/types/compendium-types';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn, capitalize } from '$lib/utils';
	import HomebrewFeatureForm from './feature-form.svelte';
	import Dropdown from '../../leveling/dropdown.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import ImageUrlInput from '../image-url-input.svelte';
	import { FeatureSchema } from '../form-schemas';
	import { SvelteMap } from 'svelte/reactivity';

	type SubclassCard = SubclassFoundationCard | SubclassSpecializationCard | SubclassMasteryCard;

	let {
		card = $bindable(),
		cardType,
		classId
	}: {
		card: SubclassCard;
		cardType: 'foundation' | 'specialization' | 'mastery';
		classId: string;
	} = $props();

	// Reference to image input component
	let imageInput: { uploadPendingFile: () => Promise<string | null> } | null = $state(null);

	// Form state
	let formTitle = $state('');
	let formImageUrl = $state('');
	let formSpellcastTrait = $state<TraitIds | null>(null);
	let formFeatures = $state<Feature[]>([]);

	// Description is automatically set based on card type
	const descriptionHtml = $derived(capitalize(cardType));

	// Feature validation state
	const featureErrors = new SvelteMap<number, boolean>();

	const traitOptions: TraitIds[] = [
		'agility',
		'strength',
		'finesse',
		'instinct',
		'presence',
		'knowledge'
	];

	// Track a serialized snapshot to detect external changes
	let lastCardSnapshot = $state<string>('');

	// Sync form state when card prop changes externally
	$effect(() => {
		if (!card) return;

		const currentSnapshot = JSON.stringify({
			compendium_id: card.compendium_id,
			title: card.title,
			image_url: card.image_url,
			features: card.features,
			spellcast_trait:
				cardType === 'foundation' && 'spellcast_trait' in card ? card.spellcast_trait : null
		});

		// Only sync if the snapshot changed (external change)
		if (currentSnapshot !== lastCardSnapshot) {
			lastCardSnapshot = currentSnapshot;
			formTitle = card.title;
			formImageUrl = card.image_url;
			formFeatures = JSON.parse(JSON.stringify(card.features));
			if (cardType === 'foundation' && 'spellcast_trait' in card) {
				formSpellcastTrait = card.spellcast_trait;
			} else {
				formSpellcastTrait = null;
			}
			featureErrors.clear();
		}
	});

	// Update card when form changes
	$effect(() => {
		if (!card) return;

		const baseCard = {
			compendium_id: card.compendium_id,
			image_url: formImageUrl,
			card_type: card.card_type,
			title: formTitle.trim(),
			description_html: descriptionHtml,
			artist_name: '',
			features: JSON.parse(JSON.stringify(formFeatures)),
			class_id: classId
		};

		let updatedCard: SubclassCard;
		if (cardType === 'foundation') {
			updatedCard = {
				...baseCard,
				spellcast_trait: formSpellcastTrait
			} as SubclassFoundationCard;
		} else if (cardType === 'specialization') {
			updatedCard = baseCard as SubclassSpecializationCard;
		} else {
			updatedCard = baseCard as SubclassMasteryCard;
		}

		// Only update if values actually changed to prevent loops
		const hasChanges =
			card.title !== updatedCard.title ||
			card.image_url !== updatedCard.image_url ||
			JSON.stringify(card.features) !== JSON.stringify(updatedCard.features) ||
			(cardType === 'foundation' &&
				'spellcast_trait' in card &&
				card.spellcast_trait !== (updatedCard as SubclassFoundationCard).spellcast_trait);

		if (hasChanges) {
			card = updatedCard;
			// Update snapshot after internal update to prevent re-syncing
			lastCardSnapshot = JSON.stringify({
				compendium_id: card.compendium_id,
				title: card.title,
				image_url: card.image_url,
				features: card.features,
				spellcast_trait:
					cardType === 'foundation' && 'spellcast_trait' in card ? card.spellcast_trait : null
			});
		}
	});

	function addFeature() {
		const newFeature: Feature = {
			title: '',
			description_html: '',
			character_modifiers: [],
			weapon_modifiers: []
		};
		formFeatures = [...formFeatures, newFeature];
	}

	function removeFeature(index: number) {
		formFeatures = formFeatures.filter((_, i) => i !== index);
		featureErrors.delete(index);

		// Collect entries that need re-indexing
		const errorsToReindex: [number, boolean][] = [];
		for (const [i, hasError] of featureErrors) {
			if (i > index) {
				errorsToReindex.push([i, hasError]);
			}
		}

		// Delete old keys and set new ones
		for (const [i] of errorsToReindex) {
			featureErrors.delete(i);
		}
		for (const [i, hasError] of errorsToReindex) {
			featureErrors.set(i - 1, hasError);
		}
	}

	// Validate features
	function validateFeatures(): boolean {
		featureErrors.clear();
		let allValid = true;
		for (let i = 0; i < formFeatures.length; i++) {
			const result = FeatureSchema.safeParse(formFeatures[i]);
			if (!result.success) {
				allValid = false;
				featureErrors.set(i, true);
			}
		}
		return allValid;
	}

	// Expose validation function
	export function validate(): boolean {
		return validateFeatures();
	}

	// Expose upload function for parent to call on save
	export async function uploadPendingImage(): Promise<void> {
		if (imageInput) {
			try {
				const uploadedUrl = await imageInput.uploadPendingFile();
				if (uploadedUrl) {
					formImageUrl = uploadedUrl;
				}
			} catch (error) {
				console.error('Failed to upload image:', error);
				throw error;
			}
		}
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Title -->
	<div class="flex flex-col gap-1">
		<label for="subclass-card-title" class="text-xs font-medium text-muted-foreground">Title</label>
		<Input
			id="subclass-card-title"
			bind:value={formTitle}
			placeholder={`${capitalize(cardType)} card title`}
		/>
	</div>

	<!-- Image -->
	<div class="flex flex-col gap-1">
		<label for="subclass-card-image-url" class="text-xs font-medium text-muted-foreground"
			>Image</label
		>
		<ImageUrlInput
			bind:this={imageInput}
			id="subclass-card-image-url"
			bind:value={formImageUrl}
			alt="Subclass card image"
		/>
	</div>

	<!-- Spellcast Trait (Foundation only) -->
	{#if cardType === 'foundation'}
		<div class="flex flex-col gap-1">
			<label for="subclass-card-spellcast-trait" class="text-xs font-medium text-muted-foreground"
				>Spellcast Trait (Optional)</label
			>
			<Select.Root
				type="single"
				value={formSpellcastTrait || undefined}
				onValueChange={(v) => (formSpellcastTrait = (v as TraitIds) || null)}
			>
				<Select.Trigger id="subclass-card-spellcast-trait" class="w-full">
					<p class="truncate">{formSpellcastTrait ? capitalize(formSpellcastTrait) : 'None'}</p>
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">None</Select.Item>
					{#each traitOptions as trait}
						<Select.Item value={trait}>{capitalize(trait)}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}

	<!-- Features -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<p class="text-xs font-medium text-muted-foreground">Features</p>
			<Button type="button" size="sm" variant="outline" onclick={addFeature}>
				<Plus class="size-3.5" />
				Add Feature
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			{#each formFeatures as feature, index (index)}
				<Dropdown
					title={feature.title || `Unnamed feature`}
					class={featureErrors.get(index) ? 'border-destructive' : ''}
				>
					<HomebrewFeatureForm
						bind:feature={formFeatures[index]}
						onRemove={() => removeFeature(index)}
					/>
				</Dropdown>
			{:else}
				<p class="text-xs italic text-muted-foreground">No features added</p>
			{/each}
		</div>
	</div>
</div>
