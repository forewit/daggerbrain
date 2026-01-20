<script lang="ts">
	import { SignedIn, SignedOut, RedirectToSignIn } from 'svelte-clerk';

	let { children } = $props();
</script>

<SignedIn>
	{@render children()}
</SignedIn>

<SignedOut>
	<RedirectToSignIn />
</SignedOut>
