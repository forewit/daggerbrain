<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { setupConvex } from 'convex-svelte';
	import { ClerkProvider } from 'svelte-clerk';

	import AppShell from './app-shell.svelte';

	const { children } = $props();
	const afterSignOutUrl = '/';

	setupConvex(env.PUBLIC_CONVEX_URL);
</script>

<ClerkProvider {afterSignOutUrl}>
	<AppShell {children} />
</ClerkProvider>
