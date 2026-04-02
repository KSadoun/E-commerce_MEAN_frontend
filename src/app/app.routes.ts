import { Routes } from '@angular/router';

// Auth
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

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

// User
import { UserDashboard } from './components/user/dashboard/dashboard';
import { UserRegister } from './components/user/register/register';
import { Home } from './components/user/home/home';
import { Shop } from './components/user/shop/shop';
import { CategoriesPage } from './components/user/categories/categories-page';
import { ContactPage } from './components/user/contact/contact-page';

// Seller
import { SellerDashboard } from './components/seller/dashboard/dashboard';
import { SellerLayout } from './components/seller/layout/layout';
import { SellerInventory } from './components/seller/inventory/inventory';
import { SellerSales } from './components/seller/sales/sales';
import { SellerCustomers } from './components/seller/customers/customers';
import { SellerRegister } from './components/seller/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop', component: Shop },

  { path: 'categories', component: CategoriesPage },
  { path: 'contact', component: ContactPage },

  // ===== Auth =====
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'users/register', component: UserRegister },
  { path: 'seller/register', component: SellerRegister },

  // ===== Admin Routes =====

  {
    path: 'admin',
    component: AdminLayout,
    // TODO: re-enable guards after auth flow is finalized.
    // canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: Users },
      { path: 'products', component: Products },
      { path: 'categories', component: Categories },
      { path: 'categories/:categoryId/products', component: CategoryProducts },
    ],
  },

  // ===== User Routes =====
  {
    path: 'users',
    // TODO: re-enable guards after auth flow is finalized.
    // canActivate: [AuthGuard, UserGuard],
    children: [
      { path: 'dashboard', component: UserDashboard },
      { path: 'register', component: UserRegister },
    ],
  },

  // ===== Seller Routes =====
  {
    path: 'seller',
    // TODO: re-enable guards after auth flow is finalized.
    // canActivate: [AuthGuard, SellerGuard],
    component: SellerLayout,
    children: [
      { path: '', component: SellerDashboard },
      { path: 'inventory', component: SellerInventory },
      { path: 'sales', component: SellerSales },
      { path: 'customers', component: SellerCustomers },
    ],
  },

  // ===== Default & 404 =====
  { path: '**', redirectTo: '/' },
];
