# Greensboro Lawncare Company (GLC) API Documentation

## Customer API Endpoints

### Create Customer
```http
POST /api/customers
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "address": "123 Main St, City, State, 12345",
    "phoneNumber": "555-555-5555"
}
```

### Update Customer
```http
PUT /api/customers/{id}
Content-Type: application/json

{
    "name": "John Doe Updated",
    "email": "john@example.com",
    "password": "securePassword123",
    "address": "1667 Green View Dr, Los Angeles, CA",
    "phoneNumber": "555-555-0132"
}
```

### Get Customer
```http
GET /api/customers/{id}
```

### Get All Customers
```http
GET /api/customers
```

### Search Customers by Address
```http
GET /api/customers/search/address?address={searchTerm}
```

### Search Customers by Phone
```http
GET /api/customers/search/phone?phoneNumber={searchTerm}
```

### Delete Customer
```http
DELETE /api/customers/{id}
```

## Provider API Endpoints

### Create Provider 
```http
POST /api/providers
Content-Type: application/json

{
  "name": "John's Lawn Service",
  "email": "john@lawnservice.com",
  "password": "securePassword123",
  "phoneNumber": "(555) 987-6543"
}
```

### Update Provider
```http
PUT /api/providers/{id}
Content-Type: application/json

{
  "name": "John's Lawn Service Updated",
  "email": "john@lawnservice.com",
  "password": "securePassword123",
  "phoneNumber": "(555) 987-6543"
}
```

### Get Provider
```http
GET /api/providers/{id}
```

## Services API Endpoints

### Create Service
```http
POST /api/services
Content-Type: application/json

{
  "name": "Lawn Mowing Service",
  "description": "Weekly lawn mowing and edging service",
  "price": 35.00,
  "available": true,
  "provider": {
    "id": 1
  }
}
```

### Update Service
```http
PUT /api/services/{id}
Content-Type: application/json

{
  "name": "Lawn Mowing Service updated",
  "description": "Weekly lawn mowing and edging service",
  "price": 35.00,
  "available": true,
  "provider": {
    "id": 1
  }
}
```

### Get Services
```http
GET /api/services/{id}
```

## Subscription API Endpoints

### Create Subscription
```http
POST /api/subscriptions
Content-Type: application/json

{
  "customer": {
    "id": 1
  },
  "services": {
    "id": 1
  },
  "type": "WEEKLY",
  "startDate": "2025-10-24T09:00:00",
  "endDate": "2025-12-24T09:00:00",
  "active": true
}
```

### Update Subscription
```http
PUT /api/subscriptions/{id}
Content-Type: application/json

{
  "customer": {
    "id": 1
  },
  "services": {
    "id": 1
  },
  "type": "ONE_TIME",
  "startDate": "2025-10-24T09:00:00",
  "endDate": "2025-12-24T09:00:00",
  "active": true
}
```

### Get Subscription
```http
GET /api/subscriptions/{id}
```

### Get Customer's Subscriptions
```http
GET /api/subscriptions/customer/{customerId}
```

### Get Active Subscriptions for Customer
```http
GET /api/subscriptions/customer/{customerId}
```

## Review API Endpoints

### Create Review
```http
POST /api/reviews
Content-Type: application/json

{
  "customer": {
    "id": 1
  },
  "services": {
    "id": 1
  },
  "overallRating": 4,
  "comment": "Great service! The lawn mowing was done professionally and on time. Very satisfied with the quality of work."
}
```

### Update Review
```http
PUT /api/reviews/{id}
Content-Type: application/json

{
  "customer": {
    "id": 1
  },
  "services": {
    "id": 1
  },
  "overallRating": 5,
  "comment": "Great service! The lawn mowing was done professionally and on time. Very satisfied with the quality of work."
}
```

### Add Provider Response to Review
```http
PUT /api/reviews/{id}/provider-response
Content-Type: application/json

"let me support your dreams for your excellent review! We're so glad you were happy with our service."
```

### Get Review
```http
GET /api/reviews/{id}
```

### Get Service Reviews
```http
GET /api/reviews/service/{serviceId}
```

### Get Customer Reviews
```http
GET /api/reviews/customer/{customerId}
```