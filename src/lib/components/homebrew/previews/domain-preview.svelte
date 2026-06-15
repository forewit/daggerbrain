<script lang="ts">
	import type { Domain } from '@convex/schemas/compendium';
	import DomainIcon from '$lib/components/decorations/domain-icon.svelte';
	import { renderMarkdown } from '$lib/utils';

	let { domain }: { domain: Domain } = $props();
</script>

<div
	class="flex max-w-[500px] min-w-[300px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm"
>
	<div
		class="relative min-h-40 px-5 py-6"
		style={`background:
			radial-gradient(circle at top right, color-mix(in srgb, ${domain.color || '#000000'}, white 28%) 0%, transparent 42%),
			linear-gradient(135deg, ${domain.color || '#000000'} 0%, color-mix(in srgb, ${domain.color || '#000000'}, black 25%) 100%);
			color: ${domain.foreground_color || '#ffffff'};`}
	>
		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0">
				<p class="text-lg font-medium">{domain.title || 'Unnamed domain'}</p>
				<p class="text-xs italic opacity-80">Domain</p>
			</div>
			<div class="size-14 shrink-0 rounded-full border border-white/25 bg-black/10 p-3">
				<DomainIcon {domain} class="size-full" />
			</div>
		</div>

		{#if domain.image_url}
			<div
				class="pointer-events-none absolute right-0 bottom-0 h-24 w-24 overflow-hidden opacity-25"
			>
				<img src={domain.image_url} alt="" class="h-full w-full object-cover" />
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-4 p-4">
		{#if domain.description_html.trim().length > 0}
			<div class="text-sm text-muted-foreground">
				{@html renderMarkdown(domain.description_html)}
			</div>
		{/if}

		<div class="grid grid-cols-2 gap-3">
			<div class="rounded-lg border bg-muted px-3 py-2">
				<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
					Primary Color
				</p>
				<div class="mt-2 flex items-center gap-2">
					<span class="size-4 rounded-full border" style={`background: ${domain.color};`}></span>
					<p class="text-sm">{domain.color || 'Unset'}</p>
				</div>
			</div>
			<div class="rounded-lg border bg-muted px-3 py-2">
				<p class="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
					Foreground
				</p>
				<div class="mt-2 flex items-center gap-2">
					<span class="size-4 rounded-full border" style={`background: ${domain.foreground_color};`}
					></span>
					<p class="text-sm">{domain.foreground_color || 'Unset'}</p>
				</div>
			</div>
		</div>

		{#if domain.artist_name.trim().length > 0}
			<p class="text-xs text-muted-foreground italic">Art by {domain.artist_name}</p>
		{/if}
	</div>
</div>
