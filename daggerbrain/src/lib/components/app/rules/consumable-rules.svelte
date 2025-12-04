<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		Consumables are loot that can only be used once. You can hold up to five of each consumable at a
		time. Using a consumable doesn't require a roll unless required by the GM or the demands of the
		fiction.
	</p>
</div>
