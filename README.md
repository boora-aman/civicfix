# CivicFix: Community Issue Reporting Platform

CivicFix is a modern web application that empowers citizens to report, track, and collaborate on local infrastructure issues. The platform connects residents with local authorities through a transparent system for reporting problems, tracking their status, and monitoring resolutions.

## 📸 Screenshots

<!-- Add your screenshots here -->
- Homepage
- Issue Reporting Form
- Issues List
- Issue Details
- User Dashboard
- Admin Dashboard
- Admin Analytics

## 🚀 Features

- **User Authentication**: Secure login/registration system with role-based access
- **Issue Reporting**: Intuitive interface for reporting community issues with images and location
- **Issue Categories**: Multiple issue types including "Damaged Playground Equipment", "Potholes", "Broken Street Lights", and more
- **Admin Dashboard**: Real-time statistics and issue management for administrators
- **Status Tracking**: Real-time updates on issue status (Pending, Approved, In Progress, Resolved)
- **Community Engagement**: Upvoting and commenting on issues
- **Interactive Analytics**: Data visualization for administrators to identify trends and priorities
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices

## 💻 Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) (v14) - React framework with App Router
  - [React](https://reactjs.org/) - UI component library
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Shadcn UI](https://ui.shadcn.com/) - Re-usable UI components
  - [Recharts](https://recharts.org/) - Responsive charting library
  - [Lucide Icons](https://lucide.dev/) - Icon library

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless API endpoints
  - [Prisma](https://www.prisma.io/) - ORM for database access
  - [PostgreSQL](https://www.postgresql.org/) - Relational database
  - [NextAuth.js](https://next-auth.js.org/) - Authentication solution

## 📋 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/civicfix.git
cd civicfix
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/civicfix"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key" # Generate a random string
```

4. **Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database with test data
npm run prisma:seed
```

5. **Start the development server**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 👥 User Accounts

After running the seed script, the following test accounts are available:

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Regular User Accounts
- Email: `user1@example.com` through `user3@example.com`
- Password: `user123`

## 📱 Features Walkthrough

### For Citizens

1. **Report an Issue**
   - Navigate to "Report an Issue" from the homepage or dashboard
   - Fill in details including title, description, category, priority, and location
   - Upload images of the issue (optional)
   - Submit the form to create a new issue

2. **Browse Issues**
   - View all reported issues on the Issues page
   - Filter by category or status
   - Sort by newest, oldest, or most upvoted
   - Use pagination to navigate through multiple pages of issues

3. **Issue Details**
   - Click on any issue to view detailed information
   - See status updates, comments, and location information
   - Upvote issues to show support
   - Add comments to provide additional information

4. **User Dashboard**
   - Track all issues you've reported
   - Monitor status changes and updates
   - View pending issues that need attention

### For Administrators

1. **Admin Dashboard**
   - View real-time statistics including total issues, pending, in progress, and resolved counts
   - See priority distribution in an interactive pie chart
   - Access quick actions for common administrative tasks

2. **Issue Management**
   - Review and approve/reject pending issues
   - Update status and priority of issues
   - Add administrative comments visible to users

3. **Analytics**
   - Visualize data with interactive charts
   - Track category distribution, priority vs votes, and monthly trends
   - Identify patterns to inform resource allocation

## 🛠️ API Endpoints

### Public Endpoints
- `GET /api/issues` - List all issues with pagination
- `GET /api/issues/:id` - Get a specific issue with details
- `POST /api/issues` - Create a new issue
- `POST /api/issues/:id/upvote` - Upvote an issue
- `POST /api/issues/:id/comments` - Add a comment to an issue

### Admin Endpoints
- `GET /api/admin/overview` - Get dashboard statistics
- `GET /api/admin/stats` - Get detailed analytics data
- `PATCH /api/admin/issues/:id` - Update issue status and priority

## 📊 Database Schema

The application uses the following main models:

- **User**: User accounts with authentication info and role
- **Issue**: Community issues with all details and status
- **Comment**: User comments on issues
- **Upvote**: User upvotes on issues

## 🧪 Testing

The current version focuses on development. Future versions will include:
- Unit tests with Jest
- Integration tests for API endpoints
- End-to-end tests with Cypress

## 🚀 Deployment

### Deploying to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/civicfix.git
   git push -u origin main
   ```

2. **Set up a PostgreSQL database**
   
   **Option 1: Vercel Postgres (Recommended)**
   - Go to [Vercel](https://vercel.com/) and create an account if you don't have one
   - Create a new project and connect your GitHub repository
   - In the project settings, go to "Storage" and select "Connect Store"
   - Choose "Vercel Postgres" and follow the setup wizard
   - Vercel will automatically add the `POSTGRES_URL` environment variable to your project

   **Option 2: Railway**
   - Go to [Railway](https://railway.app/) and create an account
   - Create a new project and select "Provision PostgreSQL"
   - Once created, go to "Connect" and copy the connection URL
   - In Vercel, add this URL as the `DATABASE_URL` environment variable

   **Option 3: Supabase**
   - Go to [Supabase](https://supabase.com/) and create an account
   - Create a new project
   - Go to "Settings" > "Database" and copy the connection string
   - In Vercel, add this URL as the `DATABASE_URL` environment variable

   **Option 4: Neon**
   - Go to [Neon](https://neon.tech/) and create an account
   - Create a new project
   - Copy the connection string from the dashboard
   - In Vercel, add this URL as the `DATABASE_URL` environment variable

3. **Configure environment variables in Vercel**
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://civicfix.vercel.app`)
     - `NEXTAUTH_SECRET`: A random string for session encryption (generate with `openssl rand -base64 32`)

4. **Deploy your application**
   - Vercel will automatically deploy your application when you push to your GitHub repository
   - You can also manually deploy from the Vercel dashboard

5. **Run database migrations**
   - After deployment, you need to run your Prisma migrations
   - You can do this by adding a build command in your `package.json`:
     ```json
     "scripts": {
       "vercel-build": "prisma generate && prisma migrate deploy && next build"
     }
     ```
   - Or by running the migrations manually:
     ```bash
     npx prisma migrate deploy
     ```

6. **Seed the database (optional)**
   - If you want to seed the database with test data, you can run:
     ```bash
     npx prisma db seed
     ```
   - Or add it to your build command:
     ```json
     "scripts": {
       "vercel-build": "prisma generate && prisma migrate deploy && prisma db seed && next build"
     }
     ```

### Troubleshooting Deployment

- **Database Connection Issues**: Ensure your database connection string is correct and the database is accessible from Vercel's servers
- **Authentication Problems**: Make sure `NEXTAUTH_URL` is set to your production URL
- **Migration Errors**: Check that your Prisma schema is compatible with your database provider

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/) 
