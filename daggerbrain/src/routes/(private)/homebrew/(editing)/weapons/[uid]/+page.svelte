<script lang="ts">
	import type { DamageTypes } from '$lib/types/compendium-types';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getEditingHeaderContext } from '$lib/state/editing-header.svelte';
	import HomebrewWeaponForm from '$lib/components/app/homebrew/homebrew-weapon-form.svelte';
	import { capitalize, cn } from '$lib/utils';
	import Hand from '@lucide/svelte/icons/hand';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const compendium = getCompendiumContext();
	const homebrew = getHomebrewContext();
	const editingHeader = getEditingHeaderContext();

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

	// Get weapon directly from homebrew context - auto-save is handled by the context
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

	// Set the editing header
	$effect(() => {
		if (weapon && weaponCategory) {
			editingHeader.set(weapon.title, `Editing ${weaponCategory === 'primary' ? 'Primary' : 'Secondary'} Weapon`);
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
			<div class="w-full max-w-6xl space-y-4 px-4 py-4">
				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 rounded-lg border bg-card p-6">
				<h2 class="mb-4 text-lg font-semibold">Preview</h2>

				<div class="flex flex-col gap-6">
					<!-- Description -->
					{#if weapon.description_html.trim().length > 0}
						<div class="text-sm">{@html weapon.description_html}</div>
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
								<td class="py-2 text-right">
									{weapon.available_traits.map(capitalize).join(' / ') || 'None'}
								</td>
							</tr>
							<tr class="border-b">
								<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage</th>
								<td class="py-2 text-right"
									>{weapon.damage_dice}{#if weapon.damage_bonus > 0}+{weapon.damage_bonus}{/if}</td
								>
							</tr>
							<tr class="border-b">
								<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage Type</th>
								<td class="py-2 text-right"
									>{weapon.available_damage_types.length > 0
										? weapon.available_damage_types.map((t) => damageTypeMap[t]).join(' / ')
										: 'None'}</td
								>
							</tr>
							<tr class="border-b">
								<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Weapon Type</th>
								<td class="py-2 text-right">{weapon.type}</td>
							</tr>
							<tr class="border-b">
								<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Category</th>
								<td class="py-2 text-right">{weapon.category}</td>
							</tr>
							<tr class="border-b">
								<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Tier</th>
								<td class="py-2 text-right">{levelToTier(weapon.level_requirement)}</td>
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
								<p class="text-sm font-medium">Features</p>
							</div>
							<div class="mt-3 space-y-3">
								{#each weapon.features as feature}
									<div class="border-l-2 border-accent/30 pl-3">
										<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
										<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
									</div>
								{/each}
							</div>
						</div>
					{:else}
						<div class="rounded-lg border bg-muted/50 px-4 py-3">
							<p class="text-sm text-muted-foreground italic">No features</p>
						</div>
					{/if}
					</div>
				</div>

				<!-- Edit Section -->
				<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
					<div class="rounded-lg border bg-card p-6">
						<h2 class="mb-4 text-lg font-semibold">Edit</h2>
						<HomebrewWeaponForm bind:weapon />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

