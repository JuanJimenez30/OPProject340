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

## Farmer API Endpoints

### Create Farmer
```http
POST /api/farmers
Content-Type: application/json

{
    "name": "Jane Smith",
    "email": "jane@farm.com",
    "password": "securePassword123",
    "phoneNumber": "111-222-3333"
}
```

### Update Farmer
```http
PUT /api/farmers/{id}
Content-Type: application/json

{
    "name": "Jane Smith Updated",
    "email": "jane.updated@farm.com",
    "phoneNumber": "111-222-3344"
}
```

### Get Farmer
```http
GET /api/farmers/{id}
```

## ProduceBox API Endpoints

### Create Produce Box
```http
POST /api/boxes
Content-Type: application/json

{
    "name": "Weekly Vegetable Box",
    "description": "Fresh seasonal vegetables picked weekly: Carrots, Tomatoes, Lettuce, Cucumbers, Bell Peppers",
    "price": 29.99,
    "available": true,
    "farm": {
        "id": 1
    }
}
```

### Update Produce Box
```http
PUT /api/boxes/{id}
Content-Type: application/json

{
    "name": "Premium Weekly Vegetable Box",
    "description": "Premium selection of fresh seasonal vegetables. Organic Carrots, Heirloom Tomatoes, Mixed Lettuce, Persian Cucumbers, Rainbow Bell Peppers",
    "price": 34.99,
    "available": true
}
```

### Get Produce Box
```http
GET /api/boxes/{id}
```

### Get Farm's Produce Boxes
```http
GET /api/boxes/farm/{farmId}
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
    "produceBox": {
        "id": 1
    },
    "type": "MONTHLY",
    "startDate": "2025-10-06T10:00:00",
    "active": true
}
```

### Update Subscription
```http
PUT /api/subscriptions/{id}
Content-Type: application/json

{
    "type": "MONTHLY",
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
GET /api/subscriptions/customer/{customerId}/active
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
    "produceBox": {
        "id": 1
    },
    "freshnessRating": 5,
    "deliveryRating": 4,
    "comment": "Great quality produce, arrived on time and fresh!"
}
```

### Update Review
```http
PUT /api/reviews/{id}
Content-Type: application/json

{
    "freshnessRating": 5,
    "deliveryRating": 5,
    "comment": "Updated: Exceptional quality and perfect delivery!"
}
```

### Add Farmer Response to Review
```http
PUT /api/reviews/{id}/farmer-response
Content-Type: application/json

{
    "farmerResponse": "Thank you for your feedback! We're glad you enjoyed our produce."
}
```

### Get Review
```http
GET /api/reviews/{id}
```

### Get Product Reviews
```http
GET /api/reviews/produce-box/{produceBoxId}
```

### Get Customer Reviews
```http
GET /api/reviews/customer/{customerId}
```