<script lang="ts">
  import "../app.css";
  import { onDestroy, onMount } from "svelte";
  import { setAppContext } from "$lib/ts/app.svelte";

  let { children } = $props();

  const app = setAppContext();

  onDestroy(() => {
    app.destroy();
  });
</script>

<svelte:head>
  <link rel="icon" href="/icon512_rounded.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

{@render children?.()}
