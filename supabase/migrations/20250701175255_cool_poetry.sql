-- VK Overseas Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS vk_overseas;
USE vk_overseas;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    message TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);

-- Insert sample data (optional for testing)
INSERT INTO bookings (name, email, phone, country, purpose, date, message) VALUES
('John Doe', 'john@example.com', '+1234567890', 'Canada', 'Study Visa', '2025-02-15', 'Interested in studying computer science'),
('Jane Smith', 'jane@example.com', '+1234567891', 'UK', 'Study Visa', '2025-02-20', 'Looking for MBA programs'),
('Mike Johnson', 'mike@example.com', '+1234567892', 'Australia', 'Visitor Visa', '2025-02-25', 'Planning to visit family');

INSERT INTO contacts (name, email, subject, message) VALUES
('Sarah Wilson', 'sarah@example.com', 'General Inquiry', 'I would like to know more about your services'),
('David Brown', 'david@example.com', 'Study Visa', 'What documents are required for UK student visa?'),
('Lisa Davis', 'lisa@example.com', 'Education Loan', 'Need help with education loan application');