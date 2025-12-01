#!/usr/bin/env bun
/// <reference types="node" />

/**
 * Interactive CLI tool for managing seed data
 *
 * This tool helps seed data to KV, R2, and D1 locally or remotely.
 *
 * Usage:
 *   bun run src/lib/scripts/seed.ts
 */

import { select, checkbox } from '@inquirer/prompts';
import { execSync } from 'node:child_process';
import { rmSync, existsSync, mkdirSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { tmpdir } from 'node:os';

// Import all compendium data for KV seeding
import { CLASSES } from '../compendium/classes/classes.js';
import { SUBCLASSES } from '../compendium/classes/subclasses.js';
import { DOMAINS } from '../compendium/domains/domains.js';
import { ARCANA_DOMAIN_CARDS } from '../compendium/domains/arcana-cards.js';
import { BLADE_DOMAIN_CARDS } from '../compendium/domains/blade-cards.js';
import { BONE_DOMAIN_CARDS } from '../compendium/domains/bone-cards.js';
import { CODEX_DOMAIN_CARDS } from '../compendium/domains/codex-cards.js';
import { GRACE_DOMAIN_CARDS } from '../compendium/domains/grace-cards.js';
import { MIDNIGHT_DOMAIN_CARDS } from '../compendium/domains/midnight-cards.js';
import { SAGE_DOMAIN_CARDS } from '../compendium/domains/sage-cards.js';
import { SPLENDOR_DOMAIN_CARDS } from '../compendium/domains/splendor-cards.js';
import { VALOR_DOMAIN_CARDS } from '../compendium/domains/valor-cards.js';
import {
	PRIMARY_WEAPONS,
	SECONDARY_WEAPONS,
	ALL_ARMOR,
	ALL_LOOT,
	ALL_CONSUMABLES
} from '../compendium/equipment/equipment.js';
import { ANCESTRY_CARDS } from '../compendium/heritage/ancestry-cards.js';
import { COMMUNITY_CARDS } from '../compendium/heritage/community-cards.js';
import { TRANSFORMATION_CARDS } from '../compendium/heritage/transformations-cards.js';
import { SOURCES } from '../compendium/sources/sources.js';

type Environment = 'local' | 'remote';
type SeedType = 'd1' | 'kv' | 'r2';

interface FolderNode {
	name: string;
	path: string; // Relative path from COMPENDIUM_IMAGES_DIR
	imageCount: number;
	children: FolderNode[];
}

// Paths
const WRANGLER_STATE_DIR = join(process.cwd(), '.wrangler', 'state', 'v3');
const COMPENDIUM_IMAGES_DIR = join(process.cwd(), 'src', 'lib', 'compendium', 'images');

// R2 configuration
const R2_BUCKET_NAME = 'daggerbrain-images';
const R2_KEY_PREFIX = 'card';
const IMAGE_EXTENSIONS = new Set(['.webp', '.avif', '.png', '.jpg', '.jpeg', '.gif', '.svg']);
const MIME_TYPES: Record<string, string> = {
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml'
};

// Compendium data mappings
const DOMAIN_CARDS_MAP: Record<string, unknown> = {
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

const DATA_MAP: Record<string, unknown> = {
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

/**
 * Run a shell command and stream output
 */
function run(command: string, options?: { silent?: boolean }): void {
	if (!options?.silent) {
		console.log(`\n  $ ${command}\n`);
	}
	execSync(command, { stdio: 'inherit' });
}

/**
 * Run a shell command silently, returning success status
 */
function runSilent(command: string): boolean {
	try {
		execSync(command, { stdio: 'pipe' });
		return true;
	} catch {
		return false;
	}
}

/**
 * Clear the local state for a specific service
 */
function clearLocalState(service: 'd1' | 'kv' | 'r2'): void {
	const statePath = join(WRANGLER_STATE_DIR, service);
	if (existsSync(statePath)) {
		console.log(`  🗑️  Clearing local ${service.toUpperCase()} state...`);
		rmSync(statePath, { recursive: true, force: true });
	}
}

/**
 * Generate the compendium data JSON and write to a temp file
 * Returns the path to the temp file
 */
function generateCompendiumJson(): string {
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

	const tempFile = join(tmpdir(), `compendium-data-${Date.now()}.json`);
	writeFileSync(tempFile, JSON.stringify(bulkData, null, 2), 'utf8');
	console.log(`  ✓ Generated compendium data with ${bulkData.length} entries`);

	return tempFile;
}

/**
 * Build a hierarchical folder tree with image counts
 */
function buildFolderTree(dir: string, relativePath: string = ''): FolderNode[] {
	if (!existsSync(dir)) {
		return [];
	}

	const entries = readdirSync(dir, { withFileTypes: true });
	const folders: FolderNode[] = [];

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const fullPath = join(dir, entry.name);
			const childRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
			const children = buildFolderTree(fullPath, childRelativePath);

			// Count images directly in this folder (not in subfolders)
			const directImages = readdirSync(fullPath, { withFileTypes: true }).filter(
				(e) => e.isFile() && IMAGE_EXTENSIONS.has(extname(e.name).toLowerCase())
			).length;

			// Total images = direct + all children
			const totalImages = directImages + children.reduce((sum, child) => sum + child.imageCount, 0);

			folders.push({
				name: entry.name,
				path: childRelativePath,
				imageCount: totalImages,
				children
			});
		}
	}

	return folders.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Flatten folder tree into checkbox choices with indentation
 */
function flattenFolderTree(
	nodes: FolderNode[],
	depth: number = 0
): Array<{ name: string; value: string }> {
	const choices: Array<{ name: string; value: string }> = [];

	for (const node of nodes) {
		const indent = '  '.repeat(depth);
		const hasChildren = node.children.length > 0;
		const prefix = hasChildren ? '📁' : '📄';

		choices.push({
			name: `${indent}${prefix} ${node.name} (${node.imageCount} images)`,
			value: node.path
		});

		if (hasChildren) {
			choices.push(...flattenFolderTree(node.children, depth + 1));
		}
	}

	return choices;
}

/**
 * Get all descendant paths for a folder (including itself)
 */
function getAllDescendantPaths(nodes: FolderNode[], targetPath: string): string[] {
	for (const node of nodes) {
		if (node.path === targetPath) {
			// Found the target, return it and all descendants
			const paths = [node.path];
			const collectDescendants = (n: FolderNode) => {
				for (const child of n.children) {
					paths.push(child.path);
					collectDescendants(child);
				}
			};
			collectDescendants(node);
			return paths;
		}

		// Search in children
		const found = getAllDescendantPaths(node.children, targetPath);
		if (found.length > 0) {
			return found;
		}
	}

	return [];
}

/**
 * Check if a path is a descendant of another path
 */
function isDescendantOf(childPath: string, parentPath: string): boolean {
	return childPath.startsWith(parentPath + '/');
}

/**
 * Recursively get all image files in a directory
 */
function getImageFiles(dir: string): string[] {
	if (!existsSync(dir)) {
		return [];
	}

	const files: string[] = [];
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...getImageFiles(fullPath));
		} else if (entry.isFile()) {
			const ext = extname(entry.name).toLowerCase();
			if (IMAGE_EXTENSIONS.has(ext)) {
				files.push(fullPath);
			}
		}
	}

	return files;
}

