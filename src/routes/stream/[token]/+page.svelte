<script lang="ts">
	import { page } from '$app/state';
	import Countdown from '$lib/components/character-sheet/campaign/countdown.svelte';
	import Fear from '$lib/components/character-sheet/campaign/fear.svelte';
	import { api } from '@convex/_generated/api';
	import type { Countdown as CountdownType } from '@convex/schemas/rules';
	import { useQuery } from 'convex-svelte';

	const overlayQuery = useQuery(api.functions.streamOverlays.getOverlayState, () =>
		page.params.token ? { token: page.params.token } : 'skip'
	);

	const state = $derived(overlayQuery.data);
	let fearValue = $state(0);
	let countdowns: CountdownType[] = $state([]);
	const shouldGroupCountdownsWithFear = $derived(
		state?.settings.countdowns.groupWithFear === true &&
			state.campaign.fear_track !== null &&
			countdowns.length > 0
	);

	type OverlaySection = 'fear' | 'countdowns';

	function sectionVars(section: OverlaySection): string {
		const layout = state?.layout[section];
		const fallbackX = 0;
		const fallbackY = 0;
		const x = typeof layout?.x === 'number' ? layout.x : fallbackX;
		const y = typeof layout?.y === 'number' ? layout.y : fallbackY;

		return [
			`--overlay-x: ${typeof x === 'number' ? `${x}px` : '0px'}`,
			`--overlay-y: ${typeof y === 'number' ? `${y}px` : '0px'}`,
			`--overlay-scale: ${getScale(section)}`
		].join('; ');
	}

	function positionVars(section: OverlaySection): string {
		const layout = state?.layout[section];
		const fallbackX = 0;
		const fallbackY = 0;
		const x = typeof layout?.x === 'number' ? layout.x : fallbackX;
		const y = typeof layout?.y === 'number' ? layout.y : fallbackY;

		return [
			`--overlay-x: ${typeof x === 'number' ? `${x}px` : '0px'}`,
			`--overlay-y: ${typeof y === 'number' ? `${y}px` : '0px'}`
		].join('; ');
	}

	function groupedVars(): string {
		return [
			positionVars('fear'),
			`--fear-scale: ${getScale('fear')}`,
			`--countdowns-scale: ${getScale('countdowns')}`
		].join('; ');
	}

	function getScale(section: OverlaySection): number {
		const scale = state?.layout[section]?.scale;
		return typeof scale === 'number' ? scale : 1;
	}

	$effect(() => {
		fearValue = state?.campaign.fear_track ?? 0;
		countdowns = state?.countdowns.map((countdown) => ({ ...countdown })) ?? [];
	});
</script>

<svelte:head>
	<title>Daggerbrain Stream Overlay</title>
</svelte:head>

{#if state}
	<div class="stream-overlay">
		{#if state.campaign.fear_track !== null}
			<section
				class="overlay-section w-min"
				class:grouped-section={shouldGroupCountdownsWithFear}
				style={shouldGroupCountdownsWithFear ? groupedVars() : sectionVars('fear')}
			>
				<Fear
					bind:fearValue
					isGM={false}
					showLabel={state.settings.fear.showLabel}
					class={shouldGroupCountdownsWithFear
						? 'fear-panel grouped-fear-panel flex-row flex-nowrap gap-3'
						: 'fear-panel flex-row flex-nowrap gap-3'}
				/>
				{#if shouldGroupCountdownsWithFear}
					<div class="countdown-row grouped-countdown-row">
						{#each countdowns as countdown, index (countdown.id)}
							<Countdown bind:countdown={countdowns[index]} isGM={false} class="countdown-panel" />
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		{#if countdowns.length && !shouldGroupCountdownsWithFear}
			<section class="overlay-section countdown-section" style={sectionVars('countdowns')}>
				<div class="countdown-row">
					{#each countdowns as countdown, index (countdown.id)}
						<Countdown bind:countdown={countdowns[index]} isGM={false} class="countdown-panel" />
					{/each}
				</div>
			</section>
		{/if}
	</div>
{/if}

<style>
	:global(html),
	:global(body) {
		margin: 0;
		background: transparent;
		overflow: hidden;
	}

	.stream-overlay {
		--navbar-height: 0px;
		box-sizing: border-box;
		width: 100vw;
		height: 100vh;
		color: white;
		font-family: Inter, system-ui, sans-serif;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
	}

	.overlay-section {
		position: absolute;
		top: var(--overlay-y);
		left: var(--overlay-x);
		max-width: calc(100vw - clamp(32px, 4vw, 72px));
		transform: scale(var(--overlay-scale, 1));
		transform-origin: top left;
	}

	:global(.fear-panel) {
		transform-origin: top left;
	}

	:global(.fear-panel svg) {
		width: min(370px, calc(100vw - 48px));
	}

	.countdown-row {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-end;
		gap: 10px;
	}

	.grouped-section {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	:global(.grouped-fear-panel) {
		zoom: var(--fear-scale, 1);
	}

	.grouped-countdown-row {
		justify-content: flex-start;
		flex-wrap: nowrap;
		max-width: none;
		zoom: var(--countdowns-scale, 1);
	}
</style>
