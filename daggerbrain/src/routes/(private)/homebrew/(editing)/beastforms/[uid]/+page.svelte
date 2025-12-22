<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewBeastformForm from '$lib/components/app/homebrew/homebrew-beastform-form.svelte';
	import { capitalize, cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get beastform directly from homebrew context - auto-save is handled by the context
	let beastform = $derived.by(() => {
		if (!uid) return null;
		return homebrew.beastforms[uid] || null;
	});

	// Check if beastform is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !beastform) {
			error(404, `Beastform with UID "${uid}" not found`);
		}
	});

	// Helper to convert level requirement to tier
	function levelToTier(level: number): number {
		if (level >= 8) return 4;
		if (level >= 5) return 3;
		if (level >= 2) return 2;
		return 1;
	}

	const damageTypeMap: Record<'phy' | 'mag', string> = {
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
{:else if beastform}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<div
			class={cn(
				'relative z-10 flex h-full w-full flex-col items-center justify-start',
				'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
			)}
		>
			<div class="w-full max-w-6xl space-y-4 px-4 py-4">
				<!-- Header -->
				<div class="flex flex-col gap-1">
					<h1 class="text-2xl font-semibold">{beastform.name}</h1>
					<p class="text-sm text-muted-foreground">Editing Beastform</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 rounded-lg border bg-card p-6">
						<h2 class="mb-4 text-lg font-semibold">Preview</h2>

						<div class="flex flex-col gap-6">
							<!-- Category -->
							{#if beastform.category.trim().length > 0}
								<div class="text-sm">
									<span class="font-medium text-muted-foreground">Category:</span> {beastform.category}
								</div>
							{/if}

							<!-- Stats Table -->
							<table class="w-full border-collapse text-sm">
								<tbody>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Tier</th>
										<td class="py-2 text-right">{levelToTier(beastform.level_requirement)}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Character Trait</th>
										<td class="py-2 text-right">
											{capitalize(beastform.character_trait.trait)}
											{#if beastform.character_trait.bonus !== 0}
												{beastform.character_trait.bonus > 0 ? '+' : ''}{beastform.character_trait.bonus}
											{/if}
										</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Attack Range</th>
										<td class="py-2 text-right">{beastform.attack.range}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Attack Trait</th>
										<td class="py-2 text-right">{capitalize(beastform.attack.trait)}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage</th>
										<td class="py-2 text-right">
											{beastform.attack.damage_dice}
											{#if beastform.attack.damage_bonus > 0}
												+{beastform.attack.damage_bonus}
											{/if}
										</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Damage Type</th>
										<td class="py-2 text-right">{damageTypeMap[beastform.attack.damage_type]}</td>
									</tr>
									{#if beastform.evasion_bonus !== 0}
										<tr class="border-b">
											<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Evasion Bonus</th>
											<td class="py-2 text-right">
												{beastform.evasion_bonus > 0 ? '+' : ''}{beastform.evasion_bonus}
											</td>
										</tr>
									{/if}
									{#if beastform.advantages.length > 0}
										<tr>
											<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Advantages</th>
											<td class="py-2 text-right">{beastform.advantages.join(', ')}</td>
										</tr>
									{/if}
								</tbody>
							</table>

							<!-- Features -->
							{#if beastform.features.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Features</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each beastform.features as feature}
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
							<HomebrewBeastformForm bind:beastform />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
