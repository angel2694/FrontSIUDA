import { Component, signal, OnInit } from '@angular/core';
import { CategoriaService } from '../../core/services/categorias/categoria';
import { AlertService } from '../../core/services/alert/alert';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria implements OnInit {
  categorias: any[] = [];
  loading = signal(false);
  nombre = signal('');
  descripcion = signal('');
  busqueda = '';
  pagina = 1;
  porPagina = 10;
  sortField = '';
  sortAsc = true;

  constructor(private categoriaService: CategoriaService, private alert: AlertService) {}

  ngOnInit() { this.loadCategorias(); }

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
    let list = b ? this.categorias.filter(c =>
      c.name?.toLowerCase().includes(b) || c.description?.toLowerCase().includes(b)
    ) : [...this.categorias];
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
    if (!n) { this.alert.error('El nombre de la categoría es obligatorio.'); return false; }
    if (n.length < 2) { this.alert.error('El nombre debe tener al menos 2 caracteres.'); return false; }
    if (n.length > 100) { this.alert.error('El nombre no puede superar los 100 caracteres.'); return false; }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]+$/.test(n)) { this.alert.error('El nombre solo puede contener letras, espacios y guiones.'); return false; }
    if (/\s{2,}/.test(n)) { this.alert.error('El nombre no puede tener espacios consecutivos.'); return false; }
    return true;
  }

  loadCategorias() {
    this.loading.set(true);
    this.categoriaService.getCategorias().subscribe({
      next: (data: any) => { this.categorias = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar categorías'); this.loading.set(false); },
    });
  }

  crearCategoria() {
    if (!this.validar()) return;
    this.categoriaService.createCategoria({ name: this.nombre().trim(), description: this.descripcion().trim() }).subscribe({
      next: () => {
        this.alert.success('Categoría creada exitosamente');
        this.nombre.set(''); this.descripcion.set('');
        this.pagina = 1;
        this.loadCategorias();
      },
      error: () => this.alert.error('Error al crear categoría'),
    });
  }
}
