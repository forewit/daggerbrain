<script lang="ts">
	import { page } from '$app/state';
	import { artCampaigns, screenshotCampaign } from '$lib/assets/images';
	import Footer from '$lib/components/navigation/footer.svelte';
	import Mockup from '$lib/components/decorations/device-mockup.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { ClerkLoaded, RedirectToSignIn, Show, SignUpButton } from 'svelte-clerk';

	let { children } = $props();
	const isMarketingRoute = $derived(page.url.pathname === '/campaigns');
	const redirectUrl = $derived(`${page.url.pathname}${page.url.search}${page.url.hash}`);
</script>

<Show when="signed-in">
	{@render children()}

	{#snippet fallback()}
		{#if isMarketingRoute}
			<main class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))] overflow-hidden">
				<div
					class="campaigns-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
				>
					<enhanced:img
						src={artCampaigns}
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
						<h1 class="font-eveleth text-lg">Campaign Manager & Dashboard</h1>
						<p class="max-w-[560px]">
							Invite your players, share homebrew content, and more with campaigns. <b
								>Launch the Campaign Dashboard</b
							> to view your player characters, encounter, countdowns, fear tracker and notes all in one
							place.
						</p>
						<SignUpButton class={cn(buttonVariants(), 'w-min')}>Start Your Campaign</SignUpButton>

						<div class="relative mt-4 mb-8 max-w-[500px]">
							<Mockup class="aspect-auto sm:w-[500px]">
								<enhanced:img
									src={screenshotCampaign}
									alt="campaign dashboard screenshot"
									sizes="(min-width: 640px) 500px, calc(100vw - 2rem)"
									class="size-full object-cover object-top"
								/>
							</Mockup>
						</div>
					</section>
				</div>

				<div class="relative mb-8 w-full bg-background/90 shadow-xl">
					<div class="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 pt-6 pb-8 text-center">
						<h2 class="text-lg font-bold">Tools built for GMs</h2>
						<p>
							Whether you're a first-time GM or managing an ongoing story, Daggerbrain GM tools are
							built for you.
						</p>
						<SignUpButton class={cn(buttonVariants(), 'w-min')}>Create a Campaign</SignUpButton>
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
	.campaigns-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.2) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
