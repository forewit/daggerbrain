<script lang="ts">
  import { onDestroy } from 'svelte';
  import { setCharacterContext } from '$lib/ts/character.svelte';

  export let uid: string;
  export let notify: (context: ReturnType<typeof setCharacterContext>) => void = () => {};

  const context = setCharacterContext(uid);
  notify(context);

  onDestroy(() => {
    context?.destroy?.();
  });
</script>
