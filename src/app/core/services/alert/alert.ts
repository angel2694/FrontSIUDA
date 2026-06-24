import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

  success(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }

  error(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
    });
  }

  async confirm(mensaje: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Estás seguro?',
      text: mensaje,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1b5e20',
      cancelButtonColor: '#e53935',
    });
    return result.isConfirmed;
  }
}
