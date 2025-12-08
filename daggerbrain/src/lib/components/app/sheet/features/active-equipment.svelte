<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCharacterContext } from '$lib/state/character.svelte';
	import WeaponCard from './equipment/weapon-row.svelte';
	import ArmorCard from './equipment/armor-row.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	let {
		class: className = '',
		onItemClick = () => {}
	}: {
		class?: string;
		onItemClick?: (type: 'weapon' | 'armor' | 'consumable' | 'loot', id: string) => void;
	} = $props();

	const context = getCharacterContext();
</script>

<div class={cn(className)}>
	<div class="relative mx-auto w-[330px]">
		<svg
			class="w-full text-primary-muted"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="147.266 157.441 198.221 17.244"
		>
			<path
				d="M 290.341 174.685 L 202.412 174.685 L 199.344 171.617 L 199.344 160.509 L 202.412 157.441 L 290.341 157.441 L 293.409 160.509 L 293.409 171.617"
				fill="currentColor"
				style="stroke-width: 0.1;"
			/>
			<path
				d="M 342.377 170.443 L 150.376 170.443 C 149.161 169.229 148.48 168.548 147.266 167.333 L 147.266 164.793 C 148.48 163.579 149.161 162.898 150.376 161.684 L 342.377 161.684 C 343.591 162.898 344.272 163.579 345.487 164.793 L 345.487 167.333 C 344.272 168.548 343.591 169.229 342.377 170.443"
				fill="currentColor"
				style="stroke-width: 0.1;"
			/>
			<path
				d="M 159.417 173.116 L 152.363 166.064 L 159.417 159.01 L 333.337 159.01 L 340.39 166.064 L 333.337 173.116"
				fill="var(--background)"
				style="stroke-width: 0.1;"
			/>
			<path
				d="M 333.544 158.51 L 159.209 158.51 L 158.917 158.803 L 152.363 165.356 L 151.656 166.063 L 152.363 166.77 L 158.917 173.323 L 159.209 173.616 L 159.624 173.616 L 333.13 173.616 L 333.544 173.616 L 333.837 173.323 L 335.413 171.747 L 340.39 166.77 L 341.098 166.063 L 340.39 165.356 L 335.413 160.379 L 333.837 158.803 L 333.544 158.51 Z M 333.13 159.51 C 335.689 162.069 337.124 163.504 339.683 166.063 C 337.124 168.622 335.689 170.057 333.13 172.616 L 159.624 172.616 C 157.065 170.057 155.63 168.622 153.07 166.063 C 155.63 163.504 157.065 162.069 159.624 159.51"
				fill="currentColor"
				style="stroke-width: 0.1;"
			/>
		</svg>

		<div class="absolute top-1/2 left-10 flex -translate-y-1/2 items-center gap-5">
			<p class=" text-[12px] leading-none font-bold text-muted-foreground">PROFICIENCY</p>
			<div class="flex items-center gap-2.5">
				{#each [1, 2, 3, 4, 5, 6] as prof}
					<div
						class="flex size-[16px] items-center justify-center rounded-full border-2 border-muted-foreground transition-colors group-hover:border-foreground"
					>
						{#if prof <= context.proficiency}
							<div class="size-[8px] rounded-full bg-muted-foreground"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<!-- Armor Slot -->
	<div class="grow pt-4">
		<table class="w-full border-collapse">
			<colgroup>
				<col />
				<col class="w-12" />
				<col class="w-29" />
				<col class="hidden w-20 sm:table-column" />
			</colgroup>
			<thead>
				<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
					<th class="px-4 py-2 text-left">Armor</th>
					<th class="py-2 pr-4 text-center">Slots</th>
					<th class="py-2 pr-4 text-right sm:text-center">Base Thresholds</th>
					<th class="hidden py-2 pr-4 text-right sm:table-cell">Features</th>
				</tr>
			</thead>
			<tbody>
				{#if context.derived_armor}
					<ArmorCard
						id={context.derived_armor.id}
						onclick={() => {
							if (context.derived_armor) onItemClick('armor', context.derived_armor.id);
						}}
					/>
				{/if}
			</tbody>
		</table>
	</div>
	<!-- Active Weapons -->
	<div class="grow pt-4">
		<table class="w-full border-collapse">
			<colgroup>
				<col />
				<col class="w-16" />
				<col class="w-18" />
				<col class="w-18" />
				<col class="hidden w-20 sm:table-column" />
			</colgroup>
			<thead>
				<tr class="border-b bg-primary-muted/50 text-xs text-muted-foreground">
					<th class="px-4 py-2 text-left">Weapons</th>
					<th class="py-2 pr-4 text-center">Range</th>
					<th class="py-2 pr-4 text-center">Hit</th>
					<th class="py-2 pr-4 text-right sm:text-center">Damage</th>
					<th class="hidden py-2 pr-4 text-right sm:table-cell">Features</th>
				</tr>
			</thead>
			<tbody>
				{#if context.derived_primary_weapon}
					<WeaponCard
						id={context.derived_primary_weapon.id}
						onclick={() => {
							if (context.derived_primary_weapon)
								onItemClick('weapon', context.derived_primary_weapon.id);
						}}
					/>
				{/if}
				{#if context.derived_secondary_weapon}
					<WeaponCard
						id={context.derived_secondary_weapon.id}
						onclick={() => {
							if (context.derived_secondary_weapon)
								onItemClick('weapon', context.derived_secondary_weapon.id);
						}}
					/>
				{/if}
				{#if context.derived_unarmed_attack}
					<WeaponCard
						id={context.derived_unarmed_attack.id}
						onclick={() => {
							if (context.derived_unarmed_attack)
								onItemClick('weapon', context.derived_unarmed_attack.id);
						}}
					/>
				{/if}
			</tbody>
		</table>
	</div>
</div>
