# Digital Pasale (डिजिटल पसले)

**Digital Pasale** is a **modern full-stack wholesale grocery management system** built for Nepali shop owners. It streamlines day-to-day operations including inventory tracking, sales & purchases, supplier/customer management, and admin approvals — all in one platform.

🌐 **Live Demo:** [digital-pasale-client.vercel.app](https://digital-pasale-client.vercel.app)

---

## 🚀 Features

### ✅ Phase 1 — Core MVP

- [x] **Authentication & User Roles** — Secure JWT login with role-based access (Admin / Owner / Staff)
- [x] **Inventory Module** — Track stock levels, stock-in/out logs, unit & sub-unit conversions
- [x] **Purchase Module** — Record purchases, auto-update inventory, view & return purchases
- [x] **Sales / POS Module** — Fast billing, bulk quantity support, sales history with search & pagination
- [x] **Customer Module** — Add, edit, delete customers; search and filter support
- [x] **Supplier Module** — Manage suppliers, create/edit/delete with full CRUD

### ✅ Phase 2 — Advanced Features

- [x] **Admin Panel** — Approve/reject user registrations, manage roles and access
- [x] **Dashboard** — Real-time overview of sales, purchases & inventory with charts (Recharts)
- [x] **Settings** — Manage units and sub-units app-wide
- [ ] **Subscriptions & Payments** — Subscription plan management and payment tracking
- [x] **Real-time Updates** — Live data sync via Socket.io

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, ShadCN UI, Lucide React |
| **Forms** | Formik + Yup |
| **Tables** | TanStack React Table |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Real-time** | Socket.io |
| **Backend** | Node.js, Express.js v5 |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT + Cookie Parser |
| **Deployment** | Vercel (client) + Render (server) |

---

## 📁 Project Structure

```
digital-pasale/
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── (authpage)/      # Login & Signup
│   │   ├── admin/           # Admin panel & approvals
│   │   └── owner/           # Owner dashboard & modules
│   │       ├── customer/
│   │       ├── dashboard/
│   │       ├── inventory/
│   │       ├── purchase/
│   │       ├── sales/
│   │       ├── settings/
│   │       └── supplier/
│   └── components/          # Reusable UI components
│
└── server/                  # Express.js backend
    ├── controllers/         # Business logic
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    └── middlewares/         # Auth & role middleware
```

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Birendra16/digital-pasale.git
cd digital-pasale
```

### 2. Server Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

### 3. Client Setup
```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Start the client:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| **Client** | Vercel | [digital-pasale-client.vercel.app](https://digital-pasale-client.vercel.app) |
| **Server** | Render | [digital-pasale-server.onrender.com](https://digital-pasale-server.onrender.com) |
| **Database** | MongoDB Atlas | Cloud hosted |

---

## 🛠️ Production Troubleshooting

If you see `401 Unauthorized` or `Failed to fetch` in production:

1. **Render (Server):**
   - Ensure `NODE_ENV=production` is set in Environment Variables.
   - Ensure `CLIENT_URL=https://your-vercel-app.vercel.app` (no trailing slash).
   - Ensure `MONGO_URI` and `JWT_SECRET` are correct.

2. **Vercel (Client):**
   - Ensure `NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com` (no trailing slash).
   - If changes don't show up, go to **Deployments** → **Redeploy** to force an update.

3. **CORS & Cookies:**
   - The app uses a global axios interceptor (`AuthInitializer.tsx`) and `sameSite: "none"` cookies for cross-origin support.
   - Make sure your browser isn't blocking third-party cookies (though the `Bearer` token fallback should handle this).

---

## 📞 Contact

* **Name:** Birendra Bohara
* **Email:** bbirendra693@gmail.com
* **GitHub:** [github.com/Birendra16](https://github.com/Birendra16)
