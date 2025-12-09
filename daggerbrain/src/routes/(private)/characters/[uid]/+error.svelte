<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import Lock from '@lucide/svelte/icons/lock';
</script>

<div class="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
	<Lock class="h-16 w-16 text-muted-foreground" />
	<h1 class="text-2xl font-bold">Character Not Available</h1>
	<p class="max-w-md text-muted-foreground">
		This character is not in your active slots. You can only access and edit up to 3 active
		characters at a time.
	</p>
	<p class="max-w-md text-sm text-muted-foreground">
		To access this character, go to your characters list and activate it using the "Manage Active
		Characters" button.
	</p>
	<div class="mt-4 flex gap-2">
		<Button onclick={() => goto('/characters')}>Go to Characters List</Button>
	</div>
</div>

