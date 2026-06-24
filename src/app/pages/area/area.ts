import { Component, OnInit, signal } from '@angular/core';
import { AreaService } from '../../core/services/areas/area';
import { AlertService } from '../../core/services/alert/alert';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './area.html',
  styleUrl: './area.css',
})
export class Area implements OnInit {
  loading = signal(false);
  areas = signal<any[]>([]);
  nombre = signal('');
  descripcion = signal('');
  busqueda = '';
  pagina = 1;
  porPagina = 5;

  constructor(private areaService: AreaService, private alert: AlertService) {}

  ngOnInit(): void { this.loadArea(); }

  get filtrado() {
    const b = this.busqueda.toLowerCase();
    return b ? this.areas().filter(a =>
      a.name?.toLowerCase().includes(b) || a.description?.toLowerCase().includes(b)
    ) : this.areas();
  }

  get paginado() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.filtrado.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.filtrado.length / this.porPagina);
  }

  onBusqueda(val: string) { this.busqueda = val; this.pagina = 1; }

  private loadArea() {
    this.loading.set(true);
    this.areaService.getAreas().subscribe({
      next: (data) => { this.areas.set(data); this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar áreas'); this.loading.set(false); },
    });
  }

  crearArea() {
    this.areaService.createArea({ name: this.nombre(), description: this.descripcion() }).subscribe({
      next: () => {
        this.alert.success('Área creada exitosamente');
        this.nombre.set(''); this.descripcion.set('');
        this.loadArea();
      },
      error: () => this.alert.error('Error al crear área'),
    });
  }
}
