CREATE TABLE `ancestry_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`image_url` text NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`artist_name` text,
	`features_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `armor` (
	`id` text PRIMARY KEY NOT NULL,
	`level_requirement` integer NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`max_armor` integer NOT NULL,
	`damage_thresholds_json` text NOT NULL,
	`features_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `character_audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`payload_hash` text,
	`payload_json` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_choices` (
	`character_id` text PRIMARY KEY NOT NULL,
	`background_questions_json` text NOT NULL,
	`connections_json` text NOT NULL,
	`class_choices_json` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_classes` (
	`character_id` text PRIMARY KEY NOT NULL,
	`primary_class_id` text,
	`primary_subclass_id` text,
	`secondary_class_id` text,
	`secondary_subclass_id` text,
	`secondary_class_domain_choice` text,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_domain_tracking` (
	`character_id` text PRIMARY KEY NOT NULL,
	`domain_card_choices_json` text NOT NULL,
	`domain_card_tokens_json` text NOT NULL,
	`loadout_domain_card_ids_json` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_heritage` (
	`character_id` text PRIMARY KEY NOT NULL,
	`ancestry_card_id` text,
	`community_card_id` text,
	`transformation_card_id` text,
	`experiences_json` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_inventory` (
	`character_id` text PRIMARY KEY NOT NULL,
	`armor_id` text,
	`primary_weapon_id` text,
	`secondary_weapon_id` text,
	`inventory_json` text NOT NULL,
	`additional_domain_card_ids_json` text NOT NULL,
	`additional_character_mods_json` text NOT NULL,
	`additional_weapon_mods_json` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_level_progress` (
	`character_id` text PRIMARY KEY NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`domain_card_ids_json` text NOT NULL,
	`level_up_choices_json` text NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_traits` (
	`character_id` text PRIMARY KEY NOT NULL,
	`agility` integer,
	`strength` integer,
	`finesse` integer,
	`instinct` integer,
	`presence` integer,
	`knowledge` integer,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`image_url` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`settings_json` text NOT NULL,
	`derived_descriptors_json` text NOT NULL,
	`ephemeral_stats_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `class_subclasses` (
	`id` text PRIMARY KEY NOT NULL,
	`class_id` text NOT NULL,
	`name` text NOT NULL,
	`description_html` text NOT NULL,
	`foundation_card_json` text NOT NULL,
	`specialization_card_json` text NOT NULL,
	`mastery_card_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`name` text NOT NULL,
	`image_url` text NOT NULL,
	`description_html` text NOT NULL,
	`starting_evasion` integer NOT NULL,
	`starting_max_hp` integer NOT NULL,
	`hope_feature_json` text NOT NULL,
	`primary_domain_id` text NOT NULL,
	`secondary_domain_id` text NOT NULL,
	`class_features_json` text NOT NULL,
	`subclasses_json` text NOT NULL,
	`suggested_traits_json` text NOT NULL,
	`suggested_primary_weapon_id` text,
	`suggested_secondary_weapon_id` text,
	`suggested_armor_id` text,
	`starting_inventory_json` text NOT NULL,
	`background_questions_json` text NOT NULL,
	`connections_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `community_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`image_url` text NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`artist_name` text,
	`features_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `consumables` (
	`id` text PRIMARY KEY NOT NULL,
	`rarity_roll` integer NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `domain_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`domain_id` text NOT NULL,
	`card_type` text NOT NULL,
	`image_url` text NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`artist_name` text,
	`features_json` text NOT NULL,
	`level_requirement` integer NOT NULL,
	`recall_cost` integer NOT NULL,
	`domain_card_type` text NOT NULL,
	`choices_json` text NOT NULL,
	`tokens` integer DEFAULT 0 NOT NULL,
	`applies_in_vault` integer DEFAULT false NOT NULL,
	`forced_in_loadout` integer DEFAULT false NOT NULL,
	`forced_in_vault` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`domain_id`) REFERENCES `domains`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description_html` text NOT NULL,
	`color` text NOT NULL,
	`foreground_color` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loot` (
	`id` text PRIMARY KEY NOT NULL,
	`rarity_roll` integer NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`character_modifiers_json` text NOT NULL,
	`weapon_modifiers_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transformation_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`image_url` text NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`artist_name` text,
	`features_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`display_name` text,
	`image_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weapons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description_html` text NOT NULL,
	`level_requirement` integer NOT NULL,
	`category` text NOT NULL,
	`available_traits_json` text NOT NULL,
	`range` text NOT NULL,
	`features_json` text NOT NULL,
	`attack_roll_bonus` integer NOT NULL,
	`damage_bonus` integer NOT NULL,
	`damage_dice` text NOT NULL,
	`available_damage_types_json` text NOT NULL,
	`burden` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
