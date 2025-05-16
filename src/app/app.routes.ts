import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductDeleteComponent } from './components/product-delete/product-delete.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { appCanActivate } from './guards/app.auth.guard';
import { AppRoles } from './app.roles';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.User] }
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] }
  },

  {
    path: 'product/create',
    component: ProductCreateComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] }
  },
  {
    path: 'product/delete/:id',
    component: ProductDeleteComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] }
  },

  { path: '**', component: NotFoundComponent }
];
