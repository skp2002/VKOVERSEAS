const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vk_overseas'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Routes

// Booking consultation endpoint
app.post('/api/bookings', (req, res) => {
    const { name, email, phone, country, purpose, date, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !country || !purpose || !date) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    // Insert into database
    const query = `
        INSERT INTO bookings (name, email, phone, country, purpose, date, message, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    db.query(query, [name, email, phone, country, purpose, date, message], (err, result) => {
        if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ error: 'Failed to book consultation' });
        }
        
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || 'admin@vkoverseas.com',
            subject: 'New Consultation Booking',
            html: `
                <h2>New Consultation Booking</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Purpose:</strong> ${purpose}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        
        res.json({ message: 'Consultation booked successfully', id: result.insertId });
    });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert into database
    const query = `
        INSERT INTO contacts (name, email, subject, message, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    `;
    
    db.query(query, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error('Error inserting contact:', err);
            return res.status(500).json({ error: 'Failed to send message' });
        }
        
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || 'admin@vkoverseas.com',
            subject: `New Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        
        res.json({ message: 'Message sent successfully', id: result.insertId });
    });
});

// Get all bookings (for admin panel)
app.get('/api/admin/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'Failed to fetch bookings' });
        }
        
        res.json(results);
    });
});

// Get all contacts (for admin panel)
app.get('/api/admin/contacts', (req, res) => {
    const query = 'SELECT * FROM contacts ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching contacts:', err);
            return res.status(500).json({ error: 'Failed to fetch contacts' });
        }
        
        res.json(results);
    });
});

// Update booking status
app.put('/api/admin/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const query = 'UPDATE bookings SET status = ? WHERE id = ?';
    
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating booking:', err);
            return res.status(500).json({ error: 'Failed to update booking' });
        }
        
        res.json({ message: 'Booking updated successfully' });
    });
});

// Serve static files
app.use(express.static('public'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;