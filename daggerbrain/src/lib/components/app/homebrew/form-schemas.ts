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
} from '@shared/schemas/compendium.schemas';

// ============================================================================
// Re-export existing schemas for validation
// ============================================================================

export { CharacterModifierSchema, WeaponModifierSchema, FeatureSchema };

/** Error message when domain_card_choice condition is set but choice_id is empty. */
export const CONDITIONS_CHOICE_REQUIRED = 'Conditions: Choice is required';

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
}).superRefine((data, ctx) => {
	// Validate that all arbitrary choices have non-empty and unique choice_id values
	const arbitraryChoices = data.choices.filter(c => c.type === 'arbitrary');
	const nameCounts = new Map<string, number>();
	
	// Count occurrences of each name (case-insensitive, trimmed)
	arbitraryChoices.forEach((choice) => {
		const name = choice.choice_id.trim();
		const normalizedName = name.toLowerCase();
		nameCounts.set(normalizedName, (nameCounts.get(normalizedName) || 0) + 1);
	});
	
	// Check for blank and duplicate names
	arbitraryChoices.forEach((choice, index) => {
		const name = choice.choice_id.trim();
		const normalizedName = name.toLowerCase();
		
		if (!name) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['choices', index, 'choice_id'],
				message: 'Name is required'
			});
		} else if (nameCounts.get(normalizedName)! > 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['choices', index, 'choice_id'],
				message: 'Name must be unique'
			});
		}
	});
});

// ============================================================================
// Ancestry Card Form Schema
// ============================================================================

export const AncestryCardFormSchema = AncestryCardSchema.omit({
	compendium_id: true,
	source_id: true
}).extend({
	title: z.string().min(1, 'Name is required')
}).superRefine((data, ctx) => {
	// Validate that all arbitrary choices have non-empty and unique choice_id values
	const arbitraryChoices = data.choices.filter(c => c.type === 'arbitrary');
	const nameCounts = new Map<string, number>();
	
	// Count occurrences of each name (case-insensitive, trimmed)
	arbitraryChoices.forEach((choice) => {
		const name = choice.choice_id.trim();
		const normalizedName = name.toLowerCase();
		nameCounts.set(normalizedName, (nameCounts.get(normalizedName) || 0) + 1);
	});
	
	// Check for blank and duplicate names, and validate feature_index
	data.choices.forEach((choice, index) => {
		const name = choice.choice_id.trim();
		const normalizedName = name.toLowerCase();
		
		// Check for blank choice_id
		if (!name) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['choices', index, 'choice_id'],
				message: 'Name is required'
			});
		}
		
		// Check for duplicate names (only for arbitrary choices)
		if (choice.type === 'arbitrary' && nameCounts.get(normalizedName)! > 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['choices', index, 'choice_id'],
				message: 'Name must be unique'
			});
		}
		
		// Validate feature_index is within bounds
		if (choice.feature_index < 0 || choice.feature_index >= data.features.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['choices', index, 'feature_index'],
				message: `Feature index must be between 0 and ${data.features.length - 1}`
			});
		}
	});
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
export type ClassFormErrors = Partial<
	Record<keyof ClassFormData | 'hope_feature' | 'class_features', string>
>;
export type SubclassFormErrors = Partial<
	Record<
		keyof SubclassFormData | 'foundation_card' | 'specialization_card' | 'mastery_card',
		string
	>
>;
export type DomainCardFormErrors = Partial<Record<keyof DomainCardFormData | 'features', string>>;
export type AncestryCardFormErrors = Partial<
	Record<keyof AncestryCardFormData | 'features' | 'choices', string>
>;
export type CommunityCardFormErrors = Partial<
	Record<keyof CommunityCardFormData | 'features', string>
>;
export type TransformationCardFormErrors = Partial<
	Record<keyof TransformationCardFormData | 'features', string>
>;

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

// ============================================================================
// Helper to extract nested validation errors from Feature validation
// Returns errors for character_modifiers and weapon_modifiers arrays
// ============================================================================

export type FeatureValidationErrors = {
	character_modifiers?: Map<number, string[]>;
	weapon_modifiers?: Map<number, string[]>;
	title?: string;
	description_html?: string;
};

/**
 * Helper to process modifier errors and build user-friendly messages
 */
function processModifierError(
	issue: z.ZodError['issues'][number],
	fieldPath: readonly PropertyKey[],
	targetField: 'target' | 'target_stat',
	requiredMessage: string
): string {
	const nestedPath = fieldPath.slice(2);

	if (nestedPath.length > 0) {
		const fieldName = nestedPath.map(String).join('.');
		if (fieldName === targetField || issue.message.includes(targetField)) {
			return requiredMessage;
		}
		return `${fieldName}: ${issue.message}`;
	}

	// Handle discriminated union errors (missing target/target_stat)
	if (issue.message.includes(targetField) || issue.code === 'invalid_union') {
		return requiredMessage;
	}

	return issue.message;
}

export function extractFeatureErrors(error: z.ZodError): FeatureValidationErrors {
	const errors: FeatureValidationErrors = {};

	for (const issue of error.issues) {
		const path = issue.path;

		if (path.length === 0) continue;

		const [firstPath, secondPath] = path;

		// Handle character_modifiers errors
		if (firstPath === 'character_modifiers' && typeof secondPath === 'number') {
			const modifierIndex = secondPath;
			if (!errors.character_modifiers) {
				errors.character_modifiers = new Map();
			}
			const existingErrors = errors.character_modifiers.get(modifierIndex) || [];
			const errorMessage = processModifierError(
				issue,
				path,
				'target',
				'Character attribute to modify is required'
			);
			errors.character_modifiers.set(modifierIndex, [...existingErrors, errorMessage]);
		}
		// Handle weapon_modifiers errors
		else if (firstPath === 'weapon_modifiers' && typeof secondPath === 'number') {
			const modifierIndex = secondPath;
			if (!errors.weapon_modifiers) {
				errors.weapon_modifiers = new Map();
			}
			const existingErrors = errors.weapon_modifiers.get(modifierIndex) || [];
			const errorMessage = processModifierError(
				issue,
				path,
				'target_stat',
				'Weapon stat to modify is required'
			);
			errors.weapon_modifiers.set(modifierIndex, [...existingErrors, errorMessage]);
		}
		// Handle top-level feature errors
		else if (firstPath === 'title') {
			errors.title = issue.message;
		} else if (firstPath === 'description_html') {
			errors.description_html = issue.message;
		}
	}

	return errors;
}
