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
  porPagina = 10;
  sortField = '';
  sortAsc = true;

  constructor(private areaService: AreaService, private alert: AlertService) {}

  ngOnInit(): void { this.loadArea(); }

  sortBy(field: string) {
    if (this.sortField === field) this.sortAsc = !this.sortAsc;
    else { this.sortField = field; this.sortAsc = true; }
    this.pagina = 1;
  }

  sortIcon(field: string): string {
    if (this.sortField !== field) return '⇅';
    return this.sortAsc ? '▲' : '▼';
  }

  get filtrado() {
    const b = this.busqueda.toLowerCase();
    let list = b ? this.areas().filter(a =>
      a.name?.toLowerCase().includes(b) || a.description?.toLowerCase().includes(b)
    ) : [...this.areas()];
    if (this.sortField) {
      list.sort((a, b) => {
        const va = String(a[this.sortField] ?? '').toLowerCase();
        const vb = String(b[this.sortField] ?? '').toLowerCase();
        return this.sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return list;
  }

  get paginado() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.filtrado.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() { return Math.ceil(this.filtrado.length / this.porPagina); }

  onBusqueda(val: string) { this.busqueda = val; this.pagina = 1; }

  private validar(): boolean {
    const n = this.nombre().trim();
    if (!n) { this.alert.error('El nombre del área es obligatorio.'); return false; }
    if (n.length < 2) { this.alert.error('El nombre debe tener al menos 2 caracteres.'); return false; }
    if (n.length > 100) { this.alert.error('El nombre no puede superar los 100 caracteres.'); return false; }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]+$/.test(n)) { this.alert.error('El nombre solo puede contener letras, espacios y guiones.'); return false; }
    if (/\s{2,}/.test(n)) { this.alert.error('El nombre no puede tener espacios consecutivos.'); return false; }
    const d = this.descripcion().trim();
    if (d.length > 500) { this.alert.error('La descripción no puede superar los 500 caracteres.'); return false; }
    return true;
  }

  private loadArea() {
    this.loading.set(true);
    this.areaService.getAreas().subscribe({
      next: (data) => { this.areas.set(data); this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar áreas'); this.loading.set(false); },
    });
  }

  crearArea() {
    if (!this.validar()) return;
    this.areaService.createArea({ name: this.nombre().trim(), description: this.descripcion().trim() }).subscribe({
      next: () => {
        this.alert.success('Área creada exitosamente');
        this.nombre.set(''); this.descripcion.set('');
        this.loadArea();
      },
      error: () => this.alert.error('Error al crear área'),
    });
  }
}
