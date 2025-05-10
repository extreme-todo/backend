-- Assuming the table name is 'focused_time'
-- Adjust the table name and column names as necessary

-- First, ensure the table exists with the correct structure
CREATE TABLE IF NOT EXISTS focused_time (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  categoryId INT NOT NULL,
  duration INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (categoryId) REFERENCES category(id)
);

-- Insert data for April 2024 (first month)
INSERT INTO focused_time (userId, categoryId, duration, createdAt, updatedAt)
VALUES
  (1, 1, 30, '2024-04-01 00:00:00', NOW()),
  (1, 1, 45, '2024-04-01 02:00:00', NOW()),
  (1, 1, 20, '2024-04-01 04:00:00', NOW()),
  (1, 1, 15, '2024-04-01 06:00:00', NOW()),
  (1, 1, 25, '2024-04-01 08:00:00', NOW()),
  (1, 1, 10, '2024-04-01 10:00:00', NOW()),
  (1, 1, 18, '2024-04-01 12:00:00', NOW()),
  (1, 1, 22, '2024-04-01 14:00:00', NOW()),
  (1, 1, 12, '2024-04-01 16:00:00', NOW()),
  (1, 1, 8, '2024-04-01 18:00:00', NOW()),
  (1, 1, 15, '2024-04-01 20:00:00', NOW()),
  (1, 1, 10, '2024-04-01 22:00:00', NOW());

-- Insert data for May 2024 (second month)
INSERT INTO focused_time (userId, categoryId, duration, createdAt, updatedAt)
VALUES
  (1, 1, 35, '2024-05-01 00:00:00', NOW()),
  (1, 1, 40, '2024-05-01 02:00:00', NOW()),
  (1, 1, 25, '2024-05-01 04:00:00', NOW()),
  (1, 1, 20, '2024-05-01 06:00:00', NOW()),
  (1, 1, 30, '2024-05-01 08:00:00', NOW()),
  (1, 1, 15, '2024-05-01 10:00:00', NOW()),
  (1, 1, 22, '2024-05-01 12:00:00', NOW()),
  (1, 1, 28, '2024-05-01 14:00:00', NOW()),
  (1, 1, 18, '2024-05-01 16:00:00', NOW()),
  (1, 1, 12, '2024-05-01 18:00:00', NOW()),
  (1, 1, 20, '2024-05-01 20:00:00', NOW()),
  (1, 1, 15, '2024-05-01 22:00:00', NOW());

-- Insert data for the last day of May 2024
INSERT INTO focused_time (userId, categoryId, duration, createdAt, updatedAt)
VALUES
  (1, 1, 30, '2024-05-31 00:00:00', NOW()),
  (1, 1, 45, '2024-05-31 02:00:00', NOW()),
  (1, 1, 20, '2024-05-31 04:00:00', NOW()),
  (1, 1, 15, '2024-05-31 06:00:00', NOW()),
  (1, 1, 25, '2024-05-31 08:00:00', NOW()),
  (1, 1, 10, '2024-05-31 10:00:00', NOW()),
  (1, 1, 18, '2024-05-31 12:00:00', NOW()),
  (1, 1, 22, '2024-05-31 14:00:00', NOW()),
  (1, 1, 12, '2024-05-31 16:00:00', NOW()),
  (1, 1, 8, '2024-05-31 18:00:00', NOW()),
  (1, 1, 15, '2024-05-31 20:00:00', NOW()),
  (1, 1, 10, '2024-05-31 22:00:00', NOW());

-- Insert data for a few more days in April and May to ensure we have data for all days
INSERT INTO focused_time (userId, categoryId, duration, createdAt, updatedAt)
VALUES
  (1, 1, 25, '2024-04-15 00:00:00', NOW()),
  (1, 1, 30, '2024-04-15 02:00:00', NOW()),
  (1, 1, 20, '2024-04-15 04:00:00', NOW()),
  (1, 1, 15, '2024-04-15 06:00:00', NOW()),
  (1, 1, 25, '2024-04-15 08:00:00', NOW()),
  (1, 1, 10, '2024-04-15 10:00:00', NOW()),
  (1, 1, 18, '2024-04-15 12:00:00', NOW()),
  (1, 1, 22, '2024-04-15 14:00:00', NOW()),
  (1, 1, 12, '2024-04-15 16:00:00', NOW()),
  (1, 1, 8, '2024-04-15 18:00:00', NOW()),
  (1, 1, 15, '2024-04-15 20:00:00', NOW()),
  (1, 1, 10, '2024-04-15 22:00:00', NOW()),
  
  (1, 1, 25, '2024-05-15 00:00:00', NOW()),
  (1, 1, 30, '2024-05-15 02:00:00', NOW()),
  (1, 1, 20, '2024-05-15 04:00:00', NOW()),
  (1, 1, 15, '2024-05-15 06:00:00', NOW()),
  (1, 1, 25, '2024-05-15 08:00:00', NOW()),
  (1, 1, 10, '2024-05-15 10:00:00', NOW()),
  (1, 1, 18, '2024-05-15 12:00:00', NOW()),
  (1, 1, 22, '2024-05-15 14:00:00', NOW()),
  (1, 1, 12, '2024-05-15 16:00:00', NOW()),
  (1, 1, 8, '2024-05-15 18:00:00', NOW()),
  (1, 1, 15, '2024-05-15 20:00:00', NOW()),
  (1, 1, 10, '2024-05-15 22:00:00', NOW());