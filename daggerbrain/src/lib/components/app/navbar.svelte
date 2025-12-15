<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import {
		SignedIn,
		SignedOut,
		SignInButton,
		Protect,
		useClerkContext,
		SignOutButton,
		SignUpButton,
		UserButton
	} from 'svelte-clerk';
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	let open = $state(false);
	let headerElement: HTMLElement | undefined = $state();

	const ctx = useClerkContext();
	const user = $derived(ctx.user);
	const userImageUrl = $derived(user?.imageUrl || '/images/portrait-placeholder.png');
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
</script>

<header
	bind:this={headerElement}
	class={cn(
		'pt-[calc(max(env(safe-area-inset-top),--spacing(2)))] pr-[calc(env(safe-area-inset-right)+--spacing(2))] pl-[calc(env(safe-area-inset-left)+--spacing(2))]',
		'sticky top-0 z-45 flex w-full justify-center border-b bg-primary-muted shadow-sm sm:relative'
	)}
>
	<nav
		style="scrollbar-width: none;"
		class="px-1 flex h-14 w-full max-w-6xl items-center justify-between"
	>
		<Button
			variant="ghost"
			href="/"
			class="flex shrink-0 items-center gap-2 px-2 text-base font-semibold"
		>
			<img src="/images/daggerbrain.svg" alt="Daggerbrain" class="size-6" />
			<span class="hidden inline">Daggerbrain</span>
		</Button>

		<Sheet.Root bind:open>
			<Sheet.Trigger
				class={cn('ml-auto sm:hidden', buttonVariants({ variant: 'ghost', size: 'icon' }))}
			>
				<Menu />
			</Sheet.Trigger>
			<Sheet.Content class="max-w-[240px]">
				<Sheet.Header>
					<SignedIn>
						<div class="flex">
							<Button
								variant="ghost"
								href={env.PUBLIC_PROFILE_URL}
								class="w-min grow justify-start gap-2.5 p-0 pl-2"
							>
								<div class="size-8 overflow-hidden rounded-full border-2 border-accent">
									<img src={userImageUrl} alt={userName} class="size-full" />
								</div>
								{userName}
							</Button>
							<!-- todo: uncomment before enabling subscriptions -->
							<!-- <Protect plan="adventurer">
								{#snippet children()}{/snippet}
								{#snippet fallback()}
									<Button size="sm" onclick={() => (open = false)} href="/subscribe" class="w-min">
										Subscribe
									</Button>
								{/snippet}
							</Protect> -->
						</div>
					</SignedIn>

					<SignedOut>
						<SignInButton class={cn(buttonVariants({ size: 'sm' }), 'grow')}>Sign In</SignInButton>
					</SignedOut>
				</Sheet.Header>
				<div class="flex flex-col overflow-y-auto px-4 pb-6">
					<Button
						variant="link"
						onclick={() => (open = false)}
						href="/"
						class="h-10 w-full justify-start rounded-none border-b pl-0"
					>
						Home
					</Button>

					<Button
						variant="link"
						onclick={() => (open = false)}
						href="/roadmap"
						class="h-10 w-full justify-start rounded-none border-b pl-0"
					>
						Roadmap
					</Button>
					<Button
						variant="link"
						onclick={() => (open = false)}
						href="/characters"
						class="h-10 w-full justify-start rounded-none border-b pl-0"
					>
						My Characters
					</Button>
				</div>
				<Sheet.Footer>
					<SignedIn>
						<SignOutButton class={buttonVariants({ size: 'sm' })}>Sign Out</SignOutButton>
					</SignedIn>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>

		<div class="hidden items-center gap-2 sm:flex">
			<Button variant="ghost" class="px-2" href="/roadmap">Roadmap</Button>
			<Button variant="ghost" class="px-2" href="/characters">My Characters</Button>

			<SignedOut>
				<SignInButton class={buttonVariants({ size: 'sm' })}>Sign In</SignInButton>
			</SignedOut>

			<!-- todo: uncomment before enabling subscriptions -->
			<!-- <Protect plan="adventurer">
					{#snippet children()}{/snippet}
					{#snippet fallback()}
						<Button variant="default" size="sm" class="mr-2 ml-4" href="/subscribe"
							>Subscribe</Button
						>
					{/snippet}
				</Protect> -->

				<SignedIn>
			<div class="size-8 flex items-center justify-center rounded-full border-2 mx-2 border-accent">
				<UserButton />
			</div>
		</SignedIn>
		</div>
	</nav>
</header>
