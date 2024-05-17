CREATE TABLE `tweets` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text,
	`user_name` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
