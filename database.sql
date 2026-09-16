-- =========================================================
-- Portfolio Database Schema
-- Import this file in phpMyAdmin (or via the mysql CLI)
-- to create the database and tables used by the PHP backend.
-- =========================================================

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ---------------------------------------------------------
-- Table: projects
-- Powers the "Projects" section on the homepage.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(150)  NOT NULL,
    description VARCHAR(500)  NOT NULL,
    image_url   VARCHAR(255)  DEFAULT NULL,
    tech_stack  VARCHAR(255)  NOT NULL COMMENT 'Comma-separated list, e.g. "PHP,MySQL,JavaScript"',
    live_url    VARCHAR(255)  DEFAULT NULL,
    code_url    VARCHAR(255)  DEFAULT NULL,
    sort_order  INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO projects (title, description, image_url, tech_stack, live_url, code_url, sort_order) VALUES
('Personal UI/UX Portfolio',
 'A clean and responsive portfolio designed to showcase my UI/UX skills, projects, education, and experience.',
 NULL,
 'HTML5,CSS3,JavaScript,PHP,MySQL',
 '#', '#', 1),
('Recipe Box',
 'A searchable recipe collection with user accounts, categories, and saved favorites.',
 NULL,
 'PHP,MySQL,CSS',
 '#', '#', 2),
('Budget Buddy',
 'A simple personal finance tracker with monthly spending charts and category budgets.',
 NULL,
 'JavaScript,PHP,MySQL',
 '#', '#', 3);

-- ---------------------------------------------------------
-- Table: contact_messages
-- Stores every submission from the "Contact" form.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL,
    subject    VARCHAR(150)  DEFAULT NULL,
    message    TEXT          NOT NULL,
    is_read    TINYINT(1)    NOT NULL DEFAULT 0,
    created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
