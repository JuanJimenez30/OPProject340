# LocalHarvest Hub API Documentation

## Customer API Endpoints

### Create Customer
```http
POST /api/customers
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "shippingAddress": "123 Main St, City, State, 12345",
    "phoneNumber": "555-555-5555"
}
```

### Update Customer
```http
PUT /api/customers/{id}
Content-Type: application/json

{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "password": "securePassword123",
    "shippingAddress": "456 Oak St, City, State, 12345",
    "phoneNumber": "123-456-7890"
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

## Farm API Endpoints

### Create Farm
```http
POST /api/farms
Content-Type: application/json

{
    "farmName": "Green Acres Farm",
    "description": "Organic farm specializing in fresh vegetables and fruits",
    "location": "123 Farm Road, Rural City, State, 12345",
    "farmer": {
        "id": 1
    }
}
```

### Update Farm
```http
PUT /api/farms/{id}
Content-Type: application/json

{
    "farmName": "Green Acres Organic Farm",
    "description": "Family-owned organic farm specializing in seasonal produce",
    "location": "456 Country Road, Rural City, State, 12345"
}
```

### Get Farm
```http
GET /api/farms/{id}
```

### Get Farm Statistics
```http
GET /api/farms/{farmerId}/statistics
```

Response includes:
```json
{
    "totalRevenue": 15000.00,
    "monthlyRevenue": 2500.00,
    "revenueByMonth": {
        "October 2025": 2500.00,
        "September 2025": 2700.00,
        // ... previous months
    },
    "totalSubscribers": 45,
    "activeSubscribers": 38,
    "subscribersByMonth": {
        "October 2025": 5,
        "September 2025": 8,
        // ... previous months
    },
    "totalBoxes": 6,
    "activeBoxes": 5,
    "mostPopularBoxes": {
        "Vegetable Box": 20,
        "Fruit Box": 15
    },
    "averageOverallRating": 4.5,
    "averageFreshnessRating": 4.7,
    "averageDeliveryRating": 4.3,
    "ratingsByBox": {
        "Vegetable Box": 4.6,
        "Fruit Box": 4.4
    },
    "totalReviews": 85,
    "responseRate": 95.5,
    "ratingDistribution": {
        "5": 45,
        "4": 30,
        "3": 8,
        "2": 2,
        "1": 0
    }
}
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