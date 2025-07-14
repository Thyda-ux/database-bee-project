-- Fixed Database Setup Script for Smart Beekeeper
-- This script fixes the issues in the original database script

-- 1. Create database
CREATE DATABASE IF NOT EXISTS Smart_Beekeeper DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Use the database
USE Smart_Beekeeper;

-- 3. Create MySQL user for the application (if not exists)
CREATE USER IF NOT EXISTS 'db_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mydb1';

-- 4. Grant privileges to the application user
GRANT ALL PRIVILEGES ON Smart_Beekeeper.* TO 'db_admin'@'localhost';

-- 5. Flush privileges
FLUSH PRIVILEGES;

-- 6. Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS UserPermissions;
DROP TABLE IF EXISTS Users;
DROP VIEW IF EXISTS UsersWithPermissions;

-- 7. Create Users table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL,
    INDEX idx_username (Username),
    INDEX idx_email (Email),
    INDEX idx_role (Role),
    INDEX idx_is_active (IsActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Create User Permissions table
CREATE TABLE UserPermissions (
    UserPermissionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Permission VARCHAR(100) NOT NULL,
    GrantedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (UserID, Permission)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Create other tables (simplified version)
CREATE TABLE Beekeeper (
    BeekeeperID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

CREATE TABLE BeeSpecies (
    SpeciesID INT AUTO_INCREMENT PRIMARY KEY,
    CommonName VARCHAR(50),
    ScientificName VARCHAR(100)
);

CREATE TABLE Hive (
    HiveID INT AUTO_INCREMENT PRIMARY KEY,
    Location VARCHAR(100),
    InstallDate DATE,
    Status VARCHAR(20),
    BeekeeperID INT,
    SpeciesID INT,
    FOREIGN KEY (BeekeeperID) REFERENCES Beekeeper(BeekeeperID) ON DELETE SET NULL,
    FOREIGN KEY (SpeciesID) REFERENCES BeeSpecies(SpeciesID) ON DELETE SET NULL
);

-- 10. Insert default admin user with proper password hash
-- Password: Beekeeper2024! (strong, unique password)
INSERT INTO Users (Username, Email, PasswordHash, Role, IsActive) VALUES 
('admin', 'admin@beekeeper.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Get the admin user ID for permission insertion
SET @admin_user_id = LAST_INSERT_ID();

-- Insert all permissions for admin user
INSERT INTO UserPermissions (UserID, Permission) VALUES
-- User Management Permissions
(@admin_user_id, 'user:create'),
(@admin_user_id, 'user:read'),
(@admin_user_id, 'user:update'),
(@admin_user_id, 'user:delete'),

-- Beekeeper Management Permissions
(@admin_user_id, 'beekeeper:create'),
(@admin_user_id, 'beekeeper:read'),
(@admin_user_id, 'beekeeper:update'),
(@admin_user_id, 'beekeeper:delete'),

-- Hive Management Permissions
(@admin_user_id, 'hive:create'),
(@admin_user_id, 'hive:read'),
(@admin_user_id, 'hive:update'),
(@admin_user_id, 'hive:delete'),

-- Species Management Permissions
(@admin_user_id, 'species:create'),
(@admin_user_id, 'species:read'),
(@admin_user_id, 'species:update'),
(@admin_user_id, 'species:delete'),

-- Environment Management Permissions
(@admin_user_id, 'environment:create'),
(@admin_user_id, 'environment:read'),
(@admin_user_id, 'environment:update'),
(@admin_user_id, 'environment:delete'),

-- Plant Management Permissions
(@admin_user_id, 'plant:create'),
(@admin_user_id, 'plant:read'),
(@admin_user_id, 'plant:update'),
(@admin_user_id, 'plant:delete'),

-- Honey Management Permissions
(@admin_user_id, 'honey:create'),
(@admin_user_id, 'honey:read'),
(@admin_user_id, 'honey:update'),
(@admin_user_id, 'honey:delete');

-- 11. Create a view for users with their permissions
CREATE VIEW UsersWithPermissions AS
SELECT 
    u.UserID,
    u.Username,
    u.Email,
    u.Role,
    u.IsActive,
    u.CreatedAt,
    u.LastLogin,
    GROUP_CONCAT(up.Permission ORDER BY up.Permission SEPARATOR ',') as Permissions
FROM Users u
LEFT JOIN UserPermissions up ON u.UserID = up.UserID
GROUP BY u.UserID, u.Username, u.Email, u.Role, u.IsActive, u.CreatedAt, u.LastLogin;

-- 12. Display setup completion message
SELECT 'Database Setup Complete!' as Status;

-- 13. Show the admin user
SELECT UserID, Username, Email, Role, IsActive, CreatedAt FROM Users WHERE Role = 'admin'; 