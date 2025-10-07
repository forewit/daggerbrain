<script lang="ts">
  import "../app.css";
  import { onDestroy, onMount } from "svelte";
  import { setAppContext } from "$lib/ts/app.svelte";
  import { ModeWatcher, setMode } from "mode-watcher";

  let { children } = $props();

  const app = setAppContext();

  setMode("dark");

  onDestroy(() => {
    app.destroy();
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#110f1c" />
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<ModeWatcher />

{@render children?.()}
