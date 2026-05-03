# HU35.T6 - Dashboard básico protegido

## 🎯 Objetivo
Implementar un dashboard principal protegido mediante autenticación JWT, utilizando un layout con sidebar, navbar y contenido dinámico en Angular.

---

## 🧱 Arquitectura implementada

Se implementó una estructura basada en layout:

- `MainLayout`: contenedor principal
- `Sidebar`: navegación lateral
- `Navbar`: barra superior
- `Dashboard`: vista principal

### Estructura

app.html  
└── router-outlet  
  └── MainLayout  
    ├── Navbar  
    ├── Sidebar  
    └── router-outlet  
      └── Dashboard  

---

## 🔐 Seguridad

- Se protegieron rutas mediante `authGuard`
- Solo usuarios autenticados pueden acceder a:

```txt
/app/dashboard