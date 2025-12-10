<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import {
		SignedIn,
		SignedOut,
		SignInButton,
		Protect,
		useClerkContext,
		SignOutButton,
		SignUpButton
	} from 'svelte-clerk';
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	let open = $state(false);

	const ctx = useClerkContext();
	const user = $derived(ctx.user);
	const userImageUrl = $derived(user?.imageUrl || '/images/portrait-placeholder.png');
	const userName = $derived(user?.username || 'Profile');
</script>

<header
	class={cn(
		'pt-[calc(max(env(safe-area-inset-top),--spacing(2)))] pr-[calc(env(safe-area-inset-right)+--spacing(3))] pl-[calc(env(safe-area-inset-left)+--spacing(2))]',
		'sticky top-0 z-45 flex w-full justify-center border-b bg-primary-muted shadow-sm sm:relative'
	)}
>
	<nav
		style="scrollbar-width: none;"
		class="flex h-14 w-full max-w-6xl items-center justify-between px-3"
	>
		<Button
			variant="ghost"
			href="/"
			class="flex shrink-0 items-center gap-2 text-base font-semibold"
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
							<Button variant="ghost" href="/profile" class="w-min grow justify-start p-0 pl-2">
								<div class="size-6 overflow-hidden rounded-full border-2 border-accent">
									<img src={'/images/portrait-placeholder.png'} alt={userName} class="size-full" />
								</div>
								{userName}
							</Button>
							<Protect plan="adventurer">
								{#snippet children()}{/snippet}
								{#snippet fallback()}
									<Button size="sm" onclick={() => (open = false)} href="/subscribe" class="w-min">
										Subscribe
									</Button>
								{/snippet}
							</Protect>
						</div>
					</SignedIn>
					<SignedOut>
						<div class="flex">
							<SignInButton class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'grow')}>
								Sign In
							</SignInButton>
							<SignUpButton class={cn(buttonVariants({ size: 'sm' }), 'grow')}>
								Sign Up
							</SignUpButton>
						</div>
					</SignedOut>
				</Sheet.Header>
				<div class="flex flex-col overflow-y-auto px-4 pb-6">
					<SignedOut>
						<Button
							variant="link"
							size="sm"
							onclick={() => (open = false)}
							href="/"
							class="pl-0 h-10 w-full justify-start rounded-none border-b"
						>
							Home
						</Button>
					</SignedOut>
					<SignedIn>
						<Button
						variant="link"
						size="sm"
						onclick={() => (open = false)}
						href="/"
						class="pl-0 h-10 w-full justify-start rounded-none border-b"
					>
						Home
					</Button>
						<Button
							variant="link"
							size="sm"
							onclick={() => (open = false)}
							href="/characters"
							class="pl-0 h-10 w-full justify-start rounded-none border-b"
						>
							My Characters
						</Button>
					</SignedIn>
				</div>
				<Sheet.Footer>
					<SignedIn>
						<SignOutButton class={buttonVariants({ size: 'sm' })}>Sign Out</SignOutButton>
					</SignedIn>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>

		<div class="ml-auto hidden items-center sm:flex">
			<SignedOut>
				<SignInButton class={buttonVariants({ size: 'sm' })}>Sign In</SignInButton>
			</SignedOut>
			<SignedIn>
				<Button variant="ghost" size="sm" class="px-2" href="/characters">My Characters</Button>

				<Protect plan="adventurer">
					{#snippet children()}{/snippet}
					{#snippet fallback()}
						<Button variant="default" size="sm" class="mr-2 ml-4" href="/subscribe"
							>Subscribe</Button
						>
					{/snippet}
				</Protect>

				<Button variant="ghost" size="sm" href="/profile" class="gap-2 px-2">
					<div class="size-6 overflow-hidden rounded-full border-2 border-accent">
						<img src={'/images/portrait-placeholder.png'} alt={userName} class="size-full" />
					</div>
				</Button>
			</SignedIn>
		</div>
	</nav>
</header>
