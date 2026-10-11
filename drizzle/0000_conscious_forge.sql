CREATE TABLE `admin_login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`started_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_audit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`kind` text NOT NULL,
	`entry_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_entries` (
	`kind` text NOT NULL,
	`id` text NOT NULL,
	`payload` text NOT NULL,
	`status` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`kind`, `id`),
	CONSTRAINT "valid_kind" CHECK("portfolio_entries"."kind" IN ('projects','labs','badges','blog')),
	CONSTRAINT "valid_status" CHECK("portfolio_entries"."status" IN ('draft','published'))
);
--> statement-breakpoint
CREATE INDEX `portfolio_published` ON `portfolio_entries` (`status`,`kind`);--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`csrf` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
