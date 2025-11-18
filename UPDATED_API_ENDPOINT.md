# Updated API Endpoint Documentation

## Updated Service Profile API

### Endpoint: Get Service Profile
**URL:** `GET /freelancer/services/getProfile`  
**Authentication:** Optional  
**Description:** Fetch detailed service information using query parameters for serviceId and freelancerId

### Request Parameters

**Query Parameters:**
- `serviceId` (string, required) - The service ID to fetch
- `freelancerId` (string, required) - The freelancer's ID who owns the service

**Example Request:**
```
GET /freelancer/services/getProfile?serviceId=507f1f77bcf86cd799439011&freelancerId=507f1f77bcf86cd799439012
```

**Headers:**
- `Authorization: Bearer {token}` (optional)

### Response Format

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Service fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Full Stack Web Development",
    "name": "Professional Web Development Service",
    "bio": "I create modern, responsive websites using the latest technologies",
    "description": "I specialize in creating full-stack web applications using React, Node.js, and MongoDB. With over 5 years of experience, I deliver high-quality, scalable solutions that meet your business needs. My services include frontend development, backend API creation, database design, and deployment.",
    "category": "Web Development",
    "skills": ["React", "Node.js", "MongoDB", "JavaScript", "CSS", "HTML"],
    "hourlyRate": 75,
    "profilePicture": "https://example.com/service-image.jpg",
    "freelancerId": "507f1f77bcf86cd799439012",
    "averageRating": 4.5,
    "totalReviews": 24,
    "rating": 4.8,
    "reviewsCount": 20,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Missing required parameters: serviceId and freelancerId are required"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Service not found or does not belong to the specified freelancer"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

### Backend Schema Changes

**Updated Service Schema in freelancer.mongo.js:**
```javascript
const serviceSchema = new mongoose.Schema({
  title: { type: String, default: "", trim: true },
  name: { type: String, default: "", required: true, trim: true },
  bio: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  rating: { type: Number, default: "", min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 }, // NEW FIELD
  totalReviews: { type: Number, default: 0 }, // NEW FIELD
  category: { type: String, default: "", trim: true },
  skills: [{ type: String, trim: true, default: "" }],
  hourlyRate: { type: Number, default: 50, trim: true },
  profilePicture: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

### Frontend Implementation Changes

1. **Updated API Configuration:**
   ```javascript
   GET_SERVICE_BY_ID: "freelancer/services/getProfile"
   ```

2. **Updated API Function:**
   ```javascript
   export const getServiceById = async (serviceId, freelancerId) => {
     const params = new URLSearchParams({
       serviceId: serviceId,
       freelancerId: freelancerId
     });
     
     const response = await apiClient.get(`${API_ENDPOINTS.GET_SERVICE_BY_ID}?${params}`);
     // ... rest of the function
   }
   ```

3. **Updated ServiceCard Component:**
   ```javascript
   <Link to={`/service/${serviceId}?freelancerId=${freelancerId}`} className="service-card">
   ```

4. **Updated ServiceDetail Component:**
   ```javascript
   const { serviceId } = useParams();
   const [searchParams] = useSearchParams();
   const freelancerId = searchParams.get('freelancerId');
   
   // Uses both serviceId and freelancerId in API call
   const response = await getServiceById(serviceId, freelancerId);
   ```

5. **Updated Rating Display:**
   ```javascript
   const averageRating = service?.averageRating || 
     (reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0);
   
   const totalReviews = service?.totalReviews || reviews.length;
   ```

### URL Structure Changes

**Old URL:**
```
/service/507f1f77bcf86cd799439011
```

**New URL:**
```
/service/507f1f77bcf86cd799439011?freelancerId=507f1f77bcf86cd799439012
```

### Backend Implementation Requirements

The backend should:

1. **Validate** both `serviceId` and `freelancerId` query parameters
2. **Find** the service by ID within the freelancer's services array
3. **Verify** that the service belongs to the specified freelancer
4. **Return** service data with the new `averageRating` and `totalReviews` fields
5. **Handle** cases where service doesn't exist or doesn't belong to the freelancer

### Database Query Example

```javascript
// Find freelancer and specific service
const freelancer = await Freelancer.findOne({
  _id: freelancerId,
  'services._id': serviceId
});

if (!freelancer) {
  return { success: false, message: "Service not found or does not belong to freelancer" };
}

// Get the specific service
const service = freelancer.services.id(serviceId);
return { success: true, data: service };
```

### Key Changes Summary

1. **Endpoint changed** from `/services/{serviceId}` to `/freelancer/services/getProfile`
2. **Parameters changed** from URL parameter to query parameters
3. **Added freelancerId** as required query parameter
4. **Added averageRating** and **totalReviews** fields to service schema
5. **Updated frontend** to use new URL structure and display new rating fields
6. **Enhanced security** by requiring freelancer ownership verification

This ensures that services can only be accessed with proper freelancer verification and provides more comprehensive rating information.