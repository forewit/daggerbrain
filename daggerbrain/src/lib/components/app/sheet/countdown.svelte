<!-- src/lib/components/app/campaigns/countdown.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Countdown } from '$lib/types/campaign-types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';

	let {
		countdown = $bindable<Countdown>(),
		isGM = false,
		class: className = '',
		onClickCountdown = () => {}
	}: {
		countdown: Countdown;
		isGM?: boolean;
		class?: string;
		onClickCountdown?: () => void;
	} = $props();

	// Rotation state for animation
	let rotation = $state(0);

	function handleHourglassClick() {
		if (!isGM) return;

		// Trigger animation
		rotation += 180;

		// Decrement countdown
		countdown.current = Math.max(countdown.min, countdown.current - 1);
	}

	function handleHourglassRightClick(e: MouseEvent) {
		if (!isGM) return;

		// Prevent context menu
		e.preventDefault();

		// Trigger animation (counter-clockwise for increment)
		rotation -= 180;

		// Increment countdown
		countdown.current = countdown.current + 1;
	}
	// Only validate min value, don't call onUpdate from effect
	$effect(() => {
		if (countdown.current < countdown.min) {
			countdown.current = countdown.min;
		}
	});
</script>

<div class={cn('flex flex-col items-center', className)}>
	<!-- Countdown Name -->
	<div
		class={cn(
			'flex items-center gap-1 text-muted-foreground',
			countdown.current === 0 && 'text-accent/80'
		)}
	>
		<p class="text-xs font-medium">{countdown.name}</p>
		{#if isGM && countdown.visibleToPlayers}
			<Eye class="size-4" />
		{/if}
	</div>
	<!-- Hourglass Button -->
	<button
		class={cn(
			'relative flex size-12 items-center justify-center overflow-visible transition-transform duration-200 hover:scale-105',
			countdown.current === 0 && ' text-accent',
			!isGM && 'pointer-events-none'
		)}
		onclick={handleHourglassClick}
		oncontextmenu={handleHourglassRightClick}
		disabled={!isGM}
	>
		<!-- Hourglass Icon (rotates, as background) -->
		<svg
			class={cn('absolute size-full opacity-20 transition-transform duration-[600ms] ease-in-out')}
			style="transform: rotate({rotation}deg);"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.19825 3.29918C5.80046 2 7.86697 2 12 2C16.133 2 18.1995 2 18.8017 3.29918C18.8535 3.41086 18.8972 3.52686 18.9323 3.6461C19.3414 5.0333 17.8802 6.64111 14.9577 9.85674L13 12L14.9577 14.1433C17.8802 17.3589 19.3414 18.9667 18.9323 20.3539C18.8972 20.4731 18.8535 20.5891 18.8017 20.7008C18.1995 22 16.133 22 12 22C7.86697 22 5.80046 22 5.19825 20.7008C5.14649 20.5891 5.10282 20.4731 5.06765 20.3539C4.65857 18.9667 6.11981 17.3589 9.0423 14.1433L11 12L9.0423 9.85674C6.11981 6.64111 4.65857 5.0333 5.06765 3.6461C5.10282 3.52686 5.14649 3.41086 5.19825 3.29918Z"
				fill="currentColor"
			/>
		</svg>

		<!-- Number (doesn't rotate, centered on top) -->
		<span class={cn('relative z-10 font-eveleth text-2xl')}>
			{countdown.current}
		</span>
	</button>
</div>
