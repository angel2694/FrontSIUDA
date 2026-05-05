import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios = signal<any[]>([]);
  loading = signal(false);
  mensaje = signal('');
  error = signal('');

  roles = ['admin', 'user', 'guest', 'almacen', 'inventario', 'cliente', 'proveedor'];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading.set(true);
    this.authService.getUsuarios().subscribe({
      next: (data: any[]) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar usuarios');
        this.loading.set(false);
      }
    });
  }

  cambiarRol(id: number, role: string) {
    this.mensaje.set('');
    this.error.set('');
    this.authService.assignRole(id, role).subscribe({
      next: (res: any) => this.mensaje.set(res.detail),
      error: () => this.error.set('Error al actualizar el rol')
    });
  }
}
