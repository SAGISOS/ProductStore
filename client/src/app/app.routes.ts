import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminGuard } from './core/guards/admin.guard';
import { AddProductComponent } from './pages/add-product/add-product.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'admin', component: AdminComponent },
  {
    path: 'status-users',
    loadComponent: () => import('./pages/status-users/status-users.component').then(m => m.StatusUsersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin-page',
    loadComponent: () => import('./pages/admin-page/admin-page.component').then(m => m.AdminPageComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./pages/add-product/add-product.component').then(m => m.AddProductComponent),
    canActivate: [AdminGuard]
  }
];
