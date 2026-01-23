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
			src="/images/art/mountains.webp"
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
								Added homebrew support for Weapons, Armor, Loot, Consumables, and Beastforms.
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
								<a
									href="https://buymeacoffee.com/marcanderson/homebrew-campaigns"
									target="_blank"
									class="block underline hover:text-emerald-500"
									>Read more about it here <ExternalLink
										class="-mt-0.5 ml-0.5 inline size-3.5"
									/></a
								>
							</div>

							<div class="px-5 pt-4 text-sm font-semibold">3D Dice Roller</div>
							<div class="px-5 pt-3 pb-4 text-sm text-muted-foreground">
								Roll directly on your character sheet, including hot-clickable traits, weapon
								damage, and attacks. A future update will include live dice rolls and a game log for
								campaigns
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

							<div class="px-5 pt-4 text-sm font-semibold">Encounter Builder</div>
							<div class="px-5 pt-3 pb-4 text-sm text-muted-foreground">
								Build and tune Adversaries and Environments for to your campaign.
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
										<span class="text-foreground">Campaign Improvements:</span>
										Game log, live dice rolls, and more
									</li>
									<li>
										<span class="text-foreground">Expanded Homebrew:</span>
										Adversaries, Classes, Subclasses, Domains, Ancestries, and Communities
									</li>
									<li><span class="text-foreground">PDF export</span></li>

									<li><span class="text-foreground">Searchable rules compendium</span></li>
									<li>
										<span class="text-foreground">The Void content</span>
									</li>
								</ul>
							</div>
						</div>
					</li>
				</ol>

				<div class="mt-10 space-y-2">
					<p class="text-sm font-medium text-foreground">Want to support the project?</p>
					<div class="flex gap-4">
						<Button
							class="bg-[#5865F2] hover:bg-[#5865F2]/80"
							target="_blank"
							href="https://discord.gg/nTATkV7d9S"
						>
							<svg id="Discord-Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.644 96"
								><defs
									><style>
										.cls-1 {
											fill: #fff;
										}
									</style></defs
								><path
									id="Discord-Symbol-White"
									class="cls-1"
									d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"
								/></svg
							>
							Join the Discord
						</Button>
						<Button
							class="bg-accent text-background hover:bg-accent/80"
							target="_blank"
							href="https://buymeacoffee.com/marcanderson">☕ Buy me a coffee</Button
						>
					</div>
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
