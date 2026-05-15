# FoodHub Server (Backend) 🍔🍕

FoodHub is a comprehensive backend server built with Node.js, Express, TypeScript, and Prisma ORM. It serves as the core infrastructure for a full-scale food ordering platform, featuring distinct functionalities and role-based access control for Customers, Providers (Restaurants), and Administrators.

## 🔗 Important Links
- **Frontend Repository (Client):** [FoodHub-Client](https://github.com/rakib-hasan3/FoodHub-Client)
- **Live Demo (Frontend):** [foodhub-client-gamma.vercel.app](https://foodhub-client-gamma.vercel.app)


## 🚀 Tech Stack
- **Framework:** Node.js, Express.js
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token), Cookie-Parser
- **Validation:** Zod
- **AI Integration:** Google Generative AI (Gemini)

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure login system utilizing JWT and HTTP-Only Cookies.
- Three distinct user roles: `USER` (Customer), `PROVIDER`, and `ADMIN`.
- Comprehensive Role-Based Access Control (RBAC) across all API endpoints.

### 👥 User & Provider Management
- **Provider:** Providers can create and manage their restaurant profiles, update their addresses, and completely control their menus.
- **Admin:** Administrators have the authority to manage all users and providers, including the ability to suspend or activate accounts.

### 🍔 Meal & Menu Management
- Create, read, update, and delete (CRUD) operations for meals and categories.
- Advanced meal filtering capabilities (e.g., Featured, Trending, Discounted Meals, Spice Level, Preparation Time).
- Built-in offer and discount system with automated expiration tracking.

### 📦 Order Processing
- Seamless order placement for customers.
- Real-time order status tracking pipeline (`PLACED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED`).
- Dedicated dashboards for providers to receive and update their specific orders.
- Global order monitoring system for administrators.

### ⭐ Reviews & Ratings
- Customers can leave detailed reviews and ratings for the meals they have ordered.
- Automated calculation and updating of average ratings and total review counts for each meal.

### 🤖 AI Integration
- Integrated with Google Generative AI to provide smart features (e.g., advanced search assistance or automated recommendations).

## 📂 Project Structure
The application follows a Modular Architecture, ensuring scalability, maintainability, and clean code separation.
- **`src/modules/`**: Contains distinct modules for each feature (incorporating Controllers, Services, Routes, and Interfaces).
- **`src/middlewares/`**: Houses global middlewares such as the Global Error Handler and Auth Middleware.
- **`prisma/schema.prisma`**: Defines the database schema, models, and complex relationships.
- **`api/`**: The output directory for the production-ready code, bundled using Tsup.

## 🛠️ Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd foodhub-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the necessary variables:
   ```env
   PORT=5000
   DATABASE_URL="your_postgresql_database_url"
   JWT_SECRET="your_jwt_secret"
   APP_URL="http://localhost:3000"
   PROD_APP_URL="your_production_frontend_url"
   ```

4. **Run Database Migrations:**
   Generate the Prisma client and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Build for Production:**
   ```bash
   npm run build
   ```

## 🌐 API Endpoints Overview
- `/api/auth` - Login, registration, and session management.
- `/api/meals` - Browse, search, filter, and view meal details.
- `/api/offers` - Fetch a list of currently discounted meals.
- `/api/orders` - Customer order creation and tracking.
- `/api/provider` - Provider profile and menu management.
- `/api/provider/orders` - Dedicated order management for providers.
- `/api/admin/user-management` - Comprehensive user and provider administration.
- `/api/admin/order-management` - Global order dashboard for admins.
- `/api/reviews` - Submit and retrieve meal reviews.
- `/api/ai` - AI assistant integration.

## 🔒 Security & Performance
- **CORS Configured:** Strict Cross-Origin Resource Sharing (CORS) configuration, accepting requests only from allowed domains (e.g., Vercel Client, Localhost) to prevent XSS attacks.
- **Global Error Handler:** A custom global error handling middleware prevents API crashes and returns consistent, user-friendly error messages to the client.
- **Production Ready:** Pre-configured for seamless deployment on Vercel (`vercel.json`) with an optimized build process powered by Tsup.

---
*Developed with Node.js & Prisma 🚀*
