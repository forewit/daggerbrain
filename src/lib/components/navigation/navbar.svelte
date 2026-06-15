<script lang="ts">
	import { Show, SignInButton, SignUpButton, useClerkContext } from 'svelte-clerk';
	import { createCheckAuthorization } from '@clerk/shared/authorization';
	import type { ClerkJWTClaims } from '@clerk/shared/types';
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import campaignsImage from '$lib/assets/images/art/verticals/campaigns-vertical.webp';
	import charactersImage from '$lib/assets/images/art/verticals/characters-vertical.webp';
	import encountersImage from '$lib/assets/images/art/verticals/encounters-vertical.webp';
	import homebrewImage from '$lib/assets/images/art/verticals/forge-vertical.webp';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Infinity from '@lucide/svelte/icons/infinity';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { tick } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import NavUserButton from '$lib/components/navigation/user-button.svelte';

	let open = $state(false);
	let mobileCommunityOpen = $state(false);
	let headerElement: HTMLElement | undefined = $state();

	const clerkCtx = useClerkContext();
	const user = $derived(clerkCtx.user);
	const userImageUrl = $derived(user?.imageUrl || '/images/art/portrait-placeholder.webp');
	const userName = $derived(user?.username || 'Profile');

	function updateNavbarHeight() {
		if (headerElement) {
			const height = headerElement.offsetHeight;
			document.documentElement.style.setProperty('--navbar-height', `${height}px`);
		}
	}

	onMount(() => {
		updateNavbarHeight();
		const resizeObserver = new ResizeObserver(() => {
			updateNavbarHeight();
		});
		if (headerElement) {
			resizeObserver.observe(headerElement);
		}
		return () => {
			resizeObserver.disconnect();
		};
	});

	let openMenu: 'play' | 'community' | null = $state(null);
	let communityMenuOpen = $derived(openMenu === 'community');
	let playMenuOpen = $derived(openMenu === 'play');
	let closingForNavigation = $state(false);
	let desktopSheetClass = $derived(
		cn(
			'absolute top-[var(--navbar-height)] z-40',
			closingForNavigation &&
				'data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=open]:duration-0 data-[state=closed]:duration-0'
		)
	);

	const isLoggedIn = $derived(!!(clerkCtx.isLoaded && clerkCtx.auth.userId));
	const isFreeUser = $derived.by(() => {
		if (!clerkCtx.isLoaded || !clerkCtx.auth.userId) return false;

		const has = createCheckAuthorization({
			userId: clerkCtx.auth.userId,
			orgId: clerkCtx.auth.orgId,
			orgRole: clerkCtx.auth.orgRole,
			orgPermissions: clerkCtx.auth.orgPermissions,
			factorVerificationAge: clerkCtx.auth.factorVerificationAge,
			features: ((clerkCtx.auth.sessionClaims as ClerkJWTClaims | undefined)?.fea as string) || '',
			plans: ((clerkCtx.auth.sessionClaims as ClerkJWTClaims | undefined)?.pla as string) || ''
		});

		return has({ plan: 'user:free_user' });
	});

	function preventSheetCloseForDesktopNavLinks(event: PointerEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest('[data-desktop-nav-sheet-safe]')) {
			event.preventDefault();
		}
	}

	beforeNavigate(() => {
		if (!openMenu) return;
		closingForNavigation = true;
		openMenu = null;
	});

	afterNavigate(async () => {
		if (!closingForNavigation) return;
		await tick();
		closingForNavigation = false;
	});

	function closeMobileMenu() {
		open = false;
		mobileCommunityOpen = false;
	}
</script>

