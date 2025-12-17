# Security Documentation

This document outlines the security features and best practices implemented in the BIMS (Barangay Information Management System).

## Table of Contents
- [Overview](#overview)
- [Authentication & Authorization](#authentication--authorization)
- [Role-Based Access Control](#role-based-access-control)
- [Password Security](#password-security)
- [Token Management](#token-management)
- [API Security](#api-security)
- [Frontend Security](#frontend-security)
- [Best Practices](#best-practices)
- [Security Checklist](#security-checklist)

---

## Overview

BIMS implements multiple layers of security to protect sensitive barangay data:
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption
- Protected API endpoints
- Frontend route protection
- Activity logging

---

## Authentication & Authorization

### Authentication Flow

1. **User Login**
   - User submits credentials (username/password)
   - Backend validates credentials against database
   - Password is compared using bcrypt
   - JWT token is generated and returned

2. **Token Storage**
   - Token stored in browser's localStorage
   - Token included in all subsequent API requests
   - Token contains user ID, username, and role

3. **Token Verification**
   - Backend middleware verifies token on protected routes
   - Expired or invalid tokens are rejected
   - User data extracted from token payload

### JWT Token Structure

```javascript
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1702857600,
  "exp": 1702944000
}
```

---

## Role-Based Access Control

### User Roles

BIMS supports two user roles:

| Role | Description | Access Level |
|------|-------------|--------------|
| **admin** | System administrator | Full access to all features including user management |
| **staff** | Regular staff member | Access to resident, household, certificate, blotter, and official management |

### Role Permissions

#### Admin Permissions
- ✅ All staff permissions
- ✅ User management (create, edit, delete users)
- ✅ System administration panel
- ✅ Activity log viewing
- ✅ System settings configuration

#### Staff Permissions
- ✅ Manage residents
- ✅ Manage households
- ✅ Issue certificates
- ✅ Record blotter incidents
- ✅ Manage officials
- ✅ Generate reports
- ✅ View dashboard
- ❌ User management
- ❌ System administration

### Implementation

#### Backend Middleware

```javascript
// verifyToken - Checks if user is authenticated
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// verifyAdmin - Checks if user has admin role
function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// verifyStaff - Checks if user is staff or admin
function verifyStaff(req, res, next) {
  if (!['admin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Staff or admin access required' });
  }
  next();
}
```

#### Frontend Route Protection

```javascript
// ProtectedRoute component with role checking
function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  
  // Check authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check admin role if required
  if (requireAdmin) {
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
}
```

#### Usage in Routes

```javascript
// Admin-only route
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin={true}>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<Admin />} />
</Route>

// Staff and admin route
<Route
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route path="/residents" element={<ResidentList />} />
  {/* ... other routes */}
</Route>
```

---

## Password Security

### Bcrypt Implementation

Passwords are hashed using bcrypt with a salt rounds value of 10:

```javascript
const bcrypt = require('bcrypt');

// Hashing password during registration
const password_hash = await bcrypt.hash(password, 10);

// Verifying password during login
const isValid = await bcrypt.compare(password, user.password_hash);
```

### Password Requirements

Currently, BIMS does not enforce strict password requirements, but it's recommended to implement:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Token Management

### Token Lifecycle

1. **Generation**: Token created on successful login
2. **Storage**: Stored in browser localStorage
3. **Usage**: Sent with every API request in Authorization header
4. **Expiration**: Tokens expire after 24 hours
5. **Revocation**: Token removed from localStorage on logout

### Token Configuration

```javascript
// Token expiration can be configured
const token = jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  JWT_SECRET,
  { expiresIn: '24h' } // Adjust as needed
);
```

### Security Considerations

- Tokens stored in localStorage (consider httpOnly cookies for production)
- No refresh token implementation (consider adding for production)
- Token contains minimal user information
- Sensitive data not stored in token payload

---

## API Security

### Protected Endpoints

#### Public Endpoints
- `POST /api/users/login` - User login

#### Staff/Admin Endpoints (require verifyToken)
- `GET /api/residents` - List residents
- `POST /api/residents` - Create resident
- `PUT /api/residents/:id` - Update resident
- `DELETE /api/residents/:id` - Delete resident
- Similar endpoints for households, certificates, blotter, officials, reports

#### Admin-Only Endpoints (require verifyToken + verifyAdmin)
- `GET /api/users` - List all users
- `POST /api/users/register` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Middleware Chain Example

```javascript
// Admin-only route
router.get('/users', verifyToken, verifyAdmin, userController.getAllUsers);

// Staff and admin route
router.post('/residents', verifyToken, residentController.createResident);
```

### CORS Configuration

```javascript
// Configure CORS to allow requests from frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

---

## Frontend Security

### Route Protection

All routes except `/login` are protected:

```javascript
// Public route
<Route path="/login" element={<Login />} />

// Protected routes
<Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route path="/" element={<Dashboard />} />
  {/* ... other routes */}
</Route>

// Admin-only routes
<Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Layout /></ProtectedRoute>}>
  <Route index element={<Admin />} />
</Route>
```

### UI-Based Access Control

Navigation menu dynamically shows/hides based on user role:

```javascript
const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/residents', label: 'Residents', icon: '👥' },
  // ... other items
];

// Only show admin menu when user is admin
if (user && user.role === 'admin') {
  navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
}
```

### Token Decoding

Frontend safely decodes JWT token to check user role:

```javascript
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
```

---

## Best Practices

### For Developers

1. **Never commit sensitive data**
   - Use `.env` files for secrets
   - Add `.env` to `.gitignore`
   - Use environment variables for configuration

2. **Validate all inputs**
   - Sanitize user inputs
   - Validate data types
   - Check for SQL injection attempts

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

4. **Use HTTPS in production**
   - Obtain SSL certificate
   - Configure server for HTTPS
   - Redirect HTTP to HTTPS

5. **Implement rate limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

### For Administrators

1. **Use strong passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Avoid common words

2. **Change default credentials**
   - Change default admin password immediately
   - Use unique passwords for each user

3. **Regular security audits**
   - Review user accounts regularly
   - Remove inactive users
   - Check activity logs

4. **Backup regularly**
   - Database backups daily
   - Store backups securely
   - Test restore procedures

5. **Monitor system logs**
   - Review activity logs
   - Check for suspicious activity
   - Investigate failed login attempts

---

## Security Checklist

### Development
- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens properly signed
- [ ] Sensitive data not in version control
- [ ] CORS configured correctly
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS prevention measures

### Deployment
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Firewall rules configured
- [ ] Database access restricted
- [ ] Strong JWT secret generated
- [ ] Rate limiting enabled
- [ ] Security headers configured

### Operations
- [ ] Regular backups scheduled
- [ ] Activity logs monitored
- [ ] User accounts reviewed
- [ ] Dependencies updated
- [ ] Security patches applied
- [ ] Access logs reviewed
- [ ] Incident response plan ready

---

## Reporting Security Issues

If you discover a security vulnerability in BIMS, please follow responsible disclosure:

1. **Do not** open a public issue
2. Email details to the maintainers
3. Include steps to reproduce
4. Allow time for a fix before disclosure

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

---

**Last Updated**: December 18, 2025
