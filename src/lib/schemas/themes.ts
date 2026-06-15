import { z } from 'zod';

export type EnhancedImage = unknown;

export const ThemeSchema = z.object({
	title: z.string(),
	background: z.string(),
	foreground: z.string(),
	card: z.string(),
	card_foreground: z.string(),
	primary: z.string(),
	primary_foreground: z.string(),
	primary_muted: z.string(),
	secondary: z.string(),
	secondary_foreground: z.string(),
	accent: z.string(),
	accent_foreground: z.string(),
	accent_muted: z.string(),
	destructive: z.string(),
	destructive_foreground: z.string(),
	muted: z.string(),
	muted_foreground: z.string()
});
export type Theme = z.infer<typeof ThemeSchema>;

export const SheetBackgroundSchema = z.object({
	title: z.string(),
	image: z.custom<EnhancedImage>(),
	preview_image_url: z.string()
});
export type SheetBackground = z.infer<typeof SheetBackgroundSchema>;
