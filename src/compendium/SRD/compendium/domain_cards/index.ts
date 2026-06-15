import type { DomainCard } from '../../../../convex/schemas/compendium';
import { ARCANA_DOMAIN_CARDS } from './arcana-cards';
import { BLADE_DOMAIN_CARDS } from './blade-cards';
import { BONE_DOMAIN_CARDS } from './bone-cards';
import { CODEX_DOMAIN_CARDS } from './codex-cards';
import { GRACE_DOMAIN_CARDS } from './grace-cards';
import { MIDNIGHT_DOMAIN_CARDS } from './midnight-cards';
import { SAGE_DOMAIN_CARDS } from './sage-cards';
import { SPLENDOR_DOMAIN_CARDS } from './splendor-cards';
import { VALOR_DOMAIN_CARDS } from './valor-cards';

export const DOMAIN_CARDS = {
	...ARCANA_DOMAIN_CARDS,
	...BLADE_DOMAIN_CARDS,
	...BONE_DOMAIN_CARDS,
	...CODEX_DOMAIN_CARDS,
	...GRACE_DOMAIN_CARDS,
	...MIDNIGHT_DOMAIN_CARDS,
	...SAGE_DOMAIN_CARDS,
	...SPLENDOR_DOMAIN_CARDS,
	...VALOR_DOMAIN_CARDS
} as const satisfies Record<string, DomainCard>;
