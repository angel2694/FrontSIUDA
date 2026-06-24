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
  porPagina = 10;
  sortField = '';
  sortAsc = true;

  constructor(private proveedorService: ProveedorService, private alert: AlertService) {}

  ngOnInit() { this.loadingProveedor(); }

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
    let list = b ? this.proveedores().filter(p =>
      p.name?.toLowerCase().includes(b) || p.ruc?.toLowerCase().includes(b) ||
      p.contact_name?.toLowerCase().includes(b)
    ) : [...this.proveedores()];
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
    const ruc = this.ruc().trim();
    if (!ruc) { this.alert.error('El RUC es obligatorio.'); return false; }
    if (!/^\d{11}$/.test(ruc)) { this.alert.error('El RUC debe tener exactamente 11 dígitos numéricos.'); return false; }
    if (!this.nombre().trim()) { this.alert.error('El nombre del proveedor es obligatorio.'); return false; }
    if (this.nombre().trim().length < 3) { this.alert.error('El nombre debe tener al menos 3 caracteres.'); return false; }
    const email = this.email().trim();
    if (email && !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
      this.alert.error('El formato del correo electrónico no es válido.'); return false;
    }
    const tel = this.telefono().trim().replace(/[\s-]/g, '');
    if (tel && (!/^\d+$/.test(tel) || tel.length < 7 || tel.length > 15)) {
      this.alert.error('El teléfono debe contener entre 7 y 15 dígitos.'); return false;
    }
    return true;
  }

  loadingProveedor() {
    this.loading.set(true);
    this.proveedorService.getProveedores().subscribe({
      next: (data: any) => { this.proveedores.set(data); this.loading.set(false); },
      error: () => { this.alert.error('Error al cargar proveedores'); this.loading.set(false); }
    });
  }

  crearProveedor() {
    if (!this.validar()) return;
    const data = {
      ruc: this.ruc().trim(), name: this.nombre().trim(),
      contact_name: this.contacto().trim(), phone: this.telefono().trim(),
      email: this.email().trim(), address: this.direccion().trim()
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
