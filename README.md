# Hiretail - Retail Marketplace Platform

A complete production-ready retail marketplace built with Next.js 14, TypeScript, Prisma, and Stripe.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Authentication**: NextAuth with credentials provider and role-based access (USER/ADMIN)
- **Payment Integration**: Stripe Checkout for subscription management
- **Multi-language Support**: 20 languages with next-intl
- **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL/MySQL)
- **Responsive Design**: Mobile-first approach with clean retail UI
- **Admin Dashboard**: Complete user and subscription management
- **Protected Routes**: Middleware-based route protection

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## 🛠️ Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

The `.env.local` file is already configured with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
```

**Important**: In production, change the `NEXTAUTH_SECRET` to a secure random string.

### 3. Setup Database

```bash
# Generate Prisma client
npm run postinstall

# Push schema to database
npm run prisma:push

# Seed database with admin user and sample products
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 Default Admin Credentials

```
Email: admin@hiretail.com
Password: @Abc123456
```

## 📁 Project Structure

```
hiretail/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── signup/
│   │   ├── checkout/
│   │   └── webhooks/
│   ├── [locale]/
│   │   ├── page.tsx              # Home page
│   │   ├── categories/           # Product categories
│   │   ├── products/[id]/        # Product detail
│   │   ├── pricing/              # Subscription plans
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── dashboard/            # User dashboard
│   │   └── admin/                # Admin dashboard
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ContentLayout.tsx
├── lib/
│   ├── prisma.ts
│   └── stripe.ts
├── messages/                     # Translation files
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   └── ... (17 more languages)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── i18n/
│   └── routing.ts
├── middleware.ts
├── i18n.ts
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 🌍 Supported Languages

The platform supports 20 languages:
- English (Default)
- Spanish
- French
- German
- Portuguese
- Italian
- Dutch
- Arabic
- Chinese
- Japanese
- Korean
- Hindi
- Turkish
- Russian
- Swedish
- Polish
- Indonesian
- Thai
- Vietnamese
- Urdu

## 💳 Stripe Integration

### Test Mode

The application is configured with Stripe test keys. Use test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiry date and any CVC

### Subscription Plans

1. **Basic Seller** - $19/month
2. **Pro Seller** - $49/month
3. **Enterprise Seller** - $99/month

### Setting Up Webhooks (Optional for Development)

For production, set up Stripe webhooks:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Add webhook secret to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## 🔐 Authentication & Authorization

### User Roles

- **USER**: Default role for new signups
  - Access to dashboard
  - Can create subscriptions
  - Manage own profile

- **ADMIN**: Administrator role
  - All USER permissions
  - Access to admin dashboard
  - View all users and subscriptions
  - Platform analytics

### Route Protection

Routes are protected using Next.js middleware:
- `/dashboard/*` - Requires authentication
- `/admin/*` - Requires ADMIN role

## 📊 Database Schema

### User
- id, name, email, password (hashed)
- role (USER | ADMIN)
- timestamps

### Subscription
- id, userId, plan, stripeSessionId
- status (ACTIVE | CANCELLED | EXPIRED)
- timestamps

### Product
- id, name, description, price
- image, category
- timestamps

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-live-stripe-publishable-key"
STRIPE_SECRET_KEY="your-live-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
```

### Database Migration

For production, switch to PostgreSQL:

1. Update `DATABASE_URL` in `.env`
2. Change provider in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:push  # Push schema to database
npm run prisma:seed  # Seed database
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: "#F96302",    // Orange
  secondary: "#FFFFFF",  // White
  accent: "#2D2D2D",     // Dark gray
}
```

### Adding New Languages

1. Add locale code to `i18n/routing.ts`
2. Create translation file in `messages/[locale].json`
3. Add language to Navbar dropdown in `components/Navbar.tsx`

## 📝 API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/auth/signout` - Logout (NextAuth)

### Checkout
- `POST /api/checkout` - Create Stripe checkout session

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npm run prisma:push
npm run prisma:seed
```

### Module Not Found
```bash
# Clear Next.js cache
rm -rf .next
npm install
npm run dev
```

### Prisma Client Issues
```bash
npx prisma generate
```

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app)

## 🔗 Resources

- **Design Inspiration**: Clean retail marketplace layout
- **Icons**: lucide-react
- **Styling**: TailwindCSS

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For issues and questions:
- Check the documentation
- Review existing GitHub issues
- Create a new issue with detailed information

---

Built with ❤️ using Next.js 14, TypeScript, Prisma, and Stripe
