import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProformaService } from '../../core/services/proformas/proforma';
import { ProveedorService } from '../../core/services/proveedores/proveedor';
import { ProductoService } from '../../core/services/productos/producto';
import { AlertService } from '../../core/services/alert/alert';

@Component({
  selector: 'app-proforma',
  imports: [CommonModule, FormsModule],
  templateUrl: './proforma.html',
  styleUrl: './proforma.css',
})
export class Proforma implements OnInit {
  proformas: any[] = [];
  proveedores = signal<any[]>([]);
  productos = signal<any[]>([]);
  loading = signal(false);
  proveedorId = signal(0);
  fecha = signal('');
  status = signal('pendiente');
  notas = signal('');
  items = signal<{product: number, quantity: number, unit_price: number}[]>([]);
  busqueda = '';
  pagina = 1;
  porPagina = 5;

  constructor(
    private proformaService: ProformaService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.loadProformas();
    this.proveedorService.getProveedores().subscribe(data => this.proveedores.set(data as any[]));
    this.productoService.getProductos().subscribe(data => this.productos.set(data as any[]));
  }

  get filtrado() {
    const b = this.busqueda.toLowerCase();
    return b ? this.proformas.filter(p =>
      p.status?.toLowerCase().includes(b) || p.date?.includes(b)
    ) : this.proformas;
  }

  get paginado() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.filtrado.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.filtrado.length / this.porPagina);
  }

  onBusqueda(val: string) { this.busqueda = val; this.pagina = 1; }

  loadProformas() {
    this.loading.set(true);
    this.proformaService.getProformas().subscribe({
      next: (data) => { this.proformas = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar proformas'); this.loading.set(false); }
    });
  }

  agregarItem() {
    this.items.update(list => [...list, { product: 0, quantity: 1, unit_price: 0 }]);
  }

  eliminarItem(index: number) {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  calcularTotalGeneral(): number {
    return this.items().reduce((acc, i) => acc + i.quantity * i.unit_price, 0);
  }

  getNombreProducto(id: number): string {
    return this.productos().find(p => p.id === id)?.name ?? String(id);
  }

  getTotalProforma(proforma: any): string {
    return proforma.items.reduce((acc: number, i: any) => acc + +i.total, 0).toFixed(2);
  }

  getNombreProveedor(id: number): string {
    return this.proveedores().find(p => p.id === id)?.name ?? String(id);
  }

  crearProforma() {
    const data = {
      supplier: this.proveedorId(), date: this.fecha(),
      status: this.status(), notes: this.notas(), items: this.items()
    };
    this.proformaService.createProforma(data).subscribe({
      next: () => {
        this.alert.success('Proforma creada exitosamente');
        this.proveedorId.set(0); this.fecha.set('');
        this.status.set('pendiente'); this.notas.set(''); this.items.set([]);
        this.pagina = 1;
        this.loadProformas();
      },
      error: () => this.alert.error('Error al crear proforma')
    });
  }
}
