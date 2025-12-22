<script lang="ts">
	import { getHomebrewContext } from '$lib/state/homebrew.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';
	import HomebrewSubclassForm from '$lib/components/app/homebrew/homebrew-subclass-form.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { error } from '@sveltejs/kit';

	let { data } = $props();

	const homebrew = getHomebrewContext();
	const compendium = getCompendiumContext();

	// Get the uid from the layout data
	let uid = $derived(data.uid);

	// Get subclass directly from homebrew context - auto-save is handled by the context
	let subclass = $derived.by(() => {
		if (!uid) return null;
		return homebrew.subclasses[uid] || null;
	});

	// Get class name for display
	let className = $derived.by(() => {
		if (!subclass) return null;
		const cls = homebrew.classes[subclass.class_id] || compendium.classes[subclass.class_id];
		return cls?.name || subclass.class_id;
	});

	// Check if subclass is not found after loading completes
	$effect(() => {
		if (!homebrew.loading && uid && !subclass) {
			error(404, `Subclass with UID "${uid}" not found`);
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
{:else if subclass}
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
					<h1 class="text-2xl font-semibold">{subclass.name}</h1>
					<p class="text-sm text-muted-foreground">Editing Subclass ({className})</p>
				</div>

				<!-- Main Content: Preview and Edit Side by Side -->
				<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
					<!-- Preview Section -->
					<div class="flex-1 rounded-lg border bg-card p-6">
						<h2 class="mb-4 text-lg font-semibold">Preview</h2>

						<div class="flex flex-col gap-6">
							<!-- Description -->
							{#if subclass.description_html.trim().length > 0}
								<div class="text-sm">{@html subclass.description_html}</div>
							{/if}

							<!-- Foundation Card -->
							<div class="rounded-lg border bg-primary/5 px-4 py-3">
								<p class="text-sm font-medium mb-3">Foundation Card</p>
								<div class="space-y-2">
									<p class="text-xs font-medium text-muted-foreground">{subclass.foundation_card.title}</p>
									{#if subclass.foundation_card.description_html}
										<p class="text-xs text-muted-foreground">{@html subclass.foundation_card.description_html}</p>
									{/if}
									{#if subclass.foundation_card.spellcast_trait}
										<p class="text-xs text-muted-foreground">Spellcast Trait: {subclass.foundation_card.spellcast_trait}</p>
									{/if}
									{#if subclass.foundation_card.features.length > 0}
										<div class="mt-2 space-y-1">
											{#each subclass.foundation_card.features as feature}
												<div class="border-l-2 border-accent/30 pl-2">
													<p class="text-xs font-medium text-muted-foreground">{feature.title}</p>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>

							<!-- Specialization Card -->
							<div class="rounded-lg border bg-primary/5 px-4 py-3">
								<p class="text-sm font-medium mb-3">Specialization Card</p>
								<div class="space-y-2">
									<p class="text-xs font-medium text-muted-foreground">{subclass.specialization_card.title}</p>
									{#if subclass.specialization_card.description_html}
										<p class="text-xs text-muted-foreground">{@html subclass.specialization_card.description_html}</p>
									{/if}
									{#if subclass.specialization_card.features.length > 0}
										<div class="mt-2 space-y-1">
											{#each subclass.specialization_card.features as feature}
												<div class="border-l-2 border-accent/30 pl-2">
													<p class="text-xs font-medium text-muted-foreground">{feature.title}</p>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>

							<!-- Mastery Card -->
							<div class="rounded-lg border bg-primary/5 px-4 py-3">
								<p class="text-sm font-medium mb-3">Mastery Card</p>
								<div class="space-y-2">
									<p class="text-xs font-medium text-muted-foreground">{subclass.mastery_card.title}</p>
									{#if subclass.mastery_card.description_html}
										<p class="text-xs text-muted-foreground">{@html subclass.mastery_card.description_html}</p>
									{/if}
									{#if subclass.mastery_card.features.length > 0}
										<div class="mt-2 space-y-1">
											{#each subclass.mastery_card.features as feature}
												<div class="border-l-2 border-accent/30 pl-2">
													<p class="text-xs font-medium text-muted-foreground">{feature.title}</p>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<!-- Edit Section -->
					<div class="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[300px]">
						<div class="rounded-lg border bg-card p-6">
							<h2 class="mb-4 text-lg font-semibold">Edit</h2>
							<HomebrewSubclassForm bind:subclass />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
