import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadService } from '../../core/services/unidades/unidad';

@Component({
  selector: 'app-unidad',
  imports: [CommonModule, FormsModule],
  templateUrl: 'unidad.html',
  styleUrl: 'unidad.css',
})
export class Unidad implements OnInit {
  unidades: any[] = [];
  loading = signal(false);
  mensaje = signal('');
  error = signal('');
  nombre = signal('');
  abreviatura = signal('');

  constructor(private unidadService: UnidadService) {}

  ngOnInit(): void {
    this.loadUnidades();
  }

  loadUnidades() {
    this.loading.set(true);
    this.unidadService.getUnidades().subscribe({
      next: (data: any[]) => {
        this.unidades = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar unidades');
        this.loading.set(false);
      }
    });
  }

  createUnidad() {
    const data = {
      name: this.nombre(),
      abbreviation: this.abreviatura()
    };
    this.unidadService.createUnidad(data).subscribe({
      next: () => {
        this.mensaje.set('Unidad creada exitosamente');
        this.loadUnidades();
        this.nombre.set('');
        this.abreviatura.set('');
      },
      error: () => {
        this.error.set('Error al crear unidad');
      }
    });
  }
}
