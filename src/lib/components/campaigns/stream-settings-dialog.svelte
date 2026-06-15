<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { createAbsoluteUrl } from '$lib/components/seo/seo';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { cn } from '$lib/utils';
	import { api } from '@convex/_generated/api';
	import type { Id } from '@convex/_generated/dataModel';
	import Copy from '@lucide/svelte/icons/copy';
	import Eye from '@lucide/svelte/icons/eye';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		campaignId
	}: {
		open: boolean;
		campaignId: Id<'campaigns'>;
	} = $props();

	const convexClient = useConvexClient();
	const clipboard = new UseClipboard({ delay: 1200 });
	const streamOverlayQuery = useQuery(api.functions.streamOverlays.getForCampaign, () =>
		campaignId ? { campaign_id: campaignId } : 'skip'
	);
	const streamOverlay = $derived(streamOverlayQuery.data ?? null);

	let overlayUrl = $state('');
	let overlayEnabled = $state(false);
	let overlayFear = $state(true);
	let overlayCountdowns = $state(true);
	let overlayFearShowLabel = $state(true);
	let overlayCountdownsGroupWithFear = $state(true);
	let overlayFearX = $state(0);
	let overlayFearY = $state(0);
	let overlayFearScale = $state(1);
	let overlayFearXInput = $state('0');
	let overlayFearYInput = $state('0');
	let overlayFearScaleInput = $state('100');
	let overlayCountdownsX = $state(0);
	let overlayCountdownsY = $state(0);
	let overlayCountdownsScale = $state(1);
	let overlayCountdownsXInput = $state('0');
	let overlayCountdownsYInput = $state('0');
	let overlayCountdownsScaleInput = $state('100');
	let generatedOverlay = $state(false);
	let isGeneratingOverlay = $state(false);
	let settingsSave: Promise<unknown> = Promise.resolve();
	let previousOpen = $state(false);
	let initializedOverlayKey = $state<string | null>(null);

	const savedOverlayUrl = $derived(
		streamOverlay?.token ? createOverlayUrl(streamOverlay.token) : ''
	);
	const visibleOverlayUrl = $derived(overlayUrl || savedOverlayUrl);
	const overlayHydrationKey = $derived(streamOverlay ? savedOverlayUrl : 'defaults');

	$effect(() => {
		const shouldInitializeInputs =
			open && (!previousOpen || initializedOverlayKey !== overlayHydrationKey);

		if (!open) {
			overlayUrl = '';
			generatedOverlay = false;
			initializedOverlayKey = null;
		}

		if (shouldInitializeInputs) {
			overlayEnabled = streamOverlay?.enabled ?? false;
			overlayFear = streamOverlay?.modules.fear ?? true;
			overlayCountdowns = streamOverlay?.modules.countdowns ?? true;
			overlayFearShowLabel = streamOverlay?.settings.fear.showLabel ?? true;
			overlayCountdownsGroupWithFear = streamOverlay?.settings.countdowns.groupWithFear ?? true;
			const fearX = getCoordinate(streamOverlay?.layout.fear?.x, 0);
			const fearY = getCoordinate(streamOverlay?.layout.fear?.y, 0);
			const countdownsX = getCoordinate(streamOverlay?.layout.countdowns?.x, 0);
			const countdownsY = getCoordinate(streamOverlay?.layout.countdowns?.y, 0);

			overlayFearX = fearX;
			overlayFearY = fearY;
			overlayFearScale = getScale(streamOverlay?.layout.fear);
			overlayFearXInput = formatCoordinateInput(fearX);
			overlayFearYInput = formatCoordinateInput(fearY);
			overlayFearScaleInput = formatSizePercentageInput(overlayFearScale);
			overlayCountdownsX = countdownsX;
			overlayCountdownsY = countdownsY;
			overlayCountdownsScale = getScale(streamOverlay?.layout.countdowns);
			overlayCountdownsXInput = formatCoordinateInput(countdownsX);
			overlayCountdownsYInput = formatCoordinateInput(countdownsY);
			overlayCountdownsScaleInput = formatSizePercentageInput(overlayCountdownsScale);
			initializedOverlayKey = overlayHydrationKey;
		}

		previousOpen = open;
	});

	function saveSettings() {
		if (!campaignId || (!streamOverlay && !generatedOverlay)) return;

		const settings = {
			campaign_id: campaignId,
			enabled: overlayEnabled,
			modules: {
				fear: overlayFear,
				countdowns: overlayCountdowns
			},
			settings: {
				fear: {
					showLabel: overlayFearShowLabel
				},
				countdowns: {
					groupWithFear: overlayCountdownsGroupWithFear
				}
			},
			layout: {
				fear: {
					x: overlayFearX,
					y: overlayFearY,
					scale: overlayFearScale
				},
				countdowns: {
					x: overlayCountdownsX,
					y: overlayCountdownsY,
					scale: overlayCountdownsScale
				}
			}
		};

		settingsSave = settingsSave
			.catch(() => {})
			.then(() => convexClient.mutation(api.functions.streamOverlays.updateSettings, settings))
			.catch((error) => {
				console.error('Failed to save stream settings', error);
				toast.error('Failed to save stream settings');
			});
	}

	async function createOrRotateOverlay() {
		if (!campaignId) return;

		isGeneratingOverlay = true;
		try {
			const result = await convexClient.mutation(api.functions.streamOverlays.createOrRotate, {
				campaign_id: campaignId
			});
			overlayUrl = createOverlayUrl(result.token);
			generatedOverlay = true;
			overlayEnabled = true;
			saveSettings();
			await clipboard.copy(overlayUrl);
			toast.success('Overlay URL copied');
		} catch (error) {
			console.error('Failed to generate overlay URL', error);
			toast.error('Failed to generate overlay URL');
		} finally {
			isGeneratingOverlay = false;
		}
	}

	function createOverlayUrl(token: string): string {
		return createAbsoluteUrl(env.PUBLIC_ORIGIN, `/stream/${token}`);
	}

	function parseCoordinate(value: string | number, fallback: number): number {
		if (typeof value === 'string' && value.trim() === '') return fallback;
		const parsed = Number(value);
		return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
	}

	function parseSizePercentage(value: string | number): number {
		const parsed = Number(value);
		if (!Number.isFinite(parsed)) return 1;
		return Math.min(10, Math.max(0.05, parsed / 100));
	}

	function formatCoordinateInput(value: number): string {
		return String(Math.round(value));
	}

	function formatSizePercentageInput(value: number): string {
		return String(Math.round(value * 100));
	}

	function getCoordinate(value: number | undefined, fallback: number): number {
		return typeof value === 'number' ? value : fallback;
	}

	function getScale(position: { scale?: number } | undefined): number {
		return typeof position?.scale === 'number' ? position.scale : 1;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="flex max-h-[90%] flex-col px-0 sm:max-w-3xl">
		<Dialog.Header class="px-6">
			<Dialog.Title class="flex items-center gap-2">
				Stream Overlay
				<span
					class="rounded-full border border-accent bg-accent-muted px-2 py-1 font-eveleth text-[10px] text-accent uppercase"
				>
					Beta
				</span>
			</Dialog.Title>
			<Dialog.Description
				>Display your campaign's fear and countdowns on your stream</Dialog.Description
			>
		</Dialog.Header>

		<div class="flex flex-col gap-4 overflow-y-auto px-6 py-4">
			<label class="flex cursor-pointer items-center gap-3">
				<Switch
					checked={overlayEnabled}
					onCheckedChange={(checked) => {
						overlayEnabled = checked ?? false;
						saveSettings();
					}}
				/>
				<h3 class="text-sm font-medium">Enable stream overlay</h3>
			</label>
			<div
				class={cn(
					'rounded-md border border-dashed border-foreground/20 p-3',
					!overlayEnabled && 'pointer-events-none opacity-50 select-none'
				)}
			>
				<div class="flex items-center gap-2">
					<Button
						type="button"
						variant={streamOverlay ? 'outline' : 'default'}
						size="sm"
						onclick={createOrRotateOverlay}
						disabled={isGeneratingOverlay}
					>
						{#if isGeneratingOverlay}
							<Loader2 class="size-4 animate-spin" />
						{:else if streamOverlay}
							<RefreshCw class="size-4" />
						{/if}
						{streamOverlay ? 'Regenerate URL' : 'Generate URL'}
					</Button>

					<Input
						value={visibleOverlayUrl}
						readonly
						class="border-none bg-transparent px-1 focus-visible:ring-0"
						style="box-shadow: none;"
					/>

					<Button
						type="button"
						size="sm"
						hidden={!visibleOverlayUrl}
						variant="outline"
						onclick={() => {
							clipboard
								.copy(visibleOverlayUrl)
								.then(() => toast.success('Overlay URL copied'))
								.catch(() => toast.error('Failed to copy overlay URL'));
						}}
					>
						<Copy class="size-4" />
					</Button>
				</div>

				<p class="mt-3 text-xs text-muted-foreground">
					* Add this browser-source URL to OBS, Streamlabs, or StreamElements. Regenerating the URL
					will invalidate existing overlay links.
				</p>
			</div>

			<h3 class={cn('text-lg font-medium', !overlayEnabled && 'pointer-events-none opacity-50')}>
				Overlay Elements
			</h3>

			<div
				class={cn('grid gap-4 md:grid-cols-2', !overlayEnabled && 'pointer-events-none opacity-50')}
			>
				<div class="flex flex-col gap-3 rounded bg-card p-3">
					<div class="flex items-center gap-2 p-1">
						<Switch
							id="stream-overlay-fear-enabled"
							checked={overlayFear}
							class="data-[state=unchecked]:bg-muted"
							onCheckedChange={(checked) => {
								overlayFear = checked ?? false;
								saveSettings();
							}}
						/>
						<label
							for="stream-overlay-fear-enabled"
							class="grow cursor-pointer text-sm leading-none font-medium"
						>
							Fear
						</label>
					</div>

					<div class={cn('flex flex-col gap-3', !overlayFear && 'pointer-events-none opacity-70')}>
						<div class="grid grid-cols-3 gap-2">
							<label class="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
								X Position
								<Input
									type="number"
									min="0"
									step="1"
									bind:value={overlayFearXInput}
									class="bg-background"
									disabled={!overlayFear}
									oninput={() => {
										overlayFearX = parseCoordinate(overlayFearXInput, overlayFearX);
										saveSettings();
									}}
								/>
							</label>
							<label class="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
								Y Position
								<Input
									type="number"
									min="0"
									step="1"
									bind:value={overlayFearYInput}
									class="bg-background"
									disabled={!overlayFear}
									oninput={() => {
										overlayFearY = parseCoordinate(overlayFearYInput, overlayFearY);
										saveSettings();
									}}
								/>
							</label>
							<label class="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
								Size %
								<Input
									type="number"
									min="5"
									max="1000"
									step="5"
									bind:value={overlayFearScaleInput}
									class="bg-background"
									disabled={!overlayFear}
									oninput={() => {
										overlayFearScale = parseSizePercentage(overlayFearScaleInput);
										saveSettings();
									}}
								/>
							</label>
						</div>

						<label class="flex cursor-pointer items-center gap-2 px-1 text-xs font-medium">
							<Checkbox
								id="stream-overlay-fear-show-label"
								checked={overlayFearShowLabel}
								disabled={!overlayFear}
								onCheckedChange={(checked) => {
									overlayFearShowLabel = checked === true;
									saveSettings();
								}}
							/>
							<span class="text-muted-foreground">Show label</span>
						</label>
					</div>
				</div>

				<div class="flex flex-col gap-3 rounded bg-card p-3">
					<div class="flex items-center gap-2 p-1">
						<Switch
							id="stream-overlay-countdowns-enabled"
							checked={overlayCountdowns}
							class="data-[state=unchecked]:bg-muted"
							onCheckedChange={(checked) => {
								overlayCountdowns = checked ?? false;
								saveSettings();
							}}
						/>
						<label
							for="stream-overlay-countdowns-enabled"
							class="flex grow cursor-pointer justify-between text-sm leading-none font-medium"
						>
							Countdowns <span class=" text-xs text-muted-foreground"
								>Must be visible "<Eye class="inline size-3.5" />"</span
							>
						</label>
					</div>

					<div
						class={cn(
							'flex flex-col gap-3',
							!overlayCountdowns && 'pointer-events-none opacity-70'
						)}
					>
						<div class="grid grid-cols-3 gap-2">
							<label
								class={cn(
									'flex flex-col gap-1 text-xs font-medium text-muted-foreground',
									overlayCountdownsGroupWithFear && 'opacity-50'
								)}
							>
								X Position
								<Input
									type="number"
									min="0"
									step="1"
									bind:value={overlayCountdownsXInput}
									class="bg-background"
									disabled={!overlayCountdowns || overlayCountdownsGroupWithFear}
									oninput={() => {
										overlayCountdownsX = parseCoordinate(
											overlayCountdownsXInput,
											overlayCountdownsX
										);
										saveSettings();
									}}
								/>
							</label>
							<label
								class={cn(
									'flex flex-col gap-1 text-xs font-medium text-muted-foreground',
									overlayCountdownsGroupWithFear && 'opacity-50'
								)}
							>
								Y Position
								<Input
									type="number"
									min="0"
									step="1"
									bind:value={overlayCountdownsYInput}
									class="bg-background"
									disabled={!overlayCountdowns || overlayCountdownsGroupWithFear}
									oninput={() => {
										overlayCountdownsY = parseCoordinate(
											overlayCountdownsYInput,
											overlayCountdownsY
										);
										saveSettings();
									}}
								/>
							</label>
							<label class="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
								Size %
								<Input
									type="number"
									min="5"
									max="1000"
									step="5"
									bind:value={overlayCountdownsScaleInput}
									class="bg-background"
									disabled={!overlayCountdowns}
									oninput={() => {
										overlayCountdownsScale = parseSizePercentage(overlayCountdownsScaleInput);
										saveSettings();
									}}
								/>
							</label>
						</div>

						<label class="flex cursor-pointer items-center gap-2 px-1 text-xs font-medium">
							<Checkbox
								id="stream-overlay-countdowns-group-with-fear"
								checked={overlayCountdownsGroupWithFear}
								disabled={!overlayCountdowns}
								onCheckedChange={(checked) => {
									overlayCountdownsGroupWithFear = checked === true;
									saveSettings();
								}}
							/>
							<span class="text-muted-foreground">Group with fear</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer class="px-6">
			<Button href="/contact" target="_blank" rel="noreferrer" variant="link">Have feedback?</Button
			>
			<div class="grow"></div>
			<Dialog.Close type="button" class={cn(buttonVariants({ variant: 'outline' }))}>
				Close
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
