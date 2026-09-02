# PULSE - Enterprise Business Management SaaS Platform

A comprehensive, modern SaaS platform for managing business operations including inventory, orders, invoices, customers, expenses, tasks, and AI-powered insights.

## Overview

PULSE is built with cutting-edge technologies to provide a scalable, secure, and intuitive platform for small to enterprise-level businesses to manage their operations efficiently.

### Key Features

- **Multi-Tenant Architecture** - Complete business isolation with per-business data segmentation
- **Inventory Management** - Real-time stock tracking with reorder levels
- **Order Management** - Full order lifecycle from creation to delivery
- **Financial Management** - Invoicing, expense tracking, and financial metrics
- **Customer Management** - Complete customer profiles and relationship tracking
- **Task Management** - Project and task management with priorities
- **Marketing Campaigns** - Campaign tracking and ROI analysis
- **AI-Powered Insights** - Actionable business intelligence
- **Real-Time Notifications** - Stay updated with system events
- **Analytics & Metrics** - Comprehensive business metrics and reporting

## Tech Stack

### Frontend & Framework
- **Next.js 14+** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM with type safety
- **PostgreSQL** - Robust relational database

### Authentication & Authorization
- **Better Auth** - Authentication framework
- **Prisma Adapter** - Database session management
- **Role-Based Access Control** - User role management

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Data Visualization
- **Recharts** - React charting library
- **date-fns** - Date manipulation utilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Project Structure

```
pulse/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── (app)/               # Protected app routes
│   │   └── dashboard/       # Dashboard pages
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── ui/                 # Base UI components
│   ├── dashboard/          # Dashboard components
│   ├── shared/             # Shared components
│   ├── customers/          # Customer-related components
│   ├── auth/               # Auth components
│   └── forms/              # Form components
├── lib/                     # Utility functions
│   ├── auth.ts             # Authentication setup
│   └── db.ts               # Database client
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
├── styles/                  # Global styles
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma data model
├── public/                  # Static assets
└── .github/                 # GitHub workflows

```

## Database Schema

### Core Entities
- **User** - Platform users
- **Business** - Business/workspace containers
- **BusinessUser** - User-to-business relationships with roles
- **Customer** - Business customers
- **Product** - Business products/services
- **Inventory** - Stock tracking
- **Order** - Customer orders
- **OrderItem** - Individual items in orders
- **Expense** - Business expenses
- **Invoice** - Customer invoices
- **Task** - Project tasks
- **Campaign** - Marketing campaigns
- **Notification** - System notifications
- **AIInsight** - AI-generated business insights
- **BusinessMetric** - KPI tracking

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pulse
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database
```bash
npm run prisma:migrate
```

5. Generate Prisma client
```bash
npm run prisma:generate
```

6. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:generate  # Generate Prisma client
```

## Architecture Overview

### Multi-Tenant Design
- Each business is isolated with a `businessId` foreign key
- Users can belong to multiple businesses with different roles
- All queries automatically scope to the current business context

### Authentication Flow
- OAuth and email/password support via Better Auth
- Session-based authentication
- Role-based access control (OWNER, ADMIN, MANAGER, MEMBER, VIEWER)

### API Structure
- RESTful API endpoints in `/app/api`
- Type-safe requests/responses
- Error handling and validation

## Development Guidelines

### Code Style
- Follow ESLint and Prettier rules
- Use TypeScript strict mode
- Components should be functional with hooks
- Prefer composition over inheritance

### Database Changes
- Use Prisma migrations for schema changes
- Always include proper indexes
- Maintain referential integrity

### Component Organization
- Keep components focused and single-responsibility
- Use composition for complex UIs
- Export types alongside components

## Environment Variables

See `.env.local` for all required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret
- `BETTER_AUTH_URL` - Auth base URL
- OAuth credentials (Google, GitHub)
- Feature flags

## Production Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npm run prisma:migrate`
4. Start the server: `npm start`

Recommended hosting platforms: Vercel, Railway, Heroku, or any Node.js hosting

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes and commit: `git commit -m "Add feature"`
3. Push to the branch: `git push origin feature/feature-name`
4. Create a Pull Request

## License

Proprietary - PULSE SaaS Platform

## Support

For issues or questions, please contact the development team.

---

**Version:** 0.1.0  
**Last Updated:** 2024-09-02  
**Status:** Foundation Phase Complete
