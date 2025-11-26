/// <reference types="node" />

/**
 * Script to generate compendium-data.json for bulk KV upload
 * 
 * This file imports all compendium data and exports it as a JSON file
 * in the format required by wrangler kv bulk put:
 * 
 * [
 *   { "key": "key1", "value": "value1" },
 *   { "key": "key2", "value": "value2" }
 * ]
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Import all compendium data
import { CLASSES } from './classes/classes.js';
import { SUBCLASSES } from './classes/subclasses.js';
import { DOMAINS } from './domains/domains.js';
import { ARCANA_DOMAIN_CARDS } from './domains/arcana-cards.js';
import { BLADE_DOMAIN_CARDS } from './domains/blade-cards.js';
import { BONE_DOMAIN_CARDS } from './domains/bone-cards.js';
import { CODEX_DOMAIN_CARDS } from './domains/codex-cards.js';
import { GRACE_DOMAIN_CARDS } from './domains/grace-cards.js';
import { MIDNIGHT_DOMAIN_CARDS } from './domains/midnight-cards.js';
import { SAGE_DOMAIN_CARDS } from './domains/sage-cards.js';
import { SPLENDOR_DOMAIN_CARDS } from './domains/splendor-cards.js';
import { VALOR_DOMAIN_CARDS } from './domains/valor-cards.js';
import {
	PRIMARY_WEAPONS,
	SECONDARY_WEAPONS,
	ALL_ARMOR,
	ALL_LOOT,
	ALL_CONSUMABLES
} from './equipment/equipment.js';
import { ANCESTRY_CARDS } from './heritage/ancestry-cards.js';
import { COMMUNITY_CARDS } from './heritage/community-cards.js';
import { TRANSFORMATION_CARDS } from './heritage/transformations-cards.js';
import { SOURCES } from './sources/sources.js';

// Domain cards mapping
const DOMAIN_CARDS_MAP: Record<string, any> = {
	'arcana-cards': ARCANA_DOMAIN_CARDS,
	'blade-cards': BLADE_DOMAIN_CARDS,
	'bone-cards': BONE_DOMAIN_CARDS,
	'codex-cards': CODEX_DOMAIN_CARDS,
	'grace-cards': GRACE_DOMAIN_CARDS,
	'midnight-cards': MIDNIGHT_DOMAIN_CARDS,
	'sage-cards': SAGE_DOMAIN_CARDS,
	'splendor-cards': SPLENDOR_DOMAIN_CARDS,
	'valor-cards': VALOR_DOMAIN_CARDS
};

// Data mapping
const DATA_MAP: Record<string, any> = {
	classes: CLASSES,
	subclasses: SUBCLASSES,
	domains: DOMAINS,
	armor: ALL_ARMOR,
	consumables: ALL_CONSUMABLES,
	loot: ALL_LOOT,
	'primary-weapons': PRIMARY_WEAPONS,
	'secondary-weapons': SECONDARY_WEAPONS,
	'ancestry-cards': ANCESTRY_CARDS,
	'community-cards': COMMUNITY_CARDS,
	'transformation-cards': TRANSFORMATION_CARDS,
	sources: SOURCES
};

// Generate the bulk upload JSON format
const bulkData: Array<{ key: string; value: string }> = [];

// Add all single-entry data types
for (const [key, data] of Object.entries(DATA_MAP)) {
	bulkData.push({
		key,
		value: JSON.stringify(data)
	});
}

// Add all domain cards
for (const [key, data] of Object.entries(DOMAIN_CARDS_MAP)) {
	bulkData.push({
		key,
		value: JSON.stringify(data)
	});
}

// Write to JSON file
const outputPath = join(process.cwd(), 'src', 'lib', 'compendium', 'compendium-data.json');
writeFileSync(outputPath, JSON.stringify(bulkData, null, 2), 'utf8');

console.log(`✓ Generated compendium-data.json with ${bulkData.length} entries`);

