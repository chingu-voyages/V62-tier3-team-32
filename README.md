# RootSource

RootSource helps shoppers discover nearby farms and explore what they currently have available. Farmers can create a farm profile, share their growing practices and offerings, and manage orders through a dedicated dashboard.

## Overview

RootSource is a farm discovery and management application built with Next.js. Shoppers can browse farm profiles and filter farms by distance. Farmers and consumers can create accounts and manage their profiles; farmers can also maintain offerings, review orders, and track revenue.

## Features

- Browse listed farms and view their profiles, certifications, growing practices, and current offerings
- Search for nearby farms by ZIP code and filter results by distance
- Create consumer and farmer accounts with email and password
- Manage consumer profiles and view order history
- Manage farmer profiles, offerings, order statuses, and revenue summaries
- Set farm pickup and delivery options

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Better Auth

## Getting Started

### Dependencies

- Node.js
- npm
- PostgreSQL

### Prerequisites

Create a PostgreSQL database and have its connection URL available.

### Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env.local` file in the project root and set the database connection URL:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   ```

4. Apply the database migrations:

   ```bash
   npm run db:migrate
   ```

### Running the app locally

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Optional: Seed local development data

The seed script adds sample farms, users, offerings, and orders. It refuses to run against a non-local database. The project’s seed configuration uses Bun, so install Bun before running:

```bash
npm run db:seed
```

## Project Structure

```text
src/
├── app/         # Pages, layouts, and API routes
├── components/  # Shared UI and site components
├── features/    # Feature-specific views, panels, and components
└── lib/         # Shared authentication, database, and utility code
prisma/
├── migrations/  # Database migrations
├── schema.prisma
└── seed.ts      # Local development seed data
```

## Team

- Alex Thomas (Scrum Master): [GitHub](https://github.com/BagelTime) / [LinkedIn](https://linkedin.com/in/ajt11176)
- Vandna Kapoor (Developer): [GitHub](https://github.com/vandnakapoor19) / [LinkedIn](https://www.linkedin.com/in/vandnakapoor)
- Alex Njaiya (Developer): [GitHub](https://github.com/alex-njaiya) / [LinkedIn](https://www.linkedin.com/in/alex-njaiya)
- Alex Takamizawa (Developer): [GitHub](https://github.com/alexkt1022) / [LinkedIn](https://linkedin.com/in/atakamizawa)
- Hasan Sammour (Developer): [GitHub](https://github.com/HasanSammour) / [LinkedIn](https://www.linkedin.com/in/hasan-sammour-72657a3a1/)
- Bathshua Bradley (Shadow Scrum Master): [GitHub](https://github.com/Awsomgal) / [LinkedIn](https://linkedin.com/in/bathshuabradley/)
