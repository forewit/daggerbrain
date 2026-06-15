<script lang="ts">
	import type { Snippet } from 'svelte';

	import Seo from '$lib/components/seo/seo.svelte';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { setHomebrewContext } from '$lib/state/homebrew.svelte';
	import { setSourcesContext } from '$lib/state/sources.svelte';
	import { setUserContext } from '$lib/state/user.svelte';
	import { setLocalstorageContext } from '$lib/state/localstorage.svelte';

	const { children }: { children: Snippet } = $props();

	setLocalstorageContext();
	setUserContext();
	setSourcesContext();
	setHomebrewContext();
</script>

<Seo />
<Toaster position="top-center" richColors class="pointer-events-auto" />
<Navbar />
{@render children()}
