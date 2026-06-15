<script lang="ts">
	import './layout.css';
	import { ModeWatcher, setMode } from 'mode-watcher';

	// Props
	const { children } = $props();

	setMode('dark');
</script>

<svelte:head>
	<meta name="theme-color" content="#1a1625" />
	<link rel="icon" href="/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="alternate" type="text/plain" title="LLMs.txt" href="/llms.txt" />
	<link
		rel="preload"
		href="/fonts/inter/InterVariable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/eveleth/EvelethCleanRegular.woff"
		as="font"
		type="font/woff"
		crossorigin="anonymous"
	/>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<ModeWatcher />
{@render children?.()}
