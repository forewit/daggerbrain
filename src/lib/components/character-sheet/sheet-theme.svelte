<script lang="ts">
	import { THEMES } from '$lib/constants/themes';
	import type { Theme } from '$lib/schemas/themes';
	import {
		createThemePortalTargetStore,
		setThemePortalTargetContext
	} from '$lib/components/ui/theme-portal';
	import type { Snippet } from 'svelte';

	type ThemeId = keyof typeof THEMES;
	type ThemeCssVariable =
		| '--background'
		| '--foreground'
		| '--card'
		| '--card-foreground'
		| '--ring'
		| '--input'
		| '--border'
		| '--popover'
		| '--popover-foreground'
		| '--primary'
		| '--primary-muted'
		| '--primary-muted-light'
		| '--primary-foreground'
		| '--destructive'
		| '--destructive-foreground'
		| '--secondary'
		| '--secondary-foreground'
		| '--muted'
		| '--muted-foreground'
		| '--accent'
		| '--accent-muted'
		| '--accent-foreground';

	function isThemeId(value: string): value is ThemeId {
		return value in THEMES;
	}

	function getThemeCssVarEntries(theme: Theme): Array<[ThemeCssVariable, string]> {
		return [
			['--background', theme.background],
			['--foreground', theme.foreground],
			['--card', theme.card],
			['--card-foreground', theme.card_foreground],
			['--primary', theme.primary],
			['--primary-muted', theme.primary_muted],
			['--primary-muted-light', theme.primary_muted],
			['--primary-foreground', theme.primary_foreground],
			['--destructive', theme.destructive],
			['--destructive-foreground', theme.destructive_foreground],
			['--secondary', theme.secondary],
			['--secondary-foreground', theme.secondary_foreground],
			['--muted', theme.muted],
			['--muted-foreground', theme.muted_foreground],
			['--accent', theme.accent],
			['--accent-muted', theme.accent_muted],
			['--accent-foreground', theme.accent_foreground],
			['--ring', 'rgb(from var(--primary) r g b / 0.302)'],
			['--input', 'rgb(from var(--primary) r g b / 0.102)'],
			['--border', 'var(--primary-muted)'],
			['--popover', 'var(--card)'],
			['--popover-foreground', 'var(--card-foreground)']
		];
	}

	let {
		id,
		children
	}: {
		id?: string;
		children?: Snippet;
	} = $props();

	const theme = $derived(id && isThemeId(id) ? THEMES[id] : undefined);
	const portalTargetStore = createThemePortalTargetStore();
	setThemePortalTargetContext(portalTargetStore);
	let portalTarget: HTMLDivElement | null = $state(null);
	const themeCssVariables = $derived.by(() => {
		if (!theme) return undefined;

		return getThemeCssVarEntries(theme)
			.map(([propertyName, value]) => `${propertyName}: ${value}`)
			.join('; ');
	});
	const activeThemeId = $derived(id && isThemeId(id) ? id : undefined);

	$effect(() => {
		portalTargetStore.set(portalTarget);
	});
</script>

<div class="contents" style={themeCssVariables} data-character-sheet-theme={activeThemeId}>
	<div bind:this={portalTarget}></div>
	{@render children?.()}
</div>
