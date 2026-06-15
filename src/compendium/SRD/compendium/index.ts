import type { CompendiumContent } from '../../../convex/schemas/compendium';
import { ADVERSARIES } from './adversaries';
import { ANCESTRY_CARDS } from './ancestry-cards';
import { ARMOR } from './armor';
import { BEASTFORMS } from './beastforms';
import { CLASSES } from './classes';
import { COMMUNITY_CARDS } from './community-cards';
import { CONSUMABLES } from './consumables';
import { DOMAIN_CARDS } from './domain_cards';
import { DOMAINS } from './domains';
import { ENVIRONMENTS } from './environments';
import { LOOT } from './loot';
import { PRIMARY_WEAPONS } from './primary-weapons';
import { SECONDARY_WEAPONS } from './secondary-weapons';
import { SUBCLASSES } from './subclasses';
import { TRANSFORMATION_CARDS } from './transformation-cards';

export const COMPENDIUM: CompendiumContent = {
	primary_weapons: PRIMARY_WEAPONS,
	secondary_weapons: SECONDARY_WEAPONS,
	armor: ARMOR,
	loot: LOOT,
	consumables: CONSUMABLES,
	beastforms: BEASTFORMS,
	classes: CLASSES,
	subclasses: SUBCLASSES,
	domains: DOMAINS,
	domain_cards: DOMAIN_CARDS,
	ancestry_cards: ANCESTRY_CARDS,
	community_cards: COMMUNITY_CARDS,
	transformation_cards: TRANSFORMATION_CARDS,
	adversaries: ADVERSARIES,
	environments: ENVIRONMENTS
};
