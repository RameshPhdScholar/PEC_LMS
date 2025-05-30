-- Create System Users table
CREATE TABLE IF NOT EXISTS system_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insert default system users
INSERT INTO system_users (email, password, role_id) VALUES
('superadmin@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 5), -- password: password123
('admin@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 4), -- password: password123
('principal@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 3), -- password: password123
('cse.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('eee.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('ece.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('ce.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('csd.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('csc.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('csm.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('has.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2), -- password: password123
('mba.hod@pallaviengineeringcollege.ac.in', '$2a$10$yCbXUYDqF3/nYZxw8bfOre5i9XjUZxOAzJhYYT.Rq6LgBXlJtBE7a', 2); -- password: password123
