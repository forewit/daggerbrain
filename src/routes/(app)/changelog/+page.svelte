<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { artMountains } from '$lib/assets/images';
	import type { PageProps } from './$types';
	import ArticleContent from '$lib/articles/article-content.svelte';
	import ArticleToc from '$lib/articles/article-toc.svelte';
	import Footer from '$lib/components/navigation/footer.svelte';

	let { data }: PageProps = $props();

	let articleElement = $state<HTMLElement | null>(null);
	let headings = $derived(data.post.headings);
	let activeHeadingId = $state('');
	let selectedHeadingId = $state('');
	let anchoredHeadingId = $state<string | null>(null);
	let pendingHeadingId = $state<string | null>(null);
	let scrollLockTimeout: number | undefined;
	const stickyOffset = 16;

	function getHeadingScrollTop(element: HTMLElement) {
		const navbarHeight = Number.parseFloat(
			getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
		);
		const offset = (Number.isFinite(navbarHeight) ? navbarHeight : 0) + stickyOffset;
		return element.getBoundingClientRect().top + window.scrollY - offset;
	}

	function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth') {
		if (!id || typeof window === 'undefined' || typeof document === 'undefined') {
			return;
		}

		const element = document.getElementById(id);
		if (!element) {
			return;
		}

		if (scrollLockTimeout) {
			clearTimeout(scrollLockTimeout);
		}

		pendingHeadingId = id;
		anchoredHeadingId = id;
		window.scrollTo({
			top: getHeadingScrollTop(element),
			behavior
		});
		window.history.replaceState(window.history.state, '', `#${id}`);
		selectedHeadingId = id;
		activeHeadingId = id;

		if (behavior === 'smooth') {
			scrollLockTimeout = window.setTimeout(() => {
				pendingHeadingId = null;
			}, 1500);
		} else {
			pendingHeadingId = null;
			scrollLockTimeout = undefined;
		}
	}

	function maybeReleasePendingHeading() {
		if (!pendingHeadingId || typeof window === 'undefined') {
			return;
		}

		const element = document.getElementById(pendingHeadingId);
		if (!element) {
			pendingHeadingId = null;
			return;
		}

		const rect = element.getBoundingClientRect();
		if (rect.top >= -80 && rect.top <= 80) {
			pendingHeadingId = null;
			if (scrollLockTimeout) {
				clearTimeout(scrollLockTimeout);
				scrollLockTimeout = undefined;
			}
		}
	}

	onMount(() => {
		if (!articleElement) {
			return;
		}

		let disposed = false;
		let mutationObserver: MutationObserver | undefined;
		const handleScroll = () => {
			maybeReleasePendingHeading();
		};
		const observer = new IntersectionObserver(
			(entries) => {
				if (pendingHeadingId) {
					return;
				}

				if (anchoredHeadingId) {
					const anchoredElement = document.getElementById(anchoredHeadingId);
					if (anchoredElement) {
						const rect = anchoredElement.getBoundingClientRect();
						if (rect.bottom > 0 && rect.top < window.innerHeight) {
							activeHeadingId = anchoredHeadingId;
							selectedHeadingId = anchoredHeadingId;
							return;
						}
					}

					anchoredHeadingId = null;
				}

				const visibleEntries = entries
					.filter((entry) => entry.isIntersecting)
					.sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

				if (visibleEntries.length === 0) {
					return;
				}

				const currentId = (visibleEntries[0]?.target as HTMLElement | undefined)?.id ?? '';

				if (!currentId) {
					return;
				}

				activeHeadingId = currentId;
				selectedHeadingId = currentId;
			},
			{
				rootMargin: '0px 0px -70% 0px',
				threshold: 0
			}
		);

		async function initializeHeadings() {
			await tick();

			if (disposed) {
				return;
			}

			let headingElements = Array.from(
				articleElement!.querySelectorAll<HTMLElement>('h2, h3, h4, h5, h6')
			);
			for (const [index, heading] of headingElements.entries()) {
				const dataHeading = headings[index];
				if (dataHeading) {
					heading.id = dataHeading.id;
				}
			}
			const hashHeadingId = window.location.hash.slice(1);
			const initialHeadingId = hashHeadingId || headings[0]?.id || '';

			activeHeadingId = initialHeadingId;
			selectedHeadingId = initialHeadingId;

			if (hashHeadingId) {
				anchoredHeadingId = hashHeadingId;
				scrollToHeading(hashHeadingId, 'auto');
			}

			for (const heading of headingElements) {
				observer.observe(heading);
			}

			mutationObserver = new MutationObserver(async () => {
				await tick();

				if (disposed) {
					return;
				}

				observer.disconnect();
				headingElements = Array.from(
					articleElement!.querySelectorAll<HTMLElement>('h2, h3, h4, h5, h6')
				);
				for (const [index, heading] of headingElements.entries()) {
					const dataHeading = headings[index];
					if (dataHeading) {
						heading.id = dataHeading.id;
					}
				}

				for (const heading of headingElements) {
					observer.observe(heading);
				}

				if (!activeHeadingId && headings[0]?.id) {
					activeHeadingId = headings[0].id;
					selectedHeadingId = headings[0].id;
				}
			});

			mutationObserver.observe(articleElement!, { childList: true, subtree: true });
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		void initializeHeadings();

		return () => {
			disposed = true;
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
			mutationObserver?.disconnect();
			if (scrollLockTimeout) {
				clearTimeout(scrollLockTimeout);
			}
		};
	});
</script>

<div class="relative min-h-[calc(100dvh-var(--navbar-height,3.5rem))]">
	<div
		class="forest-fade-container pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-full w-full overflow-hidden"
	>
		<enhanced:img
			src={artMountains}
			alt=""
			fetchpriority="high"
			sizes="100vw"
			class="forest-fade-container h-full w-full object-cover object-bottom"
		/>
	</div>

	<main class="relative z-10 mx-auto w-full max-w-6xl p-4 lg:grid lg:grid-cols-[260px_1fr] lg:pr-6">
		<ArticleToc
			{headings}
			{activeHeadingId}
			headerLevel={2}
			bind:selectedHeadingId
			onSelect={scrollToHeading}
		/>

		<div>
			<header class="mt-2 mb-4">
				<h1 class="m-0 text-3xl font-bold">Changelog</h1>
			</header>
			<ArticleContent Content={data.Content} bind:articleElement />
		</div>
	</main>
</div>
<Footer />

<style>
	.forest-fade-container {
		mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
	}
</style>
