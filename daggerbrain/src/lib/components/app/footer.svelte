<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
</script>

<footer class="border-t bg-card text-xs">
	<div
		class="mx-auto flex max-w-6xl flex-col-reverse gap-6 pt-3 pb-12 sm:flex-row sm:justify-between sm:pb-6"
	>
		<!-- Legal Section -->
		<div class="flex-1 pr-6 pl-6 sm:pt-4 sm:pr-0">
			<h3 class="mb-2 font-semibold text-foreground">Legal</h3>
			<p class="mb-2 text-muted-foreground">© Daggerbrain, LLC. All rights reserved.</p>
			<p class=" text-muted-foreground">
				Daggerbrain includes materials from the Daggerheart System Reference Document 1.0, ©
				Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL)
				License. More information can be found at
				<a
					href="https://www.daggerheart.com"
					target="_blank"
					rel="noopener noreferrer"
					class="underline hover:text-accent">https://www.daggerheart.com</a
				>. There are no previous modifications by others.
			</p>
		</div>

		<!-- Contact Us Section -->
		<div
			class="relative mr-6 -mb-5 ml-6 min-h-[130px] flex-shrink-0 overflow-hidden rounded pt-4 pr-4 sm:-mb-0 sm:ml-0"
		>
			<!-- Background Image -->
			<img
				src="/images/art/dragon-splash.webp"
				alt=""
				class="absolute inset-0 h-full w-full object-contain object-right opacity-10"
			/>
			<!-- Content -->
			<div class="relative z-10">
				<h3 class="mb-2 font-semibold text-foreground">Contact</h3>
				<div class="space-y-2">
					<Button variant="outline" size="sm" href="/contact" class="bg-muted hover:bg-muted/70"
						>Reach Out <ExternalLink class="ml-1 size-3" /></Button
					>
					<div>
						<a
							href="mailto:scribe@daggerbrain.com"
							class="text-muted-foreground underline hover:text-accent"
						>
							scribe@daggerbrain.com
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>
