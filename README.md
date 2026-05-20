# MAISON — Vue 3 eCommerce App

A production-ready eCommerce application built with Vue 3, TypeScript, Pinia, Vue Router, and Tailwind CSS. Deploy-ready for Vercel.

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — Full type safety
- **Pinia** — State management (cart + orders)
- **Vue Router 4** — Client-side routing with dynamic routes
- **Tailwind CSS 3** — Utility-first styling
- **Vite** — Lightning-fast dev server & build tool
- **localStorage** — Cart and order persistence (no backend needed)

## Features

- 🛍️ **Product Grid** — Filterable by category, with hover quick-add
- 📄 **Product Pages** — `/product/:id` dynamic routing, image gallery, related products
- 🛒 **Cart** — Slide-out drawer + full cart page, quantity management, localStorage persistence
- 📦 **Orders** — Full order history with status tracking
- 💳 **Checkout** — Form validation, mock payment, success screen with order summary
- 📱 **Responsive** — Mobile-first, works on all screen sizes

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Vite — click **Deploy**

Done! Your shop is live at `your-project.vercel.app`

## Customizing Products

Edit `src/data/products.ts` to add your own items:

```typescript
{
  id: 9,
  name: 'Your Product',
  brand: 'YOUR BRAND',
  price: 100,
  description: 'Short description',
  longDescription: 'Full description...',
  image: 'https://your-image-url.com/photo.jpg',
  images: ['url1', 'url2'],
  category: 'Apparel',  // must match a category in the categories array
  tags: ['tag1', 'tag2'],
  rating: 4.5,
  reviews: 50,
  inStock: true,
}
```

## Project Structure

```
src/
├── components/
│   ├── CartDrawer.vue      # Slide-out cart drawer
│   └── ProductCard.vue     # Product grid card
├── data/
│   └── products.ts         # Mock product data
├── router/
│   └── index.ts            # Vue Router config
├── stores/
│   ├── cartStore.ts        # Pinia cart store
│   └── ordersStore.ts      # Pinia orders store
├── types/
│   └── index.ts            # TypeScript interfaces
├── views/
│   ├── HomeView.vue        # / — Product grid + hero
│   ├── ProductView.vue     # /product/:id — Product detail
│   ├── CartView.vue        # /cart — Full cart page
│   ├── CheckoutView.vue    # /checkout — Checkout form
│   ├── OrdersView.vue      # /orders — Order history
│   └── OrderSuccessView.vue # /order-success/:id — Order detail
├── App.vue                 # Root + nav + cart drawer
├── main.ts                 # Entry point
└── style.css               # Global styles + Tailwind
```
