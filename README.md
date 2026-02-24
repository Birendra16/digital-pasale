# Digital Pasale (डिजिटल पसले)

**Digital Pasale** is a **modern MERN stack wholesale grocery management system** designed to simplify operations for Nepali shop owners. From **fast billing** to **credit tracking** and **inventory management**, it covers everything a wholesale shop needs.

---

## 🚀 Features

### ✅ Phase 1 – Minimum Viable Product (Core Features)
- [x] **Authentication & User Roles (Owner / Staff):** Secure login with owner-first setup; owner can create staff accounts.  
- [x] **Product Module:** Manage products with multiple units and unit conversions (carton, sack, dozen, piece, kg).  
- [ ] **Inventory Module:** Track stock in/out, damaged goods, expiry dates, and low stock alerts.  
- [ ] **Sales / POS Module:** Fast billing, bulk quantity support, VAT 13% auto-calculation, invoice generation, partial payments.  
- [ ] **Customer Module:** Credit management, ledger tracking, partial payments, total dues.  
- [ ] **Basic Reports:** Daily sales, stock valuation, customer due report.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, ShadCN, Lucide React, Redux Toolkit, Formik + Yup, Axios  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT (JSON Web Tokens)  
- **API Architecture:** RESTful APIs  

---

## ⚙️ Installation Steps

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

Create a .env file in the server directory
```bash
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
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

Create a .env.local file in the client directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the client : 
```bash
npm run dev
```

---

## 📞 Contact <a id="contact"></a>

If you have any questions, feel free to reach out!

* **Name**: Birendra Bohara  
* **Email**: bbirendra693@gmail.com  
* **GitHub**: [https://github.com/Birendra16/digital-pasale]

---







 



