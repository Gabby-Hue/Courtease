# CourtEase Project Architecture

## Overview
CourtEase adalah aplikasi booking lapangan olahraga yang dibangun dengan Next.js 16, React 19, Supabase, dan shadcn/ui.

## Tech Stack
- **Framework**: Next.js 16 dengan App Router
- **UI Library**: React 19 dengan TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui dengan Radix UI
- **Payment**: Midtrans Integration
- **Maps**: Leaflet dengan react-leaflet
- **Authentication**: Supabase Auth

## Project Structure

```
courtease/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   │   ├── bookings/       # Booking related APIs
│   │   ├── courts/         # Court related APIs
│   │   ├── venues/         # Venue related APIs
│   │   ├── forum/          # Forum related APIs
│   │   ├── payments/       # Payment APIs
│   │   └── search/         # Search API
│   ├── explore/            # Explore page
│   ├── forum/              # Forum pages
│   ├── venues/             # Venue pages
│   └── ...                 # Other pages
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Authentication components
│   ├── bookings/           # Booking components
│   ├── forum/              # Forum components
│   ├── location/           # Location and map components
│   ├── search/             # Search components
│   └── ...                 # Other components
├── lib/                    # Utility libraries and configurations
│   ├── api/                # API utilities and types
│   │   ├── utils.ts        # API helper functions
│   │   ├── types.ts        # API type definitions
│   │   └── index.ts        # API exports
│   ├── supabase/           # Supabase configuration and queries
│   │   ├── client.ts       # Browser client configuration
│   │   ├── server.ts       # Server client configuration
│   │   ├── middleware.ts   # Auth middleware
│   │   ├── config.ts       # Supabase configuration
│   │   ├── utils.ts        # Supabase utilities
│   │   ├── queries/        # Database queries
│   │   │   ├── index.ts    # Query exports
│   │   │   ├── bookings.ts # Booking queries
│   │   │   ├── courts.ts   # Court queries
│   │   │   ├── forum.ts    # Forum queries
│   │   │   └── dashboard.ts # Dashboard queries
│   │   ├── profile.ts      # Profile management
│   │   ├── roles.ts        # Role management
│   │   ├── status.ts       # Status handling
│   │   └── index.ts        # Supabase exports
│   ├── payments/           # Payment integrations
│   │   └── midtrans.ts     # Midtrans payment gateway
│   ├── utils.ts            # General utilities
│   ├── geo.ts              # Geographic utilities
│   ├── strings.ts          # String utilities
│   └── index.ts            # Library exports
├── hooks/                  # Custom React hooks
│   ├── use-search.ts       # Search functionality hook
│   └── index.ts            # Hook exports
├── public/                 # Static assets
├── docs/                   # Documentation
└── types/                  # TypeScript type definitions
    └── supabase.ts         # Supabase generated types
```

## Key Features

### 1. Multi-Role System
- **User**: Regular users who can book courts
- **Venue Partner**: Partners who manage venues and courts
- **Admin**: System administrators with full access

### 2. Booking System
- Court booking with time slots
- Payment integration with Midtrans
- Booking status management (pending, confirmed, checked_in, completed, cancelled)
- Review and rating system

### 3. Forum System
- Thread creation and discussion
- Real-time updates with Supabase subscriptions
- Category organization
- Search and filtering

### 4. Location-based Features
- Interactive maps with Leaflet
- Geolocation-based court recommendations
- Distance calculations
- Venue location picker

### 5. Search Functionality
- Universal search across courts, venues, and forum
- Real-time search with debouncing
- Search result highlighting
- Popular court suggestions

## Database Schema

### Main Tables
- `profiles` - User profiles and roles
- `venues` - Venue information
- `courts` - Court details
- `bookings` - Booking records
- `forum_threads` - Forum threads
- `forum_replies` - Forum replies
- `court_reviews` - Court reviews and ratings
- `payments` - Payment records

### Views
- `court_summaries` - Aggregated court information
- `venue_bookings_summary` - Venue booking statistics

## API Design

### RESTful API Structure
- All API routes follow REST conventions
- Consistent error handling with proper HTTP status codes
- Request/response validation
- Type-safe API with TypeScript

### Error Handling
- Centralized error handling in `/lib/api/utils.ts`
- User-friendly error messages
- Proper logging for debugging
- Retry logic for network failures

## Authentication & Authorization

### Authentication Flow
- Supabase Auth for user management
- JWT tokens for session management
- Email verification and password reset
- Social login support (if configured)

### Authorization
- Role-based access control (RBAC)
- Middleware for route protection
- Server-side validation
- Secure API endpoints

## Performance Optimizations

### Database
- Optimized queries with proper indexing
- Database views for complex queries
- Connection pooling
- Query result caching

### Frontend
- Component code splitting
- Image optimization
- Lazy loading for heavy components
- Debounced search
- Optimistic updates

### Caching Strategy
- Static site generation where possible
- API response caching
- Browser caching for static assets
- CDN integration

## Security Considerations

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Authentication Security
- Secure password handling
- Session management
- Rate limiting
- Audit logging

## Development Workflow

### Code Organization
- Modular architecture with clear separation of concerns
- Consistent naming conventions
- Type safety throughout the application
- Comprehensive error handling

### Best Practices
- Custom hooks for reusable logic
- Component composition over inheritance
- Server components for data fetching
- Client components for interactivity

## Deployment

### Environment Variables
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- Midtrans configuration variables

### Production Considerations
- Environment-specific configurations
- Database migrations
- Performance monitoring
- Error tracking
- Security headers

## Future Enhancements

### Planned Features
- Mobile app development
- Advanced analytics dashboard
- Push notifications
- Advanced filtering and search
- Integration with calendar applications
- Multi-language support

### Technical Improvements
- GraphQL API implementation
- Microservices architecture
- Advanced caching strategies
- Real-time collaboration features
- AI-powered recommendations