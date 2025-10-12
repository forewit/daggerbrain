<script lang="ts">
  import Sheet from "$lib/components/app/sheet/sheet.svelte";

  let { data } = $props();
</script>

<Sheet characterUid={data.uid || ""} class="mb-24" />
