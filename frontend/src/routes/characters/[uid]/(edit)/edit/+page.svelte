<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn, handleImageUpload } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import * as Collapsible from "$lib/components/ui/collapsible/index";
  import { buttonVariants } from "$lib/components/ui/button";
  import { getCharacterContext } from "$lib/ts/character.svelte.js";

  let { data } = $props();

  const app = getAppContext();
  const context = getCharacterContext();
  let character = $derived(context.character);
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto"
    )}
  >
    <div class="m-4 flex flex-col gap-4">
      <p class="text-2xl font-medium pb-2 border-b">Settings</p>

      <!-- The Void -->
      <Label>
        The Void:
        <Checkbox bind:checked={character.settings.void_enabled} />
      </Label>

      <Dialog.Root>
        <Dialog.Trigger
          class={cn(buttonVariants({ variant: "link" }), "text-destructive p-0 h-min w-min")}
          >Delete Character</Dialog.Trigger
        >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete Character</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete <strong>{character.name}</strong>? This action cannot
              be undone.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close class={cn(buttonVariants({ variant: "link" }), "text-muted-foreground")}
              >Cancel</Dialog.Close
            >
            <Dialog.Close
              class={buttonVariants({ variant: "destructive" })}
              onclick={() => {
                app.deleteCharacter(character.uid);
              }}>Delete</Dialog.Close
            >
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>
{/if}
