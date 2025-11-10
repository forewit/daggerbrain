<script lang="ts">
  import * as Select from "$lib/components/ui/select/";
  import { cn } from "$lib/utils";

  let {
    selected_experiences = $bindable(),
    max = 2,
    experiences,
    width,
    class: className = "",
  }: {
    selected_experiences: number[];
    max: number;
    experiences: string[];
    width: number;
    class?: string;
  } = $props();

  let open = $state(false);
</script>

<Select.Root
  type="multiple"
  bind:open
  value={selected_experiences.map((i) => i.toString())}
  onValueChange={(value) => {
    selected_experiences = value.filter((value) => value).map((value) => parseInt(value));
    if (selected_experiences.length >= max) open = false;
  }}
>
  <Select.Trigger
    highlighted={selected_experiences.length < max}
    class={cn("w-full truncate", className)}
  >
    <p class="truncate">
      {#if max === 1}
        {#if selected_experiences.length === 0}
          Select 1 Experience
        {:else}
          {experiences[0].trim() || "Unnamed Experience"}
        {/if}
      {:else if selected_experiences.length === 0}
        Select {max} Experiences
      {:else}
        {selected_experiences.map((i) => experiences[i].trim() || "Unnamed Experience").join(", ")}
        {#if selected_experiences.length < max}
          , (Choose {max - selected_experiences.length} more)
        {/if}
      {/if}
    </p>
  </Select.Trigger>
  <Select.Content class="rounded-md" align="start">
    <div style="max-width: {width}px;" class="p-2">
      <Select.Item
        value=""
        disabled={selected_experiences.length === 0}
        onclick={() => {
          selected_experiences = [];
          open = true;
        }}
        class="text-destructive font-bold justify-center hover:cursor-pointer"
      >
        -- Clear selection --
      </Select.Item>

      <Select.Label>Select {max} {max === 1 ? "Experience" : "Experiences"}</Select.Label>
      {#each experiences as experience, j}
        <Select.Item
          disabled={selected_experiences.some((i) => i === j) || selected_experiences.length >= max}
          class="hover:cursor-pointer"
          value={j.toString()}
        >
          {experience.trim() || "Unnamed Experience"}
        </Select.Item>
      {/each}
    </div>
  </Select.Content>
</Select.Root>
