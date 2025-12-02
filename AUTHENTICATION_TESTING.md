# BIMS Authentication Testing Guide

## Overview
The BIMS application now has JWT-based authentication protecting all API routes. This guide walks through testing the complete authentication flow.

## Prerequisites
- Node.js 14.0+ installed
- MySQL 8.0+ running and accessible
- Database created and configured in backend/.env

## Step 1: Seed Database with Default Admin User

Run the seed script to create the default admin user and sample data:

```bash
cd backend
npm run seed
```

Expected output:
```
DB synced (force:true)
Seeding complete
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Step 2: Start the Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 4000
Connected to database
```

## Step 3: Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v7.2.4  ready in 123 ms

➜  Local:   http://localhost:5173/
```

## Step 4: Test Authentication Flow

### 4.1 Verify Login Page Redirects
1. Open http://localhost:5173 in a browser
2. **Expected:** Auto-redirect to http://localhost:5173/login
3. **Verify:** Login form displays with:
   - Username input field
   - Password input field
   - Login button
   - Demo credentials hint (username: admin, password: admin123)

### 4.2 Test Failed Login
1. Enter incorrect credentials (e.g., username: `test`, password: `wrong`)
2. Click Login button
3. **Expected:** Error message displays: "Invalid credentials"
4. **Verify:** No redirect to dashboard; user remains on login page

### 4.3 Test Successful Login
1. Enter admin credentials:
   - Username: `admin`
   - Password: `admin123`
2. Click Login button
3. **Expected:** 
   - Login request succeeds (check browser Network tab for 200 response)
   - JWT token stored in localStorage
   - Redirect to http://localhost:5173/dashboard
   - Dashboard displays residents list

### 4.4 Verify Token Storage
1. After successful login, open browser DevTools (F12)
2. Go to Application → Local Storage → http://localhost:5173
3. **Expected:** Key `token` exists with JWT value (long string starting with `eyJ...`)

### 4.5 Verify Token in Requests
1. In DevTools Network tab, click any API request
2. Go to Headers → Request Headers
3. **Expected:** `Authorization: Bearer <token>` header present

### 4.6 Test Protected Routes

Try accessing protected routes directly:

| Route | Expected Behavior |
|-------|------------------|
| `/dashboard` | Loads successfully (protected route) |
| `/dashboard/residents` | Loads successfully; shows residents list |
| `/dashboard/households` | Loads successfully; shows households |
| `/dashboard/certificates` | Loads successfully; shows certificates |
| `/dashboard/blotter` | Loads successfully; shows blotter entries |
| `/dashboard/officials` | Loads successfully; shows officials |
| `/dashboard/reports` | Loads successfully; shows reports |

### 4.7 Test Token Expiration Handling

**Note:** Default token expiration is 8 hours. To test expiration:

Option A - Manual token removal:
1. Open DevTools Application → Local Storage
2. Delete the `token` key
3. Refresh page
4. **Expected:** Redirect to login page

Option B - Backend modification (for quick testing):
1. Edit `backend/src/middleware/auth.js`
2. Change `expiresIn: '8h'` to `expiresIn: '1s'` (1 second)
3. Re-run seed, login, wait 2 seconds
4. Click any API button (e.g., refresh residents list)
5. **Expected:** Redirect to login; error message about token expiration

### 4.8 Test Logout
1. From dashboard, find logout button in sidebar
2. Click logout button
3. **Expected:**
   - Token removed from localStorage
   - Redirect to login page
   - Cannot access dashboard without re-logging

### 4.9 Test 401/403 Error Handling

**Test 401 (Expired Token):**
1. Clear localStorage token manually
2. Make an API request (e.g., try to navigate to residents page)
3. **Expected:** Automatic redirect to login

**Test 403 (Insufficient Permissions - Future Use):**
1. Future versions will have role-based access control
2. Staff users attempting to access admin-only features will see 403

## Step 5: Verify All Routes Are Protected

### Backend Routes
Check that all routes require authentication:

```bash
# Without token - should fail with 401
curl http://localhost:4000/api/residents

# With token - should succeed
curl -H "Authorization: Bearer <your_token>" http://localhost:4000/api/residents
```

Protected routes:
- ✅ `/api/residents` (GET, POST, PUT, DELETE)
- ✅ `/api/households` (GET, POST)
- ✅ `/api/certificates` (GET, POST)
- ✅ `/api/blotter` (GET, POST)
- ✅ `/api/officials` (GET, POST)
- ✅ `/api/reports/*` (GET)

Public routes (login/register):
- `/api/users/login` (POST) - No auth required
- `/api/users/register` (POST) - No auth required

## Step 6: Test Data Operations

With authenticated access, verify CRUD operations:

### Create Resident
1. Navigate to Residents → Add Resident
2. Fill in form with valid data
3. Submit
4. **Expected:** Resident created; appears in list

### Read Residents
1. Navigate to Residents
2. **Expected:** List displays all residents from database

### Update Resident
1. Click edit on any resident
2. Modify fields
3. Submit
4. **Expected:** Changes saved; list updates

### Delete Resident
1. Click delete on any resident
2. Confirm deletion
3. **Expected:** Resident removed from list

## Troubleshooting

### Issue: Cannot Login
**Cause:** Seed data not created
**Solution:**
```bash
cd backend
npm run seed
```

### Issue: 401 Errors on All Requests
**Cause:** Token not being sent or expired
**Solution:**
1. Check DevTools Network → any API request → Headers
2. Verify `Authorization: Bearer <token>` present
3. If missing, re-login
4. If present but still failing, token may be expired - logout and re-login

### Issue: Redirect Loop (Login → Dashboard → Login)
**Cause:** Token verification failing
**Solution:**
1. Check backend console for errors
2. Verify JWT_SECRET in backend/.env matches token generation
3. Check token expiration time

### Issue: API Calls Work but Page Doesn't Load
**Cause:** Token not being set on initial page load
**Solution:**
1. Check App.jsx useEffect is running
2. Open DevTools → Console for errors
3. Verify localStorage has `token` key after login

## Performance Notes

- JWT tokens are validated on every request
- Token validation is fast (<1ms)
- No database queries required for token verification
- Minimal performance impact on protected routes

## Security Notes

- ✅ Tokens never stored in cookies (XSS safe)
- ✅ Tokens expire after 8 hours (configurable)
- ✅ Passwords hashed with bcrypt (cost factor: 10)
- ✅ All API routes require valid token
- ✅ 401/403 errors handled gracefully on frontend

## Next Steps

1. **User Registration:** Create staff user accounts via registration
2. **Role-Based Access:** Implement different permissions for admin vs staff
3. **Token Refresh:** Add automatic token refresh before expiration
4. **Session Management:** Add user session tracking and activity logs
5. **2FA (Optional):** Add two-factor authentication for admin accounts

## Quick Commands Reference

```bash
# Seed database with admin user
cd backend && npm run seed

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Test API with curl (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/residents
```

---

For more information, see:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [README.md](./README.md) - Project overview
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
