<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { SignedIn, SignedOut, SignInButton, SignOutButton } from 'svelte-clerk';
	import { cn } from '$lib/utils';
	import Menu from '@lucide/svelte/icons/menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	const isMobile = new IsMobile();

	let open = $state(false);
</script>

<header
	class={cn(
		'pt-[calc(max(env(safe-area-inset-top),--spacing(3)))] pr-[calc(env(safe-area-inset-right)+--spacing(4))] pl-[calc(env(safe-area-inset-left)+--spacing(2))]',
		'sticky top-0 z-45 flex w-full justify-center border-b bg-primary-muted shadow-lg sm:relative'
	)}
>
	<nav
		style="scrollbar-width: none;"
		class="justiy-between flex h-16 w-full max-w-6xl items-center px-4"
	>
		<a href="/" class="flex shrink-0 items-center gap-2 text-lg font-bold">
			<img src="/images/daggerbrain.svg" alt="Daggerbrain" class="size-6" />
			Daggerbrain
		</a>

		{#if isMobile.current}
			<Sheet.Root bind:open>
				<Sheet.Trigger class={cn('ml-auto', buttonVariants({ variant: 'link', size: 'icon' }))}>
					<Menu />
				</Sheet.Trigger>
				<Sheet.Content>
					<Sheet.Header></Sheet.Header>
					<SignedOut>
						<Button variant="link" onclick={() => (open = false)} href="/">Home</Button>
						<SignInButton class={cn(buttonVariants(), 'mx-auto w-min')}>Sign In</SignInButton>
					</SignedOut>
					<SignedIn>
						<Button variant="link" onclick={() => (open = false)} href="/">Home</Button>
						<Button variant="link" onclick={() => (open = false)} href="/characters">
							My Characters
						</Button>
						<SignOutButton class={cn(buttonVariants(), 'mx-auto w-min')}>Sign Out</SignOutButton>
					</SignedIn>
				</Sheet.Content>
			</Sheet.Root>
		{:else}
			<div class="ml-auto flex items-center gap-3">
				<SignedOut>
					<Button variant="link" onclick={() => (open = false)} href="/">Home</Button>
					<SignInButton class={buttonVariants()}>Sign In</SignInButton>
				</SignedOut>
				<SignedIn>
					<Button variant="link" onclick={() => (open = false)} href="/characters">
						My Characters
					</Button>
					<SignOutButton class={buttonVariants()}>Sign Out</SignOutButton>
				</SignedIn>
			</div>
		{/if}
	</nav>
</header>
