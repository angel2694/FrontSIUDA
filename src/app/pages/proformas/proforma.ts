import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProformaService } from '../../core/services/proformas/proforma';
import { ProveedorService } from '../../core/services/proveedores/proveedor';
import { ProductoService } from '../../core/services/productos/producto';

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
  mensaje = signal('');
  error = signal('');

  proveedorId = signal(0);
  fecha = signal('');
  status = signal('pendiente');
  notas = signal('');
  items = signal<{product: number, quantity: number, unit_price: number}[]>([]);

  constructor(
    private proformaService: ProformaService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.loadProformas();
    this.proveedorService.getProveedores().subscribe(data => this.proveedores.set(data as any[]));
    this.productoService.getProductos().subscribe(data => this.productos.set(data as any[]));
  }

  loadProformas() {
    this.loading.set(true);
    this.proformaService.getProformas().subscribe({
      next: (data) => { this.proformas = data; this.loading.set(false); },
      error: () => { this.error.set('Error al cargar proformas'); this.loading.set(false); }
    });
  }

  agregarItem() {
    this.items.update(list => [...list, { product: 0, quantity: 1, unit_price: 0 }]);
  }

  eliminarItem(index: number) {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  calcularTotal(item: any): number {
    return item.quantity * item.unit_price;
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
      supplier: this.proveedorId(),
      date: this.fecha(),
      status: this.status(),
      notes: this.notas(),
      items: this.items()
    };
    this.proformaService.createProforma(data).subscribe({
      next: () => {
        this.mensaje.set('Proforma creada exitosamente');
        this.proveedorId.set(0);
        this.fecha.set('');
        this.status.set('pendiente');
        this.notas.set('');
        this.items.set([]);
        this.loadProformas();
      },
      error: () => { this.error.set('Error al crear proforma'); }
    });
  }
}