/**
 * Get image files from specific folder paths (supports nested paths like "art/domains/arcana")
 */
function getImageFilesFromFolders(baseDir: string, folderPaths: string[]): string[] {
	const files: string[] = [];
	for (const folderPath of folderPaths) {
		const fullPath = join(baseDir, folderPath);
		files.push(...getImageFiles(fullPath));
	}
	return files;
}

/**
 * Convert local file path to R2 key
 */
function getR2Key(filePath: string): string {
	const relativePath = relative(COMPENDIUM_IMAGES_DIR, filePath).replace(/\\/g, '/');
	return `${R2_KEY_PREFIX}/${relativePath}`;
}

/**
 * Upload a single file to R2 using wrangler
 */
function uploadFileToR2(filePath: string, r2Key: string, isRemote: boolean): boolean {
	const ext = extname(filePath).toLowerCase();
	const contentType = MIME_TYPES[ext] || 'application/octet-stream';
	const remoteFlag = isRemote ? '--remote' : '--local';

	const cmd = `wrangler r2 object put ${R2_BUCKET_NAME}/${r2Key} --file="${filePath}" --content-type="${contentType}" ${remoteFlag}`;
	return runSilent(cmd);
}

/**
 * Seed D1 database (local only)
 * Uses drizzle-kit push to directly apply schema to local SQLite database
 */
