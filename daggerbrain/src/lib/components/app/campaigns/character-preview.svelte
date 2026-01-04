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

	let {
		character,
		campaignId
	}: {
		character: CampaignCharacterSummary;
		campaignId: string;
	} = $props();

	const user = getUserContext();
	const isOwner = $derived(user.user?.clerk_id === character.owner_user_id);
</script>

<div class="rounded-lg border bg-card p-4">
	<!-- Header -->
	<div class="mb-4 flex gap-3">
		<!-- Character image -->
		<div class="aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2">
			<img
				class="h-full w-full object-cover"
				src={character.image_url}
				alt={character.name}
			/>
		</div>

		<!-- Name and info -->
		<div class="flex grow flex-col gap-1 truncate">
			<div class="flex items-center gap-2">
				<p class="truncate text-xl font-bold">{character.name}</p>
				<span class="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
					Level {character.level}
				</span>
			</div>
			<p class="truncate text-xs text-muted-foreground">
				{character.derived_descriptors.primary_class_name || 'No class'}
				&ensp;•&ensp;
				{character.derived_descriptors.primary_subclass_name || 'No subclass'}
			</p>
			<p class="truncate text-xs text-muted-foreground">
				{character.derived_descriptors.ancestry_name || 'No ancestry'}
			</p>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="mb-4 grid grid-cols-2 gap-4">
		<!-- Evasion and Armor -->
		<div class="flex gap-4">
			<EvasionPreview evasion={character.evasion} />
			<ArmorPreview max_armor={character.max_armor} marked_armor={character.marked_armor} />
		</div>

		<!-- Damage Thresholds -->
		<DamageThresholdsPreview damage_thresholds={character.damage_thresholds} class="mx-auto" />
	</div>

	<!-- HP, Stress, Hope -->
	<div class="mb-4 flex flex-col gap-3">
		<HpPreview max_hp={character.max_hp} marked_hp={character.marked_hp} />
		<StressPreview max_stress={character.max_stress} marked_stress={character.marked_stress} />
		<HopePreview max_hope={character.max_hope} marked_hope={character.marked_hope} />
	</div>

	<!-- Action Button -->
	<div class="flex gap-2">
		<Button
			variant="outline"
			size="sm"
			href={`/characters/${character.id}/`}
			class="grow"
		>
			View
		</Button>
		{#if isOwner}
			<Button
				variant="outline"
				size="sm"
				href={`/characters/${character.id}/edit`}
				class="grow"
			>
				Edit
			</Button>
		{/if}
	</div>
</div>

