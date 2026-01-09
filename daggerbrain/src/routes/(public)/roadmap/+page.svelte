<script lang="ts">
	import Footer from '$lib/components/app/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
</script>

<svelte:head>
	<title>Roadmap | Daggerbrain</title>
	<meta
		name="description"
		content="See what's coming next to Daggerbrain. Check out our development roadmap and upcoming features for the Daggerheart character builder."
	/>
</svelte:head>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Forest footer image with fade effect - background -->
	<div
		class="forest-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-64 w-full overflow-hidden"
	>
		<img
			src="/images/art/forest.webp"
			alt=""
			class="forest-fade-container h-full w-full object-cover object-bottom"
		/>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex h-full w-full items-center justify-center px-4 py-16">
		<div class="w-full max-w-6xl">
			<header class="mx-auto w-full max-w-3xl text-center sm:text-left">
				<h1 class="font-eveleth text-2xl font-bold sm:text-3xl">Roadmap</h1>
				<p class="mt-3 text-sm text-muted-foreground">Here's what been brewing in the cauldron.</p>
			</header>

			<section class="mx-auto mt-6 w-full max-w-3xl" aria-label="Product roadmap timeline">
				<div class="mb-6">
					<Button
						variant="link"
						href="https://buymeacoffee.com/marcanderson/posts"
						target="_blank"
						class="inline-flex items-center gap-1.5"
					>
						Read past posts
						<ExternalLink class="size-4" />
					</Button>
				</div>
				<ol class="relative border-l border-dashed border-muted-foreground/40 pl-8">
					<!-- Homebrew support -->
					<li class="relative pb-8">
						<span
							class="absolute top-4 -left-[11px] size-[18px] rounded-full border border-emerald-500 bg-background ring-4 ring-emerald-500/15"
							aria-hidden="true"
						></span>
						<div
							class="rounded-xl border border-emerald-500/40 bg-background/70 shadow-sm [filter:drop-shadow(0_0_12px_rgba(16,185,129,0.08))] backdrop-blur-sm"
						>
							<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-4">
								<div class="text-sm font-semibold">Homebrew Support</div>
								<span
									class="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500"
									>December 2025</span
								>
							</div>
							<div class="px-5 pt-3 pb-4 text-sm text-muted-foreground">
								Added homebrew support for Weapons, Armor, Loot, Consumables, and Beastforms. <a
									href="/homebrew"
									class="underline hover:text-emerald-500">Check it out!</a
								>
							</div>
						</div>
					</li>

					<!-- Campaigns -->
					<li class="relative pb-8">
						<span
							class="absolute top-4 -left-[11px] size-[18px] rounded-full border border-emerald-500 bg-background ring-4 ring-emerald-500/15"
							aria-hidden="true"
						></span>
						<div
							class="rounded-xl border border-emerald-500/40 bg-background/70 shadow-sm [filter:drop-shadow(0_0_12px_rgba(16,185,129,0.08))] backdrop-blur-sm"
						>
							<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-4">
								<div class="text-sm font-semibold">Campaigns</div>
								<span
									class="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500"
									>January 2026</span
								>
							</div>
							<div class="px-5 pt-3 pb-4 text-sm text-muted-foreground">
								Create campaigns for your players to join. Track fear, countdowns, character sheets,
								and more.
								<a href="/campaigns" class="block underline hover:text-emerald-500"
									>Try creating a campaign</a
								>
							</div>
						</div>
					</li>

					<!-- Current -->
					<li class="relative pb-8">
						<span
							class="absolute top-4 -left-[11px] size-[18px] rounded-full border border-accent bg-background ring-4 ring-accent/15"
							aria-hidden="true"
						></span>
						<div
							class="rounded-xl border border-accent/40 bg-background/70 shadow-sm [filter:drop-shadow(0_0_12px_rgba(253,212,113,0.08))] backdrop-blur-sm"
						>
							<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-4">
								<div class="text-sm font-semibold">Licensed Art and Content</div>
								<span
									class="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs text-accent"
									>In Progress</span
								>
							</div>
							<div class="px-5 pt-3 pb-4 text-sm text-muted-foreground">
								I am working on getting Daggerbrain added to the official <a
									href="https://darringtonpress.com/license/"
									class="underline hover:text-accent">Daggerheart VTT whitelist</a
								>. If you can help with this,
								<a href="/contact" class="underline hover:text-accent">lets talk!</a>
							</div>

							<div class="px-5 pt-4 text-sm font-semibold">3D Dice Roller</div>
							<div class="px-5 pt-3 pb-4 text-sm text-muted-foreground">
								Roll with hope or fear directly on your character sheets and campaigns.
							</div>
						</div>
					</li>

					<!-- Upcoming -->
					<li class="relative">
						<span
							class="absolute top-4 -left-[9px] size-4 rounded-full border border-muted-foreground/50 bg-background"
							aria-hidden="true"
						></span>
						<div
							class="rounded-xl border border-muted-foreground/20 bg-background/70 shadow-sm backdrop-blur-sm"
						>
							<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-4">
								<div class="text-sm font-semibold">Upcoming</div>
								<span
									class="inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
									>Coming soon</span
								>
							</div>
							<div class="px-5 pt-3 pb-5 text-sm text-muted-foreground">
								<ul class="list-disc space-y-1 pl-5">
									<li>
										<span class="text-foreground">Expanded Homebrew support</span>
										for Classes, Subclasses, Domain, Ancestry, and Community Cards
									</li>

									<li>
										<span class="text-foreground">Adversary Manager</span>
									</li>
									<li><span class="text-foreground">PDF export</span></li>

									<li><span class="text-foreground">Searchable rules compendium</span></li>
									<li>
										<span class="text-foreground">The Void content</span>
										playtest material
									</li>
								</ul>
							</div>
						</div>
					</li>
				</ol>

				<div class="mt-10 flex gap-4">
					<Button href="/contact">Got an opinion?</Button>
					<!-- <Button
						class="whitespace-normal"
						variant="link"
						href="https://trello.com/b/EU4j0FnA/daggerbrain-roadmap"
						target="_blank">See more details on the public trello board</Button
					> -->
				</div>
			</section>
		</div>
	</div>
</div>
<Footer />

<style>
	.forest-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
