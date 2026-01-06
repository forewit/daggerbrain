<!-- src/lib/components/app/campaigns/countdown.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Countdown } from '$lib/types/campaign-types';
	import Button from '$lib/components/ui/button/button.svelte';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import Input from '$lib/components/ui/input/input.svelte';

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

	function handleIncrement() {
		if (!isGM) return;
		countdown.current = countdown.current + 1;
	}

	function handleDecrement() {
		if (!isGM) return;
		countdown.current = Math.max(countdown.min, countdown.current - 1);
	}

	$effect(() => {
		if (countdown.current < countdown.min) {
			countdown.current = countdown.min;
		}
	});
</script>

<div class={cn('flex flex-col items-center gap-1', className)}>
	<!-- Countdown Name -->
	<Button variant="ghost" class="p-0" size="icon" onclick={onClickCountdown}> 
		<span class="font-eveleth">{countdown.name}</span>
	</Button>

	<!-- Token-style counter with +/- buttons -->
	<div class="flex items-center justify-center gap-2">
		<!-- Minus Button -->
		<Button variant="ghost" class="p-0" size="icon" onclick={handleDecrement} disabled={!isGM || countdown.current <= countdown.min}>
			<CircleMinus class="size-5" />
		</Button>

		<!-- Counter Circle -->
	
			<Input 
				bind:value={countdown.current}
				placeholder="Countdown Current"
				type="number"
				inputmode="numeric"
				min={countdown.min}
				
				class="grow text-center font-eveleth text-xl w-20"
			/>

		<!-- Plus Button -->
		<Button variant="ghost" class="p-0" size="icon" onclick={handleIncrement} disabled={!isGM}>
			<CirclePlus class="size-5" />
		</Button>
	</div>
</div>

