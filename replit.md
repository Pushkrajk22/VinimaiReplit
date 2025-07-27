# Vinimai Exchange Platform

## Overview

Vinimai is a comprehensive e-commerce platform built with a modern full-stack architecture that facilitates safe and trusted exchanges between buyers and sellers across India. The platform operates on an offer-based marketplace model with commission-based revenue generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Styling**: CSS variables for theming with dark mode support
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful API with comprehensive error handling

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: Hot module replacement (HMR) via Vite
- **TypeScript**: Strict mode compilation with path mapping

## Key Components

### Authentication System
- Mobile number-based registration and login
- OTP verification system for mobile validation
- JWT token management with secure storage
- Role-based access control (buyer, seller, admin)
- Password hashing using bcrypt

### Product Management
- Product listing with categories (electronics, fashion, home_garden, sports, books)
- Image upload and management
- Product status workflow (pending, approved, rejected)
- Product modification requests system
- Search and filtering capabilities

### Offer System
- Negotiation-based marketplace model
- Offer status tracking (pending, accepted, rejected, countered)
- Commission calculation (3% from both buyer and seller)
- Real-time offer management

### Order Management
- Order lifecycle tracking (placed, confirmed, picked_up, out_for_delivery, delivered)
- Order tracking with status updates
- Return management system
- Notification system for order updates

### User Interface
- Responsive design with mobile-first approach
- Component-based architecture using shadcn/ui
- Accessibility-compliant UI components
- Toast notifications for user feedback
- Loading states and error handling

## Data Flow

### User Registration Flow
1. User provides mobile number, username, password, and role
2. System validates input and checks for existing users
3. Password is hashed using bcrypt
4. OTP is sent for mobile verification
5. Upon verification, user account is created
6. JWT token is generated and returned

### Product Listing Flow
1. Seller creates product with details and images
2. Product enters pending status for admin approval
3. Admin reviews and approves/rejects product
4. Approved products become visible to buyers
5. Buyers can search and filter products

### Offer and Purchase Flow
1. Buyer views product and makes an offer
2. Seller receives notification and can accept/reject/counter
3. Upon acceptance, order is created with commission calculation
4. Payment processing via Razorpay (supports UPI, cards, net banking, wallets)
5. Order tracking through delivery stages
6. Optional return process with automated refunds

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **@neondatabase/serverless**: Database connection driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **drizzle-kit**: Database migration and schema management

### UI and Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for components
- **lucide-react**: Icon library

### Authentication and Security
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing
- **zod**: Runtime type validation and schema validation

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tools
- **tsx**: TypeScript execution for development

### Payment Processing
- **razorpay**: Razorpay integration for Indian payment processing
- **crypto-js**: Cryptographic functions for payment verification

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server with middleware for API routes
- Automatic database migrations using Drizzle
- Environment variable configuration for database connections

### Production Build
- Frontend: Vite build output to `dist/public`
- Backend: esbuild bundle to `dist/index.js`
- Single deployment artifact with both frontend and backend
- Environment-based configuration for database and external services

### Database Management
- Schema-first approach with TypeScript types
- Migration system using Drizzle Kit
- Connection pooling for production scalability
- Environment variable-based database URL configuration

## Recent Changes

### Deployment Readiness Update (Current Session)
- **Fixed Peer Dependency Conflicts**: Downgraded Vite from 7.0.6 to 6.x for compatibility with existing dependencies
- **Removed @tailwindcss/vite Plugin**: Switched to PostCSS configuration for Tailwind CSS (more stable approach)
- **Resolved TypeScript Errors**: Fixed 24 TypeScript compilation errors across multiple files
- **Updated Authentication Headers**: Properly typed getAuthHeaders function and fixed header spreading issues
- **Fixed Async/Await Issues**: Added proper await keywords for response.json() calls
- **Verified Build Process**: Confirmed Vite build completes successfully with CSS generation
- **Tested API Endpoints**: Verified all endpoints return proper status codes
- **Database Connection**: Confirmed PostgreSQL database is accessible and ready

### Payment System Update (Previous Session)
- **Replaced Stripe with Razorpay**: Updated payment integration to use Razorpay, which is more suitable for Indian customers
- **Added Payment Routes**: Implemented `/api/payments/create-order`, `/api/payments/verify`, and `/api/payments/refund` endpoints
- **Created Payment Components**: Built RazorpayCheckout component with secure payment verification
- **Added Checkout Page**: Complete checkout flow with order summary and payment processing
- **Environment Setup**: Added RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables

## Deployment Options

### Replit Deployments (Recommended)
- **Custom Domain Support**: Yes, you can connect your own domain
- **Automatic HTTPS**: SSL certificates automatically provisioned
- **Global CDN**: Built-in content delivery network
- **Auto-scaling**: Handles traffic spikes automatically
- **Database Included**: PostgreSQL database is included
- **One-click Deploy**: Deploy directly from this Replit

### Alternative Platforms
- **Vercel**: Frontend deployment with serverless functions
- **Railway**: Full-stack deployment with PostgreSQL
- **DigitalOcean App Platform**: Managed hosting
- **Traditional VPS**: Complete control over server

The architecture supports horizontal scaling and can be easily deployed to various platforms including Replit, Vercel, or traditional VPS hosting.