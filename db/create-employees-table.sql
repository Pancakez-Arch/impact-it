-- Create employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Employees are viewable by everyone" 
ON employees FOR SELECT USING (true);

CREATE POLICY "Employees are insertable by admins" 
ON employees FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Employees are updatable by admins" 
ON employees FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Employees are deletable by admins" 
ON employees FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Insert sample employees
INSERT INTO employees (name, title, bio, image_url, email, phone)
VALUES 
  ('Alex Johnson', 'Technical Specialist', 'Alex has over 10 years of experience with professional camera equipment and lighting setups.', '/placeholder.svg?height=400&width=400', 'alex@techrent.com', '(555) 123-4567'),
  ('Sarah Williams', 'Customer Relations Manager', 'Sarah ensures all our clients receive exceptional service and support throughout their rental period.', '/placeholder.svg?height=400&width=400', 'sarah@techrent.com', '(555) 234-5678'),
  ('Michael Chen', 'Equipment Coordinator', 'Michael manages our inventory and ensures all equipment is properly maintained and ready for rental.', '/placeholder.svg?height=400&width=400', 'michael@techrent.com', '(555) 345-6789'),
  ('Emma Rodriguez', 'Technical Support Lead', 'Emma provides expert technical support and training for all our rental equipment.', '/placeholder.svg?height=400&width=400', 'emma@techrent.com', '(555) 456-7890'),
  ('David Kim', 'Logistics Manager', 'David coordinates equipment deliveries and pickups to ensure timely service.', '/placeholder.svg?height=400&width=400', 'david@techrent.com', '(555) 567-8901');
