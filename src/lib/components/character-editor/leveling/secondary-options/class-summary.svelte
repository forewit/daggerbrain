<script lang="ts">
	import Banner from '$lib/components/decorations/class-banner.svelte';
	import type { CharacterClass } from '@convex/schemas/compendium';
	import { cn, renderMarkdown } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import * as Select from '$lib/components/ui/select/';
	import DomainBanner from '$lib/components/decorations/domain-banner.svelte';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import HomebrewBadge from '$lib/components/decorations/badges/homebrew-badge.svelte';
	import CampaignBadge from '$lib/components/decorations/badges/campaign-badge.svelte';

	let {
		character_class,
		class: className = '',
		bannerClasses = '',
		children,
		multiclass = false,
		domain_id_selection = $bindable(undefined),
		hide_starting_stats = false,
		show_badge = false
	}: {
		character_class: CharacterClass;
		class?: string;
		bannerClasses?: string;
		children?: Snippet;
		multiclass?: boolean;
		hide_starting_stats?: boolean;
		domain_id_selection?: CharacterClass['primary_domain_id'] | undefined;
		show_badge?: boolean;
	} = $props();

	const characterCtx = getCharacterContext();
	const compendium = $derived(characterCtx.character_compendium);
</script>

<div class={cn('flex flex-col gap-3', className)}>
	<div class="flex gap-3 text-left">
		{#if character_class.image_url && character_class.image_url !== '/images/art/placeholder-art.webp'}
			<div class="max-w-[120px] min-w-[60px] grow overflow-hidden rounded-lg">
				<img src={character_class.image_url} alt="art" class="h-full object-cover" />
			</div>
		{/if}
		<div class="flex grow grow-4 flex-col gap-2">
			<div class="flex items-center gap-2">
				<p class="text-lg font-medium">
					{character_class.title}
				</p>
				{#if show_badge}
					{#if character_class.source_key === 'Homebrew'}
						<HomebrewBadge class="size-4" />
					{:else if character_class.source_key === 'Campaign'}
						<CampaignBadge class="size-4" />
					{/if}
				{/if}
			</div>
			<p class="-mt-2 text-xs text-muted-foreground italic">
				{@html renderMarkdown(character_class.description_html)}
			</p>

			<div class="flex flex-col gap-2">
				{#if multiclass}
					<p class="text-xs font-medium">Multiclass domain</p>
					<Select.Root
						type="single"
						value={domain_id_selection ?? ''}
						onValueChange={(value) => {
							if (value === '') domain_id_selection = undefined;
							else domain_id_selection = value as CharacterClass['primary_domain_id'];
						}}
					>
						<Select.Trigger
							highlighted={domain_id_selection === undefined}
							class="w-full truncate bg-muted-foreground/8 hover:bg-muted-foreground/5"
						>
							<p class="truncate">
								{domain_id_selection
									? compendium?.domains[domain_id_selection]?.title || 'Domain not available'
									: 'Select a domain'}
							</p>
						</Select.Trigger>
						<Select.Content class="rounded-md " align="start">
							<Select.Item value="" class="justify-center text-sm hover:cursor-pointer"
								>-- none selected --</Select.Item
							>
							<Select.Label>Domains</Select.Label>
							{#if character_class.primary_domain_id && compendium?.domains[character_class.primary_domain_id]}
								<Select.Item value={character_class.primary_domain_id}
									>{compendium.domains[character_class.primary_domain_id].title}</Select.Item
								>
							{/if}
							{#if character_class.secondary_domain_id && compendium?.domains[character_class.secondary_domain_id]}
								<Select.Item value={character_class.secondary_domain_id}
									>{compendium.domains[character_class.secondary_domain_id].title}</Select.Item
								>
							{/if}
						</Select.Content>
					</Select.Root>
				{:else}
					<p class="text-xs text-muted-foreground">
						<b class="text-foreground"><i>Domains:</i></b>
						{(() => {
							const primaryDomain = character_class.primary_domain_id
								? compendium?.domains[character_class.primary_domain_id]
								: undefined;
							const secondaryDomain = character_class.secondary_domain_id
								? compendium?.domains[character_class.secondary_domain_id]
								: undefined;
							if (!primaryDomain || !secondaryDomain) {
								return 'Domain not available';
							}
							return `${primaryDomain.title} / ${secondaryDomain.title}`;
						})()}
					</p>

					{#if !hide_starting_stats}
						<p class="text-xs text-muted-foreground">
							<b class="text-foreground"><i>Evasion:</i></b>
							{character_class.starting_evasion}
						</p>
						<p class="text-xs text-muted-foreground">
							<b class="text-foreground"><i>HP:</i></b>
							{character_class.starting_max_hp}
						</p>
					{/if}
				{/if}
			</div>
		</div>

		{#if multiclass && domain_id_selection !== undefined}
			<DomainBanner {compendium} domain_id={domain_id_selection} />
		{:else}
			<Banner {compendium} {character_class} class={bannerClasses} />
		{/if}
	</div>
	{@render children?.()}
</div>
