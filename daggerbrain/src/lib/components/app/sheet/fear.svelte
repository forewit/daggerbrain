<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import CircleMinus from '@lucide/svelte/icons/circle-minus';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';

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

<div class={cn('flex flex-col items-center gap-2', className)}>
	<div class="flex items-center gap-2">
		<Button
			onclick={() => {
				fearValue = Math.max(0, fearValue - 1);
				onUpdate(fearValue);
			}}
			variant="ghost"
			hidden={!isGM}
			size="sm"
			class="w-min text-destructive"
		>
			<CircleMinus />
		</Button>

		<div class="font-eveleth text-base leading-none text-destructive">FEAR</div>

		<Button
			onclick={() => {
				fearValue = Math.max(0, fearValue + 1);
				onUpdate(fearValue);
			}}
			variant="ghost"
			hidden={!isGM}
			size="sm"
			class="w-min text-destructive"
		>
			<CirclePlus />
		</Button>
	</div>

	<div class="relative mx-auto w-[370px]">
		<svg
			class={cn(
				'w-full text-destructive/50 transition-all duration-300',
				fearValue >= MAX_FEAR &&
					'drop-shadow-[0_0_8px_rgba(179,68,66,0.4),0_0_16px_rgba(179,68,66,0.2)]'
			)}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="147.266 157.441 198.221 17.244"
		>
			<path
				d="M 290.341 174.685 L 202.412 174.685 L 199.344 171.617 L 199.344 160.509 L 202.412 157.441 L 290.341 157.441 L 293.409 160.509 L 293.409 171.617"
				fill="currentColor"
				style="stroke-width: 0.1;"
			/>
			<path
				d="M 342.377 170.443 L 150.376 170.443 C 149.161 169.229 148.48 168.548 147.266 167.333 L 147.266 164.793 C 148.48 163.579 149.161 162.898 150.376 161.684 L 342.377 161.684 C 343.591 162.898 344.272 163.579 345.487 164.793 L 345.487 167.333 C 344.272 168.548 343.591 169.229 342.377 170.443"
				fill="currentColor"
				style="stroke-width: 0.1;"
			/>
			<path
				d="M 159.417 173.116 L 152.363 166.064 L 159.417 159.01 L 333.337 159.01 L 340.39 166.064 L 333.337 173.116"
				fill="var(--background)"
				style="stroke-width: 0.1;"
			/>
			<path
				d="M 333.544 158.51 L 159.209 158.51 L 158.917 158.803 L 152.363 165.356 L 151.656 166.063 L 152.363 166.77 L 158.917 173.323 L 159.209 173.616 L 159.624 173.616 L 333.13 173.616 L 333.544 173.616 L 333.837 173.323 L 335.413 171.747 L 340.39 166.77 L 341.098 166.063 L 340.39 165.356 L 335.413 160.379 L 333.837 158.803 L 333.544 158.51 Z M 333.13 159.51 C 335.689 162.069 337.124 163.504 339.683 166.063 C 337.124 168.622 335.689 170.057 333.13 172.616 L 159.624 172.616 C 157.065 170.057 155.63 168.622 153.07 166.063 C 155.63 163.504 157.065 162.069 159.624 159.51"
				fill="currentColor"
				style="stroke-width: 0.1;"
			/>
		</svg>

		<div
			class="absolute top-1/2 flex w-full -translate-y-[calc(50%)] items-center justify-center gap-[13px]"
		>
			{#each Array(MAX_FEAR) as _, index}
				{@const fearLevel = index + 1}
				<button
					aria-label="fear-slot"
					disabled={!isGM}
					onclick={() => {
						if (!isGM) return;
						if (fearLevel === fearValue) {
							fearValue = Math.max(0, fearValue - 1);
						} else {
							fearValue = fearLevel;
						}
						onUpdate(fearValue);
					}}
					type="button"
					class={cn('disabled:cursor-default')}
				>
					<div
						class={cn(
							'aspect-square size-[14px] rotate-45 transform rounded-[2px] border border-destructive',
							fearLevel <= fearValue ? 'bg-destructive' : 'bg-transparent',
							fearValue >= MAX_FEAR &&
								'shadow-[0_0_8px_rgba(179,68,66,0.4),0_0_16px_rgba(179,68,66,0.2)]'
						)}
					></div>
				</button>
			{/each}
		</div>
	</div>
</div>
