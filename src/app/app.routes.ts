import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { AdminLayout } from './components/admin/layout/layout';
import { AdminDashboard } from './components/admin/dashboard/dashboard';
import { UserDashboard } from './components/user/dashboard/dashboard';
import { SellerDashboard } from './components/seller/dashboard/dashboard';
import { UserRegister } from './components/user/register/register';
import { SellerRegister } from './components/seller/register/register';
import { Users } from './components/admin/users/users';
import { AdminGuard } from './guards/admin.guard';
import { Products } from './components/admin/products/product-list/products';
import { Categories } from './components/admin/categories/categories';
import { CategoryProducts } from './components/admin/categories/category-products/category-products';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [AdminGuard],
        children: [
            { path: '', component: AdminDashboard },
            { path: 'users', component: Users },
            { path: 'products', component: Products },
            { path: 'categories', component: Categories },
            { path: 'categories/:categoryId/products', component: CategoryProducts },
        ]
    },
    {
        path: 'users',
        children: [
            { path: '', component: UserDashboard },
            { path: 'register', component: UserRegister },
        ]
    },
    {
        path: 'seller',
        children: [
            { path: '', component: SellerDashboard },
            { path: 'register', component: SellerRegister },
        ]
    },
];
