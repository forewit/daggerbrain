<script lang="ts">
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { buttonVariants } from "$lib/components/ui/button";
  import { getCharacterContext } from "$lib/ts/character/character.svelte";

  let { data } = $props();

  const app = getAppContext();
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
      <p class="text-2xl font-medium pb-2 border-b">Settings</p>

      <!-- The Void -->
      <Label>
        The Void:
        <Checkbox bind:checked={character.settings.void_enabled} />
      </Label>

      <!-- Use Gold Coins -->
      <Label>
        Use Gold Coins:
        <Checkbox bind:checked={character.settings.use_gold_coins} />
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
