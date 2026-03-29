import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { AdminLayout } from './components/admin/layout/layout';
import { AdminDashboard } from './components/admin/dashboard/dashboard';
import { UserDashboard } from './components/user/dashboard/dashboard';
import { SellerDashboard } from './components/seller/dashboard/dashboard';
import { UserRegister } from './components/user/register/register';
import { SellerRegister } from './components/seller/register/register';
import { Users } from './components/admin/users/users';
// import { Sellers } from './components/admin/sellers/sellers';
// import { Products } from './components/admin/products/products';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: '', component: AdminDashboard },
            { path: 'users', component: Users },
            // { path: 'sellers', component: Sellers },
            // { path: 'products', component: Products },
        ]
    },
    {
        path: 'users',
        children: [
            { path: 'dashboard', component: UserDashboard },
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
