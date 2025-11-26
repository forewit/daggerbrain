<script lang="ts"> 
    import { setCharacterContext } from "$lib/state/character.svelte";

    let { children, data } = $props();
  
    setCharacterContext(data.uid);
</script>

{@render children?.()}
