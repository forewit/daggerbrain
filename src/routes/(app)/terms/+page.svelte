<script lang="ts">
	import Footer from '$lib/components/navigation/footer.svelte';
</script>

<main class="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
	<article class="grid gap-8 text-foreground">
		<header class="space-y-4">
			<p class="mb-3 text-sm font-semibold text-accent">Effective Date: May 13, 2026</p>
			<h1 class="font-eveleth text-2xl">Terms of Service</h1>
			<p class=" text-muted-foreground">
				Welcome to Daggerbrain ("Daggerbrain," "we," "our," or "us"). We operate
				<a
					class="underline underline-offset-[0.2em] hover:text-accent"
					href="https://daggerbrain.com">https://daggerbrain.com</a
				>, a set of rich digital tools for the Daggerheart TTRPG.
			</p>
			<p class=" text-muted-foreground">
				By accessing or using Daggerbrain (the "Service"), you agree to these Terms of Service
				("Terms") and our
				<a class="underline underline-offset-[0.2em] hover:text-accent" href="/privacy"
					>Privacy Policy</a
				>. If you do not agree, do not use the Service.
			</p>
		</header>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">1. Your Content, Your Rights</h2>
			<p class=" text-muted-foreground">
				You retain ownership of content you create, upload, publish, sell, or otherwise provide
				through Daggerbrain, including homebrew rules, characters, campaigns, images, text, files,
				and marketplace listings.
			</p>
			<ul class="ml-5 grid list-outside gap-[0.35rem]">
				<li class=" text-muted-foreground">
					<strong class="text-foreground">Ownership.</strong> We do not claim ownership over your content.
				</li>
				<li class=" text-muted-foreground">
					<strong class="text-foreground">License to Daggerbrain.</strong> By submitting content, you
					grant us a non-exclusive, worldwide license to host, store, reproduce, display, distribute,
					and promote that content as needed to operate, improve, and market the Service and the marketplace.
				</li>
				<li class=" text-muted-foreground">
					<strong class="text-foreground">Responsibility.</strong> You are responsible for your content
					and for ensuring that it complies with these Terms, applicable law, third-party rights, and
					any applicable game license or community content rules.
				</li>
				<li class=" text-muted-foreground">
					<strong class="text-foreground">No Exclusivity.</strong> Daggerbrain does not require exclusivity.
					You may share, sell, or publish your content on other platforms unless you separately agree
					otherwise in writing.
				</li>
			</ul>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">2. Marketplace Content</h2>
			<p class=" text-muted-foreground">
				Daggerbrain may allow users to list, sell, purchase, download, or otherwise access digital
				content through a marketplace. Marketplace creators are responsible for accurate listings,
				lawful content, support for their products, and honoring any representations made in their
				listings.
			</p>
			<p class=" text-muted-foreground">
				You may not upload or sell content that infringes intellectual property rights, violates
				applicable law, contains malicious files, misrepresents compatibility, or violates
				Daggerbrain policies. We may remove marketplace listings or suspend marketplace access at
				our discretion.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">3. Community Guidelines</h2>
			<p class=" text-muted-foreground">
				Users must help keep Daggerbrain useful, lawful, and respectful. You agree not to:
			</p>
			<ul class="ml-5 grid list-outside gap-[0.35rem]">
				<li class=" text-muted-foreground">Harass, threaten, abuse, or target other users.</li>
				<li class=" text-muted-foreground">
					Upload infringing, unlawful, deceptive, harmful, or malicious content.
				</li>
				<li class=" text-muted-foreground">
					Interfere with the Service, security systems, billing systems, or other users.
				</li>
				<li class=" text-muted-foreground">
					Attempt to access accounts, data, or systems without authorization.
				</li>
				<li class=" text-muted-foreground">
					Use the Service to distribute spam, scams, malware, or fraudulent listings.
				</li>
			</ul>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">4. Payments, Fees, and Stripe</h2>
			<p class=" text-muted-foreground">
				Daggerbrain may offer paid digital products, marketplace purchases, subscriptions, creator
				payouts, or other paid features. Payments are processed through Stripe or another
				third-party payment processor. Daggerbrain does not store full payment card details.
			</p>
			<p class=" text-muted-foreground">
				Prices, taxes, commissions, platform fees, payout timing, and creator eligibility rules may
				vary by product, location, or marketplace program. We may update fees or marketplace rules
				by posting changes in the Service or otherwise notifying affected users.
			</p>
			<p class=" text-muted-foreground">
				You are responsible for any taxes, duties, chargebacks, payment disputes, or compliance
				obligations that apply to your purchases, sales, creator earnings, or use of the Service.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">5. Refunds</h2>
			<p class=" text-muted-foreground">
				Most marketplace purchases are digital products that may be delivered or unlocked
				immediately. Because of that, refunds are limited and handled case by case.
			</p>
			<p class=" text-muted-foreground">Refunds may be considered when:</p>
			<ul class="ml-5 grid list-outside gap-[0.35rem]">
				<li class=" text-muted-foreground">
					The product was materially misrepresented in its listing.
				</li>
				<li class=" text-muted-foreground">
					The purchased file or content is missing, corrupted, or inaccessible.
				</li>
				<li class=" text-muted-foreground">The product was listed or sold in error.</li>
				<li class=" text-muted-foreground">
					Required compatibility or usage information was materially inaccurate.
				</li>
			</ul>
			<p class=" text-muted-foreground">Refunds generally will not be granted when:</p>
			<ul class="ml-5 grid list-outside gap-[0.35rem]">
				<li class=" text-muted-foreground">You changed your mind after purchase.</li>
				<li class=" text-muted-foreground">
					You successfully accessed or downloaded content that functions as described.
				</li>
				<li class=" text-muted-foreground">
					Your dissatisfaction is based on subjective preference rather than a listing fault.
				</li>
				<li class=" text-muted-foreground">
					You violated these Terms or attempted to abuse the refund process.
				</li>
			</ul>
			<p class=" text-muted-foreground">
				To request a refund, contact
				<a
					class="underline underline-offset-[0.2em] hover:text-accent"
					href="mailto:scribe@daggerbrain.com">scribe@daggerbrain.com</a
				> with the order details, a description of the issue, and any helpful screenshots or error messages.
				We may grant or deny refunds at our discretion, subject to applicable law and payment processor
				rules.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">6. Accounts and Security</h2>
			<p class=" text-muted-foreground">
				You are responsible for maintaining the confidentiality of your account credentials and for
				activity under your account. Notify us promptly if you believe your account has been
				compromised. We may suspend or restrict accounts to protect users, creators, the
				marketplace, or the Service.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">
				7. Daggerheart Compatibility and Third-Party Rights
			</h2>
			<p class=" text-muted-foreground">
				Daggerbrain is an independent platform and is not affiliated with, endorsed by, or sponsored
				by Darrington Press or Critical Role. Users are responsible for complying with any
				applicable Daggerheart licenses, community gaming terms, publisher guidelines, and
				third-party intellectual property rights.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">8. Service Changes and Availability</h2>
			<p class=" text-muted-foreground">
				We may modify, suspend, or discontinue parts of the Service at any time. We may also add,
				remove, or change features, marketplace categories, access rules, or content tools. We are
				not liable for interruptions, data loss, or changes except where required by law.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">9. Termination</h2>
			<p class=" text-muted-foreground">
				We may suspend or terminate accounts, remove content, restrict marketplace access, or take
				other action if we believe you violated these Terms, created risk for Daggerbrain or others,
				infringed third-party rights, or used the Service unlawfully. If you believe an action was
				taken in error, contact us at
				<a
					class="underline underline-offset-[0.2em] hover:text-accent"
					href="mailto:scribe@daggerbrain.com">scribe@daggerbrain.com</a
				>.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">10. Disclaimers</h2>
			<p class=" text-muted-foreground">
				The Service is provided "as is" and "as available." To the fullest extent permitted by law,
				we disclaim warranties of merchantability, fitness for a particular purpose,
				non-infringement, uninterrupted availability, and error-free operation.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">11. Limitation of Liability</h2>
			<p class=" text-muted-foreground">
				To the fullest extent permitted by law, Daggerbrain will not be liable for indirect,
				incidental, consequential, special, punitive, or exemplary damages, or for lost profits,
				revenue, data, goodwill, or business opportunities arising from your use of the Service.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">12. Changes to These Terms</h2>
			<p class=" text-muted-foreground">
				We may update these Terms from time to time. If we make material changes, we may provide
				notice through the Service or by other reasonable means. Continued use of Daggerbrain after
				updated Terms are posted means you accept the changes.
			</p>
		</section>

		<section class="space-y-4">
			<h2 class="border-b pb-3 text-xl font-bold">13. Contact Us</h2>
			<p class=" text-muted-foreground">
				Questions about these Terms can be sent to
				<a
					class="underline underline-offset-[0.2em] hover:text-accent"
					href="mailto:scribe@daggerbrain.com">scribe@daggerbrain.com</a
				>.
			</p>
		</section>
	</article>
</main>

<Footer />
