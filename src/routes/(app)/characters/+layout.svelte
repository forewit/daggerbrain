<script lang="ts">
	import { page } from '$app/state';
	import {
		artCharacters,
		screenshotCharacterSheet,
		screenshotCharacterSheetMobile
	} from '$lib/assets/images';
	import Footer from '$lib/components/navigation/footer.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { ClerkLoaded, RedirectToSignIn, Show, SignUpButton } from 'svelte-clerk';
	import Mockup from '$lib/components/decorations/device-mockup.svelte';

	let { children } = $props();
	const isMarketingRoute = $derived(page.url.pathname === '/characters');
	const redirectUrl = $derived(`${page.url.pathname}${page.url.search}${page.url.hash}`);
</script>

<Show when="signed-in">
	{@render children()}

	{#snippet fallback()}
		{#if isMarketingRoute}
			<main class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))] overflow-hidden">
				<div
					class="characters-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
				>
					<enhanced:img
						src={artCharacters}
						alt=""
						fetchpriority="high"
						sizes="100vw"
						class="h-full w-full object-cover object-center"
					/>
				</div>

				<div
					class={cn(
						'relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10',
						'pr-[calc(env(safe-area-inset-right)+1rem)] pl-[calc(env(safe-area-inset-left)+1rem)]'
					)}
				>
					<section class="mt-4 flex flex-col items-center gap-6 text-center">
						<h1 class="font-eveleth text-lg">
							Free <span class="font-eveleth text-accent">Daggerheart</span> Character Creation Tool
						</h1>
						<p class="max-w-[500px]">
							Easy D&amp;D Beyond style character creator for your Daggerheart characters. Roll dice
							right from your sheet. Domain, Ancestry, and Community cards with tokens and
							interactive choices. And more!
						</p>
						<SignUpButton class={cn(buttonVariants(), 'w-min')}>Create a Character!</SignUpButton>

						<div class="relative mb-16 max-w-[500px]">
							<Mockup class="aspect-auto sm:-ml-12 sm:w-[500px]">
								<enhanced:img
									src={screenshotCharacterSheet}
									alt="tablet character sheet screenshot"
									sizes="(min-width: 640px) 500px, calc(100vw - 2rem)"
									class="size-full object-cover"
								/>
							</Mockup>
							<Mockup
								variant="phone"
								class="absolute top-20 right-6 sm:top-16 sm:-right-12 sm:w-[180px]"
							>
								<enhanced:img
									src={screenshotCharacterSheetMobile}
									alt="mobile character sheet screenshot"
									sizes="(min-width: 640px) 180px, 120px"
									class="size-full object-cover object-top"
								/>
							</Mockup>
						</div>
					</section>
				</div>

				<div class="relative mb-8 w-full bg-background/90 shadow-xl">
					<div class="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 pt-6 pb-8 text-center">
						<h2 class="text-lg font-bold">Create up to 6 Characters for Free</h2>
						<p>
							Whether you are a veteran GM or just love creating characters, Daggerbrain's character
							builder tool and digital character sheets make it easier than ever to play the game!
						</p>
						<SignUpButton class={cn(buttonVariants(), 'w-min')}>Start Playing for Free</SignUpButton
						>
					</div>
				</div>
			</main>

			<Footer />
		{:else}
			<ClerkLoaded>
				<RedirectToSignIn {redirectUrl} />
			</ClerkLoaded>
		{/if}
	{/snippet}
</Show>

<style>
	.characters-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.2) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
