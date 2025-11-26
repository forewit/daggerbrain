<script lang="ts">
	import './layout.css';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { ClerkProvider } from 'svelte-clerk';
	import Navbar from '$lib/components/app/navbar.svelte';
	import { dark } from '@clerk/themes';

	let { children } = $props();

	setMode('dark');
</script>

<svelte:head>
	<meta name="theme-color" content="#1a1625" />
	<link rel="icon" href="/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<ClerkProvider appearance={{ baseTheme: dark }}>
	<ModeWatcher />
	<Navbar />
	{@render children?.()}
</ClerkProvider>
