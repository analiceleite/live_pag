import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthAdminComponent } from './@common/auth/admin/auth-admin.component';
import { AuthUserComponent } from './@common/auth/user/auth-user.component';

import { MenuComponent } from './@domain/admin/menu/menu.component';
import { ClientRegistrationComponent } from './@domain/admin/register/client-registration/client-registration.component';
import { ClothingRegistrationComponent } from './@domain/admin/register/clothing-registration/clothing-registration.component';
import { MiningRegisterComponent } from './@domain/admin/register/mining-registration/mining-registration.component';
import { PixKeysComponent } from './@domain/admin/management/pix-keys/pix-keys.component';

import { PendenciesComponent } from './@domain/admin/management/pendencies/pendencies.component';

import { ClothingListComponent } from './@domain/admin/view/clothing-list/clothing-list.component';
import { ClientListComponent } from './@domain/admin/view/client-list/client-list.component';
import { MiningListComponent } from './@domain/admin/view/mining-list/mining-list.component';

import { PendenciesUserComponent } from './@domain/customer/view/pendencies-user/pendencies-user.component';

import { NotFoundComponent } from './@common/components/not-found/not-found.component';

import { AdminGuard } from './@services/guards/admin-guard';
import { FinancesComponent } from './@domain/admin/management/finances/finances.component';

export const routes: Routes = [
  { path: '', component: AuthUserComponent },
  { path: 'admin', component: AuthAdminComponent }, 

  { path: 'menu', component: MenuComponent, canActivate: [AdminGuard] }, 
  { path: 'chaves-pix', component: PixKeysComponent, canActivate: [AdminGuard] }, 

  { path: 'cadastro-pecas', component: ClothingRegistrationComponent, canActivate: [AdminGuard] }, 
  { path: 'cadastro-clientes', component: ClientRegistrationComponent, canActivate: [AdminGuard] }, 
  { path: 'cadastro-garimpo', component: MiningRegisterComponent, canActivate: [AdminGuard] },

  { path: 'pendencias', component: PendenciesComponent, canActivate: [AdminGuard] },
  { path: 'financeiro', component: FinancesComponent, canActivate: [AdminGuard] }, 

  { path: 'lista-pecas', component: ClothingListComponent, canActivate: [AdminGuard] }, 
  { path: 'lista-clientes', component: ClientListComponent, canActivate: [AdminGuard] }, 
  { path: 'lista-garimpos', component: MiningListComponent, canActivate: [AdminGuard] }, 

  { path: 'pendencias-cliente', component: PendenciesUserComponent },
  { path: '**', component: NotFoundComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
