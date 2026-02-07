# FoodHub 🍱

**Discover & Order Delicious Meals**

FoodHub is a full-stack meal ordering platform where customers can browse menus, place orders, and leave reviews. Providers manage their menu and fulfill orders, while Admin oversees the platform.

---

## Features

### Public Features
- Browse all available meals and providers
- Filter meals by category, cuisine, price, etc.
- View provider profiles with menus

### Customer Features
- Register and login as customer
- Add meals to cart
- Place orders with delivery address (Cash on Delivery)
- Track order status
- **Leave reviews** for meals after ordering
- Manage profile

### Provider Features
- Register and login as provider
- Add, edit, and remove menu items
- View incoming orders
- Update order status
- **View reviews** for their meals (read-only)

### Admin Features
- View all users (customers and providers)
- Manage user status (suspend/activate)
- View all orders
- Update order status
- Manage categories
- Optional: moderate reviews

---

## Database Overview

Key tables:

- **Users** – store user info and roles (`USER`, `PROVIDER`, `ADMIN`)  
- **ProviderProfiles** – provider-specific info (linked to Users)  
- **Categories** – food categories (admin managed)  
- **Meals** – menu items offered by providers  
- **Orders** – customer orders with items and status  
- **Reviews** – customer reviews for meals (1 review per user per meal)  

**Roles & Permissions:**

| Role      | Permissions                                           |
|-----------|------------------------------------------------------|
| Customer  | Browse meals, place orders, leave reviews            |
| Provider  | Manage menu, view orders, update order status, see reviews for their meals |
| Admin     | Manage users, orders, categories, moderate reviews  |

---

## API Endpoints

### Reviews

**Customer: Create Review**
```http
POST /api/reviews/:mealId
Headers: Authorization: Bearer <token>
Body:
{
  "rating": 5,
  "comment": "Really delicious meal!"
}
