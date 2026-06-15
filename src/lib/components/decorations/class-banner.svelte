<script lang="ts">
	import { cn } from '$lib/utils';
	import type { CharacterClass, CompendiumContent } from '@convex/schemas/compendium';
	import type { CharacterClassBanner } from '@convex/schemas/characters';
	import DomainIcon from './domain-icon.svelte';

	let {
		class: className = '',
		compendium,
		character_class,
		banner
	}: {
		compendium?: CompendiumContent;
		class?: string;
		character_class?: CharacterClass;
		banner?: CharacterClassBanner;
	} = $props();

	const primaryDomain = $derived(
		banner?.primary_domain ??
			(character_class?.primary_domain_id && compendium
				? compendium.domains[character_class.primary_domain_id]
				: undefined)
	);
	const secondaryDomain = $derived(
		banner?.secondary_domain ??
			(character_class?.secondary_domain_id && compendium
				? compendium.domains[character_class.secondary_domain_id]
				: undefined)
	);
</script>

<div class={cn('relative flex h-[120px] w-[75px] flex-col', className)}>
	<div class="z-40 h-[120px] w-[75px]">
		<img class="h-full w-full" src="/images/card/banner.webp" alt="banner" />
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-1 pt-0.5 pb-3"
			style="color: {primaryDomain?.foreground_color || '#000000'};"
		>
			{#if primaryDomain}
				<DomainIcon domain={primaryDomain} class="size-9" />
			{/if}
			{#if secondaryDomain}
				<DomainIcon domain={secondaryDomain} class="size-9" />
			{/if}
		</div>
	</div>

	{#if primaryDomain}
		<div
			class="clip-banner-fg absolute top-0 left-1/2 z-30 aspect-[71/120] h-[120px] -translate-x-1/2"
			style="--domain-color: {primaryDomain.color}; background: linear-gradient(
						  to top,
						  var(--domain-color) 75%,
						  color-mix(in srgb, var(--domain-color), white 30%) 100%
						);"
		></div>
	{/if}
	<div
		class="clip-banner-fg pointer-events-none absolute top-0 left-1/2 z-35 aspect-[71/120] h-[120px] -translate-x-1/2"
		aria-hidden="true"
		style="background-image: url(&quot;data:image/svg+xml,%3Csvg%20width%3D'20'%20height%3D'20'%20viewBox%3D'0%200%2020%2020'%20fill%3D'none'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Ccircle%20cx%3D'0.6401056540959615'%20cy%3D'11.434160724313845'%20r%3D'0.2531242930874258'%20fill%3D'gold'%20fill-opacity%3D'0.4743281003476656'%20%2F%3E%3Ccircle%20cx%3D'11.331703562443176'%20cy%3D'0.24525070116778735'%20r%3D'0.2789852491760728'%20fill%3D'white'%20fill-opacity%3D'0.4804709236562582'%20%2F%3E%3Ccircle%20cx%3D'6.476668331334063'%20cy%3D'16.013904006498127'%20r%3D'0.28780251578411453'%20fill%3D'white'%20fill-opacity%3D'0.3518394525541304'%20%2F%3E%3Ccircle%20cx%3D'17.15028577192353'%20cy%3D'9.154897748235054'%20r%3D'0.2836384361283214'%20fill%3D'gold'%20fill-opacity%3D'0.6927216242006968'%20%2F%3E%3Ccircle%20cx%3D'19.84205964626508'%20cy%3D'4.574934863447016'%20r%3D'0.18029324130158877'%20fill%3D'white'%20fill-opacity%3D'0.6659346443570415'%20%2F%3E%3Ccircle%20cx%3D'8.349032621466389'%20cy%3D'0.5941819599839215'%20r%3D'0.2023054107755437'%20fill%3D'gold'%20fill-opacity%3D'0.3276963987983708'%20%2F%3E%3Ccircle%20cx%3D'1.0690717834533436'%20cy%3D'8.52273292848068'%20r%3D'0.21091573063768776'%20fill%3D'white'%20fill-opacity%3D'0.4042383019532291'%20%2F%3E%3Ccircle%20cx%3D'9.767288429781713'%20cy%3D'8.320180416349832'%20r%3D'0.2946649534923014'%20fill%3D'white'%20fill-opacity%3D'0.355247959506062'%20%2F%3E%3Ccircle%20cx%3D'17.86583006025632'%20cy%3D'18.203599826642773'%20r%3D'0.23955723634474813'%20fill%3D'gold'%20fill-opacity%3D'0.6560105190579566'%20%2F%3E%3Ccircle%20cx%3D'3.3509434149132167'%20cy%3D'18.07453764558594'%20r%3D'0.1872755201565918'%20fill%3D'gold'%20fill-opacity%3D'0.5508366660022272'%20%2F%3E%3Ccircle%20cx%3D'11.564119799923546'%20cy%3D'4.833059254041563'%20r%3D'0.2915107336811408'%20fill%3D'white'%20fill-opacity%3D'0.3716797301768985'%20%2F%3E%3Ccircle%20cx%3D'8.530537880250133'%20cy%3D'8.591384089483205'%20r%3D'0.11126256125368013'%20fill%3D'gold'%20fill-opacity%3D'0.5506360419056335'%20%2F%3E%3Ccircle%20cx%3D'15.496099609772187'%20cy%3D'19.657931570396748'%20r%3D'0.25857314981972696'%20fill%3D'gold'%20fill-opacity%3D'0.4856952324032756'%20%2F%3E%3Ccircle%20cx%3D'2.5170042382707813'%20cy%3D'10.37704447421155'%20r%3D'0.19111420663715548'%20fill%3D'gold'%20fill-opacity%3D'0.5891591208962346'%20%2F%3E%3Ccircle%20cx%3D'17.726364524141903'%20cy%3D'6.535069375446028'%20r%3D'0.24139320903641337'%20fill%3D'white'%20fill-opacity%3D'0.40185840845638054'%20%2F%3E%3Ccircle%20cx%3D'3.425904820168051'%20cy%3D'4.606771122655376'%20r%3D'0.19224914081616565'%20fill%3D'gold'%20fill-opacity%3D'0.3228310232048942'%20%2F%3E%3Ccircle%20cx%3D'6.2541252188986824'%20cy%3D'7.301982472782925'%20r%3D'0.11307573595769356'%20fill%3D'white'%20fill-opacity%3D'0.5110685726386395'%20%2F%3E%3Ccircle%20cx%3D'10.169917496788178'%20cy%3D'9.916206390591991'%20r%3D'0.20983890149285775'%20fill%3D'gold'%20fill-opacity%3D'0.5198354003519962'%20%2F%3E%3Ccircle%20cx%3D'13.560970965266478'%20cy%3D'18.46261763078004'%20r%3D'0.2343139389693616'%20fill%3D'white'%20fill-opacity%3D'0.3000057354055588'%20%2F%3E%3Ccircle%20cx%3D'18.87345668133844'%20cy%3D'1.4991532176123146'%20r%3D'0.2576587955850146'%20fill%3D'white'%20fill-opacity%3D'0.3624512666877315'%20%2F%3E%3Ccircle%20cx%3D'19.74325210425174'%20cy%3D'12.314905177532411'%20r%3D'0.21109762034740814'%20fill%3D'white'%20fill-opacity%3D'0.6457451728783059'%20%2F%3E%3Ccircle%20cx%3D'12.140080164835867'%20cy%3D'14.197169682551332'%20r%3D'0.20038775639943132'%20fill%3D'gold'%20fill-opacity%3D'0.588762166543596'%20%2F%3E%3Ccircle%20cx%3D'17.82141473882229'%20cy%3D'8.895399177863986'%20r%3D'0.22042403369178123'%20fill%3D'white'%20fill-opacity%3D'0.6487762549535774'%20%2F%3E%3Ccircle%20cx%3D'4.073103577301569'%20cy%3D'6.8101763578707235'%20r%3D'0.15727434552052677'%20fill%3D'white'%20fill-opacity%3D'0.5768084852581519'%20%2F%3E%3Ccircle%20cx%3D'1.251426243131144'%20cy%3D'0.7421006066945601'%20r%3D'0.1195487022860786'%20fill%3D'gold'%20fill-opacity%3D'0.33942313366647225'%20%2F%3E%3Ccircle%20cx%3D'7.816255204374876'%20cy%3D'18.385124146613016'%20r%3D'0.23921726321964348'%20fill%3D'white'%20fill-opacity%3D'0.4184546982239089'%20%2F%3E%3Ccircle%20cx%3D'16.50205191889498'%20cy%3D'16.8833462836571'%20r%3D'0.16166668588275576'%20fill%3D'gold'%20fill-opacity%3D'0.42092699325971533'%20%2F%3E%3Ccircle%20cx%3D'16.68387872116769'%20cy%3D'18.96927434341072'%20r%3D'0.29110910481451424'%20fill%3D'white'%20fill-opacity%3D'0.5063333754177138'%20%2F%3E%3Ccircle%20cx%3D'15.023142328323786'%20cy%3D'13.415891445533742'%20r%3D'0.10148447547862723'%20fill%3D'gold'%20fill-opacity%3D'0.5729584226257675'%20%2F%3E%3Ccircle%20cx%3D'18.534727547862445'%20cy%3D'11.119003450375633'%20r%3D'0.2780781627271819'%20fill%3D'white'%20fill-opacity%3D'0.6922715467747051'%20%2F%3E%3Ccircle%20cx%3D'17.700915327314966'%20cy%3D'2.0710614189457033'%20r%3D'0.1004366390986437'%20fill%3D'white'%20fill-opacity%3D'0.31283722263336505'%20%2F%3E%3Ccircle%20cx%3D'15.095295933254318'%20cy%3D'14.97619082618452'%20r%3D'0.23425485690281914'%20fill%3D'white'%20fill-opacity%3D'0.5649589415607341'%20%2F%3E%3Ccircle%20cx%3D'16.47389327948051'%20cy%3D'12.413383895871242'%20r%3D'0.29529938006385126'%20fill%3D'gold'%20fill-opacity%3D'0.3943529776278617'%20%2F%3E%3Ccircle%20cx%3D'2.9401519795875175'%20cy%3D'19.883069657469328'%20r%3D'0.12944471822793535'%20fill%3D'white'%20fill-opacity%3D'0.39539164980968355'%20%2F%3E%3Ccircle%20cx%3D'11.875698822025914'%20cy%3D'13.99835964027756'%20r%3D'0.21694843160153973'%20fill%3D'white'%20fill-opacity%3D'0.3762913745478643'%20%2F%3E%3Ccircle%20cx%3D'4.442343497227248'%20cy%3D'4.553992472846815'%20r%3D'0.10980527532331237'%20fill%3D'white'%20fill-opacity%3D'0.4802306304908489'%20%2F%3E%3Ccircle%20cx%3D'19.265909249906326'%20cy%3D'6.545257917369563'%20r%3D'0.23643314950138705'%20fill%3D'gold'%20fill-opacity%3D'0.5682379884249043'%20%2F%3E%3Ccircle%20cx%3D'3.376104698269693'%20cy%3D'9.929952967006312'%20r%3D'0.1528625510191028'%20fill%3D'white'%20fill-opacity%3D'0.4853996414862386'%20%2F%3E%3Ccircle%20cx%3D'9.778329601492327'%20cy%3D'17.69215858428231'%20r%3D'0.11292745022231775'%20fill%3D'gold'%20fill-opacity%3D'0.4014907214892426'%20%2F%3E%3Ccircle%20cx%3D'8.324673176330016'%20cy%3D'17.516323633587348'%20r%3D'0.1610359374998377'%20fill%3D'gold'%20fill-opacity%3D'0.4304477686832915'%20%2F%3E%3Ccircle%20cx%3D'14.038096805385962'%20cy%3D'7.098862000834467'%20r%3D'0.16489371606064618'%20fill%3D'gold'%20fill-opacity%3D'0.43764378164949036'%20%2F%3E%3Ccircle%20cx%3D'8.952601635144754'%20cy%3D'17.329933169824262'%20r%3D'0.20643194089591763'%20fill%3D'white'%20fill-opacity%3D'0.6010619441548901'%20%2F%3E%3Ccircle%20cx%3D'2.3783119842942524'%20cy%3D'14.927184949145744'%20r%3D'0.2899046736258253'%20fill%3D'gold'%20fill-opacity%3D'0.48447137960282766'%20%2F%3E%3Ccircle%20cx%3D'1.985245266040272'%20cy%3D'2.964969619118807'%20r%3D'0.1894017293081255'%20fill%3D'gold'%20fill-opacity%3D'0.3821405118429347'%20%2F%3E%3Ccircle%20cx%3D'3.22654017068156'%20cy%3D'4.525449329078497'%20r%3D'0.1630930483698091'%20fill%3D'white'%20fill-opacity%3D'0.3258734929619179'%20%2F%3E%3Ccircle%20cx%3D'16.872845565810135'%20cy%3D'12.589568912878246'%20r%3D'0.1753679535021178'%20fill%3D'white'%20fill-opacity%3D'0.31995710387730253'%20%2F%3E%3Ccircle%20cx%3D'13.958767440024612'%20cy%3D'11.821188802314651'%20r%3D'0.17461268377214095'%20fill%3D'white'%20fill-opacity%3D'0.5792256470930393'%20%2F%3E%3Ccircle%20cx%3D'18.715404780841098'%20cy%3D'16.67501167759567'%20r%3D'0.14449138660452762'%20fill%3D'white'%20fill-opacity%3D'0.6491554355187277'%20%2F%3E%3Ccircle%20cx%3D'19.12834391935478'%20cy%3D'19.310936567858217'%20r%3D'0.25333885622667385'%20fill%3D'gold'%20fill-opacity%3D'0.43239542987699753'%20%2F%3E%3Ccircle%20cx%3D'18.626467644315678'%20cy%3D'17.066603382367237'%20r%3D'0.1573720333600674'%20fill%3D'gold'%20fill-opacity%3D'0.34868905771658354'%20%2F%3E%3C%2Fsvg%3E&quot;); background-repeat: repeat; background-size: 40px 40px; mix-blend-mode: screen; opacity: 0.25;"
	></div>
	{#if secondaryDomain}
		<div
			class="clip-banner-bg absolute top-0 left-1/2 z-20 aspect-[71/120] h-[120px] -translate-x-1/2"
			style="background: {secondaryDomain.color};"
		></div>
	{/if}
</div>

<style>
	.clip-banner-bg {
		clip-path: polygon(
			92% 100%,
			92% 0,
			8% 0,
			8% 100%,
			28% 98%,
			39% 96%,
			47% 91%,
			44% 95%,
			48% 85%,
			50% 81%,
			56% 85%,
			53% 90%,
			57% 92%,
			60% 95%,
			67% 98%,
			78% 100%
		);
	}
	.clip-banner-fg {
		clip-path: polygon(
			0 0,
			11% 1%,
			11% 51%,
			17% 55%,
			18% 0,
			82% 0,
			83% 56%,
			88% 52%,
			88% 0,
			100% 1%,
			100% 58%,
			83% 69%,
			82% 90%,
			72% 90%,
			63% 88%,
			57% 85%,
			49% 82%,
			43% 85%,
			34% 88%,
			25% 90%,
			18% 90%,
			17% 68%,
			0 59%
		);
	}
</style>