async function seedD1(): Promise<void> {
	console.log('\n📦 Seeding D1 Database (LOCAL)...\n');

	// Clear existing D1 state
	clearLocalState('d1');

	// Ensure the D1 directory structure exists for miniflare
	const d1Dir = join(WRANGLER_STATE_DIR, 'd1', 'miniflare-D1DatabaseObject');
	if (!existsSync(d1Dir)) {
		mkdirSync(d1Dir, { recursive: true });
	}

	// Initialize the database by running a simple query through wrangler
	// This creates the SQLite file with the correct hash-based filename
	console.log('  🔧 Initializing local D1 database...');
	run('wrangler d1 execute daggerbrain-db --local --command="SELECT 1"');

	// Push schema directly using drizzle-kit with local config
	console.log('  📝 Pushing schema to local D1...');
	run('drizzle-kit push --config=drizzle.config.local.ts');

	console.log('\n✅ D1 seeded successfully!');
}

/**
 * Seed KV store with compendium data
 */
async function seedKV(environment: Environment): Promise<void> {
	console.log(`\n📦 Seeding KV Store (${environment.toUpperCase()})...\n`);

	if (environment === 'local') {
		clearLocalState('kv');
	}

	// Generate compendium JSON to temp file
	console.log('  📝 Generating compendium data...');
	const tempFile = generateCompendiumJson();

	try {
		// Upload to KV
		const remoteFlag = environment === 'remote' ? '--remote' : '--local';
		console.log(`  ⬆️  Uploading to KV (${environment})...`);
		run(`wrangler kv bulk put ${tempFile} --binding=KV ${remoteFlag}`);

		console.log('\n✅ KV seeded successfully!');
	} finally {
		// Clean up temp file
		unlinkSync(tempFile);
	}
}

/**
 * Prompt user to select which image folders to upload
 * Shows hierarchical folder structure, selecting a parent includes all children
 */
async function selectImageFolders(): Promise<string[] | null> {
	const folderTree = buildFolderTree(COMPENDIUM_IMAGES_DIR);

	if (folderTree.length === 0) {
		return null;
	}

	const choices = flattenFolderTree(folderTree);

	const selected = await checkbox<string>({
		message: 'Select image folders to upload:',
		choices,
		loop: false
	});

	if (selected.length === 0) {
		return [];
	}

	// Expand parent selections to include all children
	const expandedPaths = new Set<string>();
	for (const path of selected) {
		const descendants = getAllDescendantPaths(folderTree, path);
		for (const desc of descendants) {
			expandedPaths.add(desc);
		}
	}

	// Remove redundant child selections if parent is already selected
	const finalPaths = Array.from(expandedPaths).filter((path) => {
		// Keep if no ancestor is in the set
		for (const other of expandedPaths) {
			if (other !== path && isDescendantOf(path, other)) {
				return false; // This is a child of another selected path
			}
		}
		return true;
	});

	return finalPaths;
}

/**
 * Seed R2 bucket with compendium images
 */
async function seedR2(environment: Environment, selectedFolders: string[]): Promise<void> {
	console.log(`\n📦 Seeding R2 Bucket (${environment.toUpperCase()})...\n`);

	if (environment === 'local') {
		clearLocalState('r2');
	}

	const isRemote = environment === 'remote';

	// Get image files from selected folders only
	const imageFiles = getImageFilesFromFolders(COMPENDIUM_IMAGES_DIR, selectedFolders);

	if (imageFiles.length === 0) {
		console.log('  ⚠️  No images found in selected folders.');
		return;
	}

	console.log(`  Uploading ${imageFiles.length} images from: ${selectedFolders.join(', ')}\n`);

	let successCount = 0;
	let failCount = 0;

	for (const filePath of imageFiles) {
		const r2Key = getR2Key(filePath);
		process.stdout.write(`  ⬆ ${r2Key}...`);

		if (uploadFileToR2(filePath, r2Key, isRemote)) {
			successCount++;
			console.log(' ✓');
		} else {
			failCount++;
			console.log(' ✗');
		}
	}

	console.log(`\n  Uploaded: ${successCount}/${imageFiles.length} files`);
	if (failCount > 0) {
		console.log(`  Failed: ${failCount} files`);
	}

	console.log('\n✅ R2 seeded successfully!');
}

