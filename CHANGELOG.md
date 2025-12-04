# Changelog

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
