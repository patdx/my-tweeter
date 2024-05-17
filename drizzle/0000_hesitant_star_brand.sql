CREATE TABLE `post` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text,
	`reply_to_id` text,
	`text` text NOT NULL,
	`user` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `post_thread_id_idx` ON `post` (`thread_id`);--> statement-breakpoint
CREATE INDEX `post_user_idx` ON `post` (`user`);--> statement-breakpoint
CREATE INDEX `post_created_at_idx` ON `post` (`created_at`);