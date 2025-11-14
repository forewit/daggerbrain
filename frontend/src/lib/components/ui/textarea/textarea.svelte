<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
  import type { HTMLTextareaAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
  bind:this={ref}
  data-slot="textarea"
  class={cn(
    "border-border bg-card ring-offset-background placeholder:text-muted-foreground shadow-sm flex min-h-16 w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 inset-shadow focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  )}
  onfocus={(e) => {
    (ref as HTMLInputElement).select();
    if (restProps.onfocus) restProps.onfocus(e);
  }}
  bind:value
  {...restProps}
></textarea>
