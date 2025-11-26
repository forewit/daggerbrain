<script lang="ts">
	import { SignedIn } from 'svelte-clerk';
	import { setUserContext } from '$lib/state/user.svelte';
	import { setCompendiumContext } from '$lib/state/compendium.svelte';

	let { children } = $props();

	setUserContext();
	setCompendiumContext();
</script>

<SignedIn>
	{@render children()}
</SignedIn>
