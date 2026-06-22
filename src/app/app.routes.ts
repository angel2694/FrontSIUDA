import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth/auth-guard';
import { roleGuard } from './core/guards/role/role-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Landing } from './pages/landing/landing';
import { Solicitudes } from './pages/solicitudes/solicitudes';
import { Inventario } from './pages/inventario/inventario';
import { Ordenes } from './pages/ordenes/ordenes';
import { Recepcion } from './pages/recepcion/recepcion';
import { Usuarios } from './pages/usuarios/usuarios';
import { Register } from './pages/register/register';
import { Perfil } from './pages/perfil/perfil';
import { CambiarPassword } from './pages/perfil/cambiar-password/cambiar-password';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Area } from './pages/area/area/area';

export const routes: Routes = [
  // publica
  { path: 'landing', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // protegida
  { path: 'app', component: MainLayout, canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'solicitudes', component: Solicitudes},
      {path: 'inventario', component: Inventario},
      {path: 'ordenes', component: Ordenes},
      {path: 'recepcion', component: Recepcion},
      {path: 'usuarios', component: Usuarios, canActivate: [roleGuard(['admin'])]},
      {path: 'perfil', component: Perfil},
      {path: 'perfil/password', component: CambiarPassword},
      {path: 'area', component: Area}
     ]
   },
   //publica
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
   //default
  { path: '', redirectTo: 'landing', pathMatch: 'full' }
];
