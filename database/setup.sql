-- Class Management System Database Schema
-- Run these SQL commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    register_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seminars table
CREATE TABLE IF NOT EXISTS seminars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    speaker VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    venue VARCHAR(100) NOT NULL,
    registration_required BOOLEAN DEFAULT false,
    max_participants INTEGER,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homework table
CREATE TABLE IF NOT EXISTS homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    subject_url VARCHAR(500),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Syllabus table
CREATE TABLE IF NOT EXISTS syllabus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    credits INTEGER NOT NULL,
    objectives TEXT NOT NULL,
    outcomes TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    syllabus TEXT NOT NULL,
    marks INTEGER NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    tags TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seminar registrations junction table
CREATE TABLE IF NOT EXISTS seminar_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seminar_id UUID REFERENCES seminars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seminar_id, user_id)
);

-- User todos junction table (if todos can be assigned to specific users)
CREATE TABLE IF NOT EXISTS user_todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(todo_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_register_number ON users(register_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_seminars_date ON seminars(date);
CREATE INDEX IF NOT EXISTS idx_homework_date ON homework(date);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_tests_test_date ON tests(test_date);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seminars_updated_at BEFORE UPDATE ON seminars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homework_updated_at BEFORE UPDATE ON homework FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_syllabus_updated_at BEFORE UPDATE ON syllabus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: admin123)
-- Note: In production, use the application to create users with proper password hashing
INSERT INTO users (register_number, name, email, password, role) 
VALUES (
    'ADMIN001', 
    'Administrator', 
    'admin@classmanagement.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4UZxE8V5Wa', -- admin123
    'admin'
) ON CONFLICT (register_number) DO NOTHING;

-- Insert sample student users
INSERT INTO users (register_number, name, email, password, role) VALUES 
('STU001', 'John Doe', 'john.doe@student.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4UZxE8V5Wa', 'student'),
('STU002', 'Jane Smith', 'jane.smith@student.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4UZxE8V5Wa', 'student'),
('STU003', 'Mike Johnson', 'mike.johnson@student.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4UZxE8V5Wa', 'student')
ON CONFLICT (register_number) DO NOTHING;

-- Insert sample seminars
INSERT INTO seminars (title, description, speaker, date, time, venue, registration_required, max_participants, created_by) VALUES 
(
    'Introduction to Artificial Intelligence',
    'A comprehensive overview of AI technologies and their applications in modern computing.',
    'Dr. Sarah Wilson',
    '2025-02-15',
    '10:00 AM',
    'Auditorium A',
    true,
    100,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
),
(
    'Web Development Best Practices',
    'Learn the latest trends and best practices in modern web development.',
    'Prof. David Chen',
    '2025-02-20',
    '2:00 PM',
    'Conference Room B',
    true,
    50,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

-- Insert sample assignments
INSERT INTO assignments (title, description, due_date, subject) VALUES 
(
    'Database Design Project',
    'Design and implement a database schema for a library management system.',
    '2025-02-28',
    'Database Systems'
),
(
    'React.js Portfolio Website',
    'Create a personal portfolio website using React.js and modern CSS frameworks.',
    '2025-03-05',
    'Web Development'
);

-- Insert sample homework
INSERT INTO homework (subject, description, date, created_by) VALUES 
(
    'Data Structures',
    'Complete exercises 1-5 from Chapter 3: Arrays and Linked Lists',
    '2025-01-25',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
),
(
    'Computer Networks',
    'Read Chapter 2 and prepare for quiz on OSI Model',
    '2025-01-27',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

-- Insert sample tests
INSERT INTO tests (title, subject, test_date, type, description, syllabus, marks, created_by) VALUES 
(
    'Midterm Examination',
    'Database Systems',
    '2025-02-10',
    'Written',
    'Comprehensive test covering all topics from the first half of the semester.',
    'ER Diagrams, Normalization, SQL Queries, Transactions',
    100,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
),
(
    'Programming Quiz',
    'Data Structures',
    '2025-02-05',
    'Practical',
    'Hands-on programming test on arrays and linked lists.',
    'Array operations, Linked list implementation, Time complexity',
    50,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

-- Insert sample todos
INSERT INTO todos (title, description, priority, due_date, created_by) VALUES 
(
    'Prepare for Database Exam',
    'Review all notes and practice SQL queries for the upcoming midterm examination.',
    'high',
    '2025-02-08',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
),
(
    'Submit Assignment Feedback',
    'Review and provide feedback on student assignments submitted last week.',
    'medium',
    '2025-01-30',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

-- Insert sample notes
INSERT INTO notes (title, content, subject, tags, created_by) VALUES 
(
    'SQL Query Optimization Tips',
    'Key strategies for optimizing SQL queries: 1. Use indexes effectively, 2. Avoid SELECT *, 3. Use appropriate JOIN types, 4. Consider query execution plans.',
    'Database Systems',
    'sql,optimization,performance,database',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
),
(
    'React Hooks Best Practices',
    'Important guidelines when using React Hooks: 1. Only call hooks at the top level, 2. Use custom hooks for reusable logic, 3. Optimize with useMemo and useCallback when needed.',
    'Web Development',
    'react,hooks,javascript,frontend',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminars ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (these are basic examples - adjust based on your needs)
-- Users can only see their own data (except admins)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

-- Students can view all public content, admins can manage everything
CREATE POLICY "Anyone can view seminars" ON seminars FOR SELECT USING (true);
CREATE POLICY "Anyone can view homework" ON homework FOR SELECT USING (true);
CREATE POLICY "Anyone can view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Anyone can view tests" ON tests FOR SELECT USING (true);
CREATE POLICY "Anyone can view todos" ON todos FOR SELECT USING (true);
CREATE POLICY "Anyone can view notes" ON notes FOR SELECT USING (true);

-- Only admins can insert/update/delete most content
CREATE POLICY "Admins can manage seminars" ON seminars FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'admin')
);

-- Print completion message
DO $$
BEGIN
    RAISE NOTICE 'Class Management System database schema has been successfully created!';
    RAISE NOTICE 'Default admin login: ADMIN001 / admin123';
    RAISE NOTICE 'Sample student logins: STU001, STU002, STU003 / admin123';
END $$;
