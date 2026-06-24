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
  porPagina = 10;
  sortField = '';
  sortAsc = true;

  constructor(private unidadService: UnidadService, private alert: AlertService) {}

  ngOnInit(): void { this.loadUnidades(); }

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
    let list = b ? this.unidades.filter(u =>
      u.name?.toLowerCase().includes(b) || u.abbreviation?.toLowerCase().includes(b)
    ) : [...this.unidades];
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
    if (!n) { this.alert.error('El nombre de la unidad es obligatorio.'); return false; }
    if (n.length < 2) { this.alert.error('El nombre debe tener al menos 2 caracteres.'); return false; }
    if (n.length > 50) { this.alert.error('El nombre no puede superar los 50 caracteres.'); return false; }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]+$/.test(n)) { this.alert.error('El nombre solo puede contener letras, espacios y guiones.'); return false; }
    if (/\s{2,}/.test(n)) { this.alert.error('El nombre no puede tener espacios consecutivos.'); return false; }
    const a = this.abreviatura().trim();
    if (!a) { this.alert.error('La abreviatura es obligatoria.'); return false; }
    if (a.length > 10) { this.alert.error('La abreviatura no puede superar 10 caracteres.'); return false; }
    if (!/^[a-zA-Z0-9\.\-]+$/.test(a)) { this.alert.error('La abreviatura solo puede contener letras, números, puntos y guiones.'); return false; }
    return true;
  }

  loadUnidades() {
    this.loading.set(true);
    this.unidadService.getUnidades().subscribe({
      next: (data: any[]) => { this.unidades = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar unidades'); this.loading.set(false); }
    });
  }

  createUnidad() {
    if (!this.validar()) return;
    this.unidadService.createUnidad({ name: this.nombre().trim(), abbreviation: this.abreviatura().trim().toUpperCase() }).subscribe({
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
