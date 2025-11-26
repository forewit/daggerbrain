<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { LevelUpChoices } from '$lib/types/character-types';

	let {
		level = $bindable(),
		level_up_choices = $bindable(),
		class: className = ''
	}: { level: number; level_up_choices: LevelUpChoices; class?: string } = $props();

	let open = $state(false);
	let newLevel = $derived(level);
	let value = $state(level.toString());
</script>

<Select.Root
	type="single"
	bind:value
	onValueChange={(v) => {
		newLevel = parseInt(v);
		if (newLevel < level) {
			open = true;
		} else {
			level = newLevel;
		}
	}}
>
	<Select.Trigger
		class={cn(
			'w-36 rounded-md bg-primary-muted p-2 hover:cursor-pointer hover:bg-primary-muted/70',
			className
		)}
	>
		<p class="text">Level {level}</p>
	</Select.Trigger>
	<Select.Content>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as i}
			{#if i === 2}
				<Select.Label class="text-center text-xs text-accent/50">-- Tier 2 --</Select.Label>
			{:else if i === 5}
				<Select.Label class="text-center text-xs text-accent/50">-- Tier 3 --</Select.Label>
			{:else if i === 8}
				<Select.Label class="text-center text-xs text-accent/50">-- Tier 4 --</Select.Label>
			{/if}
			<Select.Item class="hover:cursor-pointer" value={i.toString()}>Level {i}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Level Down</Dialog.Title>
		</Dialog.Header>
		<p>Current level: {level}</p>
		<p>New level: {newLevel}</p>
		<Dialog.Footer>
			<Dialog.Close
				onclick={() => {
					newLevel = level;
				}}
				class={cn(buttonVariants({ variant: 'link' }))}
			>
				Cancel
			</Dialog.Close>
			<Dialog.Close
				class={cn(buttonVariants({ variant: 'destructive' }))}
				onclick={() => {
					level = newLevel;
					value = level.toString();
				}}
			>
				Level Down
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
