import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../core/services/proveedores/proveedor';
import { AlertService } from '../../core/services/alert/alert';

@Component({
  selector: 'app-proveedor',
  imports: [CommonModule, FormsModule],
  templateUrl: 'proveedor.html',
  styleUrl: 'proveedor.css',
})
export class Proveedor implements OnInit {
  proveedores = signal<any[]>([]);
  loading = signal(false);
  ruc = signal('');
  nombre = signal('');
  contacto = signal('');
  telefono = signal('');
  email = signal('');
  direccion = signal('');
  busqueda = '';
  pagina = 1;
  porPagina = 5;

  constructor(private proveedorService: ProveedorService, private alert: AlertService) {}

  ngOnInit() { this.loadingProveedor(); }

  get filtrado() {
    const b = this.busqueda.toLowerCase();
    return b ? this.proveedores().filter(p =>
      p.name?.toLowerCase().includes(b) || p.ruc?.toLowerCase().includes(b) ||
      p.contact_name?.toLowerCase().includes(b)
    ) : this.proveedores();
  }

  get paginado() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.filtrado.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.filtrado.length / this.porPagina);
  }

  onBusqueda(val: string) { this.busqueda = val; this.pagina = 1; }

  loadingProveedor() {
    this.loading.set(true);
    this.proveedorService.getProveedores().subscribe({
      next: (data: any) => { this.proveedores.set(data); this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar proveedores'); this.loading.set(false); }
    });
  }

  crearProveedor() {
    const data = {
      ruc: this.ruc(), name: this.nombre(), contact_name: this.contacto(),
      phone: this.telefono(), email: this.email(), address: this.direccion()
    };
    this.proveedorService.createProveedor(data).subscribe({
      next: () => {
        this.alert.success('Proveedor creado exitosamente');
        this.ruc.set(''); this.nombre.set(''); this.contacto.set('');
        this.telefono.set(''); this.email.set(''); this.direccion.set('');
        this.pagina = 1;
        this.loadingProveedor();
      },
      error: () => this.alert.error('Error al crear proveedor')
    });
  }
}
