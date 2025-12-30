<script lang="ts">
	import type { DamageTypes } from '$lib/types/compendium-types';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewWeaponForm from '$lib/components/app/homebrew/homebrew-weapon-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { capitalize, cn } from '$lib/utils';
	import Hand from '@lucide/svelte/icons/hand';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	let { data } = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Determine if it's a primary or secondary weapon
	let weaponCategory = $derived.by(() => {
		if (!uid) return null;
		// Check homebrew context first
		if (homebrew.primary_weapons[uid]) return 'primary' as const;
		if (homebrew.secondary_weapons[uid]) return 'secondary' as const;
		// Fall back to compendium
		if (compendium.primary_weapons[uid]) return 'primary' as const;
		if (compendium.secondary_weapons[uid]) return 'secondary' as const;
		return null;
	});

	// Get weapon directly from homebrew context
	let weapon = $derived.by(() => {
		if (!uid) return null;
		return homebrew.primary_weapons[uid] || homebrew.secondary_weapons[uid] || null;
	});

	// Check if weapon is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !weapon) {
			error(404, `Weapon with UID "${uid}" not found`);
		}
	});

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}

	const damageTypeMap: Record<DamageTypes, string> = {
		phy: 'Physical',
		mag: 'Magical'
	};

	// Form component reference and state
	let formComponent: HomebrewWeaponForm | null = $state(null);
	let formHasChanges = $state(false);
</script>

{#if homebrew.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if weapon && weaponCategory}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<!-- Main Content: Preview and Edit Side by Side -->
			<div class="flex w-full max-w-6xl flex-col flex-col-reverse justify-center gap-6 p-4 md:flex-row">
				<!-- Edit Section -->
				<div class="w-full md:w-[400px]">
					<div class="mb-2 flex items-center justify-between gap-4">
						<h2 class="text-lg font-semibold">Edit</h2>
						<div class="flex gap-2">
							{#if formHasChanges}
								<Button
									type="button"
									size="sm"
									class="h-auto"
									variant="link"
									onclick={() => {
										if (formComponent) {
											formComponent.handleReset();
										}
									}}
								>
									<RotateCcw class="size-3.5" />
									Discard
								</Button>
							{/if}
							<Button
								type="button"
								size="sm"
								class="h-7 px-3"
								disabled={!formHasChanges}
								onclick={() => {
									if (formComponent) {
										formComponent.handleSubmit();
										// Update the homebrew state record so auto-save can detect the change
										// Create a new object reference to ensure reactivity triggers
										if (uid && weaponCategory && weapon) {
											const updatedWeapon = JSON.parse(JSON.stringify(weapon));
											if (weaponCategory === 'primary') {
												homebrew.primary_weapons[uid] = updatedWeapon;
											} else {
												homebrew.secondary_weapons[uid] = updatedWeapon;
											}
										}
									}
								}}
							>
								Save
							</Button>
						</div>
					</div>

					<div class="rounded-lg border bg-card p-4">
						<HomebrewWeaponForm
							bind:this={formComponent}
							bind:weapon
							bind:hasChanges={formHasChanges}
						/>
					</div>
				</div>

				<!-- Preview Section -->
				<div>
					<div class="sticky top-4 grow">
						<h2 class="mb-2 ml-2 flex items-center gap-2 text-lg font-semibold">Preview</h2>

						<!-- actual preview -->
						<div class="mx-auto flex w-[300px] flex-col gap-4 rounded-lg border p-4">
							<!-- Title and Subtitle -->
							<div class="flex flex-col gap-1">
								<h3 class="text-lg font-semibold">{weapon.title}</h3>
								{#if weapon.category !== 'Unarmed'}
									<p class="text-xs text-muted-foreground italic">
										Tier {levelToTier(weapon.level_requirement)}
										{weapon.category} Weapon
									</p>
								{/if}
							</div>

							<!-- Description -->
							{#if weapon.description_html.trim().length > 0}
								<p class="py-4 text-sm">{@html weapon.description_html}</p>
							{/if}

							<!-- Stats Table -->
							<table class="w-full border-collapse text-sm">
								<tbody>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Range</th>
										<td class="py-2 text-right">{weapon.range}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Trait</th>
										<td class="py-2 text-right"
											>{weapon.available_traits.map(capitalize).join(' / ')}</td
										>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage</th>
										<td class="py-2 text-right"
											>{weapon.damage_dice}{#if weapon.damage_bonus > 0}+{weapon.damage_bonus}{/if}</td
										>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground"
											>Damage Type</th
										>
										<td class="py-2 text-right"
											>{weapon.available_damage_types.map((t) => damageTypeMap[t]).join(' / ')}</td
										>
									</tr>
									<tr>
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Burden</th>
										<td class="py-2 text-right">
											{weapon.burden}
											<Hand class="-mt-0.5 ml-0.5 inline-block size-3.5" />
										</td>
									</tr>
								</tbody>
							</table>

							<!-- Features -->
							{#if weapon.features.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm">Features</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each weapon.features as feature}
											<div class="border-l-2 border-accent/30 pl-3">
												<p class="text-sm font-medium text-muted-foreground">{feature.title || 'Unnamed feature'}</p>
												<p class="mt-0.5 text-xs text-muted-foreground">
													{@html feature.description_html}
												</p>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
