# Frontend API Requirements Documentation

This document outlines all the API endpoints needed for the new frontend features. The backend should implement these endpoints to support the service detail page, reviews, and order functionality.

## 1. Service Management APIs

### 1.1 Get Service by ID
**Endpoint:** `GET /services/{serviceId}`  
**Authentication:** Optional (public endpoint)  
**Description:** Fetch detailed information about a specific service

**Request:**
- **Method:** GET
- **URL Params:** `serviceId` (string) - The service ID
- **Headers:** 
  - `Authorization: Bearer {token}` (optional)

**Response:**
```json
{
  "success": true,
  "message": "Service fetched successfully",
  "data": {
    "_id": "serviceId123",
    "title": "Full Stack Web Development",
    "name": "Professional Web Development Service",
    "bio": "I create modern, responsive websites",
    "description": "Detailed service description...",
    "category": "Web Development",
    "skills": ["React", "Node.js", "MongoDB"],
    "hourlyRate": 75,
    "profilePicture": "https://example.com/image.jpg",
    "freelancerId": "freelancer123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 2. Review Management APIs

### 2.1 Get Service Reviews
**Endpoint:** `GET /services/{serviceId}/reviews`  
**Authentication:** Optional  
**Description:** Fetch all reviews for a specific service

**Request:**
- **Method:** GET
- **URL Params:** `serviceId` (string) - The service ID
- **Query Params:** 
  - `page` (number, optional) - Page number for pagination
  - `limit` (number, optional) - Number of reviews per page

**Response:**
```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": {
    "reviews": [
      {
        "_id": "review123",
        "userId": "user123",
        "userName": "John Doe",
        "userAvatar": "https://example.com/avatar.jpg",
        "rating": 5,
        "comment": "Excellent service! Very professional.",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 10,
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2.2 Create Review
**Endpoint:** `POST /services/{serviceId}/reviews`  
**Authentication:** Required  
**Description:** Create a new review for a service

**Request:**
- **Method:** POST
- **URL Params:** `serviceId` (string) - The service ID
- **Headers:** 
  - `Authorization: Bearer {token}` (required)
  - `Content-Type: application/json`
- **Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service! Highly recommended."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "_id": "review123",
    "userId": "user123",
    "serviceId": "service123",
    "rating": 5,
    "comment": "Excellent service! Highly recommended.",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 3. Order Management APIs

### 3.1 Create Order
**Endpoint:** `POST /orders`  
**Authentication:** Required  
**Description:** Create a new order request for a service

**Request:**
- **Method:** POST
- **Headers:** 
  - `Authorization: Bearer {token}` (required)
  - `Content-Type: application/json`
- **Body:**
```json
{
  "serviceId": "service123",
  "freelancerId": "freelancer123",
  "message": "I need a website for my business. Please contact me to discuss requirements.",
  "budget": 500,
  "deadline": "2024-02-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "order123",
    "clientId": "client123",
    "freelancerId": "freelancer123",
    "serviceId": "service123",
    "message": "Order requirements...",
    "budget": 500,
    "deadline": "2024-02-15",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3.2 Get User Orders
**Endpoint:** `GET /orders/user`  
**Authentication:** Required  
**Description:** Fetch all orders for the current user (both as client and freelancer)

**Request:**
- **Method:** GET
- **Headers:** 
  - `Authorization: Bearer {token}` (required)
- **Query Params:**
  - `status` (string, optional) - Filter by order status
  - `page` (number, optional) - Page number for pagination
  - `limit` (number, optional) - Number of orders per page

**Response:**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "asClient": [
      {
        "_id": "order123",
        "serviceId": "service123",
        "serviceName": "Web Development Service",
        "freelancerId": "freelancer123",
        "freelancerName": "John Developer",
        "budget": 500,
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "asFreelancer": [
      {
        "_id": "order456",
        "serviceId": "service456",
        "serviceName": "My Service",
        "clientId": "client123",
        "clientName": "Jane Client",
        "budget": 300,
        "status": "accepted",
        "createdAt": "2024-01-14T10:30:00Z"
      }
    ]
  }
}
```

## 4. Error Response Format

All endpoints should return errors in this consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (optional)"
}
```

## 5. Authentication Requirements

### Token Format
- **Type:** JWT (JSON Web Token)
- **Header:** `Authorization: Bearer {token}`
- **Payload Structure:**
```json
{
  "userId": "user123",
  "email": "user@example.com",
  "accountType": "client" | "freelancer",
  "iat": 1642234567,
  "exp": 1642838367
}
```

## 6. Status Codes

- **200 OK** - Successful GET requests
- **201 Created** - Successful POST requests (resource created)
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - User doesn't have permission
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## 7. Data Validation Rules

### Review Creation
- `rating`: Required, integer between 1-5
- `comment`: Required, string, minimum 10 characters, maximum 500 characters

### Order Creation
- `serviceId`: Required, valid service ID
- `freelancerId`: Required, valid freelancer ID
- `message`: Required, string, minimum 20 characters
- `budget`: Required, positive number
- `deadline`: Required, valid date in YYYY-MM-DD format

## 8. Business Logic Requirements

### Service Access
- Public services can be viewed by anyone
- Service ownership is determined by `freelancerId` matching current user's `userId`

### Review Restrictions
- Users cannot review their own services
- Users can only submit one review per service
- Only authenticated users can create reviews

### Order Restrictions
- Users cannot order their own services
- Only authenticated users can create orders
- Clients can view orders they created
- Freelancers can view orders for their services

## 9. Database Relationships

### Service Document
```javascript
{
  _id: ObjectId,
  title: String,
  name: String,
  bio: String,
  description: String,
  category: String,
  skills: [String],
  hourlyRate: Number,
  profilePicture: String,
  freelancerId: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Review Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User (reviewer)
  serviceId: ObjectId, // Reference to Service
  rating: Number, // 1-5
  comment: String,
  createdAt: Date
}
```

### Order Document
```javascript
{
  _id: ObjectId,
  clientId: ObjectId, // Reference to User (client)
  freelancerId: ObjectId, // Reference to User (freelancer)
  serviceId: ObjectId, // Reference to Service
  message: String,
  budget: Number,
  deadline: Date,
  status: String, // 'pending', 'accepted', 'rejected', 'completed'
  createdAt: Date,
  updatedAt: Date
}
```

This documentation provides all the necessary API specifications for implementing the service detail page, review system, and order functionality in the backend.