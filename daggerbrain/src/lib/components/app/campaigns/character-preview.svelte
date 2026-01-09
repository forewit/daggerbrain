<!-- src/lib/components/app/campaigns/character-preview.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CampaignCharacterSummary } from '$lib/types/campaign-types';
	import EvasionPreview from '$lib/components/app/sheet/character-previews/evasion-preview.svelte';
	import ArmorPreview from '$lib/components/app/sheet/character-previews/armor-preview.svelte';
	import DamageThresholdsPreview from '$lib/components/app/sheet/character-previews/damage-thresholds-preview.svelte';
	import HpPreview from '$lib/components/app/sheet/character-previews/hp-preview.svelte';
	import StressPreview from '$lib/components/app/sheet/character-previews/stress-preview.svelte';
	import HopePreview from '$lib/components/app/sheet/character-previews/hope-preview.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import Banner from '../cards/class-banner.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import type { CharacterClass } from '$lib/types/compendium-types';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	let {
		character,
		campaignId,
		canEdit = false
	}: {
		character: CampaignCharacterSummary;
		campaignId: string;
		canEdit?: boolean;
	} = $props();

	const user = getUserContext();
	const isOwner = $derived(user.user?.clerk_id === character.owner_user_id);

	const compendium = getCompendiumContext();

	// Get summary for convenient access (with fallback defaults for old data)
	const summary = $derived(
		character.derived_character_summary ?? {
			ancestry_name: '',
			primary_class_name: '',
			primary_subclass_name: '',
			secondary_class_name: '',
			secondary_subclass_name: '',
			max_hp: 0,
			max_stress: 6,
			max_hope: 6,
			evasion: 0,
			max_armor: 0,
			damage_thresholds: { major: 0, severe: 0 }
		}
	);

	// Find the primary class by name from compendium
	const primary_class = $derived.by(() => {
		if (!summary.primary_class_name) return null;
		const classes = compendium.classes;
		return (
			Object.values(classes).find(
				(cls: CharacterClass) => cls.name === summary.primary_class_name
			) || null
		);
	});
</script>

<div class="flex w-full max-w-[400px] flex-col rounded-xl bg-background shadow">
	<!-- Header -->
	<div class="mb-2 flex gap-3 px-2">
		<div class="relative min-w-0 grow">
			<!-- level class subclass -->
			<div class="mt-3 mb-2.5 flex h-9 max-w-[400px] min-w-0 items-center truncate overflow-hidden">
				<a
					href={`/characters/${character.id}/class/`}
					class={cn(
						'group relative grid h-full min-w-[72px] place-items-center overflow-hidden rounded-l-full border-b border-accent/10 bg-accent/10 pr-3 pl-4 text-xs font-medium text-accent hover:bg-accent/20',
						!canEdit && 'pointer-events-none'
					)}
				>
					<span class="transition-transform duration-200 group-hover:-translate-y-[150%]">
						Level {character.level}
					</span>
					<span
						class="absolute inset-0 grid translate-y-full place-items-center text-xs font-medium transition-transform duration-200 group-hover:translate-y-0"
					>
						Level up?
					</span>
				</a>
				<Button
					href={`/characters/${character.id}/class/`}
					class={cn(
						'h-full  justify-start gap-2 truncate  rounded-l-none rounded-r-full',
						'border-0 border-b',
						!canEdit && 'pointer-events-none'
					)}
					variant="outline"
				>
					<p class="truncate text-left text-xs">
						{summary.primary_class_name || 'No class'}
						&ensp;•&ensp;
						{summary.primary_subclass_name || 'No subclass'}
					</p>
					<div class="grow"></div>
					{#if canEdit}
						<Pencil class="mr-1 size-3 stroke-3" />
					{/if}
				</Button>
			</div>

			<div class="flex min-w-0 gap-3">
				<!-- character image -->
				<div class="aspect-square h-[90px] w-[90px] shrink-0 overflow-hidden rounded-lg border-2">
					<img
						class="h-full w-full rounded-md object-cover"
						src={character.image_url}
						alt={character.name}
					/>
				</div>

				<!-- name and heritage -->
				<div class="flex min-w-0 grow flex-col gap-1">
					<p class="truncate text-2xl font-bold">{character.name}</p>
					<p class="mt-1 truncate text-xs text-muted-foreground">
						{summary.ancestry_name || 'No ancestry'}
					</p>
					<p class="truncate text-xs text-muted-foreground">No community</p>
				</div>
			</div>
		</div>

		<!-- class banner -->
		{#if primary_class}
			<Banner character_class={primary_class} />
		{/if}
	</div>

	<!-- Evasion and Armor -->
	<div class="mb-4 flex justify-center gap-4">
		<EvasionPreview evasion={summary.evasion} />
		<ArmorPreview max_armor={summary.max_armor} marked_armor={character.marked_armor} />
	</div>

	<!-- Damage Thresholds -->
	<div class="mx-auto mb-4">
		<DamageThresholdsPreview damage_thresholds={summary.damage_thresholds} class="scale-92" />
	</div>

	<!-- HP, Stress, Hope -->
	<div class="mb-4 flex flex-col items-center gap-3">
		<HpPreview max_hp={summary.max_hp} marked_hp={character.marked_hp} />
		<StressPreview max_stress={summary.max_stress} marked_stress={character.marked_stress} />
		<HopePreview max_hope={summary.max_hope} marked_hope={character.marked_hope} />
	</div>

	<!-- Action Button -->
	<div class="flex gap-2 p-2">
		<Button variant="outline" size="sm" href={`/characters/${character.id}/`} class="grow">
			View Character Sheet
			<ExternalLink />
		</Button>
	</div>
</div>
