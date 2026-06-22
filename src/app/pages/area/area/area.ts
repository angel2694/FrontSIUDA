import { Component, OnInit, signal } from '@angular/core';
import { AreaService } from '../../../core/services/areas/area';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './area.html',
  styleUrl: './area.css',
})
export class Area implements OnInit {
  loading = signal(false);
  mensaje = signal('');
  error = signal('');
  areas = signal<any[]>([]);  // lista, no un solo area 
  nombre = signal('');
  descripcion = signal('');

  constructor(private areaService: AreaService) {}

  ngOnInit(): void {
    this.loadArea();
  }

  private loadArea() {
    this.loading.set(true);
    this.areaService.getAreas().subscribe({
      next: (data) => {
        this.areas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading area');
        this.loading.set(false);
      },
    });
  }

  crearArea() {
    const nuevaArea = { name: this.nombre(), description: this.descripcion() };
    this.areaService.createArea(nuevaArea).subscribe({
      next: (data) => {
        this.mensaje.set('Área creada exitosamente');
        this.nombre.set('');
        this.descripcion.set('');
        this.loadArea();
      },
      error: (err) => {
        this.error.set('Error creating area');
      },
    });
  }
}
