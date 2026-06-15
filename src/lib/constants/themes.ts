import sheetBackgroundCampaigns from '$lib/assets/images/art/verticals/campaigns-vertical.webp?enhanced';
import sheetBackgroundCharacters from '$lib/assets/images/art/verticals/characters-vertical.webp?enhanced';
import sheetBackgroundEncounters from '$lib/assets/images/art/verticals/encounters-vertical.webp?enhanced';
import sheetBackgroundForge from '$lib/assets/images/art/verticals/forge-vertical.webp?enhanced';
import sheetBackgroundStormy from '$lib/assets/images/art/verticals/stormy-vertical.webp?enhanced';
import type { SheetBackground, Theme } from '$lib/schemas/themes';

/**
 * background = same hue as primary at 15% saturation / 15% lightness
 *
  --colour-domain-grace-light:    #9f365d;
  --colour-domain-grace-dark:     #7c163c;
  --colour-domain-midnight-light: #1b686f;
  --colour-domain-midnight-dark:  #0b494f;
  --colour-domain-valor-light:    #df903c;
  --colour-domain-valor-dark:     #9c6020;
  --colour-domain-splendor-light: #9b8d1a;
  --colour-domain-splendor-dark:  #6a600c;
  --colour-domain-blade-light:    #8e1f13;
  --colour-domain-blade-dark:     #5c0e06;
  --colour-domain-bone-light:     #868686;
  --colour-domain-bone-dark:      #65625c;
  --colour-domain-sage-light:     #52822b;
  --colour-domain-sage-dark:      #346011;
  --colour-domain-codex-light:    #3262a2;
  --colour-domain-codex-dark:     #203f6a;
  --colour-domain-arcana-light:   #75509f;
  --colour-domain-arcana-dark:    #4a3067;

  https://leonardocolor.io/theme.html
Primary
#6b46c1
Arcana
#4e345b
Blade
#af231c
Bone
#a4a9a8
Codex
#24395d
Grace
#8d3965
Midnight
#1e201f
Sage
#244e30
Splendor
#b8a342
Valor
#e2680e
 */

export const THEMES = {
	default: {
		title: 'Default',
		background: '#19161e',
		foreground: '#ffffff',
		card: '#2e2b36',
		card_foreground: '#ffffff',
		muted: '#3d3c40',
		muted_foreground: '#b5b5b6',
		secondary: '#3d3c40',
		secondary_foreground: '#ffffff',

		primary: '#6542b5',
		primary_muted: '#33215c',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	arcana: {
		title: 'Arcana',
		background: '#181719',
		foreground: '#ffffff',
		card: '#2d2c2f',
		card_foreground: '#ffffff',
		muted: '#5a585c',
		muted_foreground: '#d6d6d6',
		secondary: '#5a585c',
		secondary_foreground: '#ffffff',

		primary: '#6b4992',
		primary_muted: '#352549',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	blade: {
		title: 'Blade',
		background: '#191716',
		foreground: '#ffffff',
		card: '#2f2c2b',
		card_foreground: '#ffffff',
		muted: '#5b5858',
		muted_foreground: '#d6d6d6',
		secondary: '#5b5858',
		secondary_foreground: '#ffffff',

		primary: '#ac221b',
		primary_muted: '#58120e',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	bone: {
		title: 'Bone',
		background: '#171717',
		foreground: '#ffffff',
		card: '#373737',
		card_foreground: '#ffffff',
		muted: '#595959',
		muted_foreground: '#fefefe',
		secondary: '#595959',
		secondary_foreground: '#ffffff',

		primary: '#949494',
		primary_muted: '#595959',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	codex: {
		title: 'Codex',
		background: '#161719',
		foreground: '#ffffff',
		card: '#2b2c2e',
		card_foreground: '#ffffff',
		muted: '#58595b',
		muted_foreground: '#d6d6d6',
		secondary: '#58595b',
		secondary_foreground: '#ffffff',

		primary: '#2e5994',
		primary_muted: '#1f3e66',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	grace: {
		title: 'Grace',
		background: '#191618',
		foreground: '#ffffff',
		card: '#2f2b2d',
		card_foreground: '#ffffff',
		muted: '#5c585a',
		muted_foreground: '#d6d6d6',
		secondary: '#5c585a',
		secondary_foreground: '#ffffff',

		primary: '#8e3c67',
		primary_muted: '#51213a',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	midnight: {
		title: 'Midnight',
		background: '#090909',
		foreground: '#ffffff',
		card: '#2b2d2c',
		card_foreground: '#ffffff',
		muted: '#585959',
		muted_foreground: '#d5d6d5',
		secondary: '#585959',
		secondary_foreground: '#ffffff',

		primary: '#585959',
		primary_muted: '#2b2d2c',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	sage: {
		title: 'Sage',
		background: '#09130c',
		foreground: '#ffffff',
		card: '#353836',
		card_foreground: '#ffffff',
		muted: '#565a57',
		muted_foreground: '#d5d6d6',
		secondary: '#565a57',
		secondary_foreground: '#ffffff',

		primary: 'hsl(138, 35%, 31%)',
		primary_muted: '#1d3e26',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	splendor: {
		title: 'Splendor',
		background: '#1d1d1b',
		foreground: '#ffffff',
		card: '#383835',
		card_foreground: '#ffffff',
		muted: '#5a5957',
		muted_foreground: '#d6d6d5',
		secondary: '#5a5957',
		secondary_foreground: '#ffffff',

		primary: '#857530',
		primary_muted: '#645924',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	},
	valor: {
		title: 'Valor',
		background: '#191716',
		foreground: '#ffffff',
		card: '#3e3c3b',
		card_foreground: '#ffffff',
		muted: '#5a5957',
		muted_foreground: '#d6d6d5',
		secondary: '#5a5957',
		secondary_foreground: '#ffffff',

		primary: '#904209',
		primary_muted: '#632e06',
		primary_foreground: '#ffffff',

		accent: '#fde07d',
		accent_muted: '#483c35',
		accent_foreground: '#ffffff',

		destructive: '#b83f3f',
		destructive_foreground: '#ffffff'
	}
} satisfies Record<string, Theme>;

export const CHARACTER_SHEET_BACKGROUNDS = {
	mountains: {
		title: 'Mountains',
		image: sheetBackgroundCharacters,
		preview_image_url: '/images/art/sheet-bg-previews/characters-bg-preview.webp'
	},
	forge: {
		title: 'Forge',
		image: sheetBackgroundForge,
		preview_image_url: '/images/art/sheet-bg-previews/forge-bg-preview.webp'
	},
	peaks: {
		title: 'Stormy',
		image: sheetBackgroundStormy,
		preview_image_url: '/images/art/sheet-bg-previews/stormy-bg-preview.webp'
	},
	rocky: {
		title: 'Rocky',
		image: sheetBackgroundEncounters,
		preview_image_url: '/images/art/sheet-bg-previews/encounters-bg-preview.webp'
	},
	maps: {
		title: 'Maps',
		image: sheetBackgroundCampaigns,
		preview_image_url: '/images/art/sheet-bg-previews/campaigns-bg-preview.webp'
	}
} satisfies Record<string, SheetBackground>;
