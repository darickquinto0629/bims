# BIMS Project Quick Reference

Quick reference guide for common tasks and commands.

## 📦 Project Files Created

```
bims/
├── README.md                  # Main project documentation
├── CONTRIBUTING.md            # Contribution guidelines
├── SETUP_GUIDE.md            # Installation & setup instructions
├── API_DOCUMENTATION.md      # Complete API reference
├── DEPLOYMENT_GUIDE.md       # Production deployment guide
├── .gitignore               # Git ignore rules
└── (existing project files)
```

## 🚀 Quick Start

### First Time Setup (5 minutes)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env  # Create and configure
npm run dev

# 2. Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env.local  # Create and configure
npm run dev

# 3. Open browser
# http://localhost:5173
```

## ⚙️ Common Commands

### Backend

```bash
# Development
npm run dev              # Start with hot-reload (nodemon)

# Production
npm start               # Start server
npm run seed            # Seed sample data
npm test                # Run tests

# Database
npm run migrate         # Run migrations (auto with server)
npm run seed:fresh      # Clear and seed database
```

### Frontend

```bash
# Development
npm run dev             # Start dev server with hot-reload

# Production
npm run build           # Build for production
npm run preview         # Preview production build
npm run build:analyze   # Analyze bundle size
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=4000
NODE_ENV=development
DB_NAME=bims_db
DB_USER=root
DB_PASS=password
DB_HOST=localhost
JWT_SECRET=secret_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:4000/api
```

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main app |
| Backend API | http://localhost:4000/api | REST API |
| MySQL | localhost:3306 | Database |

## 📚 Key Endpoints

```bash
# Residents
GET    /api/residents                 # List all
GET    /api/residents?q=john          # Search by name
POST   /api/residents                 # Create
PUT    /api/residents/:id             # Update
DELETE /api/residents/:id             # Delete
GET    /api/residents/export          # Export CSV

# Households
GET    /api/households
POST   /api/households
PUT    /api/households/:id
DELETE /api/households/:id

# Certificates
GET    /api/certificates
POST   /api/certificates
PUT    /api/certificates/:id
DELETE /api/certificates/:id

# Blotter
GET    /api/blotter
POST   /api/blotter
PUT    /api/blotter/:id
DELETE /api/blotter/:id

# Officials
GET    /api/officials
POST   /api/officials
PUT    /api/officials/:id
DELETE /api/officials/:id

# Reports
GET    /api/reports/summary           # Dashboard stats

# Users
POST   /api/users/register            # Register
POST   /api/users/login               # Login
GET    /api/users/:id                 # Get user
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── seed/           # Sample data
│   └── server.js       # Express setup
└── package.json

frontend/
├── src/
│   ├── api/            # HTTP requests
│   ├── components/     # Reusable UI
│   ├── pages/          # Page components
│   ├── styles/         # CSS/Tailwind
│   ├── App.jsx         # Main component
│   └── main.jsx        # Entry point
└── package.json
```

## 🔐 Authentication

### Login
```bash
POST /api/users/login
{
  "username": "admin",
  "password": "password123"
}
```

### Using Token
```bash
Authorization: Bearer {token}
```

## 🐛 Debugging

### Check Backend Logs
```bash
# In backend terminal
npm run dev

# Look for errors in console
# Check database connection
# Verify .env variables
```

### Check Frontend Logs
```bash
# Browser DevTools (F12)
# Console tab - JavaScript errors
# Network tab - HTTP requests
# Application tab - Local storage
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or use different port |
| Cannot connect to DB | Check MySQL running, credentials |
| API 404 errors | Verify backend running on :4000 |
| Blank frontend page | Check browser console, network tab |
| Search not working | Check database has data |

## 🎨 UI Components

### Layout.jsx
- Main wrapper with sidebar
- Navigation menu
- Active route highlighting

### PageHeader.jsx
- Page title
- Action buttons
- Decorative accent line

### Table.jsx
- List display
- Hover effects
- Empty state handling

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/my-feature

# After merge, clean up
git checkout main
git pull origin main
git branch -d feature/my-feature
```

## 📊 Database Entities

- **Resident**: People living in barangay
- **Household**: Groups of residents
- **Certificate**: Official documents
- **Blotter**: Incident/violation records
- **Official**: Staff members
- **User**: System accounts
- **ActivityLog**: Audit trail

## 🎯 Key Features

✅ Resident CRUD + Search
✅ Household management
✅ Certificate tracking
✅ Incident logging
✅ Export to CSV/JSON
✅ Dashboard statistics
✅ Beautiful UI with Tailwind
✅ Authentication with JWT
✅ Activity logging
✅ Responsive design

## 📈 Performance Tips

### Backend
- Use indexes on foreign keys
- Implement pagination
- Cache frequent queries
- Monitor query execution

### Frontend
- Lazy load routes
- Optimize images
- Minimize bundle size
- Use production builds

## 🔍 Testing

### Manual Testing
1. Add new resident
2. Search by name
3. Export data
4. Edit record
5. Delete record

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Mobile view (F12)

## 📞 Getting Help

1. Check **README.md** for overview
2. Check **SETUP_GUIDE.md** for installation
3. Check **API_DOCUMENTATION.md** for endpoints
4. Check **CONTRIBUTING.md** for development
5. Check **DEPLOYMENT_GUIDE.md** for production

## 🚢 Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] CORS properly configured
- [ ] Frontend built and optimized
- [ ] Monitoring set up
- [ ] Logs configured
- [ ] Backup schedule created
- [ ] Team notified

## 💡 Useful Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sequelize ORM](https://sequelize.org/)
- [MySQL Docs](https://dev.mysql.com/)

## 📅 Version Info

- **Version**: 1.0.0
- **Last Updated**: December 1, 2025
- **Node.js**: 14.0+
- **MySQL**: 8.0+
- **React**: 18.2.0
- **Vite**: 7.2.4

---

**Ready to start coding?** 🎉
1. Follow **SETUP_GUIDE.md** to get running
2. Read **CONTRIBUTING.md** for code style
3. Check **API_DOCUMENTATION.md** for endpoints
4. Have fun building! 🚀
