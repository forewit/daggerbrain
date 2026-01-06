/**
 * Permission Types
 * 
 * Types for the centralized permission service.
 */

import type { Campaign, CampaignMember } from './campaign-types';
import type { Character } from './character-types';

export type CampaignAccess = {
	campaign: Campaign;
	membership: CampaignMember | null;
	role: 'gm' | 'player' | null;
	canView: boolean;
	canEdit: boolean; // GM only
};

export type CharacterAccess = {
	character: Character;
	canView: boolean;
	canEdit: boolean;
	isOwner: boolean;
	campaignRole: 'gm' | 'player' | null;
};

export type HomebrewAccess<T> = {
	item: T;
	canView: boolean;
	canEdit: boolean;
	isOwner: boolean;
};

export type ClaimCharacterAccess = {
	character: Character;
	canClaim: boolean;
	reason: string | null;
};

export type HomebrewTableType =
	| 'classes'
	| 'subclasses'
	| 'domains'
	| 'domain_cards'
	| 'primary_weapons'
	| 'secondary_weapons'
	| 'armor'
	| 'loot'
	| 'consumables'
	| 'ancestry_cards'
	| 'community_cards'
	| 'transformation_cards'
	| 'beastforms';

