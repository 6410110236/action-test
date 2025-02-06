src/
├── modules/
│   ├── auth/            # User authentication (login, signup)
│   │   ├── components/  # LoginForm, SignupForm
│   │   ├── pages/       # LoginPage, SignupPage
│   │   ├── services/    # authService.js (API calls)
│   │   ├── hooks/       # useAuth.js (custom hooks)
│   │   ├── index.js
│   │
│   ├── products/        # Product-related logic
│   │   ├── components/  # ProductCard, ProductList
│   │   ├── pages/       # ProductPage, ProductDetailPage
│   │   ├── services/    # productService.js (API calls)
│   │   ├── hooks/       # useProducts.js
│   │   ├── index.js
│   │
│   ├── cart/            # Shopping cart logic
│   │   ├── components/  # CartItem, CartSummary
│   │   ├── pages/       # CartPage
│   │   ├── services/    # cartService.js
│   │   ├── hooks/       # useCart.js
│   │   ├── index.js
│   │
│   ├── orders/          # Order processing
│   │   ├── components/  # OrderSummary, OrderHistory
│   │   ├── pages/       # OrderPage, OrderDetailPage
│   │   ├── services/    # orderService.js
│   │   ├── hooks/       # useOrders.js
│   │   ├── index.js
│
├── layouts/             # Page layouts
│   ├── MainLayout.js
│   ├── AuthLayout.js
│
├── store/               # Global state (Redux/Zustand)
│   ├── authSlice.js
│   ├── cartSlice.js
│   ├── productSlice.js
│
├── routes/              # Routing configuration
│   ├── AppRoutes.js
│
├── utils/               # Utility functions
│   ├── api.js
│   ├── constants.js
│
├── App.js
├── index.js