<div class="sticky top-0 z-45 bg-background md:relative">
	<header
		bind:this={headerElement}
		class={cn(
			'relative pt-[env(safe-area-inset-top)] pr-[calc(env(safe-area-inset-right)+--spacing(2))] pl-[calc(env(safe-area-inset-left)+--spacing(2))]',
			'flex w-full flex-col items-center bg-primary-muted shadow-lg '
		)}
	>
		<nav style="scrollbar-width: none;" class="flex h-14 w-full max-w-7xl items-center px-1">
			<div class="flex shrink-0 items-center gap-2">
				<Button
					variant="link"
					href="/"
					data-desktop-nav-sheet-safe
					onpointerdown={(e) => e.preventDefault()}
					class="flex items-center gap-2 px-2 text-base font-semibold hover:no-underline"
				>
					<img src="/images/daggerbrain.svg" alt="Daggerbrain" class="size-6" />
					<span class="hidden inline">Daggerbrain</span>
				</Button>
			</div>

			<!-- mobile -->
			<Sheet.Root bind:open>
				<Sheet.Trigger
					class={cn('ml-auto lg:hidden', buttonVariants({ variant: 'ghost', size: 'icon' }))}
				>
					<Menu />
				</Sheet.Trigger>
				<Sheet.Content>
					<Sheet.Header>
						{#if isLoggedIn}
							<div class="flex items-center justify-between gap-4">
								<Button
									variant="ghost"
									href="/profile"
									onclick={() => (open = false)}
									class="w-min grow justify-start gap-2.5 p-0 pl-2"
								>
									<div class="size-8 overflow-hidden rounded-full border-2 border-accent">
										<img src={userImageUrl} alt={userName} class="size-full" />
									</div>
									{userName}
								</Button>
							</div>
						{:else}
							<div class="flex gap-2">
								<SignInButton
									class={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'flex-1')}
									>Sign In</SignInButton
								>
								<SignInButton class={cn(buttonVariants({ size: 'sm' }), 'flex-1')}
									>Create Account</SignInButton
								>
							</div>
						{/if}
					</Sheet.Header>
					<div class="flex flex-col overflow-y-auto px-4 pb-6">
						<p class="pb-2 text-xs font-bold text-muted-foreground uppercase">Play</p>

						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/characters"
							class="h-12 w-full justify-start rounded-none border-b pl-0 text-lg font-bold"
						>
							My Characters
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/campaigns"
							class="h-12 w-full justify-start rounded-none border-b pl-0 text-lg font-bold"
						>
							My Campaigns
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/homebrew"
							class="h-12 w-full justify-start rounded-none border-b pl-0 text-lg font-bold"
						>
							My Homebrew
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/encounters"
							class="h-12 w-full justify-start rounded-none border-b pl-0 text-lg font-bold"
						>
							Encounters
						</Button>

						<p class="pt-12 pb-2 text-xs font-bold text-muted-foreground uppercase">Community</p>

						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/posts"
							class="h-10 w-full justify-start rounded-none border-b pl-0"
						>
							Articles
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/changelog"
							class="h-10 w-full justify-start rounded-none border-b pl-0"
						>
							Changelog
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/roadmap"
							class="h-10 w-full justify-start rounded-none border-b pl-0"
						>
							Roadmap
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/faq"
							class="h-10 w-full justify-start rounded-none border-b pl-0"
						>
							FAQ
						</Button>
						<Button
							variant="link"
							onclick={closeMobileMenu}
							href="/contact"
							class="h-10 w-full justify-start rounded-none border-b pl-0"
						>
							Contact
						</Button>
						<Button
							variant="link"
							target="_blank"
							href="https://discord.gg/"
							class="h-10 w-full justify-start gap-2 rounded-none border-b pl-0"
						>
							<svg
								class="size-4"
								id="Discord-Logo"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 126.644 96"
								><path
									id="Discord-Symbol-White"
									fill="currentColor"
									d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"
								/></svg
							>
							Join the Discord
						</Button>

						<div class="flex items-center gap-2 pt-4">
							<Button
								variant="ghost"
								size="icon"
								class="gap-2 text-sm hover:bg-card hover:text-foreground"
								target="_blank"
								href="https://bsky.app/profile/daggerbrain.bsky.social"
							>
								<svg
									class="size-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 568 501"
									><title>Bluesky butterfly logo</title><path
										fill="currentColor"
										d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
									></path></svg
								>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="gap-2 text-sm hover:bg-card hover:text-foreground"
								target="_blank"
								href="https://x.com/daggerbrain"
							>
								<svg
									class="size-4"
									viewBox="0 0 1200 1227"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
										fill="white"
									/>
								</svg>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="gap-2 text-sm hover:bg-card hover:text-foreground"
								target="_blank"
								href="https://instagram.com/daggerbrain_official"
							>
								<svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"
									><path
										fill="currentColor"
										class="cls-1"
										d="M295.42,6c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82S40.89,143,28.17,175.92c-12.31,31.83-20.65,68.19-23,121.42S2.3,367.68,2.56,503.46,3.42,656.26,6,709.6c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45S143,964.09,176,976.83c31.8,12.29,68.17,20.67,121.39,23s70.35,2.87,206.09,2.61,152.83-.86,206.16-3.39S799.1,988,830.88,975.58c32.87-12.86,60.74-30,88.45-57.84S964.1,862,976.81,829.06c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45S862,40.87,829.07,28.19c-31.82-12.31-68.17-20.7-121.39-23S637.33,2.3,501.54,2.56,348.75,3.4,295.42,6m5.84,903.88c-48.75-2.12-75.22-10.22-92.86-17-23.36-9-40-19.88-57.58-37.29s-28.38-34.11-37.5-57.42c-6.85-17.64-15.1-44.08-17.38-92.83-2.48-52.69-3-68.51-3.29-202s.22-149.29,2.53-202c2.08-48.71,10.23-75.21,17-92.84,9-23.39,19.84-40,37.29-57.57s34.1-28.39,57.43-37.51c17.62-6.88,44.06-15.06,92.79-17.38,52.73-2.5,68.53-3,202-3.29s149.31.21,202.06,2.53c48.71,2.12,75.22,10.19,92.83,17,23.37,9,40,19.81,57.57,37.29s28.4,34.07,37.52,57.45c6.89,17.57,15.07,44,17.37,92.76,2.51,52.73,3.08,68.54,3.32,202s-.23,149.31-2.54,202c-2.13,48.75-10.21,75.23-17,92.89-9,23.35-19.85,40-37.31,57.56s-34.09,28.38-57.43,37.5c-17.6,6.87-44.07,15.07-92.76,17.39-52.73,2.48-68.53,3-202.05,3.29s-149.27-.25-202-2.53m407.6-674.61a60,60,0,1,0,59.88-60.1,60,60,0,0,0-59.88,60.1M245.77,503c.28,141.8,115.44,256.49,257.21,256.22S759.52,643.8,759.25,502,643.79,245.48,502,245.76,245.5,361.22,245.77,503m90.06-.18a166.67,166.67,0,1,1,167,166.34,166.65,166.65,0,0,1-167-166.34"
										transform="translate(-2.5 -2.5)"
									/></svg
								>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="gap-2 text-sm hover:bg-card hover:text-foreground"
								target="_blank"
								href="https://www.youtube.com/@daggerbrain"
							>
								<svg class="size-5" version="1.1" id="svg2" viewBox="0 0 528.70935 370.36798"
									><g transform="matrix(1.3333333,0,0,-1.3333333,-137.10346,529.09599)"
										><g id="g18" transform="translate(261.5556,198.411)"
											><path
												d="M 0,0 V 119.046 L 102.827,59.668 Z m 229.405,154.963 c -4.635,17.089 -17.669,30.414 -35.048,35.048 -30.704,8.4 -154.964,8.4 -154.964,8.4 0,0 -123.97,0 -154.673,-8.4 -17.09,-4.634 -30.414,-17.959 -35.338,-35.048 -8.11,-30.703 -8.11,-95.295 -8.11,-95.295 0,0 0,-64.592 8.11,-95.586 4.924,-16.799 18.248,-30.413 35.338,-35.047 30.703,-8.4 154.673,-8.4 154.673,-8.4 0,0 124.26,0 154.964,8.4 17.379,4.634 30.413,18.248 35.048,35.047 8.399,30.994 8.399,95.586 8.399,95.586 0,0 0,64.592 -8.399,95.295"
												fill="currentColor"
												id="path20"
											/></g
										></g
									></svg
								>
							</Button>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>

			<!-- desktop -->
			<div class="ml-7 hidden h-full grow items-center lg:flex">
				<Button
					variant="ghost"
					class="h-full rounded-none"
					onpointerdown={() => {
						openMenu = openMenu === 'play' ? null : 'play';
					}}
				>
					Play <ChevronDown
						class={cn('stroke-3 transition-transform', openMenu === 'play' && 'rotate-180')}
					/>
				</Button>
				<Button
					variant="ghost"
					class="h-full rounded-none"
					onpointerdown={() => {
						openMenu = openMenu === 'community' ? null : 'community';
					}}
				>
					Community <ChevronDown
						class={cn('stroke-3 transition-transform', openMenu === 'community' && 'rotate-180')}
					/>
				</Button>

				<div class="grow"></div>

				{#if isLoggedIn}
					<div in:fade class="flex h-full items-center gap-3">
						<NavUserButton />
					</div>
				{:else}
					<div class="flex gap-2">
						<SignInButton class={cn(buttonVariants({ size: 'sm', variant: 'link' }))}
							>Sign In</SignInButton
						>
						<SignInButton class={cn(buttonVariants({ size: 'sm' }))}>Create Account</SignInButton>
					</div>
				{/if}
			</div>
		</nav>
		<!-- Announdement -->
		<!-- <div
				class=" -right-[calc(env(safe-area-inset-right)+--spacing(2))] -left-[calc(env(safe-area-inset-left)+--spacing(2))] text-xs flex w-[calc(env(safe-area-inset-left)+env(safe-area-inset-right)+--spacing(4)+100%)] items-center justify-center border-y border-emerald-700 bg-emerald-900/90 px-4 py-2 text-center text-emerald-100"
			>
				<p>
					Example Announcement Banner
				</p>
			</div> -->
	</header>
</div>

{#if openMenu}
	<div
		class="fixed inset-0 z-40 hidden bg-black/50 md:block"
		transition:fade={{ duration: closingForNavigation ? 0 : 120 }}
	></div>
{/if}

<!-- desktop play tab -->
<Sheet.Root
	bind:open={playMenuOpen}
	onOpenChange={(open) => {
		openMenu = open ? 'play' : null;
	}}
>
	<Sheet.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
		}}
		onInteractOutside={preventSheetCloseForDesktopNavLinks}
		preventScroll={false}
		overlayClasses="hidden"
		side="top"
		class={desktopSheetClass}
	>
		<div class="mx-auto flex w-full max-w-7xl gap-8 px-8 py-8">
			<a
				href="/characters"
				class="group relative flex h-60 w-48 items-end overflow-hidden rounded-lg border-x bg-card p-3 text-card-foreground shadow"
			>
				<div class="absolute inset-0">
					<img
						src={charactersImage}
						alt="My Characters"
						class="h-full w-full object-cover object-bottom opacity-70 group-hover:opacity-90"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-card from-10% to-transparent to-70% group-hover:from-muted"
					></div>
				</div>
				<p class="relative z-10 font-bold">My Characters</p>
			</a>
			<a
				href="/campaigns"
				class="group relative flex h-60 w-48 items-end overflow-hidden rounded-lg border-x bg-card p-3 text-card-foreground shadow"
			>
				<div class="absolute inset-0">
					<img
						src={campaignsImage}
						alt="My Campaigns"
						class="h-full w-full object-cover object-center opacity-70 group-hover:opacity-90"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-card from-10% to-transparent to-70% group-hover:from-muted"
					></div>
				</div>
				<p class="relative z-10 font-bold">My Campaigns</p>
			</a>
			<a
				href="/homebrew"
				class="group relative flex h-60 w-48 items-end overflow-hidden rounded-lg border-x bg-card p-3 text-card-foreground shadow"
			>
				<div class="absolute inset-0">
					<img
						src={homebrewImage}
						alt="My Homebrew"
						class="h-full w-full object-cover object-center opacity-70 group-hover:opacity-90"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-card from-10% to-transparent to-70% group-hover:from-muted"
					></div>
				</div>
				<p class="relative z-10 font-bold">My Homebrew</p>
			</a>

			<div class="flex flex-col gap-1">
				<p class="pb-2 pl-3 text-xs font-bold text-muted-foreground uppercase">More Tools</p>
				<Button variant="ghost" href="/encounters" class="w-min hover:bg-card hover:text-foreground"
					>Encounters</Button
				>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>

