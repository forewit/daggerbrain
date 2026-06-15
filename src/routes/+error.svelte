<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div class="flex flex-col items-center justify-center py-24">
		<p class="text-sm text-muted-foreground italic">{page.status}</p>
		<p class="text-sm text-muted-foreground italic">{page.error?.message}</p>
	</div>
</div>
