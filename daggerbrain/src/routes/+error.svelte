<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex w-full flex-col items-center justify-center py-16">
	<p class="text-sm text-muted-foreground italic">{page.status}</p>
	<p class="text-sm text-muted-foreground italic">{page.error?.message}</p>
	<p class="text-sm text-muted-foreground italic">
		If the issue persists <a href="/contact">let us know</a>.
	</p>
</div>
