<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { artCharacters } from '$lib/assets/images';
	import { cn } from '$lib/utils';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import Footer from '$lib/components/navigation/footer.svelte';
	import { Show, useClerkContext, UserProfile } from 'svelte-clerk';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { ADVENTURER_PLAN_SLUG, FREE_PLAN_SLUG } from '@convex/constants/entitlements';

	const clerkCtx = useClerkContext();
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Characters footer image with fade effect - background -->
	<div
		class="characters-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artCharacters}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="characters-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<Loader isLoading={!clerkCtx.auth.userId} />

	{#if clerkCtx.auth.userId}
		<div
			transition:fade
			class="@container pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]"
		>
			<div class="mx-auto flex w-min max-w-6xl flex-col justify-center gap-4 px-2 py-4">
				<div class="flex flex-col gap-4 @6xl:flex-row">
					<div class="relative h-[704px] max-w-[880px] grow">
						<div class="absolute inset-0"></div>
						<UserProfile routing="hash" />
					</div>
					<div
						class="relative flex max-w-[880px] flex-col flex-wrap items-center gap-x-6 gap-y-4 rounded border border-white/5 bg-card p-4 pt-6 sm:flex-row sm:gap-y-6 sm:pt-4 md:p-6 @6xl:flex-col"
					>
						<div class="flex grow flex-col items-center gap-4 sm:flex-row md:gap-6 @6xl:flex-col">
							<div class="flex grow flex-col gap-3 md:grow-0">
								<p class="hidden text-sm font-medium md:inline">Have Questions?</p>
								<Button variant="default" size="sm" href="/contact" class="md:w-min"
									>Contact Me<ExternalLink class="-mt-[1px] ml-1 size-3.5" /></Button
								>
							</div>
							<div class="flex grow flex-col gap-3 md:grow-0">
								<p class="hidden text-sm font-medium md:inline">Join the Community!</p>
								<Button
									class="bg-[#5865F2] hover:bg-[#5865F2]/80 md:w-min"
									target="_blank"
									size="sm"
									href="https://discord.gg/"
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
							</div>
							<div class="flex grow flex-col gap-3 md:grow-0">
								<p class="hidden text-sm font-medium md:inline">See what's brewing</p>
								<Button
									size="sm"
									variant="secondary"
									href="/roadmap"
									class="bg-secondary/50 hover:bg-secondary/30 md:w-min"
									>See the roadmap
									<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
										><path
											fill="currentColor"
											d="M227.4 34.7c-10.1 0-20.2.2-30.2.5l6.1 65.6-61.1-62.5c-31.3 2.5-62.5 6.6-93.8 12.5l34.2 28.4-48-.6c35.1 100.2 6.9 182.6-.3 292.1L130 476.5c10-1.3 19.9-2.4 29.6-3.3l21.5-42.2 18.6 28.8 41.5-33.5.8 43c82.9-.2 157.7 9.1 235.7 7.9-28.2-73-31.2-143.6-31.9-209.2l-33.3-19.1 32.7-33.9c-.4-21.3-1.3-42-3.6-61.9l-57.4.7 50.2-41.7c-3.8-15.5-9-30.4-16.1-44.7l-29.5-23.9C335 38 281.2 34.6 227.4 34.7zm58.7 37c10.6 24.75 21.1 49.5 31.7 74.3 7.5-10.5 14.9-21 22.4-31.5 16 27.2 32 54.3 48 81.5l-16.2 9.5-33.3-56.7-42.5 59.4-15.2-10.9 24-33.5-21.9-51.5-24.6 40.1 12 22.6-16.5 8.8-18.3-34.5-24.8 58.2-17.2-7.4 32.5-76.2 7.7-18c4.8 9.2 9.6 18.3 14.5 27.4 12.5-20.6 25.1-41.11 37.7-61.6zM91.2 128c6.72 1.6 13.4 3.4 19.2 5.3-2.1 5.9-4.1 11.8-6.2 17.6-5.79-1.6-11.72-3.4-16.9-4.7 1.39-6 2.62-12.1 3.9-18.2zm37.9 13.4c6.3 3.8 12 7.2 17 12.8L132.6 167c-4-3.7-8.6-7-12.8-9.4zm28.7 32.3c2.1 7.4 2.1 15.7 1.6 22.5l-18.5-2.4c.1-5.1.3-10-1-14.5zm-21.2 35.7l17.2 7.1c-3.3 6.6-5.1 12.7-8.6 17.8l-16.3-9c2.6-5.4 5.6-10.8 7.7-15.9zm-16.5 34.1l17.7 6.1c-1.5 5.4-3 11.2-3.6 16.2l-18.6-2c1.3-7.5 2.1-14 4.5-20.3zm207.8 17.4c8.5 1 14.6 3 21.7 7.1l-9.8 16c-4.1-2.8-9.4-3.8-13.5-4.5zm-21.2 1.5c1.1 6.1 2.5 12.2 3.9 18.3-5.9 1.3-11.7 3.3-16.5 5.1l-6.8-17.4c6.7-2.4 13.5-4.7 19.4-6zm-37.9 15.9l11 15.1c-5.6 4-11.8 7.8-16.8 10.6l-8.9-16.4c5.1-2.9 10.6-6.3 14.7-9.3zM135.3 281c1.5 4.7 4.2 9.2 6.9 12.1l-13.8 12.6c-5.5-5.7-9.5-13.5-11.2-20.1zm230.3 3.3c3.5 6.4 6.8 12.7 8.7 19.1l-17.8 5.6c-2-5.4-4.3-10.8-6.8-14.8zm-127.4 10.9l6.9 17.3c-6.4 2.7-12.9 4.8-18.6 6.5l-5-18c5.9-1.6 11.3-3.8 16.7-5.8zm-83.8 6.2c5.3 1.7 10.8 3.4 15.7 4.2-1.2 6.1-2 12.3-2.8 18.5-7-1-14.5-3.3-20.5-5.7zm50 3.5l2.8 18.5c-7.2 1.3-13.4 1.6-19.8 1.9l-.4-18.7c5.9-.2 11.6-.8 17.4-1.7zm174.5 18c1 6.4 1.6 12.9 2.2 19.3l-18.7 1.5c-.4-6-.9-11.9-2-17.8zm-67.6 30.8c18.9 3.5 44.9 16.2 68.9 33.9 7.4-9.9 14.4-20.4 21.3-31.1l30.1 12.9c-4.7 12.3-15 25.6-28.6 37.2 17 16.2 30.9 34.5 37 53-13.8-18.1-31.1-31.8-50.3-42.8-23.4 15.8-52.7 25.9-79.6 20.4 22.9-4.4 40.6-16.6 55.8-32.6-16.5-7.5-33.8-13.9-51.3-20.1z"
										/></svg
									>
								</Button>
							</div>
						</div>
						<Button
							onclick={async () => {
								await goto('/');
								await clerkCtx.clerk?.signOut({ redirectUrl: '/' });
							}}
							variant="link"
							class="my-auto w-min pl-0  @6xl:mt-auto @6xl:px-0"
						>
							<LogOut /><span class="">Sign out</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<Footer />

<style>
	.characters-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
