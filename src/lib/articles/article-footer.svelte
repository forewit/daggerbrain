<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	let { class: className = '' } = $props();
</script>

<div class={cn('space-y-2 rounded-lg bg-primary-muted/70 p-4 shadow', className)}>
	<div class="mb-4 flex items-center justify-between border-b border-muted-foreground/20 pb-1">
		<p class="text-md font-bold">Join the community!</p>
		<Button variant="link" size="sm" href="/roadmap" class="text-muted-foreground">
			See the roadmap
			<ExternalLink />
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-4">
		<Button
			class="bg-[#5865F2] hover:bg-[#5865F2]/80"
			target="_blank"
			href="https://discord.gg/"
		>
			Join the Discord
		</Button>
		<Button class="bg-emerald-900 text-emerald-50 hover:bg-emerald-900/70" href="/subscribe">
			Become an Adventurer*
		</Button>
	</div>
	<p class="mt-4 text-xs text-muted-foreground italic">
		*The best way to support Daggerbrain. Unlocks unlimited characters & homebrew
	</p>
</div>
