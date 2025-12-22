<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import { getEditingHeaderContext } from '$lib/state/editing-header.svelte';
	import HomebrewClassForm from '$lib/components/app/homebrew/homebrew-class-form.svelte';
	import { cn, capitalize } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();
	const compendium = getCompendiumContext();
	const editingHeader = getEditingHeaderContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get class directly from homebrew context - auto-save is handled by the context
	let characterClass = $derived.by(() => {
		if (!uid) return null;
		return homebrew.classes[uid] || null;
	});

	// Check if class is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !characterClass) {
			error(404, `Class with UID "${uid}" not found`);
		}
	});

	// Set the editing header
	$effect(() => {
		if (characterClass) {
			editingHeader.set(characterClass.name, 'Editing Class');
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
{:else if characterClass}
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
							{#if characterClass.description_html.trim().length > 0}
								<div class="text-sm">{@html characterClass.description_html}</div>
							{/if}

							<!-- Image -->
							{#if characterClass.image_url}
								<div class="rounded-lg border bg-muted p-2">
									<img src={characterClass.image_url} alt={characterClass.name} class="w-full rounded" />
								</div>
							{/if}

							<!-- Stats Table -->
							<table class="w-full border-collapse text-sm">
								<tbody>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Starting Evasion</th>
										<td class="py-2 text-right">{characterClass.starting_evasion}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Starting Max HP</th>
										<td class="py-2 text-right">{characterClass.starting_max_hp}</td>
									</tr>
									<tr class="border-b">
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Primary Domain</th>
										<td class="py-2 text-right">{characterClass.primary_domain_id}</td>
									</tr>
									<tr>
										<th class="py-2 pr-4 text-left font-normal text-muted-foreground">Secondary Domain</th>
										<td class="py-2 text-right">{characterClass.secondary_domain_id}</td>
									</tr>
								</tbody>
							</table>

							<!-- Hope Feature -->
							<div class="rounded-lg border bg-primary/5 px-4 py-3">
								<div class="flex items-center justify-between">
									<p class="text-sm font-medium">Hope Feature</p>
								</div>
								<div class="mt-3">
									<div class="border-l-2 border-accent/30 pl-3">
										<p class="text-sm font-medium text-muted-foreground">{characterClass.hope_feature.title}</p>
										<p class="mt-0.5 text-xs text-muted-foreground">{@html characterClass.hope_feature.description_html}</p>
									</div>
								</div>
							</div>

							<!-- Class Features -->
							{#if characterClass.class_features.length > 0}
								<div class="rounded-lg border bg-primary/5 px-4 py-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-medium">Class Features</p>
									</div>
									<div class="mt-3 space-y-3">
										{#each characterClass.class_features as feature}
											<div class="border-l-2 border-accent/30 pl-3">
												<p class="text-sm font-medium text-muted-foreground">{feature.title}</p>
												<p class="mt-0.5 text-xs text-muted-foreground">{@html feature.description_html}</p>
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<div class="rounded-lg border bg-muted/50 px-4 py-3">
									<p class="text-sm text-muted-foreground italic">No class features</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewClassForm bind:characterClass />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
