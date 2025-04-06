import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './common/auth/auth.component';
import { MenuComponent } from './domain/admin/menu/menu.component';
import { ClientRegistrationComponent } from './domain/admin/register/client-registration/client-registration.component';
import { ClothingRegistrationComponent } from './domain/admin/register/clothing-registration/clothing-registration.component';
import { PurchaseRegistrationComponent } from './domain/admin/register/purchase-registration/purchase-registration.component';

import { PendenciesComponent } from './domain/admin/view/pendencies/pendencies.component';
import { ClothingListComponent } from './domain/admin/view/clothing-list/clothing-list.component';
import { ClientListComponent } from './domain/admin/view/client-list/client-list.component';

export const routes: Routes = [
  { path: '', component: AuthComponent} , 
  { path: 'menu', component: MenuComponent}, 
  { path: 'cadastro-pecas', component: ClothingRegistrationComponent}, 
  { path: 'cadastro-clientes', component: ClientRegistrationComponent}, 
  { path: 'cadastro-compras', component: PurchaseRegistrationComponent}, 

  { path: 'pendencias', component: PendenciesComponent}, 
  { path: 'lista-pecas', component: ClothingListComponent},
  { path: 'lista-clientes', component: ClientListComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
