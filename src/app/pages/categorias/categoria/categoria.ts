import { Component, signal, OnInit } from '@angular/core';
import { CategoriaService } from '../../../core/services/categorias/categoria';
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
  mensaje = signal('');
  error = signal('');
  nombre = signal('');
  descripcion = signal('');

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.loading.set(true);
    this.categoriaService.getCategorias().subscribe({
      next: (data: any) => {
        this.categorias = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar categorías');
        this.loading.set(false);
      },
    });
  }

  crearCategoria() {
    const nuevaCategoria = { name: this.nombre(), description: this.descripcion() };
    this.categoriaService.createCategoria(nuevaCategoria).subscribe({
      next: () => {
        this.mensaje.set('Categoría creada exitosamente');
        this.nombre.set('');
        this.descripcion.set('');
        this.loadCategorias();
      },
      error: () => {
        this.error.set('Error al crear categoría');
      },
    });
  }
}
