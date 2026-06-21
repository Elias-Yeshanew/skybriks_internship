-- ============================================
-- Garage Management System - Database Schema
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS garage_management
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE garage_management;

-- ─────────────────────────────────────────────
-- Users (for JWT auth)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_users (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(50)  UNIQUE NOT NULL,
    password     VARCHAR(255) NOT NULL,
    email        VARCHAR(100) UNIQUE,
    role         ENUM('ADMIN','STAFF') DEFAULT 'STAFF',
    enabled      BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- Customers
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name   VARCHAR(50)  NOT NULL,
    last_name    VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) UNIQUE,
    phone        VARCHAR(20)  NOT NULL UNIQUE,
    address      TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- Mechanics
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mechanics (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name     VARCHAR(50)  NOT NULL,
    last_name      VARCHAR(50)  NOT NULL,
    phone          VARCHAR(20)  NOT NULL UNIQUE,
    email          VARCHAR(100) UNIQUE,
    specialization VARCHAR(100),
    hourly_rate    DOUBLE,
    status         ENUM('AVAILABLE','BUSY','ON_LEAVE') DEFAULT 'AVAILABLE',
    hired_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- Vehicles
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    make          VARCHAR(50) NOT NULL,
    model         VARCHAR(50) NOT NULL,
    year          INT,
    vin_number    VARCHAR(50),
    customer_id   BIGINT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- Service Requests
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_requests (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      BIGINT NOT NULL,
    mechanic_id     BIGINT,
    description     TEXT   NOT NULL,
    status          ENUM('PENDING','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'PENDING',
    estimated_cost  DECIMAL(10,2),
    actual_cost     DECIMAL(10,2),
    request_date    DATE DEFAULT (CURDATE()),
    completion_date DATE,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id)  REFERENCES vehicles(id),
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- Inventory
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_items (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    category     ENUM('PARTS','FLUIDS','TOOLS','OTHER') NOT NULL,
    quantity     INT NOT NULL DEFAULT 0,
    min_quantity INT NOT NULL DEFAULT 5,
    unit_price   DECIMAL(10,2),
    supplier     VARCHAR(100),
    sku          VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- Invoices
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number     VARCHAR(50) UNIQUE NOT NULL,
    service_request_id BIGINT NOT NULL UNIQUE,
    customer_id        BIGINT NOT NULL,
    labor_cost         DECIMAL(10,2) DEFAULT 0,
    parts_cost         DECIMAL(10,2) DEFAULT 0,
    tax_amount         DECIMAL(10,2) DEFAULT 0,
    total_amount       DECIMAL(10,2) NOT NULL,
    issue_date         DATE,
    due_date           DATE,
    status             ENUM('UNPAID','PAID','OVERDUE','CANCELLED') DEFAULT 'UNPAID',
    notes              TEXT,
    pdf_path           VARCHAR(500),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_request_id) REFERENCES service_requests(id),
    FOREIGN KEY (customer_id)        REFERENCES customers(id)
);
