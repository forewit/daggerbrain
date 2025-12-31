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

<svelte:head>
	<title>Contact | Daggerbrain</title>
	<meta
		name="description"
		content="Have questions, feedback, or want to help? I'd love to hear from you."
	/>
</svelte:head>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<!-- Forest footer image with fade effect - background -->
	<div
		class="forest-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-64 w-full overflow-hidden"
	>
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
					<p class="text-muted- text-sm italic">
						Hey, I'm Marc! <span class="text-muted-foreground"
							>The scribe and creator of Daggerbrain</span
						>
					</p>
					<p class="text-xs text-muted-foreground italic">
						Forever GM turned turned player (yes, it can happen!)
					</p>
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

			<div class="space-y-2">
				<p class="text-sm font-medium text-foreground">Want to support the project?</p>
				<div class="flex gap-4">
					<Button
						class="bg-[#5865F2] hover:bg-[#5865F2]/80"
						target="_blank"
						href="https://discord.gg/nTATkV7d9S"
					>
						<svg id="Discord-Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.644 96"
							><defs
								><style>
									.cls-1 {
										fill: #fff;
									}
								</style></defs
							><path
								id="Discord-Symbol-White"
								class="cls-1"
								d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"
							/></svg
						>
						Join the Discord
					</Button>
					<Button
						class="bg-accent text-background hover:bg-accent/80"
						target="_blank"
						href="https://buymeacoffee.com/marcanderson">☕ Buy me a coffee</Button
					>
				</div>
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
