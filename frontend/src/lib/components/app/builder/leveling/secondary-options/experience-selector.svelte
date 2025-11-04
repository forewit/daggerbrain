<script lang="ts">
  import * as Select from "$lib/components/ui/select/";

  let {
    selected_experiences = $bindable(),
    experiences,
    width,
  }: {
    selected_experiences: { A: number | null; B: number | null };
    experiences: string[];
    width: number;
  } = $props();
</script>

<div class="flex flex-col gap-2 bg-primary/50 p-2 rounded-md">
  <p class="py-1 px-2 text-xs italic font-medium text-muted-foreground">
    Choose 2 Experiences.
  </p>
  <div class="flex gap-2.5">
    <Select.Root
      type="single"
      value={selected_experiences.A === null
        ? ""
        : selected_experiences.A.toString()}
      onValueChange={(value) => {
        selected_experiences.A = value !== "" ? parseInt(value) : null;
      }}
    >
      <Select.Trigger
        highlighted={selected_experiences.A === null}
        class="w-full truncate"
      >
        <p class="truncate">
          {selected_experiences.A !== null
            ? experiences[selected_experiences.A].trim() ||
              "Unnamed Experience"
            : "Select an Experience"}
        </p>
      </Select.Trigger>
      <Select.Content class="rounded-md" align="start">
        <div style="max-width: {width}px;" class="p-2">
          <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
            -- none selected --
          </Select.Item>
          <Select.Label>Experiences</Select.Label>
          {#each experiences as experience, j}
            <Select.Item
              disabled={selected_experiences.B === j || selected_experiences.A === j}
              class="hover:cursor-pointer"
              value={j.toString()}
              >{experience.trim() || "Unnamed Experience"}</Select.Item
            >
          {/each}
        </div>
      </Select.Content>
    </Select.Root>
    <Select.Root
      type="single"
      value={selected_experiences.B === null
        ? ""
        : selected_experiences.B.toString()}
      onValueChange={(value) => {
        selected_experiences.B = value !== "" ? parseInt(value) : null;
      }}
    >
      <Select.Trigger
        highlighted={selected_experiences.B === null}
        class="w-full truncate"
      >
        <p class="truncate">
          {selected_experiences.B !== null
            ? experiences[selected_experiences.B].trim() ||
              "Unnamed Experience"
            : "Select an Experience"}
        </p>
      </Select.Trigger>
      <Select.Content class="rounded-md" align="end">
        <div style="max-width: {width}px;" class="p-2">
          <Select.Item value="" class="justify-center hover:cursor-pointer text-sm">
            -- none selected --
          </Select.Item>
          <Select.Label>Experiences</Select.Label>
          {#each experiences as experience, j}
            <Select.Item
              disabled={selected_experiences.A === j || selected_experiences.B === j}
              class="hover:cursor-pointer"
              value={j.toString()}
              >{experience.trim() || "Unnamed Experience"}</Select.Item
            >
          {/each}
        </div>
      </Select.Content>
    </Select.Root>
  </div>
</div>

