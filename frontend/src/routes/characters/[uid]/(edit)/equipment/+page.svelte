<script lang="ts">
  import { cn } from "$lib/utils";
  import Dropdown from "$lib/components/app/leveling/dropdown.svelte";
  import { getCharacterContext } from "$lib/ts/character/character.svelte.js";
  import Catalog from "$lib/components/app/equipment/catalog.svelte";
  import Inventory from "$lib/components/app/equipment/inventory.svelte";
  import ActiveEquipment from "$lib/components/app/equipment/active-equipment.svelte";

  let { data } = $props();

  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
  <div
    class={cn(
      //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <Dropdown title="Starting Equipment"></Dropdown>
      <Dropdown title="Inventory">
        <div class="flex flex-col gap-4">
          <ActiveEquipment />

          <Inventory />
        </div>
      </Dropdown>

      <Dropdown title="Add Items">
        <Catalog />
      </Dropdown>
    </div>
  </div>
{/if}
