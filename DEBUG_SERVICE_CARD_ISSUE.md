# Debug Service Card Click Issue

## Problem
When clicking on service cards in the freelancer profile, getting server error but no data is displayed.

## Debugging Steps Added

### 1. Frontend Debugging
Added console.log statements to track data flow:

#### FreelancerProfile Component
- Log freelancer data and services when fetched
- Log current user ID from token
- Log service card data being passed to ServiceCard component

#### ServiceDetail Component  
- Log serviceId and freelancerId from URL parameters
- Log API call parameters and response

#### ServiceAPI
- Log API call URL and raw response

### 2. Backend Debugging
Added console.log statements to track API calls:

#### Freelancer Controller
- Log incoming request parameters (serviceId, freelancerId)
- Log API response before sending
- Log any errors

#### Freelancer Model
- Log database query parameters
- Log if freelancer is found
- Log service count and if specific service is found
- Log any database errors

## Key Issues to Check

### 1. FreelancerId Issue
**Problem:** `freelancerData?._id` was undefined
**Fix:** Changed to use `getCurrentUserId()` from JWT token

### 2. Service ID Format
Check if service IDs are in correct MongoDB ObjectId format

### 3. Database Query
Verify that:
- Freelancer exists with the given userId
- Service exists in the freelancer's services array
- Service ID matches exactly

### 4. API Route
Verify the route `/freelancer/services/getProfile` is properly registered

## Testing Steps

1. **Check Browser Console:**
   - Look for logged data from FreelancerProfile
   - Check if serviceId and freelancerId are correct
   - Verify API call URL format

2. **Check Server Console:**
   - Look for logged request parameters
   - Check if freelancer is found in database
   - Verify service lookup results

3. **Check Network Tab:**
   - Verify API call is made to correct endpoint
   - Check request parameters in query string
   - Look at response status and data

## Expected Data Flow

1. **FreelancerProfile loads services:**
   ```javascript
   services = [
     {
       _id: "service_object_id",
       title: "Service Title",
       name: "Service Name",
       // ... other fields
     }
   ]
   ```

2. **ServiceCard gets freelancerId from token:**
   ```javascript
   freelancerId = getCurrentUserId() // Should be user's ObjectId
   ```

3. **ServiceCard creates URL:**
   ```
   /service/service_object_id?freelancerId=user_object_id
   ```

4. **ServiceDetail makes API call:**
   ```
   GET /freelancer/services/getProfile?serviceId=service_object_id&freelancerId=user_object_id
   ```

5. **Backend finds service:**
   ```javascript
   // Find freelancer by userId
   // Find service by serviceId in freelancer.services array
   // Return service data
   ```

## Common Issues to Check

### 1. ObjectId Format
- Ensure serviceId and freelancerId are valid MongoDB ObjectIds
- Check if they're strings or ObjectId instances

### 2. Database Structure
- Verify freelancer document exists
- Check services array structure
- Ensure service _id matches query

### 3. Token Issues
- Verify JWT token contains correct userId
- Check token is not expired
- Ensure userId format matches database

### 4. Route Registration
- Verify route is registered in router
- Check middleware is applied correctly
- Ensure controller function is exported

## Quick Fix Test

To quickly test if the API works, try calling it directly:

```bash
# Replace with actual IDs from your database
curl "http://localhost:8000/freelancer/services/getProfile?serviceId=ACTUAL_SERVICE_ID&freelancerId=ACTUAL_USER_ID"
```

This will help identify if the issue is in the frontend data passing or backend API logic.