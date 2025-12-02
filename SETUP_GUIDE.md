# BIMS Setup Guide

Complete step-by-step guide to set up and run the Barangay Information Management System.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **Node.js** (v14.0 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **MySQL Server** (v8.0 or higher)
   - Download from https://www.mysql.com/
   - During installation, set:
     - Root user password
     - Port: 3306 (default)

4. **Git** (optional but recommended)
   - Download from https://git-scm.com/
   - Verify installation: `git --version`

## Database Setup

### Step 1: Create Database

1. **Open MySQL Command Line or MySQL Workbench**

2. **Create the database and user**:
   ```sql
   -- Create database
   CREATE DATABASE bims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   -- Create user
   CREATE USER 'bims_user'@'localhost' IDENTIFIED BY 'bims_password_123';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON bims_db.* TO 'bims_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Verify connection**:
   ```bash
   mysql -u bims_user -p
   # Enter password: bims_password_123
   # Type: USE bims_db;
   # Type: SHOW TABLES;
   ```

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
Create `.env` file in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_NAME=bims_db
DB_USER=bims_user
DB_PASS=bims_password_123
DB_HOST=localhost
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_here_change_this_in_production

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Verify Setup
```bash
npm run dev
```

You should see:
```
DB synced
Server running on http://localhost:4000
```

### Step 5: Seed Sample Data (Optional)

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- Sample households
- Sample residents
- Sample officials
- Sample users (if applicable)

**Stop the server** (Ctrl+C) before continuing to frontend setup.

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
# From the project root
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
Create `.env.local` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000/api
```

### Step 4: Verify Setup
Try building the project:
```bash
npm run build
```

This should complete without errors.

## Running the Application

### Option 1: Using Two Terminal Windows (Recommended for Development)

**Terminal 1 - Start Backend**:
```bash
cd backend
npm run dev
```

Expected output:
```
DB synced
Server running on http://localhost:4000
```

**Terminal 2 - Start Frontend**:
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v7.2.4  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Open Browser**:
- Navigate to `http://localhost:5173`
- You should see the BIMS dashboard

### Option 2: Using npm concurrently (Advanced)

Install globally:
```bash
npm install -g concurrently
```

From project root, create a script or run:
```bash
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## First Time Usage

### 1. Access the Application
- Open http://localhost:5173 in your browser

### 2. Navigate the Dashboard
- **Dashboard**: View system statistics
- **Residents**: Manage resident information
- **Certificates**: Issue and track certificates
- **Blotter**: Record incidents
- **Officials**: Manage official staff
- **Reports**: View system reports
- **Admin**: Administrative settings

### 3. Try Sample Features

**Search Residents**:
1. Go to "Residents" page
2. Type a name in search box
3. Click "Search"

**Export Data**:
1. Search for residents (or leave empty)
2. Click "Export All" or "Export Search Results"
3. CSV file will download

**Add New Resident**:
1. Go to "Residents" page
2. Click "+ Add Resident"
3. Fill in the form
4. Click "Save Changes"

## Troubleshooting

### Issue: "Port 4000 already in use"

**Solution**:
```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill process (replace PID with actual process ID)
taskkill /PID [PID] /F

# Or use different port - edit .env:
PORT=5000
```

### Issue: "Cannot connect to MySQL"

**Check**:
1. MySQL server is running
   - Windows: Check Services (services.msc)
   - Command: `mysql -u root -p`

2. Credentials in `.env` are correct
   - Test: `mysql -u bims_user -p bims_db`

3. Database and user exist:
   ```sql
   SHOW DATABASES;
   SELECT User, Host FROM mysql.user;
   ```

### Issue: "npm install fails"

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue: "Vite can't connect to API"

**Check**:
1. Backend is running on port 4000
2. `.env.local` has correct API URL
3. CORS_ORIGIN in backend `.env` matches frontend URL
4. No firewall blocking port 4000

### Issue: "Blank page in browser"

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Restart both backend and frontend

### Issue: "Database sync errors"

**Solution**:
1. Check that database exists:
   ```sql
   SHOW DATABASES;
   ```

2. Drop and recreate if needed:
   ```sql
   DROP DATABASE bims_db;
   CREATE DATABASE bims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Restart backend server

## Development Workflow

### Daily Setup
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### Making Changes

**Backend Changes**:
- Automatically reload with Nodemon
- No restart needed for code changes

**Frontend Changes**:
- Automatically hot reload with Vite
- Changes appear instantly in browser

### Testing
```bash
cd backend
npm test
```

## Production Deployment (Quick Guide)

### Backend
1. Create `.env` with production values
2. Set `NODE_ENV=production`
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/src/server.js --name "bims-api"
   ```

### Frontend
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy `frontend/dist/` to a web server (Nginx, Apache, etc.)

3. Update `VITE_API_URL` to production API endpoint

## Next Steps

1. **Explore the codebase**: Review file structure
2. **Read API Documentation**: Check README.md for endpoints
3. **Customize**: Modify fields and features as needed
4. **Deploy**: Set up production environment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review README.md
3. Check browser console for errors
4. Open a GitHub issue

---

**Happy coding!** 🚀
