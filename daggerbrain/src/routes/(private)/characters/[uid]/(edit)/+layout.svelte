<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { page } from '$app/state';
	import { cn, capitalize } from '$lib/utils';
	import Settings from '@lucide/svelte/icons/settings';
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import { getUserContext } from '$lib/state/user.svelte';
	import { goto } from '$app/navigation';
	import { upload_user_image } from '$lib/remote/images.remote';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { data, children } = $props();

	const context = getCharacterContext();
	const character = $derived(context?.character);
	const characterId = $derived(page.params.uid);
	const canEdit = $derived(context?.canEdit);
	const checkingPermission = $derived(canEdit === null);
	const user = getUserContext();

	// Check both user loading and character context loading
	// This prevents race condition where "Character not found" is shown briefly
	// when loading a character accessible via GM permissions
	const isLoading = $derived.by(() => {
		const userLoading = user?.loading;
		const contextLoading = context?.loading;
		return userLoading || contextLoading;
	});

	// Character context handles permission checking, so we just check if character is null
	// Wait for both user and character context to finish loading before showing "not found"
	const characterNotFound = $derived.by(() => {
		const loading = isLoading;
		const hasCharacter = character !== null;
		return !loading && !hasCharacter;
	});

	// Redirect if permission check completes and user can't edit
	$effect(() => {
		if (!checkingPermission && canEdit === false && character && characterId) {
			goto(`/characters/${characterId}/`);
		}
	});

	const tabs = ['edit', 'heritage', 'class', 'traits', 'experiences', 'equipment'];
	let activeTab = $derived(
		page.url.pathname
			.split('/')
			.filter((t) => !!t)
			.pop() || 'edit'
	);
	let fileInputRef = $state<HTMLInputElement>();

	function triggerImageUpload() {
		fileInputRef?.click();
	}

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file || !character) return;

		// Convert file to base64
		const reader = new FileReader();
		reader.onload = async () => {
			const dataUrl = reader.result as string;
			// Remove the "data:image/...;base64," prefix
			const base64 = dataUrl.split(',')[1];

			try {
				const url = await upload_user_image({
					data: base64,
					name: file.name,
					type: file.type
				});
				character.image_url = url;
			} catch (error) {
				console.error('Failed to upload image:', error);
				alert('Failed to upload image. Please try again.');
			}

			// Reset the input so the same file can be selected again
			target.value = '';
		};
		reader.readAsDataURL(file);
	}

	function scrollToActiveTab(instant?: boolean) {
		const el = document.getElementById(activeTab);
		el?.scrollIntoView({
			behavior: instant ? 'instant' : 'smooth',
			inline: 'center',
			block: 'end'
		});
	}

	onMount(() => {
		scrollToActiveTab(true);
		// window.addEventListener("resize", scrollToActiveTab);

		// return () => {
		//   window.removeEventListener("resize", scrollToActiveTab);
		// };
	});
</script>

