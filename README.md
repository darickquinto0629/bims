# BIMS - Barangay Information Management System

A comprehensive full-stack web application for managing barangay (village) administrative data including residents, certificates, incidents, and officials.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Features Documentation](#features-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Management
- **Resident Management** - Add, edit, and manage resident information
- **Household Management** - Organize residents into households
- **Certificate Management** - Issue and track official certificates
- **Blotter System** - Record and manage incidents/violations
- **Officials Directory** - Maintain official staff information
- **User Management** - System user accounts with authentication
- **Activity Logging** - Track all system changes

### Advanced Features
- **Search & Filter** - Find residents by name with real-time search
- **Data Export** - Export search results or all data to CSV/JSON formats
- **Reporting Dashboard** - View system statistics and summaries
- **User Authentication** - Secure login with JWT tokens
- **Password Encryption** - Bcrypt-based password hashing
- **Responsive UI** - Beautiful mobile-friendly interface with Tailwind CSS

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (4.18.2)
- **Database**: MySQL 8.0+
- **ORM**: Sequelize (6.32.1)
- **Authentication**: JWT (jsonwebtoken 9.0.0), Bcrypt (5.1.0)
- **Other**: CORS, body-parser, CSV export (csv-stringify)

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.13
- **Routing**: React Router DOM 6.14.1
- **HTTP Client**: Axios 1.4.0
- **PostCSS**: Autoprefixer 10.4.14

### Development Tools
- **Backend**: Nodemon 3.1.11, Jest 29.5.0, Supertest 6.3.3
- **Frontend**: @vitejs/plugin-react 4.0.0

## 📁 Project Structure

```
bims/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── residentController.js
│   │   │   ├── householdController.js
│   │   │   ├── certificateController.js
│   │   │   ├── blotterController.js
│   │   │   ├── officialController.js
│   │   │   ├── userController.js
│   │   │   └── reportController.js
│   │   ├── models/           # Database models
│   │   │   ├── resident.js
│   │   │   ├── household.js
│   │   │   ├── certificate.js
│   │   │   ├── blotter.js
│   │   │   ├── official.js
│   │   │   ├── user.js
│   │   │   ├── activityLog.js
│   │   │   └── index.js
│   │   ├── routes/           # API route definitions
│   │   │   ├── residentRoutes.js
│   │   │   ├── householdRoutes.js
│   │   │   ├── certificateRoutes.js
│   │   │   ├── blotterRoutes.js
│   │   │   ├── officialRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── seed/             # Database seeding
│   │   │   └── seed.js
│   │   └── server.js         # Express app setup
│   ├── package.json
│   └── .env                  # Environment variables (not in repo)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js        # Axios configuration
│   │   ├── components/       # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   └── Table.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── admin/
│   │   │   ├── blotter/
│   │   │   ├── certificates/
│   │   │   ├── officials/
│   │   │   ├── reports/
│   │   │   └── residents/
│   │   ├── styles/
│   │   │   └── index.css     # Tailwind imports
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local            # Environment variables (not in repo)
│
├── .gitignore
├── README.md                 # This file
└── CONTRIBUTING.md           # Contribution guidelines
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 14.0 or higher
- **npm** or **yarn** package manager
- **MySQL** 8.0 or higher
- **Git** (for version control)

### Installation

1. **Clone the repository** (after pushing to GitHub)
   ```bash
   git clone https://github.com/your-username/bims.git
   cd bims
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_NAME=bims_db
DB_USER=root
DB_PASS=your_password_here
DB_HOST=localhost
DB_PORT=3306

# Authentication
JWT_SECRET=your_secret_key_here

# API
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000/api
```

### Database Setup

1. **Create the database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE bims_db;
   USE bims_db;
   ```

2. **Run migrations** (tables are auto-created on server startup)
   The backend will automatically sync the database schema on startup using Sequelize.

3. **Seed sample data** (optional)
   ```bash
   cd backend
   npm run seed
   ```

## ▶️ Running the Application

### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:4000`

2. **Start Frontend Development Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   - Open `http://localhost:5173` in your browser

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```
   Output will be in `frontend/dist/`

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints

#### Residents
- `GET /residents` - List residents (supports search with `?q=name`)
- `GET /residents/:id` - Get resident details
- `POST /residents` - Create new resident
- `PUT /residents/:id` - Update resident
- `DELETE /residents/:id` - Delete resident
- `GET /residents/export` - Export residents to CSV

#### Households
- `GET /households` - List all households
- `GET /households/:id` - Get household details
- `POST /households` - Create household
- `PUT /households/:id` - Update household
- `DELETE /households/:id` - Delete household

#### Certificates
- `GET /certificates` - List certificates
- `GET /certificates/:id` - Get certificate details
- `POST /certificates` - Create certificate
- `PUT /certificates/:id` - Update certificate
- `DELETE /certificates/:id` - Delete certificate

#### Blotter (Incidents)
- `GET /blotter` - List incidents
- `GET /blotter/:id` - Get incident details
- `POST /blotter` - Create incident
- `PUT /blotter/:id` - Update incident
- `DELETE /blotter/:id` - Delete incident

#### Officials
- `GET /officials` - List officials
- `GET /officials/:id` - Get official details
- `POST /officials` - Create official
- `PUT /officials/:id` - Update official
- `DELETE /officials/:id` - Delete official

#### Reports
- `GET /reports/summary` - Get dashboard summary statistics

#### Users
- `POST /users/login` - User login (returns JWT)
- `POST /users/register` - User registration
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user

### Authentication
Include JWT token in request headers:
```
Authorization: Bearer {token}
```

## 🗄️ Database Schema

### Core Models

#### Resident
- `id` (Primary Key)
- `household_id` (Foreign Key)
- `first_name`, `middle_name`, `last_name`, `suffix`
- `birth_date`, `gender`, `civil_status`
- `occupation`, `contact_number`, `email`
- `national_id`, `voter_status`, `is_head`
- `remarks`, `timestamps`, `deleted_at` (soft delete)

#### Household
- `id` (Primary Key)
- `household_code` (Unique)
- `address_line`, `barangay`, `city`
- `postal_code`, `timestamps`, `deleted_at`

#### Certificate
- `id` (Primary Key)
- `resident_id` (Foreign Key)
- `certificate_type`, `issue_date`, `expiry_date`
- `remarks`, `timestamps`, `deleted_at`

#### Blotter
- `id` (Primary Key)
- `resident_id` (Foreign Key)
- `incident_type`, `incident_date`
- `description`, `status`, `remarks`
- `timestamps`, `deleted_at`

#### Official
- `id` (Primary Key)
- `position`, `first_name`, `last_name`
- `contact_number`, `email`, `start_date`, `end_date`
- `status`, `timestamps`, `deleted_at`

#### User
- `id` (Primary Key)
- `username`, `email`, `password_hash`
- `role`, `is_active`, `timestamps`, `deleted_at`

#### ActivityLog
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `action`, `entity_type`, `entity_id`
- `old_values`, `new_values`, `timestamps`

## 📖 Features Documentation

### Resident Management
- **Search**: Use the search bar to find residents by first or last name
- **Add New**: Click "+ Add Resident" button to create new resident
- **Edit**: Click "Edit" on any resident row to modify their information
- **Export**: Export all residents or search results as CSV/JSON

### Certificate Management
- **Issue Certificate**: Create official certificates for residents
- **Track Status**: Monitor certificate validity and expiration
- **Export**: Export certificate data for records

### Incident Tracking (Blotter)
- **Record Incidents**: Document violations or incidents involving residents
- **Status Tracking**: Update incident status (pending, resolved, closed)
- **Historical Records**: Maintain complete incident history

### Dashboard
- View real-time statistics (total residents, issued certificates, incidents)
- Monitor system activity
- Quick access to all management features

## 🤝 Contributing

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Update tests as needed
   - Add comments for complex logic

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Describe your changes clearly
   - Reference any related issues

## 📋 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For support, issues, or questions:
- Create an issue on GitHub
- Contact: your-email@example.com

---

**Last Updated**: December 1, 2025
**Version**: 1.0.0
