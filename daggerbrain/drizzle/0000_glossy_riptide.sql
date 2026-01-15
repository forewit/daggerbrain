CREATE TABLE `campaign_characters_table` (
	`campaign_id` text NOT NULL,
	`character_id` text NOT NULL,
	`claimable` integer DEFAULT 0 NOT NULL,
	`added_at` integer NOT NULL,
	PRIMARY KEY(`campaign_id`, `character_id`)
);
--> statement-breakpoint
CREATE INDEX `campaign_characters_table_campaign_id_idx` ON `campaign_characters_table` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `campaign_characters_table_character_id_idx` ON `campaign_characters_table` (`character_id`);--> statement-breakpoint
CREATE INDEX `campaign_characters_table_campaign_id_claimable_idx` ON `campaign_characters_table` (`campaign_id`,`claimable`);--> statement-breakpoint
CREATE TABLE `campaign_homebrew_vault_table` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`homebrew_type` text NOT NULL,
	`homebrew_id` text NOT NULL,
	`added_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `campaign_homebrew_vault_table_campaign_id_idx` ON `campaign_homebrew_vault_table` (`campaign_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `campaign_homebrew_vault_table_campaign_id_homebrew_id_unique` ON `campaign_homebrew_vault_table` (`campaign_id`,`homebrew_id`);--> statement-breakpoint
