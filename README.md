# CivicFix

A platform for citizens to report and track local issues in their communities.

## Features

- User authentication and role-based access control
- Issue reporting with categories, priorities, and status tracking
- Real-time updates and notifications
- Admin dashboard with analytics and issue management
- Responsive design for mobile and desktop

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- Shadcn UI
- Recharts

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Vercel account (for deployment)

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/civicfix.git
   cd civicfix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your values.

5. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Push your code to a GitHub repository.

2. Go to [Vercel](https://vercel.com) and create a new project.

3. Import your GitHub repository.

4. Configure the following environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your Vercel deployment URL
   - `NEXTAUTH_SECRET`: A secure random string
   - Email provider variables (if using email authentication)

5. Deploy your project.

## Database Setup

1. Create a PostgreSQL database.

2. Update the `DATABASE_URL` in your environment variables.

3. Run the database migrations:
   ```bash
   npx prisma db push
   ```

4. Seed the database with initial data:
   ```bash
   npm run prisma:seed
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
