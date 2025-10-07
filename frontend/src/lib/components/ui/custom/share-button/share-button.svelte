<script lang="ts">
  import Share from "@lucide/svelte/icons/share";
  import { UseClipboard } from "$lib/hooks/use-clipboard.svelte";
  import { Button, type ButtonProps } from "$lib/components/ui/button";
  import type { Snippet } from "svelte";

  const clipboard = new UseClipboard();

  // Props for customization
  let {
    title,
    text,
    url,
    onclick = ()=>{},
    children,
    ...restProps
  }: {
    title: string;
    text: string;
    url: string;
    children?: Snippet;
    onclick?: (e: MouseEvent) => void
  } & ButtonProps = $props();

  // Share functionality
  function shareText() {
    const shareData = {
      title,
      text,
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.warn("Error sharing:", error));
    } else {
      // Fallback: copy to clipboard
      clipboard.copy(text);
    }
  }
</script>

<Button
  onclick={(e) => {
    shareText();
    onclick(e);
  }}
  {...restProps}
>
  <Share />
  {@render children?.()}
</Button>
