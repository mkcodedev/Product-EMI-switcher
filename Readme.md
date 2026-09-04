# 1Fi Store — Product & Mutual Fund-Backed EMI Platform

> Full-stack dynamic smartphone catalog with variant-linked EMI calculations and zero hardcoded data.

---
## Admin Access
Portal Route: /super/admin

Test Credentials: Email: test@gmail.com | Password: test123@

## I. Tech Stack

* **Frontend:** React, Vite, React Router, Tailwind CSS, Axios, Lucide Icons
* **Backend:** Node.js, Express.js, Multer, Sharp (WebP optimization)[cite: 2]
* **Database:** MongoDB Atlas, Mongoose, GridFS Stream Storage[cite: 2]
* **Auth & Security:** JWT (3-day `httpOnly` cookie), bcryptjs, max 5 admins limit

---

## II. Database Schema & Architecture

### 1. Product Model (`backend/src/models/Product.js`)
* **Product:** `name`, `slug` (unique), `brand`, `tag`, `sellerName`, `shippingDays`, `description`, `specifications`
* **Variants (min 2 per product):** `storage`, `ram`, `colorName`, `colorHex`, `mrp`, `sellingPrice`, `images[]`[cite: 2]
* **Variant EMI Plans:** `monthlyAmount`, `tenureMonths`, `interestRate`, `cashback`

```javascript
// Mathematical calculation executed for auto-generated EMI tiers:
Monthly_EMI = Math.round((Price * (1 + (Rate * Tenure) / 1200)) / Tenure);

```
## 2. Admin Model (backend/src/models/Admin.js)
name, email (unique, lowercase), passwordHash, role (strictly capped at 5 total admins)

