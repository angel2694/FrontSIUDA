import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth';
import { Modulo } from '../../core/interfaces/modulo';

const ADMIN_MODULES = ['Áreas', 'Categorías', 'Unidades', 'Proveedores', 'Productos', 'Proformas'];

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  modulosPrincipales: Modulo[] = [];
  modulosAdmin: Modulo[] = [];
  adminOpen = false;

  constructor(private authService: AuthService) {
    const todos = this.authService.getModulos();
    this.modulosAdmin = todos.filter(m => ADMIN_MODULES.includes(m.nombre));
    this.modulosPrincipales = todos.filter(m => !ADMIN_MODULES.includes(m.nombre));
  }
}
