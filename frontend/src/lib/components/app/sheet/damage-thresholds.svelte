<script lang="ts">
  import { cn } from "$lib/utils";
  import { getCharacterContext } from "$lib/ts/character.svelte";

  let {
    class: className = "",
  }: { class?: string; } = $props();

  const context = getCharacterContext();
  let thresholds = $derived(context.damage_thresholds);
</script>

<div class={cn("w-[360px] relative text-muted-foreground", className)}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416.79 47.33">
    <path
      style="fill: currentcolor;"
      d="M 0 0 L 0 9.466 L 3.057 12.239 L 2.956 35.293 L 0 37.864 L 0 47.33 L 9.262 47.33 L 12.018 44.578 L 89.967 44.476 L 92.62 47.33 L 101.882 47.33 L 101.882 37.864 L 99.232 35.798 L 98.926 11.833 L 101.882 9.466 L 101.882 0 M 101.882 0 L 92.62 0 L 89.942 3.465 L 11.305 2.854 L 9.262 0 L 0 0"
    />
    <path
      style="stroke-width: 1; fill: currentcolor;"
      d="M 157.454 0 L 157.454 9.466 L 173.182 23.707 L 157.454 37.864 L 157.454 47.33 L 166.716 47.33 L 169.472 44.578 L 247.421 44.476 L 250.074 47.33 L 259.336 47.33 L 259.336 37.864 L 256.686 35.798 L 256.38 11.833 L 259.336 9.466 L 259.336 0 M 259.336 0 L 250.074 0 L 247.396 3.465 L 168.759 2.854 L 166.716 0 L 157.454 0"
    />
    <path
      style="stroke-width: 1; fill: currentcolor;"
      d="M 314.908 0 L 314.908 9.466 L 330.636 23.707 L 314.908 37.864 L 314.908 47.33 L 324.17 47.33 L 326.926 44.578 L 404.875 44.476 L 407.528 47.33 L 416.79 47.33 L 416.79 37.864 L 414.14 35.798 L 413.834 11.833 L 416.79 9.466 L 416.79 0 M 416.79 0 L 407.528 0 L 404.85 3.465 L 326.213 2.854 L 324.17 0 L 314.908 0"
    />
    <rect
      x="95.648"
      y="8.145"
      width="237.784"
      height="31.133"
      style="fill: none; stroke: currentcolor; stroke-width: 2px;"
    />
    <path
      d="M 240.995 20.365 L 248.976 29.107 L 233.014 29.107 L 240.995 20.365 Z"
      style="fill: currentcolor; transform-box: fill-box; transform-origin: 50% 50%;"
      transform="matrix(0, 1, -1, 0, -78.650029, -1.41727)"
    />
    <path
      d="M 240.995 20.365 L 248.976 29.107 L 233.014 29.107 L 240.995 20.365 Z"
      style="fill: currentcolor; stroke-width: 1; transform-origin: 240.995px 24.736px;"
      transform="matrix(0, 1, -1, 0, 78.284009, -1.179897)"
    />
  </svg>

  <div class="text-center text-background absolute top-[7px] left-[20px] text-xs font-bold leading-none">
    <p class="mb-[2px]">MINOR</p>
    <p>DAMAGE</p>
  </div>

  <div class="text-center text-background absolute top-[7px] left-[155px] text-xs font-bold leading-none">
    <p class="mb-[2px]">MAJOR</p>
    <p>DAMAGE</p>
  </div>
  <div class="text-center text-background absolute top-[7px] right-[16px] text-xs font-bold leading-none">
    <p class="mb-[2px]">SEVERE</p>
    <p>DAMAGE</p>
  </div>

  <div class="absolute text-foreground font-bold top-[8px] left-[112px] -translate-x-1/2">
    <p>{thresholds.major}</p>
  </div>
  <div class="absolute text-foreground font-bold top-[8px] left-[248px] -translate-x-1/2">
    <p>{thresholds.severe}</p>
  </div>
</div>
