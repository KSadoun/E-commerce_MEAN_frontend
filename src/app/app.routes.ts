import { Routes } from '@angular/router';

// Auth
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { VerifyEmail } from './components/verify-email/verify-email';

// Guards
import { AdminGuard } from './core/guards/admin.guard';
import { UserGuard } from './core/guards/user.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { SellerGuard } from './core/guards/seller.guard';

// Admin
import { AdminLayout } from './components/admin/layout/layout';
import { AdminDashboard } from './components/admin/dashboard/dashboard';
import { Users } from './components/admin/users/users';
import { Products } from './components/admin/products/product-list/products';
import { Categories } from './components/admin/categories/categories';
import { CategoryProducts } from './components/admin/categories/category-products/category-products';
import { Orders } from './components/admin/orders/orders';

// User
import { UserDashboard } from './components/user/dashboard/dashboard';
import { UserRegister } from './components/user/register/register';
import { Home } from './components/user/home/home';
import { Shop } from './components/user/shop/shop';
import { ProductDetailsPage } from './components/user/product-details/product-details';
import { CategoriesPage } from './components/user/categories/categories-page';
import { ContactPage } from './components/user/contact/contact-page';

// User — Cart, Checkout, Orders, Payments
import { Cart } from './components/user/cart/cart';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { PaymentResultComponent } from './components/user/payment-result/payment-result.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { OrderDetailComponent } from './components/user/order-detail/order-detail.component';

// Seller
import { SellerDashboard } from './components/seller/dashboard/dashboard';
import { SellerLayout } from './components/seller/layout/layout';
import { SellerInventory } from './components/seller/inventory/inventory';
import { SellerSales } from './components/seller/sales/sales';
import { SellerCustomers } from './components/seller/customers/customers';
import { SellerProfile } from './components/seller/profile/profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', component: Shop },
  { path: 'products/:id', component: ProductDetailsPage },

  { path: 'categories', component: CategoriesPage },
  { path: 'contact', component: ContactPage },

  // ===== Auth =====
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'verify-email', component: VerifyEmail },
  { path: 'users/register', component: UserRegister },
  { path: 'seller/register', redirectTo: 'users/register' },

  // ===== Cart, Checkout, Orders, Payments =====
  { path: 'cart', component: Cart, canActivate: [AuthGuard, UserGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard, UserGuard] },
  {
    path: 'payment/result',
    component: PaymentResultComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard, UserGuard] },

  // ===== Admin Routes =====
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard, AdminGuard],
    canActivateChild: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: Users },
      { path: 'products', component: Products },
      { path: 'orders', component: Orders },
      { path: 'categories', component: Categories },
      { path: 'categories/:categoryId/products', component: CategoryProducts },
    ],
  },

  // ===== User Routes =====
  {
    path: 'users',
    canActivate: [AuthGuard, UserGuard],
    canActivateChild: [AuthGuard, UserGuard],
    children: [
      { path: 'dashboard', component: UserDashboard },
      { path: 'register', component: UserRegister },
    ],
  },

  // ===== Seller Routes =====
  {
    path: 'seller',
    canActivate: [AuthGuard, SellerGuard],
    canActivateChild: [AuthGuard, SellerGuard],
    component: SellerLayout,
    children: [
      { path: '', component: SellerDashboard },
      { path: 'inventory', component: SellerInventory },
      { path: 'sales', component: SellerSales },
      { path: 'customers', component: SellerCustomers },
      { path: 'profile', component: SellerProfile },
    ],
  },

  // ===== Default & 404 =====
  { path: '**', redirectTo: '/' },
];
