# Changelog

## December 18, 2025 - Admin Access Control & Security Enhancement

### Summary
Implemented role-based access control (RBAC) to restrict the Admin page to admin users only. Enhanced security with frontend route protection and comprehensive security documentation.

### Changes Made

#### 1. Enhanced Protected Route Component
**File Modified:** `frontend/src/components/ProtectedRoute.jsx`

- Added JWT token decoding function to extract user role from token
- Added `requireAdmin` prop parameter to enable role-based access control
- Implemented admin role verification before allowing access
- Non-admin users are automatically redirected to dashboard when attempting to access admin routes

**Key Features:**
```javascript
// Token decoding function
function decodeToken(token) {
  // Safely decodes JWT payload to extract user information
  // Returns null on error to prevent security issues
}

// Enhanced ProtectedRoute component
<ProtectedRoute requireAdmin={true}>
  {children}
</ProtectedRoute>
```

#### 2. Updated Application Routing
**File Modified:** `frontend/src/App.jsx`

- Separated admin routes into dedicated protected section
- Wrapped `/admin` route with `ProtectedRoute` component requiring admin role
- Admin routes now check both authentication status and admin role
- Implemented automatic redirection for unauthorized access attempts

**Routing Structure:**
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
```

#### 3. Security Documentation
**File Created:** `SECURITY.md`

Comprehensive security documentation covering:
- Authentication & Authorization flow
- Role-Based Access Control (RBAC) implementation
- Password security with bcrypt
- JWT token management and lifecycle
- API endpoint security levels
- Frontend route protection strategies
- Best practices for developers and administrators
- Security checklist for development, deployment, and operations
- Vulnerability reporting procedures

**Security Features Documented:**
- Two-tier role system (admin and staff)
- JWT-based authentication
- Bcrypt password hashing
- Protected API endpoints
- Frontend route guards
- Token expiration and management
- Activity logging

#### 4. Existing Security Features (Already Implemented)
- **Backend Middleware:** `verifyToken`, `verifyAdmin`, `verifyStaff` functions in `backend/src/middleware/auth.js`
- **UI Access Control:** Layout component dynamically shows/hides admin menu based on user role
- **API Protection:** Backend endpoints protected with appropriate middleware

### Impact

#### Security Improvements
✅ Admin page now restricted to admin users only  
✅ Unauthorized users cannot access admin features  
✅ Clear security boundaries between admin and staff roles  
✅ Comprehensive security documentation for developers and administrators  

#### User Experience
✅ Seamless redirection for non-admin users  
✅ Admin menu only visible to admin users  
✅ No error messages, just smooth navigation  
✅ Consistent behavior across the application  

#### Developer Experience
✅ Reusable `requireAdmin` prop for future protected routes  
✅ Clean and maintainable code structure  
✅ Comprehensive security documentation  
✅ Clear implementation examples  

### Testing Recommendations
- Test admin user access to `/admin` page ✓
- Test staff user redirected from `/admin` page ✓
- Test direct URL access attempts ✓
- Verify admin menu visibility by role ✓
- Test token expiration handling

---

## December 4, 2025 - UI/UX Improvements and Address Field Updates

### Summary
Updated name display format across the application and improved address field handling in residents and certificates modules.

### Changes Made

#### 1. Name Display Format Update
**Changed name display from "Last Name, First Name" to "First Name Last Name" format**

**Files Modified:**
- `frontend/src/pages/certificates/CertificateList.jsx`
  - Updated resident name display in table column
  - Changed from: `${r.Resident.last_name}, ${r.Resident.first_name}`
  - Changed to: `${r.Resident.first_name} ${r.Resident.last_name}`

- `frontend/src/pages/residents/ResidentList.jsx`
  - Updated resident name display in table column
  - Changed from: `${r.last_name}, ${r.first_name}`
  - Changed to: `${r.first_name} ${r.last_name}`

**Impact:**
- More natural and readable name display throughout the application
- Consistent with common naming conventions
- Improved user experience

#### 2. Address Field Migration
**Migrated address storage from Household model to Resident model**

**Backend Changes:**
- `backend/src/models/resident.js`
  - Added `address: DataTypes.STRING` field to Resident model
  - Address is now stored directly with each resident record

**Frontend Changes:**
- `frontend/src/pages/certificates/CertificateForm.jsx`
  - Updated `selectResident()` function to use `resident.address` instead of `resident.Household?.address_line`
  - Updated search results dropdown display to show `res.address` instead of `res.Household?.address_line`
  - Auto-suggest now correctly populates address field when selecting a resident

- `frontend/src/pages/residents/ResidentList.jsx`
  - Updated address column to display `r.address` instead of `r.Household?.address_line`

- `frontend/src/pages/residents/ResidentForm.jsx`
  - Added address field to resident create/edit form
  - Made address field required with validation
  - Address field positioned between Household and First Name fields

- `frontend/src/pages/households/HouseholdList.jsx`
  - Removed address_line column from household table display

- `frontend/src/pages/households/HouseholdForm.jsx`
  - Removed address_line field from household form
  - Simplified household management to only handle household_code

**Impact:**
- More accurate data model - addresses belong to residents, not households
- Each resident can have their own address
- Simplified household management
- Improved data granularity and flexibility

#### 3. Bug Fixes
- Fixed address field not populating in certificate form auto-suggest
- Fixed address field not displaying in residents table
- Ensured address is saved when creating residents from certificate form

### Database Schema Changes
```sql
-- Added to Resident table
ALTER TABLE Residents ADD COLUMN address VARCHAR(255);
```

### Testing Recommendations
1. Test resident creation with address field
2. Verify address displays correctly in residents list
3. Test certificate form auto-suggest populates address
4. Verify address saves when creating residents from certificate form
5. Confirm household management works without address field

### Migration Notes
- Existing residents without addresses will show "N/A" in the address column
- Households no longer store address information
- Residents created from certificate form will include address if provided

### User-Facing Changes
- Name displays are now in "First Last" format instead of "Last, First"
- Address field is now visible and editable in resident forms
- Address appears in auto-suggest results when searching for residents in certificate form
- Household forms simplified (no address field)
