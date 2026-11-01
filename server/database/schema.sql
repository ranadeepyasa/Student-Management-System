-- DevFlow MySQL Schema
-- Collaborative Software Development Platform

CREATE DATABASE IF NOT EXISTS `devflow_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `devflow_db`;

-- 1. Users Table (5 Team Roles)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('Admin / Team Leader', 'Frontend Developer', 'Backend Developer', 'QA / Testing Engineer', 'Release Manager') NOT NULL,
  `department` VARCHAR(100) DEFAULT 'Engineering',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('online', 'busy', 'offline') DEFAULT 'online',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `github_repo` VARCHAR(150) NOT NULL DEFAULT 'Student-Management-System',
  `github_owner` VARCHAR(100) NOT NULL DEFAULT 'ranadeepyasa',
  `default_branch` VARCHAR(50) NOT NULL DEFAULT 'main',
  `primary_language` VARCHAR(50) DEFAULT 'JavaScript',
  `is_private` BOOLEAN DEFAULT FALSE,
  `created_by` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Project Members Table
CREATE TABLE IF NOT EXISTS `project_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `project_role` VARCHAR(50) DEFAULT 'Member',
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_project_user` (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tasks Table
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `assigned_to` INT,
  `status` ENUM('Todo', 'In Progress', 'In Review', 'Done') DEFAULT 'Todo',
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `due_date` DATE DEFAULT NULL,
  `created_by` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Issues Table
CREATE TABLE IF NOT EXISTS `issues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `issue_number` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `status` ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  `labels` VARCHAR(255) DEFAULT 'bug',
  `assigned_to` INT,
  `created_by` INT,
  `github_issue_id` BIGINT DEFAULT NULL,
  `is_github_synced` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_issues_status` (`status`),
  INDEX `idx_issues_priority` (`priority`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Issue Comments Table
CREATE TABLE IF NOT EXISTS `issue_comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `issue_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `is_github_synced` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`issue_id`) REFERENCES `issues`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Branches Table
CREATE TABLE IF NOT EXISTS `branches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `base_branch` VARCHAR(100) DEFAULT 'main',
  `is_default` BOOLEAN DEFAULT FALSE,
  `is_protected` BOOLEAN DEFAULT FALSE,
  `last_commit_sha` VARCHAR(40),
  `last_commit_message` VARCHAR(255),
  `author_id` INT,
  `is_github_synced` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_project_branch` (`project_id`, `name`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Pull Requests Table
CREATE TABLE IF NOT EXISTS `pull_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `pr_number` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `source_branch` VARCHAR(100) NOT NULL,
  `target_branch` VARCHAR(100) NOT NULL DEFAULT 'main',
  `author_id` INT,
  `status` ENUM('Open', 'Approved', 'Changes Requested', 'Merged', 'Closed') DEFAULT 'Open',
  `additions` INT DEFAULT 0,
  `deletions` INT DEFAULT 0,
  `github_pr_id` BIGINT DEFAULT NULL,
  `is_github_synced` BOOLEAN DEFAULT FALSE,
  `merged_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_prs_status` (`status`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Code Reviews Table
CREATE TABLE IF NOT EXISTS `code_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pull_request_id` INT NOT NULL,
  `reviewer_id` INT NOT NULL,
  `verdict` ENUM('APPROVED', 'CHANGES_REQUESTED', 'COMMENTED') NOT NULL,
  `summary` TEXT NOT NULL,
  `inline_comments_count` INT DEFAULT 0,
  `github_review_id` BIGINT DEFAULT NULL,
  `is_github_synced` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`pull_request_id`) REFERENCES `pull_requests`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Releases Table
CREATE TABLE IF NOT EXISTS `releases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `tag_name` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `target_branch` VARCHAR(50) DEFAULT 'main',
  `is_draft` BOOLEAN DEFAULT FALSE,
  `is_prerelease` BOOLEAN DEFAULT FALSE,
  `published_by` INT,
  `downloads_count` INT DEFAULT 0,
  `github_release_id` BIGINT DEFAULT NULL,
  `is_github_synced` BOOLEAN DEFAULT FALSE,
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 11. Activity Logs Table
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT,
  `user_id` INT,
  `action_type` VARCHAR(50) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT,
  `target_name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_act_type` (`action_type`),
  INDEX `idx_act_created` (`created_at`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `link_url` VARCHAR(255),
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notif_user` (`user_id`, `is_read`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
