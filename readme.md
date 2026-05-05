# FLUX-BITE — System Design Overview

## 1. Objective

Build a **location-based food delivery platform** where:

* Customers can discover nearby restaurants (within 6km)
* Browse menus and place orders
* Restaurants manage menus and orders
* Orders are delivered (initially simple, later scalable)

## 2. Actors

### Customers

* Browse restaurants
* View menu
* Place order
* Track order

---

### 🍽️ Restaurant Owner

* Create/manage restaurant
* Manage menu
* Accept/reject orders
* Prepare & mark orders ready
* Assign rider (MVP)

---

### 🛵 Rider (Phase 2)

* Accept delivery request
* Deliver order
* Update status

---

### 🛠️ System (Implicit Actor)

* Filter restaurants by location
* Manage order lifecycle
* Handle authentication validation

---

## 🧩 3. Core Features

* Auth System
* Restaurant Management
* Menu Management
* Order System (Core)
* Delivery System (Basic → Advanced)
* Payments (COD → Stripe later)

---

## 🔁 4. End-to-End Flow

### Customer Flow

```text
Location Access
→ Nearby Restaurants (6km)
→ Select Restaurant
→ View Menu
→ Add to Cart
→ Login (if not logged in)
→ Choose Payment (COD)
→ Place Order
→ Track Order
```

---

### Owner Flow

```text
Login
→ Create Restaurant
→ Add Menu & Items
→ Receive Order
→ Accept / Reject
→ Prepare
→ Mark Ready
→ Assign Rider (MVP)
```

---

## 📦 5. Order Lifecycle

```text
PLACED
→ ACCEPTED / REJECTED
→ PREPARING
→ READY
→ PICKED
→ DELIVERED
```

---

## 🧠 6. Service Architecture

### Frontend

* React (SPA)

### Backend Services

* Auth Service (MongoDB)
* Restaurant Service (PostgreSQL)
* Order Service (Upcoming)
* Delivery Service (Future)
* Utils Service (File Uploads)

---

## 🗃️ 7. Data Model (Restaurant Service)

### Entity Relationships

```text
User (Auth Service)
   ↓ (ownerId reference)
Restaurant
   ↓
Menu
   ↓
Category
   ↓
MenuItem
```

---

### 🏪 Restaurant

* id (PK)
* owner_id (reference to Auth Service user)
* name
* description
* address
* latitude
* longitude
* is_open
* created_at

---

### 📋 Menu

* id (PK)
* restaurant_id (FK)
* name
* created_at
* updated_at

---

### 🧩 Category

* id (PK)
* restaurant_id (FK)
* name

> Category belongs to Restaurant (not Menu)

---

### 🍔 MenuItem

* id (PK)
* menu_id (FK)
* category_id (FK)
* name
* description
* price
* is_available
* image_url

---

## 🔗 Relationships

```text
Restaurant → Menu        (1:N)
Restaurant → Category    (1:N)
Menu → MenuItem          (1:N)
Category → MenuItem      (1:N)
```

---

## 8. Key System Rules

* Owner can only access their own restaurant data
* Backend calculates total price (never trust frontend)
* Restaurant must be open before accepting orders
* Items must be available before ordering
* Order state transitions must be controlled
* No data duplication across tables

---

## 9. Future Scope

* Rider Service (auto assignment)
* Online Payments (Stripe, JazzCash, Easypaisa)
* Ratings & Reviews
* Real-time tracking (WebSockets)
* Admin dashboard
* Scalability (API Gateway, message queues)


# RESTAURANT SERVICE API ROUTES

# Restaurant Management Routes
   # Create a new restaurant (Owner only)
   POST /api/v1/restaurants
   
   # Get restaurant details by ID
   GET /api/v1/restaurants/:id
   
   # Update restaurant (Owner only)
   PATCH /api/v1/restaurants/:id
   
   # Soft delete restaurant (Owner only)
   DELETE /api/v1/restaurants/:id

# Search
   # Search restaurants by name, description, or address
   GET /api/v1/restaurants/search?q=&page=&limit=
  

# Discovery (Core Feature)
   # Get nearby restaurants (within radius, default 6km)
   GET /api/v1/restaurants/nearby?lat=&lng=&radius=&page=&limit=
  

# Restaurant Operations Routes
   # Open restaurant (Owner only)
   GET /api/v1/restaurants/:id/open
   
   # Close restaurant (Owner only)
   GET /api/v1/restaurants/:id/close

# Menu Management Routes
   # Create a new menu for a restaurant (Owner only)
   POST /api/v1/restaurants/:id/menus
   
   # Get all menus for a restaurant (Owner only)
   GET /api/v1/restaurants/:id/menus
   
   # Get a specific menu by ID (Owner only)
   GET /api/v1/restaurants/:id/menus/:menuId
   
   # Get a specific menu by ID (Owner only)
   PATCH /api/v1/restaurants/:id/menus/:menuId
   
   # Update a specific menu (Owner only)
   DELETE /api/v1/restaurants/:id/menus/:menuId

