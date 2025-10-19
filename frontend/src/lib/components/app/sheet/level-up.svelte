<script lang="ts">
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";

  let { class: className = "", level }: { class?: string; level: number } = $props();

  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    onclick={(e) => {
      e.preventDefault();
      open = true;
    }}
    class={cn(
      "border border-accent rounded-full bg-border text-accent grid place-items-center h-6 px-3",
      className
    )}
  >
      <p class="text-xs">Level {level}</p>
      <!-- <ChevronRight class="size-3 stroke-3" /> -->
  </Dialog.Trigger>
  <Dialog.Content>test</Dialog.Content>
</Dialog.Root>
