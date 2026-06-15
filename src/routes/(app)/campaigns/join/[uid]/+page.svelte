<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { api } from '@convex/_generated/api';
	import { artCampaigns } from '$lib/assets/images';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Footer from '$lib/components/navigation/footer.svelte';
	import LoadError from '$lib/components/utility/load-error.svelte';
	import Loader from '$lib/components/utility/loader.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';

	const userCtx = getUserContext();
	const convexClient = useConvexClient();
	const clerkCtx = useClerkContext();
	const inviteCode = $derived(page.params.uid ?? '');
	const inviteQuery = useQuery(api.functions.campaigns.resolveInvite, () =>
		!userCtx.isLoading && inviteCode ? { invite_code: inviteCode } : 'skip'
	);
	const inviteStatus = $derived(inviteQuery.data ?? null);
	const isLoading = $derived(userCtx.isLoading || inviteQuery.isLoading);
	const loadError = $derived(userCtx.error || inviteQuery.error);

	let displayName = $state('');
	let joining = $state(false);
	let joinError = $state('');
	let hasInitializedDisplayName = $state(false);

	$effect(() => {
		if (hasInitializedDisplayName) return;
		displayName =
			clerkCtx.user?.username ||
			[clerkCtx.user?.firstName, clerkCtx.user?.lastName].filter(Boolean).join(' ') ||
			'';
		hasInitializedDisplayName = true;
	});

	$effect(() => {
		if (inviteStatus?.is_member) {
			goto(`/campaigns/${inviteStatus.campaign_id}`);
		}
	});

	async function handleJoin() {
		if (!inviteStatus) {
			joinError = 'Campaign not found';
			return;
		}

		joining = true;
		joinError = '';

		try {
			const campaignId = await convexClient.mutation(api.functions.campaigns.join, {
				invite_code: inviteCode,
				display_name: displayName.trim()
			});
			goto(`/campaigns/${campaignId}`);
		} catch (error) {
			joinError = error instanceof Error ? error.message : 'Failed to join campaign';
			joining = false;
		}
	}
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<Loader {isLoading} />
	<div
		class="campaigns-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-64 w-full overflow-hidden"
	>
		<enhanced:img
			src={artCampaigns}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="campaigns-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<div
		class={cn(
			'relative z-10 flex h-full w-full flex-col items-center justify-start',
			'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
		)}
	>
		{#if isLoading || inviteStatus?.is_member}
			<div></div>
		{:else if loadError || !inviteStatus}
			<LoadError />
		{:else}
			<div class="flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
				<div class="flex flex-col items-center gap-2 text-center">
					<h1 class="font-eveleth text-2xl">Join Campaign</h1>
					<p class="max-w-md text-sm text-muted-foreground">
						You&apos;re joining from a campaign invite link. Add a display name and head to the
						table.
					</p>
				</div>

				<div class="mx-auto w-full max-w-[500px] rounded-xl border bg-card shadow-lg">
					<div class="border-b px-6 py-5 text-center">
						<p class="text-[10px] font-medium tracking-[0.24em] text-muted-foreground uppercase">
							Campaign
						</p>
						<p class="mt-2 font-eveleth text-lg">
							{inviteStatus.campaign_name || 'Unnamed Campaign'}
						</p>
					</div>

					<form
						class="flex flex-col gap-4 px-6 py-5"
						onsubmit={(event) => {
							event.preventDefault();
							handleJoin();
						}}
					>
						<div class="flex flex-col gap-2">
							<label for="join-display-name" class="text-sm font-medium"
								>Display Name (optional)</label
							>
							<Input
								id="join-display-name"
								type="text"
								placeholder="Enter your display name"
								bind:value={displayName}
							/>
						</div>

						{#if joinError}
							<div
								class="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
							>
								{joinError}
							</div>
						{/if}

						<Button type="submit" class="w-full" size="sm" disabled={joining}>
							{#if joining}
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								Joining...
							{:else}
								Join Campaign
							{/if}
						</Button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>

<Footer />

<style>
	.campaigns-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
