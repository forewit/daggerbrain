<script lang="ts">
	import { Show, RedirectToSignIn, ClerkLoaded } from 'svelte-clerk';

	let { children } = $props();
</script>

<Show when="signed-in">
	{@render children()}

	{#snippet fallback()}
		<ClerkLoaded>
			<RedirectToSignIn />
		</ClerkLoaded>
	{/snippet}
</Show>
