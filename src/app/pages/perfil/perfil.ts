import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  perfil = signal<any>(null);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getPerfil().subscribe({
      next: (data: any) => this.perfil.set(data),
      error: () => console.error('Error al cargar perfil')
    });
  }
}