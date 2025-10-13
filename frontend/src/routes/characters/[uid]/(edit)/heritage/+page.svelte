<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import { getAppContext } from "$lib/ts/app.svelte";
  import { cn } from "$lib/utils";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import Button, { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { ANCESTRY_CARDS, COMMUNITY_CARDS, TRANSFORMATION_CARDS } from "$lib/ts/constants.js";

  let { data } = $props();

  const app = getAppContext();
  const character = $derived(app.characters.find((c) => c.uid === data.uid));
</script>

{#if character}
  <div
    class={cn(
      "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
      "max-w-6xl mx-auto px-4 py-2"
    )}
  >
    <div class="flex flex-col gap-4 text-nowrap">
      <Label
        >Ancestry:
        <Dialog.Root>
          <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }))}>
            {character.heritage.ancestry_card === null
              ? "Choose an Ancestry"
              : character.heritage.ancestry_card.title}
          </Dialog.Trigger>
          <Dialog.Content class="sm:max-w-md">
            <Dialog.Header>
              <Dialog.Title>Choose an Ancestry</Dialog.Title>
              <Dialog.Description>[Ancestry description text]</Dialog.Description>
              {#each Object.values(ANCESTRY_CARDS) as ancestry}
                <Button variant="outline" class="flex text-left items-center gap-2 h-auto justify-start" onclick={() => character.heritage.ancestry_card = ancestry}>
                  <img src={ancestry.full_card_image_url} alt={ancestry.title} class="w-10 h-10 object-cover" />
                  <div class="flex flex-col">
                    <p class="text-sm font-bold">{ancestry.title}</p>
                    <p class="text-xs text-muted-foreground">{@html ancestry.description}</p>
                  </div>
                </Button>
              {/each}
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
      </Label>

      <Label>
        Community:
        <Dialog.Root>
          <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }))}>
            {character.heritage.community_card === null
              ? "Choose a Community"
              : character.heritage.community_card.title}
          </Dialog.Trigger>
          <Dialog.Content class="sm:max-w-md">
            <Dialog.Header>
              <Dialog.Title>Choose a Community</Dialog.Title>
              <Dialog.Description>[Community description text]</Dialog.Description>
              {#each Object.values(COMMUNITY_CARDS) as community}
                <Button variant="outline" class="flex text-left items-center gap-2 h-auto justify-start" onclick={() => character.heritage.community_card = community}>
                  <img src={community.full_card_image_url} alt={community.title} class="w-10 h-10 object-cover" />
                  <div class="flex flex-col">
                    <p class="text-sm font-bold">{community.title}</p>
                    <p class="text-xs text-muted-foreground text-wrap">{@html community.description}</p>
                  </div>
                </Button>
              {/each}
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
      </Label>

      {#if character.settings.void_enabled}
        <Label>
          Transformation:
          <Dialog.Root>
            <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }))}>
              {character.transformation_card === null
                ? "Choose a Transformation"
                : character.transformation_card.title}
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-md">
              <Dialog.Header>
                <Dialog.Title>Choose a Transformation</Dialog.Title>
                <Dialog.Description>[Transformation description text]</Dialog.Description>
                {#each Object.values(TRANSFORMATION_CARDS) as transformation}
                  <Button variant="outline" class="flex text-left items-center gap-2 h-auto justify-start" onclick={() => character.transformation_card = transformation}>
                    <img src={transformation.full_card_image_url} alt={transformation.title} class="w-10 h-10 object-cover" />
                    <div class="flex flex-col">
                      <p class="text-sm font-bold">{transformation.title}</p>
                      <p class="text-xs text-muted-foreground text-wrap">{@html transformation.description}</p>
                    </div>
                  </Button>
                {/each}
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </Label>
      {/if}
    </div>
  </div>
{/if}