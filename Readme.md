# 1Fi Store

> A full-stack smartphone catalog with variant-aware pricing, zero-interest EMI plans, admin management, and MongoDB-backed product media.

[![Frontend](https://img.shields.io/badge/frontend-React%2018-149eca?style=flat-square&logo=react&logoColor=white)](frontend/)
[![Backend](https://img.shields.io/badge/backend-Express%204-111827?style=flat-square&logo=express&logoColor=white)](backend/)
[![Database](https://img.shields.io/badge/database-MongoDB%20%2B%20GridFS-47A248?style=flat-square&logo=mongodb&logoColor=white)](backend/src/config/db.js)
[![License](https://img.shields.io/badge/license-private-lightgrey?style=flat-square)](#)

1Fi Store is a dynamic product catalog for smartphones and EMI-led shopping flows. Product data, variants, EMI plans, reviews, and media are stored in MongoDB rather than hardcoded in the frontend.

## 📱 Product References

| # | Product | Reference Website |
|---|---------|-------------------|
| 1 | Apple iPhone 17 Pro (Silver, 256 GB) | [Snapmint](https://snapmint.com/p/apple-iphone-17-pro-silver-256-gb-smart-phones-on-emi) |
| 2 | Tecno Spark 50 5G (Champagne Gold, 128 GB, 6 GB RAM) | [Snapmint](https://snapmint.com/p/tecno-spark-50-5g-champagne-gold-128-gb-6-gb-ram-smart-phones-on-emi) |
| 3 | Motorola G57 Power 5G (Fluidity, 128 GB, 8 GB RAM) | [Snapmint](https://snapmint.com/p/motorola-g57-power-5g-fluidity-128-gb-8-gb-ram-smart-phones-on-emi) |
| 4 | Realme P4 Lite 5G (Mosaic Green, 64 GB, 4 GB RAM) | [Snapmint](https://snapmint.com/p/realme-p4-lite-5g-mosaic-green-64-gb-4-gb-ram-smart-phones-on-emi) |
| 5 | Vivo T5x 5G (Cyber Green, 256 GB, 8 GB RAM) | [Snapmint](https://snapmint.com/p/vivo-t5x-5g-cyber-green-256-gb-8-gb-ram-smart-phones-on-emi) |


## Contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Admin access](#admin-access)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Seed data](#seed-data)
- [EMI calculation](#emi-calculation)
- [Security and media](#security-and-media)

## Highlights

- Browse a MongoDB-backed smartphone catalog.
- Switch between product variants with independent price, color, stock, image, and EMI data.
- Compare EMI tenures, interest rates, and cashback values.
- Manage products and optimized images from the protected admin portal.
- Store uploaded images as WebP files in MongoDB GridFS.
- Keep admin sessions in an `httpOnly` JWT cookie valid for three days.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Storefront | React, React Router, Vite, Tailwind CSS, Axios, Lucide React |
| API | Node.js, Express, Mongoose, CORS, cookie-parser, dotenv |
| Authentication | JWT, bcryptjs, `httpOnly` cookies |
| Media processing | Multer, Sharp, MongoDB GridFS |
| Database | MongoDB Atlas or any MongoDB deployment supported by Mongoose |

## Project structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/db.js             # MongoDB and GridFS connection
│   │   ├── controllers/             # Auth, product, and media behavior
│   │   ├── middleware/              # JWT protection and uploads
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # HTTP route definitions
│   │   └── server.js                # Express application entry point
│   ├── seed.json                    # Sample catalog documents
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios client
│   │   ├── components/              # Shared UI components
│   │   └── pages/                   # Storefront and admin pages
│   └── package.json
└── Readme.md
```

Useful source links:

- [Product schema](backend/src/models/Product.js)
- [Admin schema](backend/src/models/Admin.js)
- [Product routes](backend/src/routes/productRoutes.js)
- [Authentication routes](backend/src/routes/authRoutes.js)
- [Media routes](backend/src/routes/mediaRoutes.js)
- [Sample seed data](backend/seed.json)
- [Frontend application](frontend/src/App.jsx)

## Quick start

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database, such as MongoDB Atlas

### 1. Install dependencies

From the repository root:

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit either file. Both are ignored by [`.gitignore`](.gitignore).

### 3. Start the applications

Run the API in one terminal:

```bash
cd backend
npm run dev
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Default URLs:

- Storefront: `http://localhost:5173`
- API health: `http://localhost:5000/`
- API status: `http://localhost:5000/api`
- Admin portal: `http://localhost:5173/super/admin`

For a production API process, use `npm start` from `backend/`. To build the frontend, use `npm run build` from `frontend/`.

## Environment variables

| Variable | App | Required | Purpose |
| --- | --- | --- | --- |
| `PORT` | Backend | No | API port; defaults to `5000` |
| `MONGODB_URI` | Backend | Yes | MongoDB connection string |
| `CLIENT_URL` | Backend | Yes for deployment | Allowed frontend origin for CORS |
| `JWT_SECRET` | Backend | Yes | Secret used to sign admin tokens |
| `NODE_ENV` | Backend | No | Enables production cookie behavior when set to `production` |
| `VITE_API_URL` | Frontend | Yes | Base URL for API requests |

## Admin access

The admin portal is available at `/super/admin`.

For the local demo environment documented by the original project:

```text
Email: test@gmail.com
Password: test123@
```

Change or remove demo credentials before deploying. New admin accounts require a name, valid email, matching passwords, and a password of at least eight characters. The API allows a maximum of five admin accounts.

## API reference

All API routes are prefixed with `/api`. Protected routes require the `admin_token` cookie created by login.

### Health and public catalog

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Backend health and database readiness |
| `GET` | `/api` | API status |
| `GET` | `/api/products` | Return products sorted by newest first |
| `GET` | `/api/products/:slug` | Return one product and its variants |
| `GET` | `/api/products/meta/suggestions` | Return distinct brands, tags, storage values, RAM values, and colors |
| `GET` | `/api/media/:filename` | Stream an optimized image from GridFS |

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/admin/signup` | Public | Create an admin account, up to the five-account limit |
| `POST` | `/api/admin/login` | Public | Authenticate and set a three-day `httpOnly` cookie |
| `POST` | `/api/admin/logout` | Public | Clear the admin cookie |
| `GET` | `/api/admin/me` | Admin | Return the authenticated admin |

### Admin catalog management

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/products/admin` | Create a product with at least two variants |
| `PUT` | `/api/products/admin/:id` | Update a product and validate its variants and EMI plans |
| `DELETE` | `/api/products/admin/:id` | Delete a product |
| `POST` | `/api/media/upload` | Upload, resize, convert, and store an image as WebP |

### Example: list products

```bash
curl http://localhost:5000/api/products
```

```json
{
  "data": [
    {
      "name": "Apple iPhone 17 Pro",
      "slug": "apple-iphone-17-pro",
      "brand": "Apple",
      "variants": [
        {
          "storage": "256GB",
          "ram": "12GB",
          "colorName": "Silver",
          "sellingPrice": 128990,
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
  ]
}
```

### Example: create a product

Send JSON to `POST /api/products/admin` with the admin cookie:

```json
{
  "name": "Example Phone",
  "slug": "example-phone",
  "brand": "Example",
  "description": "A product description.",
  "specifications": {
    "screenSize": "6.7 inch OLED",
    "processor": "Example X1",
    "battery": "5000 mAh"
  },
  "variants": [
    {
      "storage": "128GB",
      "ram": "8GB",
      "colorName": "Black",
      "colorHex": "#111111",
      "mrp": 59999,
      "sellingPrice": 54999,
      "images": ["/api/media/example.webp"],
      "emiPlans": [
        {
          "monthlyAmount": 4583,
          "tenureMonths": 12,
          "interestRate": 0,
          "cashback": 2000
        }
      ]
    },
    {
      "storage": "256GB",
      "ram": "8GB",
      "colorName": "Blue",
      "colorHex": "#2563EB",
      "mrp": 64999,
      "sellingPrice": 59999,
      "images": ["/api/media/example-blue.webp"],
      "emiPlans": [
        {
          "monthlyAmount": 5000,
          "tenureMonths": 12,
          "interestRate": 0,
          "cashback": 2000
        }
      ]
    }
  ]
}
```

Successful catalog responses use `{ "data": ... }`. Validation and authentication failures use `{ "message": "..." }`.

## Data model

### Product document

Defined in [`backend/src/models/Product.js`](backend/src/models/Product.js).

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required product name |
| `slug` | String | Required, unique, lowercase URL identifier |
| `brand` | String | Required brand |
| `tag` | String | Defaults to `NEW` |
| `sellerName` | String | Defaults to `Balaji Infocom` |
| `shippingDays` | String | Dispatch and delivery message |
| `ratingAverage` / `ratingCount` | Number | Catalog rating summary |
| `description` | String | Required product description |
| `specifications` | Object | Storage, screen, cameras, processor, and battery details |
| `reviews` | Array | Author, city, rating, comment, verification, and date |
| `variants` | Array | Requires at least two variants |

Each variant contains `storage`, `ram`, `colorName`, `colorHex`, `mrp`, `sellingPrice`, `images`, `stock`, and `emiPlans`. Each variant requires at least one image and one EMI plan.

Each EMI plan contains:

```text
monthlyAmount, tenureMonths, interestRate, cashback
```

### Admin document

Defined in [`backend/src/models/Admin.js`](backend/src/models/Admin.js).

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required |
| `email` | String | Required, unique, lowercase, validated format |
| `passwordHash` | String | bcrypt hash; raw passwords are never stored |
| `role` | String | Immutable and defaults to `admin` |

Both schemas include `createdAt` and `updatedAt` timestamps.

## Seed data

The documented catalog snapshot contains three products, each with two variants and variant-specific EMI plans:

| Product | Variants | Example EMI tenures |
| --- | ---: | --- |
| Apple iPhone 17 Pro | 2 | 3, 6, and 12 months |
| Samsung Galaxy S24 Ultra | 2 | 3 and 12 months |
| Google Pixel 9 Pro | 2 | 3 and 12 months |

The checked-in [`backend/seed.json`](backend/seed.json) contains the sample catalog documents. The repository does not currently include an executable seed runner, so import the JSON through the admin dashboard or your preferred MongoDB tooling after configuring the database. The API requires at least two variants and one EMI plan per variant.

## EMI calculation

The intended interest-adjusted monthly amount can be represented as:

```text
Monthly EMI = round((sellingPrice * (1 + (interestRate * tenureMonths) / 1200)) / tenureMonths)
```

For a zero-interest 12-month plan on a price of `128990`:

```text
round(128990 / 12) = 10749
```

The current API accepts and stores `monthlyAmount` in the submitted EMI plan. It does not calculate or overwrite that value server-side, so clients or a future seed/import script should calculate it before sending data.

## Security and media

- Passwords are hashed with bcryptjs before storage.
- Admin JWTs are stored in an `httpOnly` cookie and expire after three days.
- Product mutations and media uploads require admin authentication.
- CORS is restricted to configured client origins and approved Vercel deployments.
- Uploaded images are resized to fit within `1200 x 1200`, converted to WebP at quality 80, and stored in the `mediaUploads` GridFS bucket.
- Keep `MONGODB_URI` and `JWT_SECRET` in environment variables and rotate any credentials used for testing before deployment.

## License

This project is currently intended for private/demo use. Add a project license before distributing it publicly.
