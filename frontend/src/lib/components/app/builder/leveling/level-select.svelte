<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { buttonVariants } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import type { LevelUpOption, Character } from "$lib/ts/types";

  let {
    level = $bindable(),
    level_up_choices = $bindable(),
    class: className = "",
  }: { level: number; level_up_choices: Character["level_up_choices"]; class?: string } = $props();

  let open = $state(false);
  let newLevel = $derived(level);
  let selectElm: HTMLSelectElement = $state(null!);
</script>

<select
  class={cn("bg-primary-muted p-2 rounded-md w-36 border-r-6 border-primary-muted", className)}
  value={level}
  bind:this={selectElm}
  onchange={(e) => {
    newLevel = parseInt(selectElm.value);

    if (newLevel < level) {
      selectElm.value = level.toString();
      open = true;
      e.preventDefault();
    } else {
      level = newLevel;
    }
  }}
>
  {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as i}
    <option value={i}>Level {i}</option>
  {/each}
</select>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Level Down</Dialog.Title>
    </Dialog.Header>
    <p>Current level: {level}</p>
    <p>New level: {newLevel}</p>
    <Dialog.Footer>
      <Dialog.Close
        onclick={() => {
          newLevel = level;
        }}
        class={cn(buttonVariants({ variant: "link" }))}
      >
        Cancel
      </Dialog.Close>
      <Dialog.Close
        class={cn(buttonVariants({ variant: "destructive" }))}
        onclick={() => {
          level = newLevel;
          selectElm.value = level.toString();
          for (let i = 0; i < newLevel; i++) {
            level_up_choices[i as keyof typeof level_up_choices] = [];
          }
        }}
      >
        Level Down
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
