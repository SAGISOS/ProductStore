import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './core/guards/admin.guard';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { UserResolver } from './core/resolvers/user.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { 
    path: 'admin', 
    component: AdminComponent,
    resolve: {
      user: UserResolver
    }
  },

  {
    path: 'status-users',
    loadComponent: () =>
      import('./pages/status-users/status-users.component').then(m => m.StatusUsersComponent),
    canActivate: [AdminGuard],
    resolve: {
      user: UserResolver
    }
  },
  {
    path: 'admin-page',
    loadComponent: () => import('./pages/admin-page/admin-page.component').then(m => m.AdminPageComponent),
    canActivate: [AdminGuard],
    resolve: {
      user: UserResolver
    }
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./pages/add-product/add-product.component').then(m => m.AddProductComponent),
    canActivate: [AdminGuard],
    resolve: {
      user: UserResolver
    }
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent),
    resolve: {
      user: UserResolver
    }
  },
  {
    path: 'profile-edit',
    loadComponent: () =>
      import('./pages/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
    resolve: {
      user: UserResolver
    }
  }
];
