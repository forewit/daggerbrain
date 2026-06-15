<script>
	import { artMountains } from '$lib/assets/images';
</script>

<svelte:head>
	<title>Maintenance | Daggerbrain</title>
	<meta name="description" content="We are undergoing maintenance." />
</svelte:head>

<div class="fixed inset-0 z-100 bg-background">
	<!-- Forest footer image with fade effect - background -->
	<div
		class="forest-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artMountains}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="h-full w-full object-cover object-center"
		/>
	</div>

	<!-- content -->
	<div
		class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-4 text-center"
	>
		<h1 class="font-eveleth text-4xl">We'll be back soon!</h1>
		<p class="">
			<img src="/images/daggerbrain.svg" alt="Daggerbrain" class="inline size-8" />
			<b>Daggerbrain</b> is being upgraded!
			<span class="text-nowrap">Please check back soon.</span>
		</p>
	</div>
</div>

<style>
	.forest-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
