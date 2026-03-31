import { Routes } from '@angular/router';

// Auth
import { Login } from './components/login/login';

// Admin
import { AdminLayout } from './components/admin/layout/layout';
import { AdminDashboard } from './components/admin/dashboard/dashboard';
import { Users } from './components/admin/users/users';

// User
import { UserDashboard } from './components/user/dashboard/dashboard';
import { UserRegister } from './components/user/register/register';

// Seller
import { SellerDashboard } from './components/seller/dashboard/dashboard';
import { SellerLayout } from './components/seller/layout/layout';
import { SellerInventory } from './components/seller/inventory/inventory';
import { SellerSales } from './components/seller/sales/sales';
import { SellerCustomers } from './components/seller/customers/customers';
import { SellerRegister } from './components/seller/register/register';

// Guards
import { AdminGuard } from './core/guards/admin.guard';
import { UserGuard } from './core/guards/user.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { SellerGuard } from './core/guards/seller.guard';

export const routes: Routes = [
  // ===== Auth =====
  { path: 'login', component: Login },
  { path: 'users/register', component: UserRegister },
  { path: 'seller/register', component: SellerRegister },

  // ===== Admin Routes =====
  {
    path: 'admin',
    component: AdminLayout,
    // TODO: re-enable guards after auth flow is finalized.
    // canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboard }, // /admin
      { path: 'users', component: Users }, // /admin/users
    ],
  },

  // ===== User Routes =====
  {
    path: 'users',
    // TODO: re-enable guards after auth flow is finalized.
    // canActivate: [AuthGuard, UserGuard],
    children: [{ path: '', component: UserDashboard }],
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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