/**
 * Main CLI flow
 */
async function main(): Promise<void> {
	console.log('\n🌱 Daggerbrain Seed Manager\n');

	// Step 1: Select environment
	const environment = await select<Environment>({
		message: 'Select environment:',
		choices: [
			{ name: 'Local', value: 'local' },
			{ name: 'Remote', value: 'remote' }
		]
	});

	// Step 2: Select what to seed (different options based on environment)
	const seedChoices =
		environment === 'local'
			? [
					{ name: 'D1 (Database)', value: 'd1' as SeedType },
					{ name: 'KV (Compendium Data)', value: 'kv' as SeedType },
					{ name: 'R2 (Images)', value: 'r2' as SeedType }
				]
			: [
					{ name: 'KV (Compendium Data)', value: 'kv' as SeedType },
					{ name: 'R2 (Images)', value: 'r2' as SeedType }
				];

	const selectedSeeds = await checkbox<SeedType>({
		message: 'Select data to seed:',
		choices: seedChoices,
		loop: false
	});

	if (selectedSeeds.length === 0) {
		console.log('\n⚠️  No seeds selected. Exiting.\n');
		return;
	}

	// Step 3: Gather additional options for each seed type BEFORE confirming
	let r2Folders: string[] = [];

	if (selectedSeeds.includes('r2')) {
		const folders = await selectImageFolders();

		if (folders === null) {
			console.log('\n⚠️  No image folders found. Removing R2 from selection.\n');
			selectedSeeds.splice(selectedSeeds.indexOf('r2'), 1);
		} else if (folders.length === 0) {
			console.log('\n⚠️  No folders selected. Removing R2 from selection.\n');
			selectedSeeds.splice(selectedSeeds.indexOf('r2'), 1);
		} else {
			r2Folders = folders;
		}
	}

	// Check if we still have seeds to run
	if (selectedSeeds.length === 0) {
		console.log('\n⚠️  No seeds remaining. Exiting.\n');
		return;
	}

	// Step 4: Show summary and confirm
	console.log('\n' + '─'.repeat(50));
	console.log('\n📋 Summary:\n');
	console.log(`  Environment: ${environment.toUpperCase()}`);
	console.log(`  Seeds: ${selectedSeeds.join(', ').toUpperCase()}`);
	if (r2Folders.length > 0) {
		console.log(`  R2 Folders: ${r2Folders.join(', ')}`);
	}
	console.log('');

	const confirmMessage =
		environment === 'remote'
			? '⚠️  You are about to seed REMOTE resources. Proceed?'
			: 'Proceed with seeding?';

	const confirm = await select({
		message: confirmMessage,
		choices: [
			{ name: 'Yes, proceed', value: true },
			{ name: 'No, cancel', value: false }
		],
		default: false
	});

	if (!confirm) {
		console.log('\n❌ Operation cancelled.\n');
		return;
	}

	console.log('\n' + '─'.repeat(50));

	// Step 5: Execute selected seeds
	for (const seed of selectedSeeds) {
		switch (seed) {
			case 'd1':
				await seedD1();
				break;
			case 'kv':
				await seedKV(environment);
				break;
			case 'r2':
				await seedR2(environment, r2Folders);
				break;
		}
	}

	console.log('\n' + '─'.repeat(50));
	console.log('\n✨ All done!\n');
}

// Run the CLI
main().catch((error) => {
	if (error.name === 'ExitPromptError') {
		console.log('\n👋 Cancelled.\n');
		process.exit(0);
	}
	console.error('\n❌ Error:', error.message);
	process.exit(1);
});
