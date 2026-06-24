import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadService } from '../../core/services/unidades/unidad';
import { AlertService } from '../../core/services/alert/alert';

@Component({
  selector: 'app-unidad',
  imports: [CommonModule, FormsModule],
  templateUrl: 'unidad.html',
  styleUrl: 'unidad.css',
})
export class Unidad implements OnInit {
  unidades: any[] = [];
  loading = signal(false);
  nombre = signal('');
  abreviatura = signal('');
  busqueda = '';
  pagina = 1;
  porPagina = 5;

  constructor(private unidadService: UnidadService, private alert: AlertService) {}

  ngOnInit(): void { this.loadUnidades(); }

  get filtrado() {
    const b = this.busqueda.toLowerCase();
    return b ? this.unidades.filter(u =>
      u.name?.toLowerCase().includes(b) || u.abbreviation?.toLowerCase().includes(b)
    ) : this.unidades;
  }

  get paginado() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.filtrado.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.filtrado.length / this.porPagina);
  }

  onBusqueda(val: string) { this.busqueda = val; this.pagina = 1; }

  loadUnidades() {
    this.loading.set(true);
    this.unidadService.getUnidades().subscribe({
      next: (data: any[]) => { this.unidades = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar unidades'); this.loading.set(false); }
    });
  }

  createUnidad() {
    this.unidadService.createUnidad({ name: this.nombre(), abbreviation: this.abreviatura() }).subscribe({
      next: () => {
        this.alert.success('Unidad creada exitosamente');
        this.nombre.set(''); this.abreviatura.set('');
        this.pagina = 1;
        this.loadUnidades();
      },
      error: () => this.alert.error('Error al crear unidad')
    });
  }
}
