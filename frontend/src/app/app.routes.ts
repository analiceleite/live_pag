import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Auth Components
import { AuthAdminComponent } from './@common/auth/admin/auth-admin.component';
import { AuthUserComponent } from './@common/auth/user/auth-user.component';

// Admin Components
import { MenuComponent } from './@domain/admin/menu/menu.component';
import { ClientRegistrationComponent } from './@domain/admin/register/client-registration/client-registration.component';
import { ClothingRegistrationComponent } from './@domain/admin/register/clothing-registration/clothing-registration.component';
import { PurchaseRegistrationComponent } from './@domain/admin/register/purchase-registration/purchase-registration.component';
import { MiningRegisterComponent } from './@domain/admin/register/mining-registration/mining-registration.component';

import { PendenciesComponent } from './@domain/admin/management/pendencies/pendencies.component';
import { DeliveriesComponent } from './@domain/admin/management/deliveries/deliveries.component';

import { ClothingListComponent } from './@domain/admin/view/clothing-list/clothing-list.component';
import { ClientListComponent } from './@domain/admin/view/client-list/client-list.component';
import { MiningListComponent } from './@domain/admin/view/mining-list/mining-list.component';

// Customer Component
import { PendenciesUserComponent } from './@domain/customer/view/pendencies-user/pendencies-user.component';

// Common
import { NotFoundComponent } from './@common/components/not-found/not-found.component';

// Guards
import { AdminGuard } from './@services/guards/admin-guard';
import { FinancesComponent } from './@domain/admin/management/finances/finances.component';

export const routes: Routes = [
  // 👤 Public access - Auth routes
  { path: '', component: AuthUserComponent }, // User login
  { path: 'admin', component: AuthAdminComponent }, // Admin login

  // 🛠️ Admin-only routes (require AdminGuard)
  { path: 'menu', component: MenuComponent, canActivate: [AdminGuard] }, // Admin menu

  // 📋 Registration routes
  { path: 'cadastro-pecas', component: ClothingRegistrationComponent, canActivate: [AdminGuard] }, // Register clothing
  { path: 'cadastro-clientes', component: ClientRegistrationComponent, canActivate: [AdminGuard] }, // Register client
  { path: 'cadastro-compras', component: PurchaseRegistrationComponent, canActivate: [AdminGuard] }, // Register purchase
  { path: 'cadastro-garimpo', component: MiningRegisterComponent, canActivate: [AdminGuard] }, // Register mining

  // 📦 Management routes
  { path: 'pendencias', component: PendenciesComponent, canActivate: [AdminGuard] }, // Manage payment pendencies
  { path: 'entregas', component: DeliveriesComponent, canActivate: [AdminGuard] }, // Manage deliveries
  { path: 'financeiro', component: FinancesComponent, canActivate: [AdminGuard] }, // Manage finances

  // 📄 Listing routes
  { path: 'lista-pecas', component: ClothingListComponent, canActivate: [AdminGuard] }, // View clothing list
  { path: 'lista-clientes', component: ClientListComponent, canActivate: [AdminGuard] }, // View client list
  { path: 'lista-garimpos', component: MiningListComponent, canActivate: [AdminGuard] }, // View mining list

  // 🧾 Customer route
  { path: 'pendencias-cliente', component: PendenciesUserComponent }, // Customer sees own pendencies

  // 🔍 Fallback - 404 page
  { path: '**', component: NotFoundComponent } // Not found route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
