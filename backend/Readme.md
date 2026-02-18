1. Authentication APIs
Register User
Method: POST

URL: http://localhost:5000/auth/register

Body (JSON):

json
{
  "name": "Test User",
  "email": "testuser@gmail.com",
  "password": "password123"
}
For Admin Registration (using your specified emails):

json
{
  "name": "Admin User",
  "email": "riyas@gmail.com",
  "password": "password123"
}
Login
Method: POST

URL: http://localhost:5000/auth/login

Body (JSON):

json
{
  "email": "testuser@gmail.com",
  "password": "password123"
}
Expected Response - Copy the token from response, you'll need it for all other requests:

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "user",
  "name": "Test User",
  "email": "testuser@gmail.com"
}
Get Current User
Method: GET

URL: http://localhost:5000/auth/me

Headers:

Key: authorization

Value: <paste-your-token-here>

2. Products APIs
Get All Products (Public)
Method: GET

URL: http://localhost:5000/products

Get Single Product
Method: GET

URL: http://localhost:5000/products/PRODUCT_ID_HERE

Replace PRODUCT_ID_HERE with actual product ID (get from GET all products)

Create Product (Admin Only)
Method: POST

URL: http://localhost:5000/products

Headers:

Key: authorization

Value: <admin-token>

Body (JSON):

json
{
  "name": "iPhone 13 Pro",
  "price": 99999,
  "description": "Latest iPhone with amazing camera and battery life",
  "image": "https://images.unsplash.com/photo-1632661674596-618d0b64c3f4?w=500"
}
More product examples:

json
{
  "name": "MacBook Pro M2",
  "price": 149999,
  "description": "14-inch MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD",
  "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
}
json
{
  "name": "Wireless Headphones",
  "price": 2999,
  "description": "Noise cancelling wireless headphones with 30hr battery",
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
}
Update Product (Admin Only)
Method: PUT

URL: http://localhost:5000/products/PRODUCT_ID_HERE

Headers:

Key: authorization

Value: <admin-token>

Body (JSON):

json
{
  "name": "iPhone 13 Pro Max",
  "price": 109999,
  "description": "Updated description for iPhone"
}
Delete Product (Admin Only)
Method: DELETE

URL: http://localhost:5000/products/PRODUCT_ID_HERE

Headers:

Key: authorization

Value: <admin-token>

3. Cart APIs (All require authentication)
Get Cart
Method: GET

URL: http://localhost:5000/cart

Headers:

Key: authorization

Value: <user-token>

Add to Cart
Method: POST

URL: http://localhost:5000/cart/add

Headers:

Key: authorization

Value: <user-token>

Body (JSON):

json
{
  "productId": "PRODUCT_ID_HERE",
  "quantity": 2
}
Without quantity (defaults to 1):

json
{
  "productId": "PRODUCT_ID_HERE"
}
Update Cart Item
Method: PUT

URL: http://localhost:5000/cart/update

Headers:

Key: authorization

Value: <user-token>

Body (JSON):

json
{
  "productId": "PRODUCT_ID_HERE",
  "quantity": 5
}
To remove item (set quantity to 0):

json
{
  "productId": "PRODUCT_ID_HERE",
  "quantity": 0
}
Remove from Cart
Method: DELETE

URL: http://localhost:5000/cart/remove/PRODUCT_ID_HERE

Headers:

Key: authorization

Value: <user-token>

Clear Cart
Method: DELETE

URL: http://localhost:5000/cart/clear

Headers:

Key: authorization

Value: <user-token>