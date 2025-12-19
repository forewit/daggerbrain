import { z } from 'zod';
import {
	WeaponSchema,
	ArmorSchema,
	BeastformSchema,
	FeatureSchema,
	CharacterModifierSchema,
	WeaponModifierSchema,
	TraitIdsSchema,
	DamageTypesSchema
} from '$lib/compendium/compendium-schemas';

// ============================================================================
// Re-export existing schemas for validation
// ============================================================================

export { CharacterModifierSchema, WeaponModifierSchema, FeatureSchema };

// ============================================================================
// Weapon Form Schema - derives from WeaponSchema without auto-generated fields
// ============================================================================

export const WeaponFormSchema = WeaponSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	// Override with custom error messages
	title: z.string().min(1, 'Name is required'),
	available_traits: z.array(TraitIdsSchema).min(1, 'Select at least one trait'),
	available_damage_types: z.array(DamageTypesSchema).min(1, 'Select at least one damage type')
});

// ============================================================================
// Armor Form Schema - derives from ArmorSchema without auto-generated fields
// ============================================================================

export const ArmorFormSchema = ArmorSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	// Override with custom error messages
	title: z.string().min(1, 'Name is required')
});

// ============================================================================
// Beastform Form Schema - derives from BeastformSchema without auto-generated fields
// ============================================================================

export const BeastformFormSchema = BeastformSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	// Override with custom error messages
	name: z.string().min(1, 'Name is required'),
	category: z.string().min(1, 'Category is required')
});

// ============================================================================
// Type exports
// ============================================================================

export type WeaponFormData = z.infer<typeof WeaponFormSchema>;
export type ArmorFormData = z.infer<typeof ArmorFormSchema>;
export type BeastformFormData = z.infer<typeof BeastformFormSchema>;
export type FeatureFormData = z.infer<typeof FeatureSchema>;
export type CharacterModifierFormData = z.infer<typeof CharacterModifierSchema>;
export type WeaponModifierFormData = z.infer<typeof WeaponModifierSchema>;

// ============================================================================
// Error types for form fields
// ============================================================================

export type WeaponFormErrors = Partial<Record<keyof WeaponFormData | 'features', string>>;
export type ArmorFormErrors = Partial<Record<keyof ArmorFormData | 'features', string>>;
export type BeastformFormErrors = Partial<Record<keyof BeastformFormData | 'features', string>>;

// ============================================================================
// Helper to extract field errors from Zod error
// ============================================================================

export function extractFieldErrors<T extends Record<string, unknown>>(
	error: z.ZodError
): Partial<Record<keyof T, string>> {
	const errors: Partial<Record<keyof T, string>> = {};
	for (const issue of error.issues) {
		const path = issue.path[0];
		if (path && typeof path === 'string') {
			// Only take the first error for each field
			if (!errors[path as keyof T]) {
				errors[path as keyof T] = issue.message;
			}
		}
	}
	return errors;
}

