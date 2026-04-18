# Kids Creative Shop

A full Next.js shop for a kid creator.

## Features
- public home page
- product pages
- add to cart
- checkout with address, mobile, email
- offline payment flow
- admin login
- admin product upload with Cloudinary
- admin visibility control
- admin orders dashboard
- PostgreSQL on Neon
- no Prisma

## 1. Extract and install
```bash
npm install
```

## 2. Create env file
Copy `.env.example` to `.env.local` and fill all values.

## 3. Initialize database
```bash
npm run db:init
```

## 4. Start development server
```bash
npm run dev
```

## Admin login
Open:
`/admin/login`

Use the values from:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Notes
- Orders are stored in PostgreSQL.
- Payment is not collected online.
- Product images are uploaded to Cloudinary from the admin page.
- Products can be shown or hidden from the admin page.
