# 🚀 Quick Start Guide - Hiretail

Get your Hiretail marketplace running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Database

```bash
npm run prisma:push
npm run prisma:seed
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Open Browser

Navigate to: **http://localhost:3000**

## Step 5: Login as Admin

Use these credentials:

```
Email: admin@hiretail.com
Password: @Abc123456
```

---

## 🎯 What You Get

✅ **Home Page** - Marketplace homepage with categories and featured products  
✅ **Categories** - Browse products by category  
✅ **Product Pages** - Detailed product views  
✅ **Pricing Page** - 3 subscription tiers with Stripe integration  
✅ **Login/Signup** - Complete authentication system  
✅ **User Dashboard** - Subscription management and seller tools  
✅ **Admin Dashboard** - User management, analytics, and revenue tracking  
✅ **20 Languages** - Full internationalization support  

---

## 🧪 Test Stripe Checkout

1. Go to **Pricing** page
2. Click **Subscribe Now** on any plan
3. Login if not authenticated
4. Use test card: **4242 4242 4242 4242**
5. Any future date and any CVC
6. Complete checkout
7. Redirected to dashboard with active subscription

---

## 🎨 Key Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/categories` | Product categories | Public |
| `/products/[id]` | Product detail | Public |
| `/pricing` | Subscription plans | Public |
| `/login` | Login page | Public |
| `/signup` | Signup page | Public |
| `/dashboard` | User dashboard | Authenticated |
| `/admin` | Admin dashboard | Admin only |

---

## 🔧 Quick Commands

```bash
# Start dev server
npm run dev

# Reset database
rm prisma/dev.db
npm run prisma:push
npm run prisma:seed

# Build for production
npm run build

# Start production server
npm run start
```

---

## 🌍 Test Multi-Language

1. Click language dropdown in navbar
2. Select any of the 20 languages
3. Entire UI updates instantly

---

## 📱 Test Responsive Design

- Desktop: Full navigation with all features
- Tablet: Responsive grid layouts
- Mobile: Hamburger menu, optimized cards

---

## ✨ Next Steps

1. **Customize Theme**: Edit `tailwind.config.ts`
2. **Add Products**: Use admin dashboard
3. **Setup Webhooks**: For production Stripe integration
4. **Deploy**: Push to Vercel or your hosting platform
5. **Add Translations**: Translate `messages/*.json` files

---

## 💡 Tips

- Check **README.md** for detailed documentation
- All passwords are hashed with bcrypt
- Routes are protected with middleware
- Stripe keys are test mode (safe to use)
- Database is SQLite (easily switch to PostgreSQL)

---

## 🎉 You're Ready!

Your production-ready retail marketplace is now running. Explore the features and customize it to your needs!

For questions, check the main **README.md** file.
