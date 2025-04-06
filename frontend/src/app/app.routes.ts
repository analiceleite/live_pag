import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './common/auth/auth.component';
import { MenuComponent } from './domain/admin/menu/menu.component';
import { ClientRegistrationComponent } from './domain/admin/register/client-registration/client-registration.component';
import { ClothingRegistrationComponent } from './domain/admin/register/clothing-registration/clothing-registration.component';
import { PurchaseRegistrationComponent } from './domain/admin/register/purchase-registration/purchase-registration.component';

import { PendenciesComponent } from './domain/admin/view/pendencies/pendencies.component';

export const routes: Routes = [
  { path: '', component: AuthComponent} , 
  { path: 'menu', component: MenuComponent}, 
  { path: 'cadastro-pecas', component: ClothingRegistrationComponent}, 
  { path: 'cadastro-clientes', component: ClientRegistrationComponent}, 
  { path: 'cadastro-compras', component: PurchaseRegistrationComponent}, 
  { path: 'pendencias', component: PendenciesComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
