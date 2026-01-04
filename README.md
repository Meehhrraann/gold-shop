# Gold Shop – Full‑Stack E‑Commerce Platform

A modern, full‑stack e‑commerce application built with Next.js, React, Tailwind CSS, and Shadcn UI, featuring secure authentication, real‑time data handling, product management, and advanced search & filtering.  
The project is fully deployed and accessible at:

🔗 Live Demo: https://gold-shop-phi.vercel.app/

---

# 🚀 Tech Stack

Frontend

- Next.js – App Router, Server Actions, API Routes
- React.js – Component‑based UI
- Tailwind CSS – Utility‑first styling
- Shadcn UI – Accessible, customizable UI components

Backend & Infrastructure

- MongoDB Atlas – Cloud database
- Liara Object Storage (S3 compatible) – Image storage
- Auth.js – Authentication (Session + JWT hybrid)
- Middleware – Login callback handling

---

# 🔐 Authentication Features

- Credential Login (Email + Password)
- OAuth Login:
  - GitHub
  - Google
- Email Verification
- Password Reset Email
- Hybrid Auth: Session + JWT for secure and scalable auth flows

---

# 🛒 Shopping Cart Logic

- Cart stored in LocalStorage for guests
- On login, cart is automatically synced and transferred to the database
- Persistent cart across sessions

---

# 🧩 Core Features

Product Management

- Create product
- Update product
- Upload product images to Liara Object Storage (S3)
- Real‑time UI updates

User Interaction

- Like system
- Comment system
- Kanban board for admin/product workflow

Search & Filtering

- Global Search – Search across the entire platform
- Local Search – Context‑specific search (e.g., inside product lists)
- Advanced Filtering – Category, price, attributes, etc.

---

# 📊 Analytics & Data Visualization

- Dynamic charts powered by real database data
- Aggregation pipelines to transform MongoDB data into meaningful insights
- Custom data manipulation using MongoDB Aggregation Framework

---

# 🗄️ Database & Storage

MongoDB Atlas
Used for:

- Users
- Products
- Comments
- Likes
- Cart
- Admin/Kanban data

Liara Object Storage (S3 Compatible)
Used for:

- Product images
- Secure upload via signed URLs
- Fast CDN delivery

---

# ⚙️ Middleware

Custom middleware handles:

- Auth callback after login
- Session validation
- Route protection
- Redirect logic

---

# 🧪 Key Highlights

- Fully responsive UI
- Clean and scalable architecture
- Modern UI with Shadcn components
- Secure authentication flow
- Real‑time interactions
- Optimized database queries
- Production‑ready deployment

---

# 🛠️ Installation & Setup

`bash
git clone <repo-url>
cd gold-shop
npm install
`

Environment Variables
Create a .env file:

- MONGODB_URI=
- NEXTAUTH_SECRET=
- API_SERVER_BASE_URL=

- GITHUB_CLIENT_ID=
- GITHUB_CLIENT_SECRET=
- GOGGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=

- JWT_SECRET=

- EMAIL_HOST=
- EMAIL_PORT=
- EMAIL_USER=
- EMAIL_PASSWORD=
- EMAIL_APP_PASSWORD=

Run Development Server
`bash
npm run dev
`

---

# 📌 Future Improvements

- Order management
- Payment gateway integration
- Admin analytics dashboard
- Wishlist system
