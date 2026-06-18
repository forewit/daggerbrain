<script lang="ts">
	import { artCharacters } from '$lib/assets/images';
	import Footer from '$lib/components/navigation/footer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { PricingTable } from 'svelte-clerk';
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="characters-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artCharacters}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="characters-fade-container h-full w-full object-cover object-center"
		/>
	</div>

	<div
		class={cn(
			'z-10 flex h-full w-full flex-col items-center justify-start',
			'pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]'
		)}
	>
		<div class="relative flex w-full max-w-6xl flex-col space-y-4 px-4 py-4">
			<div
				class="flex flex-col gap-2 rounded-lg border border-emerald-900/50 bg-emerald-900/30 p-4 text-emerald-50"
			>
				<h1 class="text-normal font-bold text-emerald-50">
					Thank you for supporting Daggerbrain!
				</h1>
				<div class="flex flex-col gap-3 md:flex-row md:items-center">
					<p class="text-sm">
						Daggerbrain is a passion project to bring rich digital tools to Daggerheart.
						Subscribing is the best way to support the project, but the core features will
						always be free. Want to join the community and be early to new features?
					</p>
					<Button
						class="w-min bg-[#5865F2] hover:bg-[#5865F2]/80"
						target="_blank"
						size="sm"
						href="https://discord.gg/"
					>
						Join the Discord
					</Button>
				</div>
			</div>
			<PricingTable newSubscriptionRedirectUrl="/subscribe/success" />
		</div>
	</div>
</div>

<Footer />

<style>
	.characters-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
