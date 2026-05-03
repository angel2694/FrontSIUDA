import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Landing } from './pages/landing/landing';
import { Solicitudes } from './pages/solicitudes/solicitudes';
import { Inventario } from './pages/inventario/inventario';
import { Ordenes } from './pages/ordenes/ordenes';
import { Recepcion } from './pages/recepcion/recepcion';

export const routes: Routes = [
  // publica
  { path: 'landing', component: Landing },
  { path: 'login', component: Login },
  // protegida
  { path: 'app', component: MainLayout, canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'solicitudes', component: Solicitudes},
      {path: 'inventario', component: Inventario},
      {path: 'ordenes', component: Ordenes},
      {path: 'recepcion', component: Recepcion},
     ]
   },
   //default
  { path: '', redirectTo: 'landing', pathMatch: 'full' }
];
