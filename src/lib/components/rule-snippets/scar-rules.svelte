<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		If your character takes the <b>Avoid Death</b> death move, they could gain a Scar, permanently crossing
		out a Hope slot.
	</p>

	<p>
		Work with the GM to determine its lasting narrative impact and how, if possible, it can be
		restored. If you ever cross out your last Hope slot, your character's journey ends.
	</p>
</div>
