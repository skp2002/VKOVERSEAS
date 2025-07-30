// Admin Panel JavaScript

// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Add active class to clicked nav link
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    
    // Load data for the section
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'contacts':
            loadContacts();
            break;
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        const [bookingsResponse, contactsResponse] = await Promise.all([
            fetch(`${API_BASE}/admin/bookings`),
            fetch(`${API_BASE}/admin/contacts`)
        ]);
        
        const bookings = await bookingsResponse.json();
        const contacts = await contactsResponse.json();
        
        // Update stats
        document.getElementById('totalBookings').textContent = bookings.length;
        document.getElementById('totalContacts').textContent = contacts.length;
        document.getElementById('pendingBookings').textContent = 
            bookings.filter(b => b.status === 'pending').length;
        document.getElementById('newContacts').textContent = 
            contacts.filter(c => c.status === 'new').length;
        
        // Update recent activity
        displayRecentBookings(bookings.slice(0, 5));
        displayRecentContacts(contacts.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error loading dashboard data', 'danger');
    }
}

function displayRecentBookings(bookings) {
    const container = document.getElementById('recentBookings');
    
    if (bookings.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent bookings</p>';
        return;
    }
    
    container.innerHTML = bookings.map(booking => `
        <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
            <div>
                <strong>${booking.name}</strong><br>
                <small class="text-muted">${booking.country} - ${booking.purpose}</small>
            </div>
            <div class="text-end">
                <span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span><br>
                <small class="text-muted">${formatDate(booking.created_at)}</small>
            </div>
        </div>
    `).join('');
}

function displayRecentContacts(contacts) {
    const container = document.getElementById('recentContacts');
    
    if (contacts.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent contacts</p>';
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
            <div>
                <strong>${contact.name}</strong><br>
                <small class="text-muted">${contact.subject}</small>
            </div>
            <div class="text-end">
                <span class="badge bg-${getStatusColor(contact.status)}">${contact.status}</span><br>
                <small class="text-muted">${formatDate(contact.created_at)}</small>
            </div>
        </div>
    `).join('');
}

// Bookings functions
async function loadBookings() {
    try {
        const response = await fetch(`${API_BASE}/admin/bookings`);
        const bookings = await response.json();
        
        displayBookingsTable(bookings);
    } catch (error) {
        console.error('Error loading bookings:', error);
        showAlert('Error loading bookings', 'danger');
    }
}

function displayBookingsTable(bookings) {
    const tbody = document.getElementById('bookingsTable');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.phone}</td>
            <td>${booking.country}</td>
            <td>${booking.purpose}</td>
            <td>${formatDate(booking.date)}</td>
            <td>
                <select class="form-select form-select-sm" onchange="updateBookingStatus(${booking.id}, this.value)">
                    <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewBookingDetails(${booking.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function updateBookingStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE}/admin/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showAlert('Booking status updated successfully', 'success');
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showAlert('Error updating booking status', 'danger');
    }
}

function viewBookingDetails(id) {
    fetch(`${API_BASE}/admin/bookings`)
        .then(response => response.json())
        .then(bookings => {
            const booking = bookings.find(b => b.id === id);
            if (booking) {
                document.getElementById('modalTitle').textContent = 'Booking Details';
                document.getElementById('modalBody').innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Personal Information</h6>
                            <p><strong>Name:</strong> ${booking.name}</p>
                            <p><strong>Email:</strong> ${booking.email}</p>
                            <p><strong>Phone:</strong> ${booking.phone}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Consultation Details</h6>
                            <p><strong>Country:</strong> ${booking.country}</p>
                            <p><strong>Purpose:</strong> ${booking.purpose}</p>
                            <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <h6>Message</h6>
                            <p>${booking.message || 'No message provided'}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Created:</strong> ${formatDate(booking.created_at)}</p>
                        </div>
                    </div>
                `;
                new bootstrap.Modal(document.getElementById('detailModal')).show();
            }
        });
}

// Contacts functions
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/admin/contacts`);
        const contacts = await response.json();
        
        displayContactsTable(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
        showAlert('Error loading contacts', 'danger');
    }
}

function displayContactsTable(contacts) {
    const tbody = document.getElementById('contactsTable');
    
    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No contacts found</td></tr>';
        return;
    }
    
    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td>${contact.id}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>${truncateText(contact.message, 50)}</td>
            <td><span class="badge bg-${getStatusColor(contact.status)}">${contact.status}</span></td>
            <td>${formatDate(contact.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewContactDetails(${contact.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewContactDetails(id) {
    fetch(`${API_BASE}/admin/contacts`)
        .then(response => response.json())
        .then(contacts => {
            const contact = contacts.find(c => c.id === id);
            if (contact) {
                document.getElementById('modalTitle').textContent = 'Contact Details';
                document.getElementById('modalBody').innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Contact Information</h6>
                            <p><strong>Name:</strong> ${contact.name}</p>
                            <p><strong>Email:</strong> ${contact.email}</p>
                            <p><strong>Subject:</strong> ${contact.subject}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Status & Date</h6>
                            <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(contact.status)}">${contact.status}</span></p>
                            <p><strong>Created:</strong> ${formatDate(contact.created_at)}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <h6>Message</h6>
                            <p>${contact.message}</p>
                        </div>
                    </div>
                `;
                new bootstrap.Modal(document.getElementById('detailModal')).show();
            }
        });
}

// Utility functions
function getStatusColor(status) {
    switch(status) {
        case 'pending':
        case 'new':
            return 'warning';
        case 'confirmed':
        case 'read':
            return 'info';
        case 'completed':
        case 'replied':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'secondary';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function refreshData() {
    loadDashboard();
}