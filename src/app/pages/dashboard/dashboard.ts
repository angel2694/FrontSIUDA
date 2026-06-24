import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../core/services/productos/producto';
import { CategoriaService } from '../../core/services/categorias/categoria';
import { ProveedorService } from '../../core/services/proveedores/proveedor';
import { ProformaService } from '../../core/services/proformas/proforma';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalProductos = 0;
  totalProveedores = 0;
  totalCategorias = 0;
  totalProformas = 0;
  today = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

  // Gráfico de dona — proformas por estado
  donaOptions: any = {
    series: [],
    chart: { type: 'donut', height: 260 },
    labels: [],
    colors: ['#f9a825', '#2e7d32', '#e53935'],
    legend: { position: 'bottom' },
    title: { text: 'Proformas por estado', align: 'left', style: { fontSize: '14px' } },
    plotOptions: { pie: { donut: { size: '60%' } } },
    noData: { text: 'Sin datos' }
  };

  // Gráfico de barras — productos por categoría
  barOptions: any = {
    series: [{ name: 'Productos', data: [] }],
    chart: { type: 'bar', height: 260, toolbar: { show: false } },
    colors: ['#2e7d32'],
    xaxis: { categories: [] },
    title: { text: 'Productos por categoría', align: 'left', style: { fontSize: '14px' } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
    dataLabels: { enabled: false },
    noData: { text: 'Sin datos' }
  };

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private proformaService: ProformaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    forkJoin({
      productos: this.productoService.getProductos(),
      categorias: this.categoriaService.getCategorias(),
      proveedores: this.proveedorService.getProveedores(),
      proformas: this.proformaService.getProformas()
    }).subscribe(({ productos, categorias, proveedores, proformas }) => {
      const prods = productos as any[];
      const cats = categorias as any[];
      const provs = proveedores as any[];
      const pfs = proformas as any[];

      this.totalProductos = prods.length;
      this.totalCategorias = cats.length;
      this.totalProveedores = provs.length;
      this.totalProformas = pfs.length;

      this.buildDonaChart(pfs);
      this.buildBarChart(prods, cats);

      this.cdr.detectChanges();
    });
  }

  buildDonaChart(proformas: any[]) {
    const pendiente = proformas.filter(p => p.status === 'pendiente').length;
    const aprobada = proformas.filter(p => p.status === 'aprobada').length;
    const rechazada = proformas.filter(p => p.status === 'rechazada').length;
    this.donaOptions = {
      ...this.donaOptions,
      series: [pendiente, aprobada, rechazada],
      labels: [`Pendiente (${pendiente})`, `Aprobada (${aprobada})`, `Rechazada (${rechazada})`]
    };
  }

  buildBarChart(productos: any[], categorias: any[]) {
    const counts = categorias.map(c => ({
      name: c.name,
      count: productos.filter(p => p.category === c.id).length
    }));
    this.barOptions = {
      ...this.barOptions,
      series: [{ name: 'Productos', data: counts.map(c => c.count) as any[] }],
      xaxis: { categories: counts.map(c => c.name) }
    };
  }
}