CREATE INDEX `campaign_homebrew_vault_table_homebrew_type_homebrew_id_idx` ON `campaign_homebrew_vault_table` (`homebrew_type`,`homebrew_id`);--> statement-breakpoint
CREATE TABLE `campaign_members_table` (
	`campaign_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`display_name` text,
	`joined_at` integer NOT NULL,
	PRIMARY KEY(`campaign_id`, `user_id`)
);
--> statement-breakpoint
CREATE INDEX `campaign_members_table_campaign_id_idx` ON `campaign_members_table` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `campaign_members_table_user_id_idx` ON `campaign_members_table` (`user_id`);--> statement-breakpoint
CREATE TABLE `campaign_state_table` (
	`campaign_id` text PRIMARY KEY NOT NULL,
	`fear_track` integer DEFAULT 0 NOT NULL,
	`fear_visible_to_players` integer DEFAULT false NOT NULL,
	`notes` text,
	`countdowns` text DEFAULT '[]' NOT NULL,
	`invite_code` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campaign_state_table_invite_code_unique` ON `campaign_state_table` (`invite_code`);--> statement-breakpoint
CREATE INDEX `campaign_state_table_invite_code_idx` ON `campaign_state_table` (`invite_code`);--> statement-breakpoint
CREATE TABLE `campaigns_table` (
	`id` text PRIMARY KEY NOT NULL,
	`gm_user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_characters_table` (
	`id` text PRIMARY KEY DEFAULT '06d81d9f-0f4f-48d3-a777-d964e9ef60e7' NOT NULL,
	`clerk_user_id` text NOT NULL,
	`name` text DEFAULT 'New Character' NOT NULL,
	`image_url` text DEFAULT '/images/portrait-placeholder.png' NOT NULL,
	`campaign_id` text,
	`settings` text DEFAULT '{"void_enabled":false,"use_gold_coins":false,"homebrew_enabled":false,"show_campaign_info":true}' NOT NULL,
	`derived_descriptors` text DEFAULT '{"ancestry_name":"","community_name":"","primary_class_name":"","primary_subclass_name":"","secondary_class_name":"","secondary_subclass_name":"","max_hp":0,"max_stress":6,"max_hope":6,"evasion":0,"max_armor":0,"damage_thresholds":{"major":0,"severe":0}}' NOT NULL,
	`ancestry_card_id` text,
	`custom_top_ancestry` text,
	`custom_bottom_ancestry` text,
	`community_card_id` text,
	`experiences` text DEFAULT '["",""]' NOT NULL,
	`class_choices` text DEFAULT '{}' NOT NULL,
	`primary_class_id` text,
	`primary_subclass_id` text,
	`secondary_class_id` text,
	`secondary_subclass_id` text,
	`secondary_class_domain_id_choice` text,
	`chosen_beastform` text DEFAULT 'null',
	`companion` text DEFAULT 'null',
	`background_questions` text DEFAULT '[]' NOT NULL,
	`connections` text DEFAULT '[]' NOT NULL,
	`character_descriptions` text DEFAULT '{"clothes":"","eyes":"","body":"","skin":"","attitude":""}' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`active_armor_id` text,
	`active_primary_weapon_id` text,
	`active_secondary_weapon_id` text,
	`inventory` text DEFAULT '{"primary_weapons":{},"secondary_weapons":{},"armor":{},"loot":{},"consumables":{},"adventuring_gear":[],"gold_coins":0}' NOT NULL,
	`active_conditions` text DEFAULT '[]' NOT NULL,
	`transformation_card_id` text,
	`additional_domain_card_ids` text DEFAULT '[]' NOT NULL,
	`additional_ancestry_card_ids` text DEFAULT '[]' NOT NULL,
	`additional_community_card_ids` text DEFAULT '[]' NOT NULL,
	`additional_transformation_card_ids` text DEFAULT '[]' NOT NULL,
	`unarmed_attack_choices` text DEFAULT '{}' NOT NULL,
	`ancestry_card_choices` text DEFAULT '{}' NOT NULL,
	`community_card_tokens` integer DEFAULT 0 NOT NULL,
	`domain_card_choices` text DEFAULT '{}' NOT NULL,
	`domain_card_tokens` text DEFAULT '{}' NOT NULL,
	`selected_traits` text DEFAULT '{"agility":null,"strength":null,"finesse":null,"instinct":null,"presence":null,"knowledge":null}' NOT NULL,
	`marked_hp` integer DEFAULT 0 NOT NULL,
	`marked_stress` integer DEFAULT 0 NOT NULL,
	`marked_hope` integer DEFAULT 2 NOT NULL,
	`marked_armor` integer DEFAULT 0 NOT NULL,
	`loadout_domain_card_ids` text DEFAULT '[]' NOT NULL,
	`bonus_max_loadout` integer DEFAULT 0 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`level_up_domain_card_ids` text DEFAULT '{"1":{"A":null,"B":null},"2":{"A":null},"3":{"A":null},"4":{"A":null},"5":{"A":null},"6":{"A":null},"7":{"A":null},"8":{"A":null},"9":{"A":null},"10":{"A":null}}' NOT NULL,
	`level_up_choices` text DEFAULT '{"2":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"3":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"4":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"5":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"6":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"7":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"8":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"9":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}},"10":{"A":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null},"B":{"option_id":null,"marked_traits":{"A":null,"B":null},"selected_experiences":[],"selected_domain_card_id":null,"selected_subclass_upgrade":null}}}' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_characters_table`("id", "clerk_user_id", "name", "image_url", "campaign_id", "settings", "derived_descriptors", "ancestry_card_id", "custom_top_ancestry", "custom_bottom_ancestry", "community_card_id", "experiences", "class_choices", "primary_class_id", "primary_subclass_id", "secondary_class_id", "secondary_subclass_id", "secondary_class_domain_id_choice", "chosen_beastform", "companion", "background_questions", "connections", "character_descriptions", "notes", "active_armor_id", "active_primary_weapon_id", "active_secondary_weapon_id", "inventory", "active_conditions", "transformation_card_id", "additional_domain_card_ids", "additional_ancestry_card_ids", "additional_community_card_ids", "additional_transformation_card_ids", "unarmed_attack_choices", "ancestry_card_choices", "community_card_tokens", "domain_card_choices", "domain_card_tokens", "selected_traits", "marked_hp", "marked_stress", "marked_hope", "marked_armor", "loadout_domain_card_ids", "bonus_max_loadout", "level", "level_up_domain_card_ids", "level_up_choices") SELECT "id", "clerk_user_id", "name", "image_url", "campaign_id", "settings", "derived_descriptors", "ancestry_card_id", "custom_top_ancestry", "custom_bottom_ancestry", "community_card_id", "experiences", "class_choices", "primary_class_id", "primary_subclass_id", "secondary_class_id", "secondary_subclass_id", "secondary_class_domain_id_choice", "chosen_beastform", "companion", "background_questions", "connections", "character_descriptions", "notes", "active_armor_id", "active_primary_weapon_id", "active_secondary_weapon_id", "inventory", "active_conditions", "transformation_card_id", "additional_domain_card_ids", "additional_ancestry_card_ids", "additional_community_card_ids", "additional_transformation_card_ids", "unarmed_attack_choices", "ancestry_card_choices", "community_card_tokens", "domain_card_choices", "domain_card_tokens", "selected_traits", "marked_hp", "marked_stress", "marked_hope", "marked_armor", "loadout_domain_card_ids", "bonus_max_loadout", "level", "level_up_domain_card_ids", "level_up_choices" FROM `characters_table`;--> statement-breakpoint
DROP TABLE `characters_table`;--> statement-breakpoint
ALTER TABLE `__new_characters_table` RENAME TO `characters_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `characters_table_clerk_user_id_idx` ON `characters_table` (`clerk_user_id`);--> statement-breakpoint
CREATE INDEX `characters_table_campaign_id_idx` ON `characters_table` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_ancestry_cards` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_ancestry_cards_campaign_id_idx` ON `homebrew_ancestry_cards` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_armor` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_armor_campaign_id_idx` ON `homebrew_armor` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_beastforms` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_beastforms_campaign_id_idx` ON `homebrew_beastforms` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_classes` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_classes_campaign_id_idx` ON `homebrew_classes` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_community_cards` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_community_cards_campaign_id_idx` ON `homebrew_community_cards` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_consumables` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_consumables_campaign_id_idx` ON `homebrew_consumables` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_domain_cards` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_domain_cards_campaign_id_idx` ON `homebrew_domain_cards` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_domains` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_domains_campaign_id_idx` ON `homebrew_domains` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_loot` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_loot_campaign_id_idx` ON `homebrew_loot` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_primary_weapons` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_primary_weapons_campaign_id_idx` ON `homebrew_primary_weapons` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_secondary_weapons` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_secondary_weapons_campaign_id_idx` ON `homebrew_secondary_weapons` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_subclasses` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_subclasses_campaign_id_idx` ON `homebrew_subclasses` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `homebrew_transformation_cards` ADD `campaign_id` text;--> statement-breakpoint
CREATE INDEX `homebrew_transformation_cards_campaign_id_idx` ON `homebrew_transformation_cards` (`campaign_id`);