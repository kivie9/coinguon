CREATE TABLE `ancestral_halls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`name` text NOT NULL,
	`short_name` text,
	`address` text NOT NULL,
	`province` text,
	`founded_year` integer,
	`ranking` text,
	`structure` text,
	`maps_query_url` text,
	`image_url` text,
	`manager_name` text,
	`manager_phone` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_ancestral_halls_clan_id` ON `ancestral_halls` (`clan_id`);--> statement-breakpoint
CREATE TABLE `branches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`name` text NOT NULL,
	`branch_title` text,
	`branch_full_title` text,
	`leader_id` integer,
	`ancestral_place` text,
	`contact_info` text,
	`order_index` integer DEFAULT 1,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_branches_clan_id` ON `branches` (`clan_id`);--> statement-breakpoint
CREATE TABLE `clan_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`title` text NOT NULL,
	`description` text,
	`tag` text,
	`file_url` text NOT NULL,
	`published_year` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_clan_documents_clan_id` ON `clan_documents` (`clan_id`);--> statement-breakpoint
CREATE TABLE `clans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`short_name` text,
	`han_nom_name` text,
	`slogan` text,
	`sub_slogan` text,
	`motto` text,
	`founded_year` integer,
	`description` text,
	`logo_url` text,
	`footer_copyright` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clans_code_unique` ON `clans` (`code`);--> statement-breakpoint
CREATE INDEX `idx_clans_code` ON `clans` (`code`);--> statement-breakpoint
CREATE TABLE `member_honors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`year` text,
	`badge_type` text DEFAULT 'star',
	`certificate_url` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_member_honors_member_id` ON `member_honors` (`member_id`);--> statement-breakpoint
CREATE TABLE `member_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`media_type` text DEFAULT 'photo' NOT NULL,
	`url` text NOT NULL,
	`caption` text NOT NULL,
	`year` text,
	`is_portrait` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_member_media_member_id` ON `member_media` (`member_id`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`branch_id` integer,
	`full_name` text NOT NULL,
	`courtesy_name` text,
	`gender` text,
	`generation_number` integer DEFAULT 1 NOT NULL,
	`role_title` text,
	`duties` text,
	`avatar_url` text,
	`is_alive` integer DEFAULT true NOT NULL,
	`birthday_solar` text,
	`birthday_lunar` text,
	`death_date_solar` text,
	`death_day_lunar` text,
	`burial_place` text,
	`residence` text,
	`ancestral_origin` text,
	`phone` text,
	`email` text,
	`academic_level` text,
	`career` text,
	`bio` text,
	`badge_type` text,
	`father_id` integer,
	`mother_id` integer,
	`spouse_id` integer,
	`birth_order` integer,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_members_generation` ON `members` (`generation_number`);--> statement-breakpoint
CREATE INDEX `idx_members_branch_id` ON `members` (`branch_id`);--> statement-breakpoint
CREATE INDEX `idx_members_is_alive` ON `members` (`is_alive`);--> statement-breakpoint
CREATE INDEX `idx_members_death_lunar` ON `members` (`death_day_lunar`);--> statement-breakpoint
CREATE INDEX `idx_members_father_id` ON `members` (`father_id`);--> statement-breakpoint
CREATE INDEX `idx_members_mother_id` ON `members` (`mother_id`);--> statement-breakpoint
CREATE TABLE `relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`person_id` integer NOT NULL,
	`related_person_id` integer NOT NULL,
	`type` text NOT NULL,
	`marriage_order` integer,
	`order_in_family` integer,
	`note` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_person_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_rel_person_type` ON `relationships` (`person_id`,`type`);--> statement-breakpoint
CREATE INDEX `idx_rel_related_person` ON `relationships` (`related_person_id`);--> statement-breakpoint
CREATE TABLE `event_organizers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`phone` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_event_organizers_event_id` ON `event_organizers` (`event_id`);--> statement-breakpoint
CREATE TABLE `event_ritual_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`step_number` integer NOT NULL,
	`time_scheduled` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_event_ritual_steps_event_id` ON `event_ritual_steps` (`event_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`event_date_solar` text NOT NULL,
	`event_date_lunar` text,
	`time_start` text,
	`location` text NOT NULL,
	`role_audience` text,
	`description` text,
	`status` text DEFAULT 'UPCOMING' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_events_solar_date` ON `events` (`event_date_solar`);--> statement-breakpoint
CREATE INDEX `idx_events_category` ON `events` (`category`);--> statement-breakpoint
CREATE TABLE `fund_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fund_id` integer NOT NULL,
	`member_id` integer,
	`transaction_code` text,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`amount` integer NOT NULL,
	`contributor_name` text NOT NULL,
	`branch_name` text,
	`transaction_date` text NOT NULL,
	`note` text,
	`receipt_url` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`fund_id`) REFERENCES `funds`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fund_transactions_transaction_code_unique` ON `fund_transactions` (`transaction_code`);--> statement-breakpoint
CREATE INDEX `idx_fund_tx_fund_id` ON `fund_transactions` (`fund_id`);--> statement-breakpoint
CREATE INDEX `idx_fund_tx_date` ON `fund_transactions` (`transaction_date`);--> statement-breakpoint
CREATE INDEX `idx_fund_tx_type` ON `fund_transactions` (`type`);--> statement-breakpoint
CREATE TABLE `funds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`target_amount` integer DEFAULT 0 NOT NULL,
	`current_balance` integer DEFAULT 0 NOT NULL,
	`bank_name` text,
	`bank_account` text,
	`account_holder` text,
	`donation_syntax` text,
	`qr_code_url` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `funds_code_unique` ON `funds` (`code`);--> statement-breakpoint
CREATE INDEX `idx_funds_code` ON `funds` (`code`);--> statement-breakpoint
CREATE TABLE `news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clan_id` integer,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`tag` text NOT NULL,
	`tag_color` text DEFAULT 'primary',
	`summary` text NOT NULL,
	`content` text NOT NULL,
	`thumbnail_url` text,
	`author_name` text DEFAULT 'Ban Trị Sự',
	`views_count` integer DEFAULT 0 NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`comments_count` integer DEFAULT 0 NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`published_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`clan_id`) REFERENCES `clans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_articles_slug_unique` ON `news_articles` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_news_published_at` ON `news_articles` (`published_at`);--> statement-breakpoint
CREATE INDEX `idx_news_tag` ON `news_articles` (`tag`);--> statement-breakpoint
CREATE INDEX `idx_news_slug` ON `news_articles` (`slug`);--> statement-breakpoint
CREATE TABLE `news_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`author_name` text NOT NULL,
	`author_branch` text,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `news_articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_news_comments_article_id` ON `news_comments` (`article_id`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`entity_name` text NOT NULL,
	`entity_id` integer NOT NULL,
	`old_values` text,
	`new_values` text,
	`ip_address` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_entity` ON `audit_logs` (`entity_name`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_created_at` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer,
	`email` text NOT NULL,
	`password_hash` text,
	`phone` text,
	`full_name` text NOT NULL,
	`avatar_url` text,
	`role` text DEFAULT 'MEMBER' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`last_login_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_phone` ON `users` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_users_member_id` ON `users` (`member_id`);