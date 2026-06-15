<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Domain } from '@convex/schemas/compendium';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	type DomainIconData = Pick<Domain, 'title' | 'image_url'>;

	let {
		class: className = '',
		domain
	}: {
		class?: string;
		domain?: DomainIconData;
	} = $props();

	// Check if it's a local SVG (supports mask-image for currentColor) or external image
	let isLocalSvg = $derived(
		domain?.image_url?.startsWith('/') && domain?.image_url?.endsWith('.svg')
	);
</script>

{#if domain?.image_url}
	{#if isLocalSvg}
		<!-- Local SVG: use mask-image for currentColor support -->
		<div
			class={cn('aspect-square', className)}
			style="
				background-color: currentColor;
				-webkit-mask-image: url('{domain.image_url}');
				mask-image: url('{domain.image_url}');
				-webkit-mask-size: contain;
				mask-size: contain;
				-webkit-mask-repeat: no-repeat;
				mask-repeat: no-repeat;
				-webkit-mask-position: center;
				mask-position: center;
			"
			role="img"
			aria-label="{domain.title} domain icon"
		></div>
	{:else}
		<!-- External image (homebrew): use regular img tag -->
		<img
			src={domain.image_url}
			alt="{domain.title} domain icon"
			class={cn('aspect-square object-contain', className)}
		/>
	{/if}
{:else}
	<!-- Fallback: simple placeholder -->
	<Sparkles class="aspect-square object-contain" />
{/if}
