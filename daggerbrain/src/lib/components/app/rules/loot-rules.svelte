<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		Loot is treasure and equipment found during adventures. Unlike consumables, loot items can be
		used repeatedly and may provide ongoing bonuses or special abilities.
	</p>
</div>
