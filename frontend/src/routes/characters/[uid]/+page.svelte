<script lang="ts">
  import Dice from "$lib/components/app/dice/dice.svelte";
  import Sheet from "$lib/components/app/sheet/sheet.svelte";
  let { data } = $props();
</script>

<Sheet characterUid={data.uid || ""} class="mb-24" />
<Dice onRollEnd={(notation,total)=>{
  console.log(notation,total)
  alert(total)
}}/>
