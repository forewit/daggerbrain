<script lang="ts">
	import Footer from '$lib/components/app/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
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

			<section class="mx-auto mt-10 w-full max-w-3xl" aria-label="Product roadmap timeline">
				<ol class="relative border-l border-dashed border-muted-foreground/40 pl-8">
					<!-- Past -->
					<li class="relative pb-8 opacity-60">
						<span
							class="absolute top-4 -left-[9px] size-4 rounded-full border border-muted-foreground/50 bg-background"
							aria-hidden="true"
						></span>
						<div
							class="rounded-xl border border-muted-foreground/20 bg-background/70 shadow-sm backdrop-blur-sm"
						>
							<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-4">
								<div class="text-sm font-semibold">Completed</div>
							</div>
							<div class="px-5 pt-3 pb-5 text-sm text-muted-foreground">
								<ul class="list-disc space-y-1 pl-5">
									<li><span class="text-foreground">Character sheet & character builder</span></li>
									<li><span class="text-foreground">Daggerbrain launch!</span></li>
								</ul>
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
									>Current</span
								>
							</div>
							<div class="px-5 pt-3 pb-4 text-sm">
								I am working on getting Daggerbrain added to the official <a
									href="https://darringtonpress.com/license/"
									class="underline hover:text-accent">Daggerheart VTT whitelist</a
								>. If you can help with this, <a href="/contact" class="underline hover:text-accent">lets talk!</a>
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
									>Next</span
								>
							</div>
							<div class="px-5 pt-3 pb-5 text-sm text-muted-foreground">
								<ul class="list-disc space-y-1 pl-5">
									<li><span class="text-foreground">Integrated dice roller</span></li>
									<li>
										<span class="text-foreground">The Void content</span>
										playtest material
									</li>
									<li><span class="text-foreground">Searchable rules compendium</span></li>
									<li><span class="text-foreground">Homebrew support</span></li>

									<li>
										<span class="text-foreground">DM tools</span>
										adversary manager, campaigns, and more!
									</li>
								</ul>
							</div>
						</div>
					</li>
				</ol>

				<Button class="mt-10" href="/contact">Got an opinion?</Button>
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
