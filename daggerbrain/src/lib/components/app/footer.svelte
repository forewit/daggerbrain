<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
</script>

<footer class="border-t bg-card text-xs">
		<div class="pt-3 pb-12 sm:pb-6 max-w-6xl mx-auto  gap-6 flex flex-col-reverse sm:flex-row sm:justify-between">
			<!-- Legal Section -->
			<div class="flex-1 pl-6 pr-6 sm:pr-0 sm:pt-4">
				<h3 class="mb-2 font-semibold text-foreground">Legal</h3>
				<p class="mb-2 text-muted-foreground">
					© 2025 Daggerbrain, LLC. All rights reserved.
				</p>
				<p class=" text-muted-foreground">
					Daggerbrain includes materials from the Daggerheart System Reference Document 1.0, © Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information can be found at
					<a href="https://www.daggerheart.com" target="_blank" rel="noopener noreferrer" class="underline hover:text-accent">https://www.daggerheart.com</a>. There are no previous modifications by others.
				</p>
				
			</div>

			<!-- Contact Us Section -->
			<div class="relative flex-shrink-0 overflow-hidden rounded min-h-[130px] pr-4 mr-6 ml-6 sm:ml-0 pt-4 -mb-5 sm:-mb-0">
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
						<Button variant="outline" size="sm" href="/contact" class="bg-muted hover:bg-muted/70">Reach Out <ExternalLink class="ml-1 size-3" /></Button>
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
