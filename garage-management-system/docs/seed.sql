-- ============================================
-- Garage Management System - Seed Data
-- Run after schema.sql
-- Default admin password: admin123
-- Default staff password: staff123
-- ============================================

USE garage_management;

-- Admin user (password: admin123)
INSERT INTO app_users (username, password, email, role) VALUES
('admin', '$2a$10$bvPYQMMo8WG.ej2guZdfY.JFIGxrfsowH4Fpd7ETnUt5lorj1BBfK', 'admin@garage.com', 'ADMIN'),
('staff', '$2a$10$qDQTuJPkvcZxVWH2k8zC1OiM4Qb09DSDaqd7obq16QYudBSFZKaAG', 'staff@garage.com', 'STAFF');

-- Customers
INSERT INTO customers (first_name, last_name, phone, email, address) VALUES
('Dawit',   'Bekele',  '0911234567', 'dawit@email.com',   'Bole, Addis Ababa'),
('Sara',    'Haile',   '0922345678', 'sara@email.com',    'Kirkos, Addis Ababa'),
('Yonas',   'Tesfaye', '0933456789', 'yonas@email.com',   'Lideta, Addis Ababa'),
('Meron',   'Girma',   '0944567890', 'meron@email.com',   'Nifas Silk, Addis Ababa'),
('Abebe',   'Tadesse', '0955678901', 'abebe@email.com',   'Akaki, Addis Ababa');

-- Mechanics
INSERT INTO mechanics (first_name, last_name, phone, email, specialization, hourly_rate, status) VALUES
('Teshome', 'Alemu',   '0966789012', 'teshome@garage.com', 'Engine Repair',     250.00, 'AVAILABLE'),
('Habtamu', 'Worku',   '0977890123', 'habtamu@garage.com', 'Electrical Systems', 200.00, 'BUSY'),
('Dereje',  'Mulugeta','0988901234', 'dereje@garage.com',  'Bodywork & Paint',   180.00, 'AVAILABLE'),
('Kebede',  'Negash',  '0999012345', 'kebede@garage.com',  'Transmission',       220.00, 'AVAILABLE');

-- Vehicles
INSERT INTO vehicles (license_plate, make, model, year, vin_number, customer_id) VALUES
('AA-12345', 'Toyota',  'Corolla', 2019, 'JT2BF22K1W0074998', 1),
('AA-23456', 'Honda',   'Civic',   2020, '2HGFC2F5XLH523456', 2),
('AA-34567', 'Hyundai', 'Elantra', 2021, 'KMHD84LF3MU123456', 3),
('AA-45678', 'Nissan',  'Sunny',   2018, '3N1AB7AP1KY123456', 4),
('AA-56789', 'Toyota',  'Camry',   2022, '4T1BF1FK5CU123456', 1),
('AA-67890', 'Ford',    'Ranger',  2020, '1FTFX1E50KKE12345', 5);

-- Service Requests
INSERT INTO service_requests (vehicle_id, mechanic_id, description, status, estimated_cost, actual_cost, request_date, completion_date, notes) VALUES
(1, 1, 'Full engine oil change and filter replacement',           'COMPLETED',   500.00,   500.00, CURDATE() - INTERVAL 10 DAY, CURDATE() - INTERVAL 9 DAY,  'Used synthetic 5W-30'),
(2, 2, 'Brake pad replacement - front and rear',                  'IN_PROGRESS', 1800.00,  NULL,   CURDATE() - INTERVAL 3 DAY,  NULL,                         'Waiting for rear pads delivery'),
(3, NULL, 'Engine diagnostic - check engine light on',            'PENDING',     800.00,   NULL,   CURDATE(),                   NULL,                         NULL),
(4, 1, 'Transmission fluid flush and filter change',              'COMPLETED',   1200.00, 1200.00, CURDATE() - INTERVAL 20 DAY, CURDATE() - INTERVAL 19 DAY, 'No issues found'),
(5, 3, 'Full body respray - silver to white',                     'PENDING',     8500.00,  NULL,   CURDATE() - INTERVAL 1 DAY,  NULL,                         'Customer requested pearl white'),
(6, 4, 'Suspension overhaul - all four corners',                  'COMPLETED',   4500.00, 4800.00, CURDATE() - INTERVAL 5 DAY,  CURDATE() - INTERVAL 2 DAY,  'Replaced all bushings');

-- Inventory
INSERT INTO inventory_items (name, category, quantity, min_quantity, unit_price, supplier, sku) VALUES
('Engine Oil 5W-30 (1L)',        'FLUIDS', 45,  10, 180.00,  'Ethio Oil Supplies',   'OIL-5W30-1L'),
('Oil Filter - Toyota',          'PARTS',   8,   5, 85.00,   'Toyota Parts ET',      'FLT-OIL-TOY'),
('Brake Pad Set - Front',        'PARTS',  12,   5, 650.00,  'AutoParts Ethiopia',   'BRK-PAD-FRT'),
('Brake Pad Set - Rear',         'PARTS',   3,   5, 550.00,  'AutoParts Ethiopia',   'BRK-PAD-RR'),
('Transmission Fluid (1L)',      'FLUIDS', 20,   8, 200.00,  'Ethio Oil Supplies',   'FLD-TRANS-1L'),
('Spark Plugs (set of 4)',       'PARTS',  15,   5, 320.00,  'NGK Ethiopia',         'SPK-PLG-SET4'),
('Air Filter - Universal',       'PARTS',   6,   5, 120.00,  'AutoParts Ethiopia',   'FLT-AIR-UNI'),
('Coolant (1L)',                 'FLUIDS', 18,   8, 95.00,   'Ethio Oil Supplies',   'FLD-COOL-1L'),
('Hydraulic Jack (2T)',          'TOOLS',   4,   2, 2500.00, 'Tool Depot Addis',     'TL-HYD-2T'),
('Wrench Set (metric)',          'TOOLS',   6,   2, 1800.00, 'Tool Depot Addis',     'TL-WRN-MET'),
('Wiper Blades (pair)',          'PARTS',  10,   5, 180.00,  'AutoParts Ethiopia',   'WPR-BLD-PR'),
('Battery 60Ah',                 'PARTS',   2,   3, 3200.00, 'Battery Plus ET',      'BAT-60AH');
