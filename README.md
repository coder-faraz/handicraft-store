# Limra Manufacturing Company - E-Commerce Store

Welcome to the **Limra Manufacturing Company** repository! This is a modern, premium, high-performance e-commerce storefront for Indian handicrafts, built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **MongoDB**.

## 🚀 Project Overview

This project provides a complete end-to-end e-commerce solution:
- **Customer Storefront**: Beautiful, responsive, and SEO-optimized product discovery and shopping experience.
- **Admin Dashboard**: Secure panel to manage products, categories, orders, and users.
- **Authentication**: Custom session-based authentication using `iron-session` and `bcryptjs`.
- **Payments**: Integrated with **Razorpay** for secure checkouts.
- **Media**: Integrated with **Cloudinary** for optimized image hosting and delivery.
- **Database**: **MongoDB** with Mongoose ORM.

## 🛠️ Local Setup Steps

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd handicraft-store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory (see *Env Variables Explained* section below for details) and populate it with your keys.

4. **Run Database Migrations (Indexes):**
   *(Optional but recommended)* You can execute the index migration script to set up text search and unique constraints.
   ```bash
   # Add a temporary script to package.json to run src/lib/mongodb-indexes.ts or simply let mongoose auto-create indexes during dev.
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Env Variables Explained

Your `.env.local` should look like this:

```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/limra-store

# Iron Session Password (must be at least 32 characters long)
SESSION_PASSWORD=super-secret-password-that-is-at-least-32-chars

# Site URL for SEO/Sitemaps
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudinary Keys (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Keys (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Sentry DSN (Optional: for error tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## ☁️ Deployment to Vercel

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. In the configuration step, open the **Environment Variables** section and paste all the variables from your `.env.local`.
5. Click **Deploy**. Vercel will automatically detect Next.js and build your app.

## 🗄️ MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and create a user with read/write privileges.
3. Go to **Network Access** and whitelist your IP (or `0.0.0.0/0` for universal access).
4. Click **Connect**, choose "Connect your application", and copy the connection string into `MONGODB_URI`.

## 🖼️ Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/).
2. From the dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Add them to your environment variables. The Admin dashboard uses these credentials to securely upload and delete product images.

## 💳 Razorpay Setup

1. Sign up for a [Razorpay](https://razorpay.com/) merchant account.
2. Go to **Settings > API Keys** in the Razorpay Dashboard.
3. Generate a new Test Key (or Live Key).
4. Copy the `Key Id` and `Key Secret` into your environment variables.

## 📂 Folder Structure Overview

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── (store)/          # Customer-facing routes (products, cart, checkout)
│   ├── admin/            # Admin dashboard routes
│   └── api/              # Backend API endpoints (auth, products, payments)
├── components/           # Reusable React components
│   ├── admin/            # Admin-specific components (Sidebar, Tables)
│   ├── shared/           # Shared components (Buttons, Spinners)
│   └── store/            # Storefront components (ProductCard, Header)
├── context/              # React Context Providers (Auth, Cart)
├── lib/                  # Utility functions, DB connection, Razorpay config
├── models/               # Mongoose schemas (User, Product, Order)
└── validators/           # Zod schemas for API validation
```

## 📈 Phase Summary

- **Phase 1**: Database schema design, authentication system (`iron-session`), context setup.
- **Phase 2**: Admin dashboard shell, secure API routes, mock data tables, and Cloudinary upload logic.
- **Phase 3**: Customer storefront UI, rich mega-menus, responsive product grids, filtering, and theme setup.
- **Phase 4**: Shopping cart logic, Address management, Razorpay checkout integration, and Orders tracking UI.
- **Phase 5**: SEO optimizations (Sitemaps, Robots, JSON-LD), performance tuning (ISR, Image optimization), error boundaries, and production readiness.

---
*Built with ❤️ for Limra Manufacturing Company.*
