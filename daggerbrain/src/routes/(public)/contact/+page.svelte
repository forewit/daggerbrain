<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Footer from '$lib/components/app/footer.svelte';

	let subject = $state('');
	let message = $state('');

	const email = 'scribe@daggerbrain.com'; // Replace with your actual email

	const mailtoLink = $derived(() => {
		const encodedSubject = encodeURIComponent(subject);
		const encodedBody = encodeURIComponent(message);
		return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
	});
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Forest footer image with fade effect - background -->
	<div class="forest-fade-container absolute bottom-0 left-0 right-0 h-64 w-full overflow-hidden pointer-events-none z-0">
		<img
			src="/images/art/forest.webp"
			alt=""
			class="forest-fade-container h-full w-full object-cover object-bottom"
		/>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex h-full w-full items-center justify-center px-4 py-16">
		<div class="w-full max-w-lg space-y-6">
			<div class="flex items-center gap-4">
				<div class="rounded-full border-2 border-accent p-1">
					<img
						src="/images/me.jpg"
						alt="Marc"
						class="h-16 w-16 rounded-full border-2 border-border object-cover"
					/>
				</div>
				<div class="space-y-2">
					<p class="text-sm text-muted- italic">
						Hey, I'm Marc! <span class="text-muted-foreground">The scribe and creator of Daggerbrain</span>
					</p>
					<p class="text-xs text-muted-foreground italic">Forever GM turned turned player (yes, it can happen!)</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="space-y-2">
					<label for="subject" class="text-sm font-medium text-foreground"> Subject </label>
					<Input
						id="subject"
						type="text"
						placeholder="This is going to be epic..."
						bind:value={subject}
					/>
				</div>

				<div class="space-y-2">
					<label for="message" class="text-sm font-medium text-foreground"> Message </label>
					<Textarea
						id="message"
						placeholder="Tell me a story..."
						bind:value={message}
						rows={8}
						class="min-h-32"
					/>
				</div>

				<Button
					href={mailtoLink()}
					variant="default"
					size="lg"
					class="w-full"
					disabled={!subject.trim() || !message.trim()}
				>
					Send me an email
				</Button>
			</div>
		</div>
	</div>
</div>
<Footer />

<style>
	.forest-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
