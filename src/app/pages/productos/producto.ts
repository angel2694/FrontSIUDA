import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/productos/producto';
import { CategoriaService } from '../../core/services/categorias/categoria';
import { UnidadService } from '../../core/services/unidades/unidad';

@Component({
  selector: 'app-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnInit {
  productos: any[] = [];
  loading = signal(false);
  mensaje = signal('');
  error = signal('');
  code = signal('');
  nombre = signal('');
  descripcion = signal('');
  minStock = signal(0);
  categoriaId = signal(0);
  unidadId = signal(0);
  categorias = signal<any[]>([]);
  unidades = signal<any[]>([]);

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private unidadService: UnidadService
  ) {}

  ngOnInit() {
    this.loadProductos();
    this.categoriaService.getCategorias().subscribe(data => this.categorias.set(data as any[]));
    this.unidadService.getUnidades().subscribe(data => this.unidades.set(data as any[]));
  }

  loadProductos() {
    this.loading.set(true);
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar productos');
        this.loading.set(false);
      }
    });
  }

  getNombreCategoria(id: number): string {
    return this.categorias().find(c => c.id === id)?.name ?? id;
  }

  getNombreUnidad(id: number): string {
    const u = this.unidades().find(u => u.id === id);
    return u ? `${u.name} (${u.abbreviation})` : String(id);
  }

  crearProducto() {
    const data = {
      code: this.code(),
      name: this.nombre(),
      description: this.descripcion(),
      category: this.categoriaId(),
      unit_measure: this.unidadId(),
      min_stock: this.minStock()
    };
    this.productoService.createProducto(data).subscribe({
      next: () => {
        this.mensaje.set('Producto creado exitosamente');
        this.code.set('');
        this.nombre.set('');
        this.descripcion.set('');
        this.minStock.set(0);
        this.categoriaId.set(0);
        this.unidadId.set(0);
        this.loadProductos();
      },
      error: () => {
        this.error.set('Error al crear producto');
      }
    });
  }
}
