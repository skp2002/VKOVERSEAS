# VK Overseas - Study Abroad & Visa Consultancy Website

A comprehensive, responsive website for VK Overseas consultancy services, helping students with study visas, visitor visas, and education loans.

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern UI**: Clean, professional design with smooth animations
- **Multi-page Website**: Home, About, Services, Destinations, Contact, Booking
- **Interactive Forms**: Consultation booking and contact forms
- **Testimonials Slider**: Rotating student testimonials
- **Partner Universities**: Showcase of partner institutions

### Backend
- **Node.js/Express**: RESTful API server
- **MySQL Database**: Structured data storage
- **Email Notifications**: Automated email alerts for new submissions
- **Admin Panel**: Complete management interface
- **Form Validation**: Server-side validation and security

### Pages Included
1. **Homepage** - Hero section, destinations, testimonials, partner logos
2. **About** - Company story, mission, vision, team
3. **Services** - Study visa, visitor visa, education loan services
4. **Destinations** - Canada, UK, Australia study information
5. **Booking** - Consultation booking form
6. **Contact** - Contact form and office information
7. **Admin Panel** - Dashboard for managing submissions

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Email**: Nodemailer
- **Icons**: Font Awesome
- **Styling**: Custom CSS with Bootstrap

## Installation

### Prerequisites
- Node.js (v14+)
- MySQL Server
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vk-overseas-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `vk_overseas`
   - Import the database schema:
   ```bash
   mysql -u your_username -p vk_overseas < server/database.sql
   ```

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the following variables:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=vk_overseas
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ADMIN_EMAIL=admin@vkoverseas.com
   PORT=3000
   ```

5. **Start the application**
   ```bash
   # Start the backend server
   npm run server
   
   # In another terminal, start the frontend
   npm run dev
   ```

6. **Access the website**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - Admin Panel: `http://localhost:5173/admin`

## File Structure

```
vk-overseas-website/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── logo.png
├── server/
│   ├── app.js
│   └── database.sql
├── admin/
│   ├── index.html
│   └── admin.js
├── index.html
├── about.html
├── booking.html
├── contact.html
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Public Endpoints
- `POST /api/bookings` - Submit consultation booking
- `POST /api/contact` - Submit contact form

### Admin Endpoints
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/contacts` - Get all contacts
- `PUT /api/admin/bookings/:id` - Update booking status

## Database Schema

### Bookings Table
- `id` - Primary key
- `name` - Client name
- `email` - Client email
- `phone` - Client phone
- `country` - Country of interest
- `purpose` - Consultation purpose
- `date` - Preferred date
- `message` - Additional message
- `status` - Booking status (pending, confirmed, completed, cancelled)
- `created_at` - Timestamp

### Contacts Table
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email
- `subject` - Message subject
- `message` - Message content
- `status` - Contact status (new, read, replied)
- `created_at` - Timestamp

## Customization

### Branding
- Update logo in `assets/images/logo.png`
- Modify colors in `assets/css/style.css` (CSS variables)
- Update company information in HTML files

### Content
- Edit page content in HTML files
- Update testimonials in `index.html`
- Modify service descriptions in respective pages

### Styling
- Customize colors in CSS variables
- Modify Bootstrap theme
- Add custom animations and effects

## Deployment

### Frontend (Static Files)
- Build the frontend files
- Deploy to services like Netlify, Vercel, or GitHub Pages

### Backend
- Deploy to services like Heroku, DigitalOcean, or AWS
- Configure environment variables
- Set up MySQL database

### Database
- Use managed MySQL services (AWS RDS, Google Cloud SQL)
- Import the database schema
- Update connection strings

## Security Features

- Form validation (client and server-side)
- SQL injection prevention
- CORS configuration
- Input sanitization
- Environment variable protection

## Support

For technical support or customization requests:
- Email: support@vkoverseas.com
- Documentation: Refer to code comments and this README

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**VK Overseas** - Your trusted partner in global education and visa consultancy services.