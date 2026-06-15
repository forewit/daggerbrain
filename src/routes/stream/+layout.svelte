<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { setupConvex } from 'convex-svelte';

	const { children } = $props();

	setupConvex(env.PUBLIC_CONVEX_URL);
</script>

<svelte:head>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

{@render children?.()}
