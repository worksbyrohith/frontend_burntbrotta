import { Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RestaurantListComponent } from './components/restaurant/restaurant-list/restaurant-list.component';
import { MenuPageComponent } from './components/menu/menu-page/menu-page.component';
import { CartPageComponent } from './components/cart/cart-page/cart-page.component';
import { OrderConfirmationComponent } from './components/order/order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './components/order/order-history/order-history.component';
import { OrderDetailComponent } from './components/order/order-detail/order-detail.component';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminRestaurantsComponent } from './components/admin/admin-restaurants/admin-restaurants.component';
import { AdminMenuComponent } from './components/admin/admin-menu/admin-menu.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Customer Routes (protected by AuthGuard)
  { path: 'restaurants', component: RestaurantListComponent, canActivate: [authGuard] },
  { path: 'restaurants/:id/menu', component: MenuPageComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard] },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [authGuard] },

  // Admin Routes (protected by AdminGuard)
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/restaurants', component: AdminRestaurantsComponent, canActivate: [adminGuard] },
  { path: 'admin/menu/:restaurantId', component: AdminMenuComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
  
  // Fallback
  { path: '**', redirectTo: 'restaurants' }
];
