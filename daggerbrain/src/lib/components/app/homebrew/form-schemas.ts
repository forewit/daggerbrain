import { z } from 'zod';
import {
	WeaponSchema,
	ArmorSchema,
	BeastformSchema,
	FeatureSchema,
	CharacterModifierSchema,
	WeaponModifierSchema,
	TraitIdsSchema,
	DamageTypesSchema,
	LootSchema,
	ConsumableSchema,
	ClassSchema,
	SubclassSchema,
	DomainCardSchema,
	AncestryCardSchema,
	CommunityCardSchema,
	TransformationCardSchema
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
// Loot Form Schema
// ============================================================================

export const LootFormSchema = LootSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required'),
	rarity_roll: z.number().min(1).max(20)
});

// ============================================================================
// Consumable Form Schema
// ============================================================================

export const ConsumableFormSchema = ConsumableSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required'),
	rarity_roll: z.number().min(1).max(20)
});

// ============================================================================
// Class Form Schema
// ============================================================================

export const ClassFormSchema = ClassSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	name: z.string().min(1, 'Name is required')
});

// ============================================================================
// Subclass Form Schema
// ============================================================================

export const SubclassFormSchema = SubclassSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	name: z.string().min(1, 'Name is required')
});

// ============================================================================
// Domain Card Form Schema
// ============================================================================

export const DomainCardFormSchema = DomainCardSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required')
});

// ============================================================================
// Ancestry Card Form Schema
// ============================================================================

export const AncestryCardFormSchema = AncestryCardSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required')
});

// ============================================================================
// Community Card Form Schema
// ============================================================================

export const CommunityCardFormSchema = CommunityCardSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required')
});

// ============================================================================
// Transformation Card Form Schema
// ============================================================================

export const TransformationCardFormSchema = TransformationCardSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required')
});

// ============================================================================
// Type exports
// ============================================================================

export type WeaponFormData = z.infer<typeof WeaponFormSchema>;
export type ArmorFormData = z.infer<typeof ArmorFormSchema>;
export type BeastformFormData = z.infer<typeof BeastformFormSchema>;
export type LootFormData = z.infer<typeof LootFormSchema>;
export type ConsumableFormData = z.infer<typeof ConsumableFormSchema>;
export type ClassFormData = z.infer<typeof ClassFormSchema>;
export type SubclassFormData = z.infer<typeof SubclassFormSchema>;
export type DomainCardFormData = z.infer<typeof DomainCardFormSchema>;
export type AncestryCardFormData = z.infer<typeof AncestryCardFormSchema>;
export type CommunityCardFormData = z.infer<typeof CommunityCardFormSchema>;
export type TransformationCardFormData = z.infer<typeof TransformationCardFormSchema>;
export type FeatureFormData = z.infer<typeof FeatureSchema>;
export type CharacterModifierFormData = z.infer<typeof CharacterModifierSchema>;
export type WeaponModifierFormData = z.infer<typeof WeaponModifierSchema>;

// ============================================================================
// Error types for form fields
// ============================================================================

export type WeaponFormErrors = Partial<Record<keyof WeaponFormData | 'features', string>>;
export type ArmorFormErrors = Partial<Record<keyof ArmorFormData | 'features', string>>;
export type BeastformFormErrors = Partial<Record<keyof BeastformFormData | 'features', string>>;
export type LootFormErrors = Partial<Record<keyof LootFormData, string>>;
export type ConsumableFormErrors = Partial<Record<keyof ConsumableFormData, string>>;
export type ClassFormErrors = Partial<Record<keyof ClassFormData | 'hope_feature' | 'class_features', string>>;
export type SubclassFormErrors = Partial<Record<keyof SubclassFormData | 'foundation_card' | 'specialization_card' | 'mastery_card', string>>;
export type DomainCardFormErrors = Partial<Record<keyof DomainCardFormData | 'features', string>>;
export type AncestryCardFormErrors = Partial<Record<keyof AncestryCardFormData | 'features', string>>;
export type CommunityCardFormErrors = Partial<Record<keyof CommunityCardFormData | 'features', string>>;
export type TransformationCardFormErrors = Partial<Record<keyof TransformationCardFormData | 'features', string>>;

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