# Category Management Routes
   # Create a new category for a restaurant (Owner only)
   POST /api/v1/restaurants/:id/categories
   
   # Get all categories for a restaurant (Owner only)
   GET /api/v1/restaurants/:id/categories
   
   # Get a specific category by ID (Owner only)
   GET /api/v1/restaurants/:id/categories/:categoryId
   
   # Update a specific category (Owner only)
   PATCH /api/v1/restaurants/:id/categories/:categoryId
   
   # Delete a specific category (Owner only)
   DELETE /api/v1/restaurants/:id/categories/:categoryId

# Menu Item Management Routes
   # Create a new menu item for a menu (Owner only)
   POST /api/v1/restaurants/:id/menus/:menuId/items
   
   # Get all menu items for a menu (Owner only)
   GET /api/v1/restaurants/:id/menus/:menuId/items
   
   # Get a specific menu item by ID (Owner only)
   GET /api/v1/restaurants/:id/menus/:menuId/items/:itemId
   
   # Update a specific menu item (Owner only)
   PATCH /api/v1/restaurants/:id/menus/:menuId/items/:itemId
   
   # Delete a specific menu item (Owner only)
   DELETE /api/v1/restaurants/:id/menus/:menuId/items/:itemId

# Public Routes
   GET /api/v1/restaurants/:id/menus/:menuId/items?available=true
   → Get all available menu items for a menu (Public)

    


    ============================================================


    # 🍽️ FLUX-BITE — Menu & MenuItem System Design

## 📌 Overview

This document defines the **Menu Management System** for Fluxx_Bite.

It covers:

* Data modeling
* Relationships
* API structure
* Business rules
* Scalability considerations

---

# 🧠 Design Philosophy

* Keep schema **simple and scalable**
* Avoid unnecessary joins
* Optimize for **read-heavy traffic (50k+ users)**
* Ensure **strict ownership control**
* Design APIs for **frontend efficiency**

---

# 🗃️ Final Data Model

## 🏪 Restaurant (Already Implemented)

No changes required.

---

## 🧩 Category

Represents logical grouping of menu items (e.g., Burgers, Drinks).

```ts
Category {
  id: string
  restaurantId: string
  name: string
  createdAt: Date
}
```

---

## 🍔 MenuItem

Represents individual food items.

```ts
MenuItem {
  id: string
  restaurantId: string
  categoryId: string
  name: string
  description: string
  price: number
  isAvailable: boolean
  imageUrl: string
  createdAt: Date
}
```

---

# ⚠️ Important Design Decision

❌ No `Menu` table (removed intentionally)

### Reason:

* Reduces complexity
* Avoids unnecessary joins
* Categories are sufficient for grouping
* Faster queries under high traffic

---

# 🔗 Relationships

```
Restaurant → Category   (1:N)
Restaurant → MenuItem   (1:N)
Category   → MenuItem   (1:N)
```

---

# 🚀 API Design

---

## 📂 CATEGORY APIs

### 1. Create Category

```
POST /restaurants/:restaurantId/categories
```

---

### 2. Get Categories by Restaurant

```
GET /restaurants/:restaurantId/categories
```

---

### 3. Update Category

```
PATCH /categories/:id
```

---

### 4. Delete Category

```
DELETE /categories/:id
```

---

## 🍔 MENU ITEM APIs

---

### 1. Create Menu Item

```
POST /categories/:categoryId/items
```

---

### 2. Get Full Menu (Grouped) ⭐

```
GET /restaurants/:restaurantId/menu
```

### Response Shape:

```json
[
  {
    "category": "Burgers",
    "items": [...]
  }
]
```

---

### 3. Update Menu Item

```
PATCH /items/:id
```

---

### 4. Delete Menu Item

```
DELETE /items/:id
```

---

# 🔐 Authorization Rules

* A user can only manage:

  * Their own restaurant
  * Their categories
  * Their menu items

---

# 🧠 Business Rules

* Category must belong to a restaurant
* MenuItem must belong to:

  * A valid category
  * The same restaurant
* Price must be greater than 0
* Item must be `isAvailable = true` to be ordered
* Restaurant must be open to accept orders

---

# ⚡ Performance & Scalability

## ✅ Query Strategy

* Always query using `restaurantId`
* Avoid deep joins
* Use selective fields (`select` in Prisma)

---

## ✅ Indexing (Required)

```prisma
Category {
  @@index([restaurantId])
}

MenuItem {
  @@index([restaurantId])
  @@index([categoryId])
}
```

---

## ✅ Optimization Ready

Future enhancements:

* Redis caching (menu & categories)
* CDN for images
* Read replicas for scaling

---

# 🧱 Implementation Order

Follow this sequence:

1. Category Module

   * createCategory
   * getCategoriesByRestaurant
   * updateCategory
   * deleteCategory

2. MenuItem Module

   * createItem
   * updateItem
   * deleteItem

3. Menu Fetch API

   * grouped menu by category

---

# 🎯 Goals of This Design

* Clean architecture
* Scalable for high traffic
* Easy frontend integration
* Minimal future refactoring

---