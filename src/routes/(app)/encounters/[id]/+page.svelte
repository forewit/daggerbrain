<script lang="ts">
	import { page } from '$app/state';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import DiceLogSheet from '$lib/components/dice/dice-log-sheet.svelte';
	import DiceRecents from '$lib/components/dice/dice-recents.svelte';
	import DiceRoller from '$lib/components/dice/dice-roller.svelte';
	import Encounter from '$lib/components/encounters/encounter.svelte';
	import { getEncounterContext } from '$lib/state/encounters.svelte';

	const encounterCtx = getEncounterContext();
	const encounterId = $derived(page.params.id);
	const encounter = $derived(encounterCtx.encounter);

	let showDiceLog = $state(false);
	let editingName = $state(false);
</script>

<DiceLogSheet bind:open={showDiceLog} />
<DiceRecents class="sm:bottom-8" bind:showDiceLog />
<DiceRoller class="sm:bottom-8" variant="gm" />

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<Encounter>
		<div class="flex items-center gap-2 truncate">
			<Button
				href="/encounters"
				variant="link"
				class="hidden px-0 text-muted-foreground sm:block sm:flex"
			>
				Encounters
			</Button>
			<ChevronRight class="hidden size-3.5 shrink-0 text-muted-foreground sm:block" />

			<Button href="/encounters" variant="ghost" size="icon" class="shrink-0 sm:hidden">
				<ChevronLeft class="shrink-0" />
			</Button>

			{#if encounter}
				{#if editingName}
					<Input
						class="-ml-2 border-none px-2"
						autofocus
						onblur={() => (editingName = false)}
						bind:value={encounter.name}
						placeholder="Encounter name"
					/>
				{:else}
					<Button variant="ghost" onclick={() => (editingName = true)} class="-ml-2 truncate px-2">
						<span class="truncate">{encounter.name || 'Unnamed Encounter'}</span>
					</Button>
				{/if}
			{/if}
		</div>
	</Encounter>
</div>
