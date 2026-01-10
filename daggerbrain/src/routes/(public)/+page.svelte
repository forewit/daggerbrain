<script lang="ts">
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/app/footer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
</script>

<svelte:head>
	<title>Daggerbrain - Digital Character Builder for Daggerheart</title>
	<meta
		name="description"
		content="Create and manage your Daggerheart characters with Daggerbrain. Build character sheets, track abilities, inventory, and everything you need for your tabletop adventures."
	/>
</svelte:head>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Dragon banner image with fade effect - background -->
	<div
		class="dragon-fade-container pointer-events-none absolute top-0 right-0 left-0 z-0 h-72 w-full overflow-hidden sm:h-96"
	>
		<img
			src="/images/art/dragon-banner.webp"
			alt=""
			class="dragon-fade-container h-full w-full object-cover object-bottom"
		/>
	</div>

	<!-- Content -->
	<div class="relative z-10 mx-auto h-full w-full">
		<div class="flex flex-col items-center sm:items-start">
			<!-- Hero section-->
			<section
				class="mx-auto flex w-full max-w-6xl flex-col items-center gap-x-10 gap-y-16 px-4 pt-16 sm:flex-row sm:justify-evenly sm:px-8"
			>
				<!-- Hero Card -->
				<button
					class=" group relative flex min-h-[400px] max-w-[400px] cursor-pointer flex-col overflow-hidden rounded-2xl border-x border-muted-foreground/40 bg-black text-left shadow-xl transition-shadow hover:shadow-2xl sm:mx-0"
					onclick={() => {
						goto('/characters');
					}}
				>
					<img
						src="/images/art/epic-monk.webp"
						alt=""
						fetchpriority="high"
						class="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-600 group-hover:scale-103 group-hover:opacity-50"
					/>
					<!-- Top linear gradient -->
					<div
						class="hero-gradient-top pointer-events-none absolute top-0 right-0 left-0 rounded-t-2xl"
					></div>
					<!-- Bottom linear gradient -->
					<div
						class="hero-gradient-bottom pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-2xl"
					></div>
					<!-- Content -->
					<div class="z-20 flex grow flex-col gap-12 px-8 pt-16 pb-12">
						<h2
							class="relative font-eveleth text-2xl font-bold opacity-90 transition-opacity duration-300 group-hover:opacity-100"
						>
							Build Your Character
						</h2>
						<p class="relative grow text-sm">
							Create your Daggerheart character and <b>get ready for an epic adventure!</b>
						</p>
						<div class={cn(buttonVariants(), 'w-min border border-muted/20 shadow-lg')}>
							Build a character
							<ArrowRight
								class="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
							/>
						</div>
					</div>
				</button>

				<!-- info -->
				<div class="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<h1 class="font-eveleth text-2xl font-bold">
						Rolling with
						<span
							class="font-eveleth text-accent [filter:drop-shadow(0_0_8px_rgba(253,212,113,0.2))_drop-shadow(0_0_16px_rgba(253,212,113,0.2))]"
							>Hope</span
						>
					</h1>
					<p class="text-sm">
						Daggerbrain is a passion project to create rich digital tools for Daggerheart.
					</p>
					<Button
						variant="outline"
						href="/roadmap"
						class="bg-muted hover:bg-muted/70"
						onclick={() => {
							goto('/roadmap');
						}}
						>See the roadmap
						<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
							><path
								fill="currentColor"
								d="M227.4 34.7c-10.1 0-20.2.2-30.2.5l6.1 65.6-61.1-62.5c-31.3 2.5-62.5 6.6-93.8 12.5l34.2 28.4-48-.6c35.1 100.2 6.9 182.6-.3 292.1L130 476.5c10-1.3 19.9-2.4 29.6-3.3l21.5-42.2 18.6 28.8 41.5-33.5.8 43c82.9-.2 157.7 9.1 235.7 7.9-28.2-73-31.2-143.6-31.9-209.2l-33.3-19.1 32.7-33.9c-.4-21.3-1.3-42-3.6-61.9l-57.4.7 50.2-41.7c-3.8-15.5-9-30.4-16.1-44.7l-29.5-23.9C335 38 281.2 34.6 227.4 34.7zm58.7 37c10.6 24.75 21.1 49.5 31.7 74.3 7.5-10.5 14.9-21 22.4-31.5 16 27.2 32 54.3 48 81.5l-16.2 9.5-33.3-56.7-42.5 59.4-15.2-10.9 24-33.5-21.9-51.5-24.6 40.1 12 22.6-16.5 8.8-18.3-34.5-24.8 58.2-17.2-7.4 32.5-76.2 7.7-18c4.8 9.2 9.6 18.3 14.5 27.4 12.5-20.6 25.1-41.11 37.7-61.6zM91.2 128c6.72 1.6 13.4 3.4 19.2 5.3-2.1 5.9-4.1 11.8-6.2 17.6-5.79-1.6-11.72-3.4-16.9-4.7 1.39-6 2.62-12.1 3.9-18.2zm37.9 13.4c6.3 3.8 12 7.2 17 12.8L132.6 167c-4-3.7-8.6-7-12.8-9.4zm28.7 32.3c2.1 7.4 2.1 15.7 1.6 22.5l-18.5-2.4c.1-5.1.3-10-1-14.5zm-21.2 35.7l17.2 7.1c-3.3 6.6-5.1 12.7-8.6 17.8l-16.3-9c2.6-5.4 5.6-10.8 7.7-15.9zm-16.5 34.1l17.7 6.1c-1.5 5.4-3 11.2-3.6 16.2l-18.6-2c1.3-7.5 2.1-14 4.5-20.3zm207.8 17.4c8.5 1 14.6 3 21.7 7.1l-9.8 16c-4.1-2.8-9.4-3.8-13.5-4.5zm-21.2 1.5c1.1 6.1 2.5 12.2 3.9 18.3-5.9 1.3-11.7 3.3-16.5 5.1l-6.8-17.4c6.7-2.4 13.5-4.7 19.4-6zm-37.9 15.9l11 15.1c-5.6 4-11.8 7.8-16.8 10.6l-8.9-16.4c5.1-2.9 10.6-6.3 14.7-9.3zM135.3 281c1.5 4.7 4.2 9.2 6.9 12.1l-13.8 12.6c-5.5-5.7-9.5-13.5-11.2-20.1zm230.3 3.3c3.5 6.4 6.8 12.7 8.7 19.1l-17.8 5.6c-2-5.4-4.3-10.8-6.8-14.8zm-127.4 10.9l6.9 17.3c-6.4 2.7-12.9 4.8-18.6 6.5l-5-18c5.9-1.6 11.3-3.8 16.7-5.8zm-83.8 6.2c5.3 1.7 10.8 3.4 15.7 4.2-1.2 6.1-2 12.3-2.8 18.5-7-1-14.5-3.3-20.5-5.7zm50 3.5l2.8 18.5c-7.2 1.3-13.4 1.6-19.8 1.9l-.4-18.7c5.9-.2 11.6-.8 17.4-1.7zm174.5 18c1 6.4 1.6 12.9 2.2 19.3l-18.7 1.5c-.4-6-.9-11.9-2-17.8zm-67.6 30.8c18.9 3.5 44.9 16.2 68.9 33.9 7.4-9.9 14.4-20.4 21.3-31.1l30.1 12.9c-4.7 12.3-15 25.6-28.6 37.2 17 16.2 30.9 34.5 37 53-13.8-18.1-31.1-31.8-50.3-42.8-23.4 15.8-52.7 25.9-79.6 20.4 22.9-4.4 40.6-16.6 55.8-32.6-16.5-7.5-33.8-13.9-51.3-20.1z"
							/></svg
						>
					</Button>
				</div>
			</section>

			<!-- Campaigns -->
			<section class="mx-auto w-full max-w-5xl px-4 pt-20 md:px-8">
				<button
					class="campaigns-scroll-trigger group relative flex flex-col overflow-hidden rounded-3xl border-x border-accent/0 text-left transition-all duration-600 md:max-h-[400px] md:flex-row"
					onclick={() => {
						goto('/campaigns');
					}}
				>
					<div class="relative w-full grow overflow-hidden">
						<img
							src="/images/screenshots/campaign-screenshot.webp"
							alt="Character sheet screenshot"
							class="h-full w-full object-cover transition-all duration-600"
							loading="lazy"
						/>
					</div>
					<div
						class="relative z-20 flex max-w-[300px] grow flex-col justify-center gap-3 px-6 pt-5 pb-6 sm:w-1/2 sm:py-8"
					>
						<h3 class="font-eveleth text-xl font-bold">Run Campaigns</h3>
						<ul class="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
							<li>Live updates</li>
							<li>Fear tracker</li>
							<li>Countdowns</li>
							<li>Character previews</li>
							<li>... and more!</li>
						</ul>
						<div
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'pointer-events-none mt-2 w-min border-accent/20 bg-accent/10 text-accent transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(253,212,113,0.4)]'
							)}
						>
							Create a campaign
							<ArrowRight
								class="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
							/>
						</div>
					</div>
				</button>
			</section>

			<!-- Character Sheet -->
			<!-- <section class="mx-auto w-full max-w-3xl px-4 pt-24 sm:px-8">
				<div
					class="relative flex flex-col overflow-hidden rounded-xl border border-muted-foreground/20 bg-background/70 text-left shadow-lg backdrop-blur-sm sm:flex-row"
				>
					<img
						src="/images/screenshots/character-sheet.webp"
						alt="Character sheet screenshot"
						class="w-full object-cover sm:w-1/2"
						loading="lazy"
					/>
					<div class="flex grow flex-col justify-center gap-3 px-6 pt-5 pb-6 sm:w-1/2 sm:py-8">
						<h3 class="font-eveleth text-lg font-bold">Manage your digital character sheets</h3>
						<p class="text-sm text-muted-foreground">
							Track character cards, class abilities, inventory, and everything you need at the
							table.
						</p>
						<a class={cn(buttonVariants({ variant: 'outline' }), 'mt-2 w-min')} href="/characters">
							My characters
							<ArrowRight class="size-3.5" />
						</a>
					</div>
				</div>
			</section> -->

			<!-- Homebrew Showcase - Full Width Glass Pane -->
			<section class="relative z-10 mt-30 w-full pb-30">
				<button
					class="homebrew-showcase group relative min-h-[400px] w-full cursor-pointer overflow-hidden border-y border-muted-foreground/30 bg-background sm:min-h-[320px]"
					onclick={() => {
						goto('/homebrew');
					}}
				>
					<!-- Forge Background Image -->
					<div class="absolute inset-0">
						<img
							src="/images/art/forge.webp"
							alt=""
							class="h-full w-full object-cover opacity-30 transition-all duration-600"
							loading="lazy"
						/>
					</div>

					<div
						class="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col justify-center gap-4 px-4 py-8 sm:px-8 sm:py-12"
					>
						<div class="flex flex-col items-center gap-8 sm:text-left">
							<h3 class="font-eveleth text-2xl font-bold text-foreground">
								Create Homebrew Content
							</h3>
							<p class="text-center text-sm">
								Design your own Weapons, Armor, Loot, and more! <br />Build custom content for your
								Daggerheart characters.
							</p>

							<div
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'pointer-events-none mx-auto w-min shrink-0 sm:mx-0'
								)}
							>
								Create Homebrew
								<ArrowRight
									class="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
								/>
							</div>
						</div>
					</div>
				</button>
			</section>
		</div>
	</div>
</div>
<Footer />

<style>
	.dragon-fade-container {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}

	.hero-gradient-top {
		height: 8%;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
	}

	.hero-gradient-bottom {
		height: 8%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
	}

	.homebrew-showcase {
		box-shadow:
			0 -8px 16px -4px rgba(0, 0, 0, 1),
			0 8px 16px -4px rgba(0, 0, 0, 1);
	}

	/* Campaigns scroll-triggered animations */
	@keyframes campaigns-border {
		from {
			border-color: rgba(253, 212, 113, 0);
		}
		to {
			border-color: rgba(253, 212, 113, 0.2);
		}
	}

	@keyframes campaigns-shadow {
		from {
			box-shadow: none;
		}
		to {
			box-shadow: 0 0 60px rgba(253, 212, 113, 0.25);
		}
	}

	.campaigns-scroll-trigger {
		animation:
			campaigns-border 1s ease-out both,
			campaigns-shadow 1s ease-out both;
		/* Modern browsers: scroll-driven animations */
		animation-timeline: view();
		animation-range: entry 50%;
		/* Fallback for browsers that don't support view() timeline */
		@supports not (animation-timeline: view()) {
			animation: none;
		}
	}
</style>
