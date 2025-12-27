<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import HomebrewLootForm from '$lib/components/app/homebrew/homebrew-loot-form.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get loot directly from homebrew context
	let loot = $derived.by(() => {
		if (!uid) return null;
		return homebrew.loot[uid] || null;
	});

	// Check if loot is saved
	let isSaved = $derived.by(() => {
		if (!uid || !loot) return false;
		return homebrew.isSaved('loot', uid);
	});

	// Check if loot is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !loot) {
			error(404, `Loot with UID "${uid}" not found`);
		}
	});
</script>

{#if homebrew.loading}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if loot}
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
					<h1 class="text-2xl font-semibold">{loot.title}</h1>
					<p class="text-sm text-muted-foreground">Editing Loot</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 p-6">
						<h2 class="mb-2 text-lg font-semibold">Preview</h2>
						<p class="mb-4 text-xs text-muted-foreground">{isSaved ? 'Saved' : 'Not Saved'}</p>

						<div class="flex flex-col gap-6">
							<!-- Description -->
							{#if loot.description_html.trim().length > 0}
								<div class="text-sm">{@html loot.description_html}</div>
							{/if}

							<!-- Character Modifiers -->
							{#if loot.character_modifiers.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Character Modifiers</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each loot.character_modifiers as modifier}
											<div class="border-l-2 border-accent/30 pl-3">
												<p class="text-xs text-muted-foreground">
													{modifier.behaviour} {modifier.target}
													{#if modifier.type === 'flat'}
														: {modifier.value}
													{/if}
												</p>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Weapon Modifiers -->
							{#if loot.weapon_modifiers.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Weapon Modifiers</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each loot.weapon_modifiers as modifier}
											<div class="border-l-2 border-accent/30 pl-3">
												<p class="text-xs text-muted-foreground">
													{modifier.behaviour} {modifier.target_weapon} {modifier.target_stat}
												</p>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewLootForm bind:loot {uid} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
