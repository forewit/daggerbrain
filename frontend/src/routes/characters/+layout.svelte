<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";

  let { children } = $props();

  const app = getAppContext();

  $effect(() => {
    app.showFooter = false;
    return () => {
      app.showFooter = true;
    };
  });
</script>

{@render children?.()}
