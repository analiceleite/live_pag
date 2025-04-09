import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminComponent } from './@common/auth/admin/auth-admin.component';
import { AuthUserComponent } from './@common/auth/user/auth-user.component';
import { MenuComponent } from './@domain/admin/menu/menu.component';
import { ClientRegistrationComponent } from './@domain/admin/register/client-registration/client-registration.component';
import { ClothingRegistrationComponent } from './@domain/admin/register/clothing-registration/clothing-registration.component';
import { PurchaseRegistrationComponent } from './@domain/admin/register/purchase-registration/purchase-registration.component';

import { PendenciesComponent } from './@domain/admin/view/pendencies/pendencies.component';
import { ClothingListComponent } from './@domain/admin/view/clothing-list/clothing-list.component';
import { ClientListComponent } from './@domain/admin/view/client-list/client-list.component';
import { PendenciesUserComponent } from './@domain/customer/view/pendencies-user/pendencies-user.component';
import { NotFoundComponent } from './@common/components/not-found/not-found.component';

import { AdminGuard } from './@services/guards/admin-guard';

export const routes: Routes = [
  { path: '', component: AuthUserComponent },
  { path: 'admin', component: AuthAdminComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AdminGuard] },
  { path: 'cadastro-pecas', component: ClothingRegistrationComponent, canActivate: [AdminGuard] },
  { path: 'cadastro-clientes', component: ClientRegistrationComponent, canActivate: [AdminGuard] },
  { path: 'cadastro-compras', component: PurchaseRegistrationComponent, canActivate: [AdminGuard] },
  { path: 'pendencias', component: PendenciesComponent, canActivate: [AdminGuard] },
  { path: 'lista-pecas', component: ClothingListComponent, canActivate: [AdminGuard] },
  { path: 'lista-clientes', component: ClientListComponent, canActivate: [AdminGuard] },

  { path: 'pendencias-cliente', component: PendenciesUserComponent },

  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
