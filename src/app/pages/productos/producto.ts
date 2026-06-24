import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/productos/producto';
import { CategoriaService } from '../../core/services/categorias/categoria';
import { UnidadService } from '../../core/services/unidades/unidad';
import { AlertService } from '../../core/services/alert/alert';

@Component({
  selector: 'app-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnInit {
  productos: any[] = [];
  loading = signal(false);
  code = signal('');
  nombre = signal('');
  descripcion = signal('');
  minStock = signal(0);
  categoriaId = signal(0);
  unidadId = signal(0);
  categorias = signal<any[]>([]);
  unidades = signal<any[]>([]);
  busqueda = '';
  pagina = 1;
  porPagina = 10;
  sortField = '';
  sortAsc = true;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private unidadService: UnidadService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.loadProductos();
    this.categoriaService.getCategorias().subscribe(data => this.categorias.set(data as any[]));
    this.unidadService.getUnidades().subscribe(data => this.unidades.set(data as any[]));
  }

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
    let list = b ? this.productos.filter(p =>
      p.name?.toLowerCase().includes(b) || p.code?.toLowerCase().includes(b)
    ) : [...this.productos];
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

  getNombreCategoria(id: number): string {
    return this.categorias().find(c => c.id === id)?.name ?? String(id);
  }

  getNombreUnidad(id: number): string {
    const u = this.unidades().find(u => u.id === id);
    return u ? `${u.name} (${u.abbreviation})` : String(id);
  }

  private validar(): boolean {
    if (!this.code().trim()) { this.alert.error('El código del producto es obligatorio.'); return false; }
    if (!this.nombre().trim()) { this.alert.error('El nombre del producto es obligatorio.'); return false; }
    if (this.nombre().trim().length < 2) { this.alert.error('El nombre debe tener al menos 2 caracteres.'); return false; }
    if (this.categoriaId() === 0) { this.alert.error('Debe seleccionar una categoría.'); return false; }
    if (this.unidadId() === 0) { this.alert.error('Debe seleccionar una unidad de medida.'); return false; }
    if (this.minStock() < 0) { this.alert.error('El stock mínimo no puede ser negativo.'); return false; }
    return true;
  }

  loadProductos() {
    this.loading.set(true);
    this.productoService.getProductos().subscribe({
      next: (data) => { this.productos = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar productos'); this.loading.set(false); }
    });
  }

  crearProducto() {
    if (!this.validar()) return;
    const data = {
      code: this.code().trim().toUpperCase(), name: this.nombre().trim(),
      description: this.descripcion().trim(),
      category: this.categoriaId(), unit_measure: this.unidadId(),
      min_stock: this.minStock()
    };
    this.productoService.createProducto(data).subscribe({
      next: () => {
        this.alert.success('Producto creado exitosamente');
        this.code.set(''); this.nombre.set(''); this.descripcion.set('');
        this.minStock.set(0); this.categoriaId.set(0); this.unidadId.set(0);
        this.pagina = 1;
        this.loadProductos();
      },
      error: () => this.alert.error('Error al crear producto')
    });
  }
}
