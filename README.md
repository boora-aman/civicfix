# CivicFix: Community Issue Reporting Platform

CivicFix is a web application that enables citizens to report, track, and collaborate on local infrastructure issues in their communities. The platform connects residents with local authorities through a transparent system for reporting problems, tracking their status, and monitoring resolutions.

![CivicFix Demo](https://example.com/civicfix-demo.png)

## 🚀 Features

- **User Authentication**: Secure login/registration system with role-based access
- **Issue Reporting**: Easy-to-use interface for reporting community issues with images and location
- **Admin Approval System**: Moderation workflow for validating and prioritizing reported issues
- **Status Tracking**: Real-time updates on issue status (Pending, Approved, In Progress, Resolved)
- **Community Engagement**: Upvoting and commenting on issues
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices
- **Dashboard**: Personalized dashboards for users and administrators

## 💻 Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) (v14) - React framework for server-side rendering
  - [React](https://reactjs.org/) - UI component library
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Shadcn UI](https://ui.shadcn.com/) - Re-usable UI components
  - [Lucide Icons](https://lucide.dev/) - Icon library

- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless API endpoints
  - [Prisma](https://www.prisma.io/) - ORM for database access
  - [PostgreSQL](https://www.postgresql.org/) - Relational database
  - [NextAuth.js](https://next-auth.js.org/) - Authentication solution

- **Deployment**:
  - Can be deployed on [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or any platform supporting Next.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher) or [yarn](https://yarnpkg.com/) (v1.22 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

## 🔧 Installation

### Clone the repository

```bash
git clone https://github.com/boora-aman/civicfix.git
cd civicfix
```

### Install dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/civicfix"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key" # Generate a random string

# Optional - for email provider
EMAIL_SERVER_USER=username
EMAIL_SERVER_PASSWORD=password
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@example.com
```

### Database Setup

1. Create a PostgreSQL database

```bash
# PostgreSQL command line
createdb civicfix
```

2. Run Prisma migrations to set up your database schema

```bash
# Using npx
npx prisma migrate dev --name init

# Using yarn
yarn prisma migrate dev --name init
```

3. Seed the database with initial data (optional)

```bash
# Using npx
npx prisma db seed

# Using yarn
yarn prisma db seed
```

## 🚀 Running the Application

### Development Mode

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
# Using npm
npm run build
npm start

# Using yarn
yarn build
yarn start
```

## 🌐 Platform-Specific Setup

### Windows

- Install [PostgreSQL for Windows](https://www.postgresql.org/download/windows/)
- Ensure `pg_config` is in your PATH environment variable
- You might need to install [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) for certain npm packages

### macOS

- Install PostgreSQL using [Homebrew](https://brew.sh/):
  ```bash
  brew install postgresql
  brew services start postgresql
  ```
- Create the database:
  ```bash
  createdb civicfix
  ```

### Linux (Ubuntu/Debian)

- Install PostgreSQL:
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```
- Start and enable PostgreSQL:
  ```bash
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  ```
- Create a PostgreSQL user and database:
  ```bash
  sudo -u postgres createuser --interactive
  sudo -u postgres createdb civicfix
  ```

### Docker

You can also run the application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t civicfix .
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up
   ```

## 📱 Usage

### For Citizens

1. **Register/Login**: Create an account or log in
2. **Report Issue**: Submit a new issue with description, location, and images
3. **Track Progress**: Monitor the status of your reported issues
4. **Engage**: Upvote and comment on issues in your community

### For Administrators

1. **Review Issues**: View all pending issues reported by users
2. **Approve/Reject**: Validate issues and set priority levels
3. **Update Status**: Mark issues as in progress or resolved
4. **Manage Users**: View user activity and reports

## 👥 User Roles

- **Regular User**: Can report issues, track their submissions, and engage with community reports
- **Admin**: Full access to manage issues, set priorities, update statuses, and administer the platform

## 🔒 Admin Account Setup

To create an admin account:

1. Register a regular account through the application
2. Access the PostgreSQL database:
   ```bash
   psql -d civicfix
   ```
3. Update the user role to ADMIN:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

Alternatively, you can use the admin registration page at `/admin-register` which requires an invitation code.

## 🛠 API Endpoints

The application provides the following API endpoints:

- `GET /api/issues` - Get all approved issues (or all issues for admins)
- `POST /api/issues` - Create a new issue
- `GET /api/issues/:id` - Get a specific issue
- `GET /api/issues/featured` - Get featured issues for the homepage
- `GET /api/admin/issues` - Get all issues (admin only)
- `PATCH /api/admin/issues/:id` - Update issue status and priority (admin only)

## 💬 Feedback and Contributions

Feedback and contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- And all the other open-source projects that made this possible! 