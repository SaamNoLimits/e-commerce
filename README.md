# 🛒 Next.js 15 E-Commerce Platform

<div align="center">
  
  ![Next.js MongoDB Amazona](/public/images/app.png)
  
  **A full-featured e-commerce solution built with modern web technologies**
  
  [Live Demo](https://next-mongo-ecommerce-final.vercel.app/) | [Video Tutorial](https://youtu.be/WLHCPwqHzzQ)
  
  [![GitHub stars](https://img.shields.io/github/stars/basir/nextjs-amazona?style=social)](https://github.com/basir/nextjs-amazona)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  
</div>

## 🚀 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **UI Components** | ![Shadcn](https://img.shields.io/badge/Shadcn-000000?style=for-the-badge&logo=shadcnui&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=javascript&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) |
| **Payment** | ![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white) ![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white) |
| **Authentication** | ![Auth.js](https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=auth0&logoColor=white) ![Google Auth](https://img.shields.io/badge/Google%20Auth-4285F4?style=for-the-badge&logo=google&logoColor=white) |
| **Deployment** | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| **Additional** | ![Uploadthing](https://img.shields.io/badge/Uploadthing-FF0000?style=for-the-badge&logo=cloudinary&logoColor=white) ![Resend](https://img.shields.io/badge/Resend-008080?style=for-the-badge&logo=mail.ru&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=typescript&logoColor=white) |

## 📋 Features

- **Server Components**: Building e-commerce pages with Next.js server components
- **Modern UI**: Beautiful design with Shadcn and Tailwind CSS
- **Product Quick View**: Modal views using Next.js parallel routes with intercepting routes
- **Database Integration**: Mongoose models with MongoDB
- **Form Handling**: React Hook Form with Zod validation
- **Server Actions**: Update data without using API endpoints
- **Cart Management**: Server-side shopping cart with HTTP cookies
- **Authentication**: Multiple auth options with next-auth
- **Customer Dashboard**: Profile management and order tracking
- **Admin Dashboard**: Complete admin panel with charts, product management, order processing, and user management

## 🔧 Installation & Setup

### 1. Clone Repository

```bash
git clone git@github.com:basir/nextjs-amazona.git
cd nextjs-amazona
```

### 2. Environment Setup

- Duplicate `.example-env` and rename to `.env.local`

### 3. Configure MongoDB

**Option A: Cloud MongoDB**
- Create a database at [MongoDB.com](https://mongodb.com/)
- Update `MONGODB_URI` in `.env.local` with your database URL

**Option B: Local MongoDB**
- Install MongoDB from [MongoDB.org/download](https://www.mongodb.org/download)
- Update `MONGODB_URI` in `.env.local` with your local database URL

### 4. Seed Database

```bash
npm run seed
```

### 5. Install Dependencies & Run

```bash
npm install --legacy-peer-deps
npm run dev
```

### 6. Admin Access

- Open [http://localhost:3000](http://localhost:3000)
- Click "Sign In" button
- Login with admin credentials:
  - Email: `admin@example.com`
  - Password: `123456`

## 📚 Course Outline

<details>
<summary>Click to expand full course outline</summary>

- [00: Introduction](./lessons/00-introduction.md)
- [01: Install AI Tools & VSCode Extensions](./lessons/01-install-ai-tools-and-vscode-extensions.md)
- [02: Create Next App](./lessons/02-create-next-app.md)
- [03: Create Website Layout](./lessons/03-create-website-layout.md)
- [04: Create Home Page Carousel](./lessons/04-create-home-page-carousel.md)
- [05: Connect to MongoDB & Seed Products](./lessons/05-connect-to-mongodb-and-seed-products.md)
- [06: Create Home Cards](./lessons/06-create-home-cards.md)
- [07: Create Today's Deals Slider](./lessons/07-create-todays-deals-slider.md)
- [08: Create Best Selling Slider](./lessons/08-create-best-selling-slider.md)
- [09: Create Product Details Page](./lessons/09-create-product-details-page.md)
- [10: Create Browsing History](./lessons/10-create-browsing-history.md)
- [11: Implement Add to Cart](./lessons/11-implement-add-to-cart.md)
- [12: Create Cart Page](./lessons/12-create-cart-page.md)
- [13: Create Cart Sidebar](./lessons/13-create-cart-sidebar.md)
- [14: Sign In User](./lessons/14-signin-user.md)
- [15: Register User](./lessons/15-register-user.md)
- [16: Sign In with Google](./lessons/16-signin-with-google.md)
- [17: Create Checkout Page](./lessons/17-create-checkout-page.md)
- [18: Place Order](./lessons/18-place-order.md)
- [19: Pay Order by PayPal](./lessons/19-pay-order-by-paypal.md)
- [20: Pay Order by Stripe](./lessons/20-pay-order-by-stripe.md)
- [21: Rate & Review Products](./lessons/21-rate-review-products.md)
- [22: Create Order History Page](./lessons/22-create-order-history-page.md)
- [23: Update User Name](./lessons/23-update-user-name.md)
- [24: Create Category Sidebar](./lessons/24-create-category-sidebar.md)
- [25: Create Search Page](./lessons/25-create-search-page.md)
- [26: Add Theme Color](./lessons/26-add-theme-color.md)
- [27: Create Admin Dashboard](./lessons/27-create-admin-dashboard.md)
- [28: Admin Products](./lessons/28-admin-products.md)
- [29: Create & Update Products](./lessons/29-create-update-products.md)
- [30: Admin Orders](./lessons/30-admin-orders.md)
- [31: Mark Orders as Paid/Delivered](./lessons/31-mark-orders-as-paid-delivered.md)
- [32: Admin Users](./lessons/32-admin-users.md)
- [33: Edit User](./lessons/33-edit-user.md)
- [34: Admin Web Pages](./lessons/34-admin-web-pages.md)
- [35: Create & Update Web Pages](./lessons/35-create-update-web-pages.md)
- [36: Create Settings Page](./lessons/36-create-settings-page.md)
- [37: Make Website Multilingual](./lessons/37-make-website-multilingual.md)

</details>

## 📱 Screenshots

<div align="center">
  <img src="/public/images/app.png" alt="Application Screenshot" width="800"/>
</div>

## 📞 Contact

This project was developed by:
- **Ms. Zineb AHJLI** & **Mr. Oussama AHJLI**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
