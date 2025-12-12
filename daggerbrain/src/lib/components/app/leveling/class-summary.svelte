<script lang="ts">
	import Banner from '$lib/components/app/cards/class-banner.svelte';
	import type { CharacterClass, DomainIds } from '$lib/types/compendium-types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import * as Select from '$lib/components/ui/select/';
	import DomainBanner from '$lib/components/app/cards/domain-banner.svelte';
	import { getCompendiumContext } from '$lib/state/compendium.svelte';

	let {
		character_class,
		class: className = '',
		bannerClasses = '',
		children,
		multiclass = false,
		domain_id_selection = $bindable(null),
		hide_starting_stats = false
	}: {
		character_class: CharacterClass;
		class?: string;
		bannerClasses?: string;
		children?: Snippet;
		multiclass?: boolean;
		hide_starting_stats?: boolean;
		domain_id_selection?: DomainIds | null;
	} = $props();

	const compendium = getCompendiumContext();
</script>

<div class={cn('flex flex-col gap-3', className)}>
	<div class="flex gap-3 text-left">
		<div class="max-w-[120px] min-w-[60px] grow">
			<img src={character_class.image_url} alt="art" class="h-full object-cover" />
		</div>
		<div class="flex grow grow-4 flex-col gap-2">
			<p class="text-lg font-medium">{character_class.name}</p>
			<p class="-mt-2 text-xs text-muted-foreground italic">
				{@html character_class.description_html}
			</p>

			<div class="flex flex-col gap-2">
				{#if multiclass}
					<p class="text-xs font-medium">Multiclass domain</p>
					<Select.Root
						type="single"
						value={domain_id_selection ?? ''}
						onValueChange={(value) => {
							if (value === '') domain_id_selection = null;
							else domain_id_selection = value as DomainIds;
						}}
					>
						<Select.Trigger
							highlighted={domain_id_selection === null}
							class="w-full truncate bg-muted-foreground/8 hover:bg-muted-foreground/5"
						>
							<p class="truncate">
							{domain_id_selection
								? compendium.domains[domain_id_selection]?.name || 'Domain not available'
								: 'Select a domain'}
							</p>
						</Select.Trigger>
						<Select.Content class="rounded-md " align="start">
							<Select.Item value="" class="justify-center text-sm hover:cursor-pointer"
								>-- none selected --</Select.Item
							>
							<Select.Label>Domains</Select.Label>
							<!-- primary domain -->
							{#if compendium.domains[character_class.primary_domain_id]}
								<Select.Item value={character_class.primary_domain_id}
									>{compendium.domains[character_class.primary_domain_id].name}</Select.Item
								>
							{/if}
							<!-- secondary domain -->
							{#if compendium.domains[character_class.secondary_domain_id]}
								<Select.Item value={character_class.secondary_domain_id}
									>{compendium.domains[character_class.secondary_domain_id].name}</Select.Item
								>
							{/if}
						</Select.Content>
					</Select.Root>
				{:else}
					<p class="text-xs text-muted-foreground">
						<b class="text-foreground"><i>Domains:</i></b>
						{(() => {
							const primaryDomain = compendium.domains[character_class.primary_domain_id];
							const secondaryDomain = compendium.domains[character_class.secondary_domain_id];
							if (!primaryDomain || !secondaryDomain) {
								return 'Domain not available';
							}
							return `${primaryDomain.name} / ${secondaryDomain.name}`;
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

		{#if multiclass && domain_id_selection !== null}
			<DomainBanner domain_id={domain_id_selection} />
		{:else}
			<Banner {character_class} class={bannerClasses} />
		{/if}
	</div>
	{@render children?.()}
</div>
