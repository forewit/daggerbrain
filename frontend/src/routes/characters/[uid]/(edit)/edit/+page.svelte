<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, handleImageUpload } from "$lib/utils";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));

  let fileInput = $state<HTMLInputElement>();

  function onImageUploadSuccess(dataUrl: string) {
    if (character) {
      character.image = dataUrl;
    }
  }

  function triggerImageUpload() {
    fileInput?.click();
  }
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-6xl mx-auto px-4 py-2"
    )}
  >
    <p class="text-2xl font-bold py-2">Character Settings</p>

    <!-- hidden file input for image upload -->
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      onchange={(event) => handleImageUpload(event, onImageUploadSuccess)}
      class="hidden"
    />

    <div class="space-y-4 text-nowrap">
      <Label class="w-min">
        Picture:
        <button
          class="h-[90px] w-[90px] shrink-0 p-1 aspect-square rounded-lg border-2 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
          onclick={triggerImageUpload}
        >
          <img
            class="h-full w-full rounded-md object-cover"
            src={character.image}
            alt={character.name}
          />
        </button>
      </Label>

      <Label>
        Name:
        <Input bind:value={character.name} class="w-[200px]"/>
      </Label>

      <Label>
        The Void:
        <Checkbox bind:checked={character.settings.void_enabled} />
      </Label>
    </div>
  </div>
{/if}
