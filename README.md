This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Next.js Prisma Pesan Hotel App

---

## 1. Project Overview

A modern Pesan Hotel web application built with Next.js, Prisma ORM, and PostgreSQL.  
It provides a seamless experience for users to search, book, and manage hotel reservations, while admins can manage hotels, rooms, bookings, and payments.

**Key Features:**

- User authentication (email/password, OAuth)
- Hotel and room management
- Booking and payment workflows
- Admin dashboard
- Responsive UI/UX
- API integrations (Stripe, Midtrans, Google Sheets)
- Cron jobs for automated tasks

---

## 2. Tech Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Next.js         | Frontend & backend (App Router) |
| Prisma ORM      | Database access layer           |
| PostgreSQL      | Relational database             |
| Tailwind CSS    | Styling                         |
| Stripe/Midtrans | Payment gateway integration     |
| Lucide React    | Icon library                    |
| Zod             | Input validation                |
| Sonner          | Toast notifications             |
| Radix UI        | UI primitives                   |
| Docker          | Containerization                |
| Vercel          | Deployment                      |

---

## 3. System Architecture

The system follows a modular and layered architecture, ensuring clear separation of concerns between frontend, backend API routes, and the database.

- Next.js App Router handles both frontend pages and backend API routes.

- Prisma ORM acts as the database access layer, ensuring type-safe queries.

- PostgreSQL stores relational data such as users, hotels, rooms, bookings, and payments.

- Third-party services (Stripe, Midtrans, Google Sheets) are integrated for payments and reporting.

- Authentication layer is handled via BetterAuth/OAuth, with role-based access control (admin vs. user).

## 4. Installation & Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Git

### Steps

```bash
# Clone the repository
git clone https://github.com/fiqrioemry/nextjs-prisma-hotel-booking-app.git
cd nextjs-prisma-hotel-booking-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Run locally
npm run dev
```

### Environment Variables Example

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/hotel-booking?schema=public
NEXT_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=your-stripe-secret
EMAIL_FROM=support@hotelbooking.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email
SMTP_PASS=your-app-password
```

---

## 5. Database Schema

### Key Prisma Models

| Model        | Description                  |
| ------------ | ---------------------------- |
| User         | App users (admin, customer)  |
| Profile      | User profile details         |
| Hotel        | Hotel entity                 |
| Room         | Individual hotel rooms       |
| RoomType     | Room category/type           |
| Booking      | Hotel room bookings          |
| Payment      | Payment records for bookings |
| Session      | Auth sessions                |
| Account      | OAuth accounts               |
| Verification | Email verification tokens    |

**Example: Hotel Model**

```prisma
model Hotel {
	id          String   @id @default(cuid())
	name        String
	location    String
	description String
	thumbnail   String
	address     String
	rooms       Room[]
}
```

### Migration Strategy

- Use Prisma Migrate for schema changes:
  ```bash
  npx prisma migrate dev --name <migration-name>
  ```
- For production:
  ```bash
  npx prisma migrate deploy
  ```

---

## 6. Features & Modules

### Authentication & Authorization

- Email/password and OAuth (Google, GitHub)
- Role-based access (admin, user)
- Session management

### API Routes

- Built with Next.js App Router (`/app/api/*`)
- RESTful endpoints for bookings, payments, hotels, users, etc.

### Database Operations

- CRUD via Prisma Client
- Transactional operations for payments/bookings

### UI/UX Components

- Modular React components in `/components`
- Radix UI primitives for dialogs, dropdowns, etc.
- Responsive layouts for admin/user

---

## 7. Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes

### Running in Development

```bash
npm run dev
```

### Running in Production

```bash
npm run build
npm start
```

### Testing Strategy

- Unit tests (recommended: Jest, React Testing Library)
- Integration tests for API routes and database

---

## 8. Deployment Guide

### Vercel

- Push to `main` branch triggers Vercel deployment
- Configure environment variables in Vercel dashboard

### Docker

- Build and run with Docker:
  ```bash
  docker build -t hotel-booking-app .
  docker run -p 3000:3000 --env-file .env hotel-booking-app
  ```

### Database Hosting

- Compatible with Supabase, Neon, AWS RDS, Railway, etc.
- Update `DATABASE_URL` in `.env` accordingly

---

## 9. Security & Best Practices

- **Secrets Management:** Never commit `.env` with real secrets; use `.env.example`
- **Database Migrations:** Always run migrations in production with backups
- **Input Validation:** Use Zod for validating API inputs
- **Error Handling:** Centralized error responses in API routes
- **Access Control:** Protect admin routes and sensitive endpoints

---

## 10. Future Improvements

- Add unit/integration test coverage
- Implement advanced search/filter for hotels
- Add user reviews and ratings
- Improve accessibility (a11y)
- Optimize performance (SSR, caching)
- Add multi-language support

---

## 11. License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

---

**For questions or contributions, please open an issue or pull request on GitHub.**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
