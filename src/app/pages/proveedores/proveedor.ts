import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../core/services/proveedores/proveedor';

@Component({
  selector: 'app-proveedor',
  imports: [CommonModule, FormsModule],
  templateUrl: 'proveedor.html',
  styleUrl: 'proveedor.css',
})
export class Proveedor implements OnInit {
  proveedores = signal<any[]>([]);
  loading = signal(false);
  mensaje = signal('');
  error = signal('');
  ruc = signal('');
  nombre = signal('');
  contacto = signal('');
  telefono = signal('');
  email = signal('');
  direccion = signal('');

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit() {
    this.loadingProveedor();
  }

  loadingProveedor() {
    this.loading.set(true);
    this.proveedorService.getProveedores().subscribe({
      next: (data: any) => {
        this.proveedores.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar proveedores');
        this.loading.set(false);
      }
    });
  }

  crearProveedor() {
    const data = {
      ruc: this.ruc(),
      name: this.nombre(),
      contact_name: this.contacto(),
      phone: this.telefono(),
      email: this.email(),
      address: this.direccion()
    };

    this.proveedorService.createProveedor(data).subscribe({
      next: (res: any) => {
        this.mensaje.set('Proveedor creado exitosamente');
        // Limpiar los campos del formulario
        this.ruc.set('');
        this.nombre.set('');
        this.contacto.set('');
        this.telefono.set('');
        this.email.set('');
        this.direccion.set('');
        // Recargar la lista de proveedores
        this.loadingProveedor();
      },
      error: () => {
        this.error.set('Error al crear proveedor');
      }
    });
  }
}