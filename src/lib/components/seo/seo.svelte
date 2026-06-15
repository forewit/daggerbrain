<script module lang="ts">
	export {
		CONTACT_EMAIL,
		DEFAULT_OG_IMAGE_ALT,
		DEFAULT_OG_IMAGE_PATH,
		DEFAULT_ROBOTS,
		PUBLIC_PAGE_DEFINITIONS,
		PUBLIC_PAGES,
		PUBLIC_ROUTE_DEFINITIONS,
		PRIVATE_ROBOTS,
		PRIVATE_ROUTE_DEFINITIONS,
		SITE_DESCRIPTION,
		SITE_LOCALE,
		SITE_NAME,
		buildPageSeo,
		buildRouteJsonLd,
		buildRouteSeo,
		createAbsoluteUrl,
		getPrivateRouteDefinitionByRouteId,
		getPublicPageDefinitionByRouteId,
		isPrivateRoute,
		normalizePublicOrigin,
		serializeJsonLd
	} from '$lib/components/seo/seo';
</script>

<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { page } from '$app/state';
	import {
		buildRouteJsonLd,
		buildRouteSeo,
		serializeJsonLd,
		type PageSeo
	} from '$lib/components/seo/seo';

	const routeId = $derived(page.route.id);
	const pathname = $derived(page.url.pathname);
	const seo = $derived(
		(page.data.seo as PageSeo | undefined) ?? buildRouteSeo(PUBLIC_ORIGIN, routeId, pathname)
	);
	const jsonLd = $derived(page.data.jsonLd ?? buildRouteJsonLd(PUBLIC_ORIGIN, routeId, seo));
	const serializedJsonLd = $derived(jsonLd ? serializeJsonLd(jsonLd) : null);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content={seo.robots} />
	<link rel="canonical" href={seo.canonical} />
	<meta property="og:site_name" content={seo.siteName} />
	<meta property="og:locale" content={seo.locale} />
	<meta property="og:type" content={seo.type} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.url} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:image:alt" content={seo.imageAlt} />
	{#if seo.type === 'article' && seo.article}
		<meta property="article:published_time" content={seo.article.publishedTime} />
		{#if seo.article.modifiedTime}
			<meta property="article:modified_time" content={seo.article.modifiedTime} />
		{/if}
		{#if seo.article.author}
			<meta property="article:author" content={seo.article.author} />
		{/if}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />
	{#if serializedJsonLd}
		{@html `<script type="application/ld+json">${serializedJsonLd}</script>`}
	{/if}
</svelte:head>
