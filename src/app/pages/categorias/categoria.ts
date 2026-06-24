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
  porPagina = 5;

  constructor(private categoriaService: CategoriaService, private alert: AlertService) {}

  ngOnInit() { this.loadCategorias(); }

  get filtrado() {
    const b = this.busqueda.toLowerCase();
    return b ? this.categorias.filter(c =>
      c.name?.toLowerCase().includes(b) || c.description?.toLowerCase().includes(b)
    ) : this.categorias;
  }

  get paginado() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.filtrado.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.filtrado.length / this.porPagina);
  }

  onBusqueda(val: string) { this.busqueda = val; this.pagina = 1; }

  loadCategorias() {
    this.loading.set(true);
    this.categoriaService.getCategorias().subscribe({
      next: (data: any) => { this.categorias = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar categorías'); this.loading.set(false); },
    });
  }

  crearCategoria() {
    this.categoriaService.createCategoria({ name: this.nombre(), description: this.descripcion() }).subscribe({
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
