<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		fearValue = $bindable(0),
		onUpdate,
		isGM = false,
		class: className = ''
	}: {
		fearValue?: number;
		onUpdate: (value: number) => void;
		isGM?: boolean;
		class?: string;
	} = $props();

	const MAX_FEAR = 12;
</script>

<div class={cn('flex flex-col justify-center gap-2 text-center', className)}>
	<div class={cn('flex flex-col justify-center gap-2 text-center', className)}>
		<button
			onclick={() => {
				if (!isGM) return;
				fearValue = 0;
				onUpdate(0);
			}}
			disabled={!isGM}
			class={cn(
				'mx-auto w-min text-sm font-medium text-destructive',
				!isGM && 'cursor-not-allowed opacity-50'
			)}
		>
			FEAR
		</button>
		<div class="mb-2 flex flex-wrap justify-center gap-4">
			{#each Array(MAX_FEAR) as _, index}
				<button
					aria-label="fear-slot"
					disabled={!isGM}
					class={cn(
						'aspect-square h-[16px] w-[16px] rotate-45 transform rounded-[2px] border border-destructive transition-all duration-300',
						index < fearValue ? 'bg-destructive' : 'bg-transparent',
						fearValue === MAX_FEAR &&
							'shadow-[0_0_8px_rgba(239,68,68,0.4),0_0_16px_rgba(239,68,68,0.2)]',
						!isGM && 'cursor-not-allowed'
					)}
					onclick={() => {
						if (!isGM) return;
						if (index + 1 === fearValue) {
							fearValue = Math.max(0, fearValue - 1);
						} else {
							fearValue = index + 1;
						}
						onUpdate(fearValue);
					}}
					type="button"
				></button>
			{/each}
		</div>
	</div>
</div>
