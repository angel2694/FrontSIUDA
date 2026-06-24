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
  sortField = '';
  sortAsc = true;

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
    let list = b ? this.proformas.filter(p =>
      p.status?.toLowerCase().includes(b) || p.date?.includes(b)
    ) : [...this.proformas];
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

  private validar(): boolean {
    if (this.proveedorId() === 0) { this.alert.error('Debe seleccionar un proveedor.'); return false; }
    if (!this.fecha()) { this.alert.error('La fecha es obligatoria.'); return false; }
    const anio = new Date(this.fecha()).getFullYear();
    if (anio < 2000 || anio > 2100) { this.alert.error('La fecha debe estar entre 2000 y 2100.'); return false; }
    if (this.items().length === 0) { this.alert.error('Debe agregar al menos un ítem.'); return false; }
    for (const item of this.items()) {
      if (item.product === 0) { this.alert.error('Todos los ítems deben tener un producto seleccionado.'); return false; }
      if (item.quantity <= 0) { this.alert.error('La cantidad de cada ítem debe ser mayor a 0.'); return false; }
      if (item.unit_price <= 0) { this.alert.error('El precio unitario debe ser mayor a 0.'); return false; }
    }
    return true;
  }

  loadProformas() {
    this.loading.set(true);
    this.proformaService.getProformas().subscribe({
      next: (data) => { this.proformas = data; this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar proformas'); this.loading.set(false); }
    });
  }

  crearProforma() {
    if (!this.validar()) return;
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
