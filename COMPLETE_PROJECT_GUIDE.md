# Vinimai Exchange Platform - Complete Project Guide

## Quick Setup Instructions

### 1. Create New Project Folder
```bash
mkdir vinimai-platform
cd vinimai-platform
```

### 2. Initialize Package.json
```bash
npm init -y
```

### 3. Install Dependencies
```bash
# Core dependencies
npm install @hookform/resolvers @neondatabase/serverless @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @tanstack/react-query

# Build tools
npm install @types/bcrypt @types/crypto-js @types/jsonwebtoken @vitejs/plugin-react @types/node @types/react @types/react-dom

# Core libraries
npm install bcrypt class-variance-authority clsx cmdk crypto-js date-fns drizzle-orm drizzle-kit express jsonwebtoken lucide-react react react-dom react-hook-form recharts tailwindcss tailwindcss-animate typescript vite wouter zod

# Development dependencies
npm install -D @types/express tsx esbuild
```

## Project Structure
```
vinimai-platform/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── lib/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── seed-data.ts
├── shared/
│   └── schema.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── drizzle.config.ts
```

## Environment Variables Required
```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Run Commands
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run db:push # Push database schema
```

## Key Features Implemented
- User authentication with JWT
- Product listing and management
- Offer-based negotiation system
- Order tracking and management
- Razorpay payment integration
- Admin panel with approval workflow
- Mobile-responsive design
- Revenue calculation (3% from buyer + 3% from seller)

## Database Schema
- Users (buyers, sellers, admins)
- Products (with categories and images)
- Offers (negotiation system)
- Orders (with fee calculations)
- Returns (refund management)
- Notifications (user alerts)

## Technology Stack
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Drizzle ORM
- Payment: Razorpay integration
- Build: Vite + esbuild

This is a complete e-commerce marketplace platform ready for deployment and customization.