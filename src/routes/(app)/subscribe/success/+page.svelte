<script lang="ts">
	import { artCharacters } from '$lib/assets/images';
	import Footer from '$lib/components/navigation/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { Confetti } from 'svelte-confetti';
</script>

<div
	style="
 position: fixed;
 top: 0px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;"
>
	<Confetti
		x={[-5, 5]}
		y={[0, 0.1]}
		delay={[500, 2000]}
		infinite
		duration={5000}
		amount={100}
		fallDistance="400px"
	/>
</div>

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
		<div class="flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
			<p class="relative mt-20 text-center font-eveleth text-xl">
				Welcome
				<span
					class="font-eveleth text-accent [filter:drop-shadow(0_0_8px_rgba(253,212,113,0.2))_drop-shadow(0_0_16px_rgba(253,212,113,0.2))]"
					>Adventurer</span
				>
			</p>

			<p class="text-center">
				Thank you for subscribing to Daggerbrain! Your support allows this project to continue
				growing.
			</p>
			<div class="relative flex flex-col items-center gap-4">
				<Button href="/characters" variant="outline" class="border border-white/10">
					Unlimited Characters <ExternalLink />
				</Button>
				<Button href="/homebrew" variant="outline" class="border border-white/10">
					Unlimited Homebrew <ExternalLink />
				</Button>

				<Button
					class="relative mx-auto bg-[#5865F2] hover:bg-[#5865F2]/80"
					target="_blank"
					size="sm"
					href="https://discord.gg/"
				>
					Join the Discord
				</Button>
			</div>
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