### III. Seed Data (seed.json)
```javascript 
[
  {
    "name": "Apple iPhone 17 Pro",
    "slug": "apple-iphone-17-pro",
    "brand": "Apple",
    "tag": "NEW",
    "sellerName": "Balaji Infocom",
    "shippingDays": "Dispatch in less than 48 hours",
    "description": "Titanium design with A19 Pro Bionic chip and 48MP triple camera array.",
    "specifications": {
      "screenSize": "6.3 inch Super Retina XDR OLED",
      "processor": "Apple A19 Pro Hexa-Core",
      "rearCamera": "48MP + 48MP + 48MP",
      "frontCamera": "18MP TrueDepth",
      "battery": "Up to 27 hours video playback"
    },
    "variants": [
      {
        "storage": "256GB",
        "ram": "12GB",
        "colorName": "Silver",
        "colorHex": "#C0C0C0",
        "mrp": 134900,
        "sellingPrice": 128990,
        "images": ["/api/media/iphone_silver.webp"],
        "emiPlans": [
          { "monthlyAmount": 44967, "tenureMonths": 3, "interestRate": 0, "cashback": 7500 },
          { "monthlyAmount": 22483, "tenureMonths": 6, "interestRate": 0, "cashback": 7500 },
          { "monthlyAmount": 11242, "tenureMonths": 12, "interestRate": 0, "cashback": 7500 }
        ]
      },
      {
        "storage": "512GB",
        "ram": "12GB",
        "colorName": "Cosmic Orange",
        "colorHex": "#EA580C",
        "mrp": 154900,
        "sellingPrice": 148990,
        "images": ["/api/media/iphone_orange.webp"],
        "emiPlans": [
          { "monthlyAmount": 49663, "tenureMonths": 3, "interestRate": 0, "cashback": 7500 },
          { "monthlyAmount": 24832, "tenureMonths": 6, "interestRate": 0, "cashback": 7500 },
          { "monthlyAmount": 12416, "tenureMonths": 12, "interestRate": 0, "cashback": 7500 }
        ]
      }
    ]
  },
  {
    "name": "Samsung Galaxy S24 Ultra",
    "slug": "samsung-s24-ultra",
    "brand": "Samsung",
    "tag": "AI PHONE",
    "sellerName": "Balaji Infocom",
    "shippingDays": "Dispatch in less than 48 hours",
    "description": "Galaxy AI phone with Titanium frame and 200MP Quad Telephoto camera.",
    "specifications": {
      "screenSize": "6.8 inch Dynamic AMOLED 2X 120Hz",
      "processor": "Snapdragon 8 Gen 3 for Galaxy",
      "rearCamera": "200MP + 50MP + 12MP + 10MP",
      "frontCamera": "12MP Dual Pixel",
      "battery": "5000 mAh with 45W Fast Charging"
    },
    "variants": [
      {
        "storage": "256GB",
        "ram": "12GB",
        "colorName": "Titanium Gray",
        "colorHex": "#71717A",
        "mrp": 134999,
        "sellingPrice": 129999,
        "images": ["/api/media/s24_gray.webp"],
        "emiPlans": [
          { "monthlyAmount": 43333, "tenureMonths": 3, "interestRate": 0, "cashback": 5000 },
          { "monthlyAmount": 10833, "tenureMonths": 12, "interestRate": 0, "cashback": 5000 }
        ]
      },
      {
        "storage": "512GB",
        "ram": "12GB",
        "colorName": "Titanium Black",
        "colorHex": "#18181B",
        "mrp": 144999,
        "sellingPrice": 139999,
        "images": ["/api/media/s24_black.webp"],
        "emiPlans": [
          { "monthlyAmount": 46666, "tenureMonths": 3, "interestRate": 0, "cashback": 5000 },
          { "monthlyAmount": 11667, "tenureMonths": 12, "interestRate": 0, "cashback": 5000 }
        ]
      }
    ]
  },
  {
    "name": "Google Pixel 9 Pro",
    "slug": "google-pixel-9-pro",
    "brand": "Google",
    "tag": "PRO CAMERA",
    "sellerName": "Balaji Infocom",
    "shippingDays": "Dispatch in less than 48 hours",
    "description": "Engineered by Google with Gemini Nano and Tensor G4 processor.",
    "specifications": {
      "screenSize": "6.3 inch Super Actua LTPO OLED",
      "processor": "Google Tensor G4",
      "rearCamera": "50MP + 48MP + 48MP",
      "frontCamera": "42MP Dual PD",
      "battery": "4700 mAh with Fast Charging"
    },
    "variants": [
      {
        "storage": "128GB",
        "ram": "16GB",
        "colorName": "Obsidian",
        "colorHex": "#1F2937",
        "mrp": 109999,
        "sellingPrice": 104999,
        "images": ["/api/media/pixel_obsidian.webp"],
        "emiPlans": [
          { "monthlyAmount": 34999, "tenureMonths": 3, "interestRate": 0, "cashback": 4000 },
          { "monthlyAmount": 8750, "tenureMonths": 12, "interestRate": 0, "cashback": 4000 }
        ]
      },
      {
        "storage": "256GB",
        "ram": "16GB",
        "colorName": "Porcelain",
        "colorHex": "#F3F4F6",
        "mrp": 119999,
        "sellingPrice": 114999,
        "images": ["/api/media/pixel_porcelain.webp"],
        "emiPlans": [
          { "monthlyAmount": 38333, "tenureMonths": 3, "interestRate": 0, "cashback": 4000 },
          { "monthlyAmount": 9583, "tenureMonths": 12, "interestRate": 0, "cashback": 4000 }
        ]
      }
    ]
  }
] 
```
## IV. Setup & Run Instructions
### 1. Install All Dependencies (Single Command)
Bash
>(cd backend && npm install) && (cd frontend && npm install)
### 2. Configure Environment Variables
backend/.env:
```javascript
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
### frontend/.env:
```
VITE_API_URL=http://localhost:5000/api
```
## 3. Run Applications
Backend: cd backend && npm run dev (Runs on http://localhost:5000)

Frontend: cd frontend && npm run dev (Runs on http://localhost:5173)


## ## V. API Endpoints & Example Responses

| Method | Endpoint | Access | Purpose | Status |
|---|---|---|---|---|
| GET | `/api/products` | Public | List storefront catalog products | 🟢 |
| GET | `/api/products/:slug` | Public | Get product details & variant EMI matrix | 🟢 |
| GET | `/api/products/meta/suggestions` | Public | Autocomplete values for inputs | 🟢 |
| GET | `/api/media/:filename` | Public | Stream optimized WebP from GridFS | 🟢 |
| POST | `/api/admin/login` | Public | Log in admin (returns 3-day cookie) | 🟢 |
| POST | `/api/admin/signup` | Public | Register admin (enforces 5-admin cap) | 🟢 |
| POST | `/api/admin/upload` | Admin | Upload variant photo to MongoDB | 🟢 |
| POST | `/api/products/admin` | Admin | Create product with variants & plans | 🟢 |
| PUT | `/api/products/admin/:id` | Admin | Update existing product & recalculations | 🟢 |
| DELETE | `/api/products/admin/:id` | Admin | Delete product from catalog | 🟢 |


## Example Response: GET /api/products/:slug
[cite: 1, 2]
``` javascript
JSON
{
  "data": {
    "name": "Apple iPhone 17 Pro",
    "slug": "apple-iphone-17-pro",
    "brand": "Apple",
    "variants": [
      {
        "storage": "256GB",
        "colorName": "Silver",
        "sellingPrice": 128990,
        "mrp": 134900,
        "images": ["/api/media/img_102.webp"],
        "emiPlans": [
          {
            "monthlyAmount": 11242,
            "tenureMonths": 12,
            "interestRate": 0,
            "cashback": 7500
          }
        ]
      }
    ]
  }
}
```
