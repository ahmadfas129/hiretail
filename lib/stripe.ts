export const stripe = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
};

export const plans = {
  basic: {
    name: 'Basic Seller',
    price: 19,
    priceId: 'price_basic',
  },
  pro: {
    name: 'Pro Seller',
    price: 49,
    priceId: 'price_pro',
  },
  enterprise: {
    name: 'Enterprise Seller',
    price: 99,
    priceId: 'price_enterprise',
  },
};
