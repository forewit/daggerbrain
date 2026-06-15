<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		class: className = ''
	}: {
		class?: string;
	} = $props();

	//const MAINTENANCE_BANNER_ACKNOWLEDGED_KEY = 'maintenance-banner-acknowledged';

	let acknowledged = $state(false);

	function acknowledgeMaintenance() {
		if (acknowledged) {
			return;
		}

		acknowledged = true;

		// if (browser) {
		// 	localStorage.setItem(MAINTENANCE_BANNER_ACKNOWLEDGED_KEY, 'true');
		// }
	}

	// onMount(() => {
	// 	const storedAcknowledgement = browser
	// 		? localStorage.getItem(MAINTENANCE_BANNER_ACKNOWLEDGED_KEY) === 'true'
	// 		: false;

	// 	acknowledged = storedAcknowledgement;
	// });
</script>

{#if !acknowledged}
	<div class="mx-auto flex h-8 items-center justify-center bg-accent-muted" out:slide>
		<div
			class={cn(
				'relative flex max-w-6xl grow items-center justify-center text-center text-xs text-accent',
				className
			)}
		>
			<span
				>Daggerbrain.com will be down <b>Thursday, March 26th 6am - 4pm EST</b> while we make some upgrades.</span
			>
			<Button
				onclick={acknowledgeMaintenance}
				size="sm"
				variant="ghost"
				class="absolute top-1/2 right-0 size-6 -translate-y-1/2"><X /></Button
			>
		</div>
	</div>
{/if}