<!-- desktop community tab -->
<Sheet.Root
	bind:open={communityMenuOpen}
	onOpenChange={(open) => {
		openMenu = open ? 'community' : null;
	}}
>
	<Sheet.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
		}}
		onInteractOutside={preventSheetCloseForDesktopNavLinks}
		preventScroll={false}
		overlayClasses="hidden"
		side="top"
		class={desktopSheetClass}
	>
		<div class="mx-auto flex w-full max-w-7xl gap-8 px-8 py-8">
			<div class="flex w-40 flex-col gap-1">
				<p class="pb-2 pl-3 text-xs font-bold text-muted-foreground uppercase">Support</p>
				<Button
					variant="ghost"
					href="/posts"
					class="h-10 w-min text-lg font-bold tracking-wide hover:bg-card hover:text-foreground"
				>
					Articles
				</Button>
				<Button
					variant="ghost"
					href="/changelog"
					class="h-10 w-min text-lg font-bold tracking-wide hover:bg-card hover:text-foreground"
				>
					Changelog
				</Button>
				<Button
					variant="ghost"
					href="/roadmap"
					class="h-10 w-min text-lg font-bold tracking-wide hover:bg-card hover:text-foreground"
				>
					Roadmap
				</Button>
				<Button
					variant="ghost"
					href="/faq"
					class="h-10 w-min text-lg font-bold tracking-wide hover:bg-card hover:text-foreground"
				>
					FAQ
				</Button>
				<Button
					variant="ghost"
					href="/contact"
					class="h-10 w-min text-lg font-bold tracking-wide hover:bg-card hover:text-foreground"
				>
					Contact
				</Button>
			</div>

			<div class="flex w-60 flex-col gap-1">
				<p class="pb-2 pl-3 text-xs font-bold text-muted-foreground uppercase">Connect</p>
				<Button
					variant="ghost"
					class="w-min gap-2 text-sm hover:bg-card hover:text-foreground"
					target="_blank"
					href="https://discord.gg/"
				>
					<svg
						class="size-4"
						id="Discord-Logo"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 126.644 96"
						><path
							id="Discord-Symbol-White"
							fill="currentColor"
							d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"
						/></svg
					>
					Join the Discord
				</Button>
			</div>

			<div class="flex w-60 flex-col gap-1">
				<p class="pb-2 pl-3 text-xs font-bold text-muted-foreground uppercase">Socials</p>
				<div class="ml-1 flex gap-2">
					<Button
						variant="ghost"
						size="icon"
						class="gap-2 text-sm hover:bg-card hover:text-foreground"
						target="_blank"
						href="https://bsky.app/profile/daggerbrain.bsky.social"
					>
						<svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 568 501"
							><title>Bluesky butterfly logo</title><path
								fill="currentColor"
								d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
							></path></svg
						>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="gap-2 text-sm hover:bg-card hover:text-foreground"
						target="_blank"
						href="https://x.com/daggerbrain"
					>
						<svg
							class="size-4"
							viewBox="0 0 1200 1227"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
								fill="white"
							/>
						</svg>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="gap-2 text-sm hover:bg-card hover:text-foreground"
						target="_blank"
						href="https://instagram.com/daggerbrain_official"
					>
						<svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"
							><path
								fill="currentColor"
								class="cls-1"
								d="M295.42,6c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82S40.89,143,28.17,175.92c-12.31,31.83-20.65,68.19-23,121.42S2.3,367.68,2.56,503.46,3.42,656.26,6,709.6c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45S143,964.09,176,976.83c31.8,12.29,68.17,20.67,121.39,23s70.35,2.87,206.09,2.61,152.83-.86,206.16-3.39S799.1,988,830.88,975.58c32.87-12.86,60.74-30,88.45-57.84S964.1,862,976.81,829.06c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45S862,40.87,829.07,28.19c-31.82-12.31-68.17-20.7-121.39-23S637.33,2.3,501.54,2.56,348.75,3.4,295.42,6m5.84,903.88c-48.75-2.12-75.22-10.22-92.86-17-23.36-9-40-19.88-57.58-37.29s-28.38-34.11-37.5-57.42c-6.85-17.64-15.1-44.08-17.38-92.83-2.48-52.69-3-68.51-3.29-202s.22-149.29,2.53-202c2.08-48.71,10.23-75.21,17-92.84,9-23.39,19.84-40,37.29-57.57s34.1-28.39,57.43-37.51c17.62-6.88,44.06-15.06,92.79-17.38,52.73-2.5,68.53-3,202-3.29s149.31.21,202.06,2.53c48.71,2.12,75.22,10.19,92.83,17,23.37,9,40,19.81,57.57,37.29s28.4,34.07,37.52,57.45c6.89,17.57,15.07,44,17.37,92.76,2.51,52.73,3.08,68.54,3.32,202s-.23,149.31-2.54,202c-2.13,48.75-10.21,75.23-17,92.89-9,23.35-19.85,40-37.31,57.56s-34.09,28.38-57.43,37.5c-17.6,6.87-44.07,15.07-92.76,17.39-52.73,2.48-68.53,3-202.05,3.29s-149.27-.25-202-2.53m407.6-674.61a60,60,0,1,0,59.88-60.1,60,60,0,0,0-59.88,60.1M245.77,503c.28,141.8,115.44,256.49,257.21,256.22S759.52,643.8,759.25,502,643.79,245.48,502,245.76,245.5,361.22,245.77,503m90.06-.18a166.67,166.67,0,1,1,167,166.34,166.65,166.65,0,0,1-167-166.34"
								transform="translate(-2.5 -2.5)"
							/></svg
						>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="gap-2 text-sm hover:bg-card hover:text-foreground"
						target="_blank"
						href="https://www.youtube.com/@daggerbrain"
					>
						<svg class="size-5" version="1.1" id="svg2" viewBox="0 0 528.70935 370.36798"
							><g transform="matrix(1.3333333,0,0,-1.3333333,-137.10346,529.09599)"
								><g id="g18" transform="translate(261.5556,198.411)"
									><path
										d="M 0,0 V 119.046 L 102.827,59.668 Z m 229.405,154.963 c -4.635,17.089 -17.669,30.414 -35.048,35.048 -30.704,8.4 -154.964,8.4 -154.964,8.4 0,0 -123.97,0 -154.673,-8.4 -17.09,-4.634 -30.414,-17.959 -35.338,-35.048 -8.11,-30.703 -8.11,-95.295 -8.11,-95.295 0,0 0,-64.592 8.11,-95.586 4.924,-16.799 18.248,-30.413 35.338,-35.047 30.703,-8.4 154.673,-8.4 154.673,-8.4 0,0 124.26,0 154.964,8.4 17.379,4.634 30.413,18.248 35.048,35.047 8.399,30.994 8.399,95.586 8.399,95.586 0,0 0,64.592 -8.399,95.295"
										fill="currentColor"
										id="path20"
									/></g
								></g
							></svg
						>
					</Button>
				</div>
			</div>

			<div class="ml-auto flex w-60 flex-col gap-1">
				<p class="pb-2 text-xs font-bold text-muted-foreground uppercase">Featured Article</p>
				<a
					href="/posts/example"
					class="group relative flex h-60 w-48 items-end overflow-hidden rounded-lg border-x bg-card p-3 text-card-foreground shadow"
				>
					<div class="absolute inset-0">
						<img
							src="/images/art/mountains.webp"
							alt="Example Article"
							class="h-full w-full object-cover object-bottom opacity-70 group-hover:opacity-90"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-card from-10% to-transparent to-70% group-hover:from-muted"
						></div>
					</div>
					<p class="relative z-10 font-bold">Example Article</p>
				</a>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
