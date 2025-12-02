# BIMS API Documentation

Complete REST API reference for the Barangay Information Management System.

## Base URL
```
http://localhost:4000/api
```

## Table of Contents
- [Authentication](#authentication)
- [Residents](#residents)
- [Households](#households)
- [Certificates](#certificates)
- [Blotter](#blotter)
- [Officials](#officials)
- [Reports](#reports)
- [Users](#users)
- [Error Responses](#error-responses)

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

### Login
```
POST /users/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@bims.local"
  }
}
```

---

## Residents

### List Residents

**Endpoint**: `GET /residents`

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| q | string | - | Search by first or last name (substring match) |
| page | number | 1 | Page number for pagination |
| pageSize | number | 50 | Items per page |

**Example Requests**:
```bash
# Get all residents
GET /residents

# Search residents
GET /residents?q=john

# Paginate results
GET /residents?page=2&pageSize=20

# Search with pagination
GET /residents?q=john&page=1&pageSize=10
```

**Response (200)**:
```json
{
  "count": 5,
  "rows": [
    {
      "id": 1,
      "first_name": "John",
      "middle_name": "Michael",
      "last_name": "Doe",
      "birth_date": "1990-05-15",
      "gender": "Male",
      "civil_status": "Married",
      "occupation": "Software Engineer",
      "contact_number": "09123456789",
      "email": "john@example.com",
      "household_id": 1,
      "is_head": true,
      "voter_status": true,
      "Household": {
        "id": 1,
        "household_code": "HH-001",
        "address_line": "123 Main St"
      }
    }
  ]
}
```

### Get Resident Details

**Endpoint**: `GET /residents/:id`

**Example**:
```bash
GET /residents/1
```

**Response (200)**:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "birth_date": "1990-05-15",
  "gender": "Male",
  "civil_status": "Married",
  "occupation": "Software Engineer",
  "contact_number": "09123456789",
  "email": "john@example.com",
  "household_id": 1,
  "is_head": true,
  "voter_status": true,
  "remarks": null,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z",
  "Household": {
    "id": 1,
    "household_code": "HH-001",
    "address_line": "123 Main St"
  }
}
```

### Create Resident

**Endpoint**: `POST /residents`

**Request Body**:
```json
{
  "household_id": 1,
  "first_name": "Jane",
  "middle_name": "Marie",
  "last_name": "Smith",
  "suffix": null,
  "birth_date": "1995-08-20",
  "gender": "Female",
  "civil_status": "Single",
  "occupation": "Teacher",
  "contact_number": "09987654321",
  "email": "jane@example.com",
  "national_id": "ID123456789",
  "voter_status": false,
  "is_head": false,
  "remarks": "New resident"
}
```

**Response (201)**:
```json
{
  "id": 2,
  "household_id": 1,
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "createdAt": "2025-01-16T14:20:00Z",
  "updatedAt": "2025-01-16T14:20:00Z"
}
```

**Validation**:
- `first_name` (required): string
- `last_name` (required): string
- `birth_date`: YYYY-MM-DD format
- `gender`: 'Male' | 'Female' | 'Other'
- `civil_status`: 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Divorced' | 'Other'

### Update Resident

**Endpoint**: `PUT /residents/:id`

**Request Body**: Same fields as Create (all optional)

**Response (200)**: Updated resident object

### Delete Resident

**Endpoint**: `DELETE /residents/:id`

**Response (200)**:
```json
{
  "message": "deleted"
}
```

### Export Residents

**Endpoint**: `GET /residents/export`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Optional search filter |
| format | string | 'csv' (default) or 'json' |

**Example**:
```bash
GET /residents/export?q=john&format=csv
```

**Response**: CSV or JSON file download

---

## Households

### List Households

**Endpoint**: `GET /households`

**Response (200)**:
```json
{
  "count": 10,
  "rows": [
    {
      "id": 1,
      "household_code": "HH-001",
      "address_line": "123 Main Street",
      "barangay": "Barangay 1",
      "city": "Manila",
      "postal_code": "1000",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### Create Household

**Endpoint**: `POST /households`

**Request Body**:
```json
{
  "household_code": "HH-011",
  "address_line": "456 Oak Avenue",
  "barangay": "Barangay 2",
  "city": "Manila",
  "postal_code": "1001"
}
```

**Response (201)**: Created household object

### Update Household

**Endpoint**: `PUT /households/:id`

### Delete Household

**Endpoint**: `DELETE /households/:id`

---

## Certificates

### List Certificates

**Endpoint**: `GET /certificates`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| resident_id | number | Filter by resident |
| status | string | 'valid' \| 'expired' \| 'pending' |

**Response (200)**:
```json
{
  "count": 15,
  "rows": [
    {
      "id": 1,
      "resident_id": 1,
      "certificate_type": "Barangay Clearance",
      "issue_date": "2025-01-01",
      "expiry_date": "2026-01-01",
      "remarks": "Standard clearance",
      "status": "valid",
      "Resident": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ]
}
```

### Create Certificate

**Endpoint**: `POST /certificates`

**Request Body**:
```json
{
  "resident_id": 1,
  "certificate_type": "Barangay Clearance",
  "issue_date": "2025-01-16",
  "expiry_date": "2026-01-16",
  "remarks": "Issued for travel"
}
```

**Response (201)**: Created certificate object

### Get Certificate

**Endpoint**: `GET /certificates/:id`

### Update Certificate

**Endpoint**: `PUT /certificates/:id`

### Delete Certificate

**Endpoint**: `DELETE /certificates/:id`

---

## Blotter

### List Incidents

**Endpoint**: `GET /blotter`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | 'pending' \| 'resolved' \| 'closed' |
| resident_id | number | Filter by resident |

**Response (200)**:
```json
{
  "count": 8,
  "rows": [
    {
      "id": 1,
      "resident_id": 1,
      "incident_type": "Disturbance",
      "incident_date": "2025-01-15",
      "description": "Noise complaint at 10 PM",
      "status": "pending",
      "remarks": "Investigation ongoing",
      "Resident": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ]
}
```

### Create Incident

**Endpoint**: `POST /blotter`

**Request Body**:
```json
{
  "resident_id": 1,
  "incident_type": "Disturbance",
  "incident_date": "2025-01-16",
  "description": "Loud music complaint",
  "status": "pending",
  "remarks": "First complaint"
}
```

**Incident Types**: Disturbance, Theft, Assault, Vandalism, Other

**Status**: pending, resolved, closed

### Get Incident

**Endpoint**: `GET /blotter/:id`

### Update Incident

**Endpoint**: `PUT /blotter/:id`

### Delete Incident

**Endpoint**: `DELETE /blotter/:id`

---

## Officials

### List Officials

**Endpoint**: `GET /officials`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | 'active' \| 'inactive' |

**Response (200)**:
```json
{
  "count": 5,
  "rows": [
    {
      "id": 1,
      "position": "Barangay Captain",
      "first_name": "Ramon",
      "last_name": "Santos",
      "contact_number": "09111111111",
      "email": "ramon@barangay.gov",
      "start_date": "2022-06-30",
      "end_date": "2025-06-30",
      "status": "active"
    }
  ]
}
```

### Create Official

**Endpoint**: `POST /officials`

**Request Body**:
```json
{
  "position": "Barangay Captain",
  "first_name": "Ramon",
  "last_name": "Santos",
  "contact_number": "09111111111",
  "email": "ramon@barangay.gov",
  "start_date": "2022-06-30",
  "end_date": "2025-06-30",
  "status": "active"
}
```

### Update Official

**Endpoint**: `PUT /officials/:id`

### Delete Official

**Endpoint**: `DELETE /officials/:id`

---

## Reports

### Dashboard Summary

**Endpoint**: `GET /reports/summary`

**Response (200)**:
```json
{
  "residents": 45,
  "certificates": 23,
  "incidents": 8,
  "officials": 5,
  "households": 12
}
```

### Resident Statistics

**Endpoint**: `GET /reports/residents/statistics`

**Response (200)**:
```json
{
  "total": 45,
  "byGender": {
    "Male": 22,
    "Female": 23,
    "Other": 0
  },
  "byStatus": {
    "Single": 15,
    "Married": 25,
    "Widowed": 3,
    "Divorced": 2
  },
  "voters": 35,
  "heads": 12
}
```

---

## Users

### Register User

**Endpoint**: `POST /users/register`

**Request Body**:
```json
{
  "username": "newuser",
  "email": "user@bims.local",
  "password": "SecurePassword123!"
}
```

**Response (201)**:
```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@bims.local",
  "role": "user"
}
```

### Login

**Endpoint**: `POST /users/login`

**Request Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@bims.local",
    "role": "admin"
  }
}
```

### Get User Profile

**Endpoint**: `GET /users/:id`

**Response (200)**:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@bims.local",
  "role": "admin",
  "is_active": true
}
```

### Update User

**Endpoint**: `PUT /users/:id`

**Request Body**:
```json
{
  "email": "newemail@bims.local",
  "password": "NewPassword123!"
}
```

---

## Error Responses

### Common Error Codes

**400 - Bad Request**
```json
{
  "message": "first_name and last_name required"
}
```

**404 - Not Found**
```json
{
  "message": "Not found"
}
```

**401 - Unauthorized**
```json
{
  "message": "Unauthorized"
}
```

**500 - Server Error**
```json
{
  "message": "Server error"
}
```

### Error Handling Best Practices

1. Always include `Authorization` header for protected routes
2. Validate required fields before sending
3. Check response status codes
4. Handle errors gracefully in frontend

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- Implement rate limiting middleware
- 100 requests per minute per IP
- 1000 requests per hour per IP

## CORS

Frontend URL: `http://localhost:5173` (configured in `.env`)

Update `CORS_ORIGIN` for different environments.

---

## Testing Endpoints with cURL

```bash
# List residents
curl http://localhost:4000/api/residents \
  -H "Authorization: Bearer {token}"

# Create resident
curl -X POST http://localhost:4000/api/residents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "birth_date": "1995-08-20"
  }'

# Search residents
curl "http://localhost:4000/api/residents?q=john" \
  -H "Authorization: Bearer {token}"
```

---

**Last Updated**: December 1, 2025
**API Version**: 1.0.0