{#if isLoading || checkingPermission}
	<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
		<!-- Keep the page height so the footer doesn't jump while loading -->
		<div class="absolute inset-0 flex items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	</div>
{:else if characterNotFound}
	<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
		<p class="text-sm text-muted-foreground italic">Character not found</p>
		<Button href="/characters">Back to Characters</Button>
	</div>
{:else if !canEdit}
	<div class="flex flex-col items-center justify-center gap-4 px-4 py-12">
		<p class="text-sm text-muted-foreground italic">You do not have permission to edit this character</p>
		<Button href={`/characters/${characterId}/`}>View Character</Button>
	</div>
{:else if character}
	<!-- tabs -->
	<div
		class={cn(
			//"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
			'@container grid grid-cols-[1fr_repeat(7,auto)_1fr] items-center',
			'snap-x snap-mandatory overflow-x-auto ',
			'mt-3 h-20 bg-muted/50'
		)}
		style="scrollbar-width: none;"
	>
		<div class="h-12 w-[50vw] shrink-0 snap-align-none border-y bg-muted @3xl:w-0"></div>

		{#each tabs as tab, i}
			<Button
				id={tab}
				variant="ghost"
				class={cn(
					'focus-visible:ring-foreground',
					'h-12 border-y bg-muted hover:bg-muted',
					'relative snap-center rounded-none pr-3 pl-6.5 font-normal shadow-none transition-colors duration-100 hover:text-foreground',
					activeTab === tab &&
						'border-accent/10 bg-accent-muted text-accent hover:bg-accent-muted hover:text-accent',
					i === 0 && '@3xl:rounded-l-full'
				)}
				onclick={() => goto(`/characters/${character.id}/${tab}/`).then(() => scrollToActiveTab())}
			>
				{#if i === 0}
					<Settings class="size-4" />
					Home
				{:else}
					{i}. {capitalize(tab)}
				{/if}

				<span
					class={cn(
						'transition-discreet absolute left-0 transition-all duration-100 ',
						'size-0 border-y-24 border-l-12 border-y-transparent border-l-muted',
						i === 0 && '@3xl:hidden'
					)}
				></span>
				<span
					style="z-index: {tabs.length - i}"
					class={cn(
						'absolute right-0 translate-x-full transition-colors duration-100',
						'size-0 border-y-24 border-l-12 border-y-transparent border-l-muted',
						activeTab === tab && 'border-l-accent-muted'
					)}
				></span>
			</Button>
		{/each}

		<Button
			href={`/characters/${character.id}/`}
			variant="link"
			class="h-12 snap-center border-y bg-muted pr-7 pl-7 font-normal focus-visible:ring-foreground @3xl:rounded-r-full"
		>
			Sheet
			<ExternalLink class="size-4" />
		</Button>

		<div class="h-12 w-[50vw] shrink-0 snap-align-none border-y bg-muted @3xl:w-0"></div>
	</div>

	<!-- page -->
	<div class="@container">
		<div class="m-3 mx-auto max-w-3xl items-center gap-4 @3xl:grid @3xl:grid-cols-[auto_1fr_auto]">
			<Button
				disabled={tabs.indexOf(activeTab) === 0}
				href={`/characters/${character.id}/${tabs[tabs.indexOf(activeTab) - 1]}`}
				variant="ghost"
				class="hidden size-12 justify-self-center rounded-full border-b-0 border-accent/10 bg-accent/10 p-0 text-accent hover:bg-accent/20 @3xl:flex @3xl:border-b"
			>
				<ChevronLeft class="-ml-[1px] size-6" />
			</Button>

			<!-- image and name -->
			<main class="mx-auto flex max-w-2xl gap-3 px-4 @3xl:mx-0 @3xl:px-0">
				<button
					class="group aspect-square h-[90px] w-[90px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition-colors hover:border-primary/50"
					onclick={triggerImageUpload}
				>
					<img
						class="h-full w-full rounded-md object-cover"
						src={character.image_url}
						alt={character.name}
					/>
				</button>
				<div class="mt-1 flex flex-col gap-1">
					<p class="text-sm font-medium">Character Name</p>
					<Input bind:value={character.name} class="w-[240px]" />
				</div>

				<!-- hidden file input for image upload -->
				<input
					bind:this={fileInputRef}
					type="file"
					accept="image/*"
					onchange={handleImageUpload}
					class="hidden"
				/>
			</main>

			{#if tabs.indexOf(activeTab) < tabs.length - 1}
				<Button
					href={`/characters/${character.id}/${tabs[tabs.indexOf(activeTab) + 1]}`}
					variant="ghost"
					class="hidden size-12 justify-self-center rounded-full border-b border-accent/10 bg-accent/10  p-0 text-accent hover:bg-accent/20 @3xl:flex"
				>
					<ChevronRight class="-mr-[1px] size-6" />
				</Button>
			{:else}
				<Button
					href={`/characters/${character.id}/`}
					variant="ghost"
					class={cn(
						'hidden size-12 justify-self-center rounded-full border-b border-accent/10 bg-accent/10  p-0 text-accent hover:bg-accent/20 @3xl:flex'
					)}
				>
					<ExternalLink class="-mr-[1px] size-4" />
				</Button>
			{/if}
		</div>
	</div>

	{@render children?.()}

	<div class="h-20"></div>

	<div
		class="fixed right-0 bottom-0 left-0 z-40 grid h-14 auto-cols-fr grid-flow-col border-t-1 border-accent/10 bg-card md:hidden"
	>
		{#if tabs[tabs.indexOf(activeTab) - 1]}
			<Button
				class="h-full rounded-none border-r capitalize "
				href={`/characters/${character.id}/${tabs[tabs.indexOf(activeTab) - 1]}`}
				variant="ghost"
			>
				<ChevronLeft class="size-4" />
				{tabs[tabs.indexOf(activeTab) - 1]}
			</Button>
		{/if}

		{#if tabs[tabs.indexOf(activeTab) + 1]}
			<Button
				class="h-full rounded-none border-l capitalize "
				href={`/characters/${character.id}/${tabs[tabs.indexOf(activeTab) + 1]}`}
				variant="ghost"
			>
				{tabs[tabs.indexOf(activeTab) + 1]}
				<ChevronRight class="size-4" />
			</Button>
		{:else}
			<Button
				class="h-full rounded-none border-t border-l capitalize"
				href={`/characters/${character.id}/`}
				variant="ghost"
			>
				Sheet
				<ExternalLink class="size-4" />
			</Button>
		{/if}
	</div>
{/if}
