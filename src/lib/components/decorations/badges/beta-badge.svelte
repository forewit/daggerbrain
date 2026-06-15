<script lang="ts">
	import { browser } from '$app/environment';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let {
		class: className = ''
	}: {
		class?: string;
	} = $props();

	const BETA_BADGE_ACKNOWLEDGED_KEY = 'beta-3-17-badge-acknowledged';

	let acknowledged = $state(false);
	let open = $state(false);
	let autoShimmerActive = $state(false);

	onMount(() => {
		const storedAcknowledgement = browser
			? localStorage.getItem(BETA_BADGE_ACKNOWLEDGED_KEY) === 'true'
			: false;

		acknowledged = storedAcknowledgement;
		open = !storedAcknowledgement;

		if (!browser || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		let shimmerResetTimeout: number | undefined;
		const shimmerStartTimeout = window.setTimeout(() => {
			autoShimmerActive = true;

			shimmerResetTimeout = window.setTimeout(() => {
				autoShimmerActive = false;
			}, 900);
		}, 2000);

		return () => {
			window.clearTimeout(shimmerStartTimeout);

			if (shimmerResetTimeout) {
				window.clearTimeout(shimmerResetTimeout);
			}
		};
	});

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen && !acknowledged) {
			open = true;
			return;
		}

		open = nextOpen;
	}

	function acknowledgeBeta() {
		acknowledged = true;

		if (browser) {
			localStorage.setItem(BETA_BADGE_ACKNOWLEDGED_KEY, 'true');
		}

		open = false;
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Trigger
		class={cn(
			'beta-badge grid h-6 place-items-center overflow-hidden rounded-full border border-accent bg-accent-muted px-2 font-eveleth text-xs text-accent uppercase',
			autoShimmerActive && 'shimmer-active',
			className
		)}
	>
		<span class="relative z-10">Beta</span>
	</Dialog.Trigger>

	<Dialog.Content
		class="sm:max-w-md"
		hideClose
		onEscapeKeydown={(event) => event.preventDefault()}
		onInteractOutside={(event) => event.preventDefault()}
	>
		<Dialog.Header>
			<Dialog.Title>Beta</Dialog.Title>
			<Dialog.Description>
				This is a Beta version of Daggerbrain that is under active development. Expect bugs and
				frequent data deletion.
			</Dialog.Description>
			<Dialog.Footer>
				<button type="button" class={cn(buttonVariants())} onclick={acknowledgeBeta}>
					I Understand
				</button>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<style>
	.beta-badge {
		position: relative;
		isolation: isolate;
	}

	.beta-badge::after {
		content: '';
		position: absolute;
		inset: -35%;
		background: linear-gradient(
			120deg,
			transparent 35%,
			color-mix(in srgb, var(--accent) 18%, white 82%) 48%,
			transparent 61%
		);
		opacity: 0;
		pointer-events: none;
		transform: translateX(-180%) skewX(-18deg);
	}

	.beta-badge:hover::after,
	.beta-badge:focus-visible::after,
	.beta-badge.shimmer-active::after {
		animation: beta-badge-shimmer 900ms ease-out;
	}

	@keyframes beta-badge-shimmer {
		0% {
			opacity: 0;
			transform: translateX(-180%) skewX(-18deg);
		}

		15% {
			opacity: 0.95;
		}

		100% {
			opacity: 0;
			transform: translateX(180%) skewX(-18deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.beta-badge::after {
			animation: none !important;
		}
	}
</style>
