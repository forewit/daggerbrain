<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-3 text-xs text-muted-foreground italic', className)}>
	<p>
		Some features can apply special or unique conditions, which work as described in the feature
		text.
	</p>
	<p>
		Unless otherwise noted, the same condition can't be applied more than once to the same target.
	</p>
</div>
