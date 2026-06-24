import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  perfil = signal<any>(null);
  editando = signal(false);
  mensaje = signal('');
  error = signal('');

  form = { first_name: '', last_name: '', email: '' };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getPerfil().subscribe({
      next: (data: any) => this.perfil.set(data),
      error: () => console.error('Error al cargar perfil')
    });
  }

  iniciarEdicion() {
    const p = this.perfil();
    this.form = { first_name: p.first_name, last_name: p.last_name, email: p.email };
    this.mensaje.set('');
    this.error.set('');
    this.editando.set(true);
  }

  guardar() {
    this.authService.actualizarPerfil(this.form).subscribe({
      next: (data: any) => {
        this.perfil.set(data);
        this.editando.set(false);
        this.mensaje.set('Perfil actualizado correctamente.');
      },
      error: () => this.error.set('Error al guardar los cambios.')
    });
  }

  cancelar() {
    this.editando.set(false);
    this.error.set('');
  }
}