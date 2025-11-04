<script lang="ts">
  import { getAppContext } from "$lib/ts/app.svelte";
  import { getCharacterContext } from "$lib/ts/character.svelte";
  import { type Traits } from "$lib/ts/types.js";
  import * as Select from "$lib/components/ui/select";
  import { capitalize } from "$lib/utils";
  import { cn } from "$lib/utils";
  import { TRAIT_OPTIONS } from "$lib/ts/constants/rules.js";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";

  const context = getCharacterContext();
  let character = $derived(context.character);

  let trait_option_indices = $derived.by(() => {
    if (!character) return {};
    const indices: Record<string, number | null> = {};
    const used: Set<number> = new Set();
    for (const trait of Object.keys(character.base_stats.traits)) {
      const val = character.base_stats.traits[trait as keyof Traits];
      if (val === null) {
        indices[trait] = null;
      } else {
        let foundIdx = null;
        for (let i = 0; i < TRAIT_OPTIONS.length; i++) {
          if (TRAIT_OPTIONS[i] === val && !used.has(i)) {
            foundIdx = i;
            used.add(i);
            break;
          }
        }
        indices[trait] = foundIdx; // do not fallback: only assign an index if available
      }
    }
    return indices;
  });

  function isOptionIndexDisabled(currentTrait: string, idx: number): boolean {
    return Object.entries(trait_option_indices).some(([t, i]) => t !== currentTrait && i === idx);
  }
</script>

{#if character}
  <div
    class={cn(
      //"pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-2xl mx-auto @container"
    )}
  >
    <div class="m-4 flex flex-col gap-2">
      {#if character.primary_class}
        <Dialog.Root>
          <Dialog.Trigger class={cn(buttonVariants({ variant: "link" }), "ml-auto")}>
            Suggested traits?
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header
              ><Dialog.Title>Suggested Traits: {character.primary_class.name}</Dialog.Title
              ></Dialog.Header
            >
            <Dialog.Description>
              <div class="flex flex-wrap gap-1">
                {#each Object.entries(character.primary_class.suggested_traits) as [trait, modifier], i}
                  <p class="text-nowrap">
                    {modifier && modifier > 0 ? "+" + modifier : modifier}
                    {capitalize(trait)}{i <
                    Object.entries(character.primary_class.suggested_traits).length - 1
                      ? ","
                      : ""}
                  </p>
                {/each}
              </div>
            </Dialog.Description>
            <Dialog.Footer>
              <Dialog.Close class={buttonVariants({ variant: "link" })}>Cancel</Dialog.Close>
              <Dialog.Close
                class={buttonVariants()}
                onclick={() => {
                  if (!character.primary_class) return;
                  character.base_stats.traits = character.primary_class.suggested_traits;
                }}
              >
                Use Suggested Traits
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      {/if}

      <!-- traits -->
      <div class="grid grid-cols-1 @xs:grid-cols-2 @lg:grid-cols-3 gap-5 justify-items-center">
        {#each Object.entries(character.base_stats.traits) as [trait, modifier], i}
          {@const total = character.derived_stats.traits[trait as keyof Traits] || 0}
          {@const bonus = total - (modifier || 0)}

          <div
            class="min-w-[130px] max-w-[220px] w-full p-3 border flex flex-col gap-2 items-center rounded-xl bg-primary-muted"
          >
            <p class="font-bold text-sm">{capitalize(trait)}</p>
            <Select.Root
              type="single"
              value={(trait_option_indices[trait] ?? "").toString()}
              onValueChange={(value) => {
                if (value === "") {
                  trait_option_indices[trait] = null;
                  character.base_stats.traits[trait as keyof Traits] = null;
                } else {
                  const idx = parseInt(value);
                  trait_option_indices[trait] = idx;
                  character.base_stats.traits[trait as keyof Traits] = TRAIT_OPTIONS[idx];
                }
              }}
            >
              <Select.Trigger highlighted={modifier === null} class="w-full truncate bg-muted-foreground/8 hover:bg-muted-foreground/5">
                <p class="truncate">
                  {#if modifier === null}
                    Select
                  {:else}
                    {modifier > 0 ? "+" + modifier : modifier}
                  {/if}
                </p>
              </Select.Trigger>
              <Select.Content class="rounded-md">
                <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
                  -- Select --
                </Select.Item>
                <Select.Label>Trait Options</Select.Label>
                {#each TRAIT_OPTIONS as option, j}
                  <Select.Item
                    class="hover:cursor-pointer"
                    value={j.toString()}
                    disabled={isOptionIndexDisabled(trait, j)}
                  >
                    {option > 0 ? "+" + option : option}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
            <p class="text-sm text-muted-foreground">
              Bonus: {bonus > 0 ? "+" + bonus : bonus}
            </p>
            <p class="text-sm">
              Total: {total > 0 ? "+" + total : total}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
