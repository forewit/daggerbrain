import type {
	CharacterModifierSchema,
	TraitNamesSchema,
	TraitsSchema,
	DomainIdsSchema,
	SourceIdsSchema,
	AdventuringGearSchema,
	CharacterConditionSchema,
	WeaponModifierSchema,
	FeatureSchema,
	SubclassFoundationCardSchema,
	SubclassSpecializationCardSchema,
	SubclassMasteryCardSchema,
	SubclassSchema,
	ClassSchema,
	DomainSchema,
	DomainCardChoiceSchema,
	DomainCardSchema,
	AncestryCardSchema,
	CommunityCardSchema,
	TransformationCardSchema,
	RangesSchema,
	WeaponCategoriesSchema,
	DamageTypesSchema,
	WeaponSchema,
	ArmorSchema,
	LootSchema,
	ConsumableSchema,
	SourcesSchema
} from '$lib/compendium/compendium-schemas';
import type { z } from 'zod';

// ============================================================================
// Core Enums & IDs
// ============================================================================

export type TraitNames = z.infer<typeof TraitNamesSchema>;
export type Traits = z.infer<typeof TraitsSchema>;
export type DomainIds = z.infer<typeof DomainIdsSchema>;
export type SourceIds = z.infer<typeof SourceIdsSchema>;
export type Source = z.infer<typeof SourcesSchema>;

// ============================================================================
// Character Modifiers & Conditions
// ============================================================================

export type CharacterCondition = z.infer<typeof CharacterConditionSchema>;
export type CharacterModifier = z.infer<typeof CharacterModifierSchema>;
export type WeaponModifier = z.infer<typeof WeaponModifierSchema>;
export type Feature = z.infer<typeof FeatureSchema>;

// ============================================================================
// Classes
// ============================================================================

export type SubclassFoundationCard = z.infer<typeof SubclassFoundationCardSchema>;
export type SubclassSpecializationCard = z.infer<typeof SubclassSpecializationCardSchema>;
export type SubclassMasteryCard = z.infer<typeof SubclassMasteryCardSchema>;
export type Subclass = z.infer<typeof SubclassSchema>;
export type Class = z.infer<typeof ClassSchema>;

// ============================================================================
// Domains
// ============================================================================

export type Domain = z.infer<typeof DomainSchema>;
export type DomainCardChoice = z.infer<typeof DomainCardChoiceSchema>;
export type DomainCard = z.infer<typeof DomainCardSchema>;

// ============================================================================
// Heritages
// ============================================================================

export type AncestryCard = z.infer<typeof AncestryCardSchema>;
export type CommunityCard = z.infer<typeof CommunityCardSchema>;
export type TransformationCard = z.infer<typeof TransformationCardSchema>;

// ============================================================================
// Equipment & Items
// ============================================================================

export type Ranges = z.infer<typeof RangesSchema>;
export type WeaponCategories = z.infer<typeof WeaponCategoriesSchema>;
export type DamageTypes = z.infer<typeof DamageTypesSchema>;
export type DamageThresholds = {
	major: number;
	severe: number;
};

export type Weapon = z.infer<typeof WeaponSchema>;
export type Armor = z.infer<typeof ArmorSchema>;
export type AdventuringGear = z.infer<typeof AdventuringGearSchema>;
export type Loot = z.infer<typeof LootSchema>;
export type Consumable = z.infer<typeof ConsumableSchema>;
