import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  
  private readonly colorPrimario = '#734443';
  private readonly colorSecundario = '#b8aba5';
  private readonly colorTextoPrincipal = '#211f1c';
  private readonly colorTextoSecundario = '#4e3a3a';

  constructor() {}

  crearMensajeError(mensaje: string, titulo: string = '¡Oh no! Ocurrió un error') {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      confirmButtonText: 'Aceptar',
  
      customClass: {
        popup: 'swal2-popup-error', 
        confirmButton: 'swal2-confirm-button-error', 
      },

      buttonsStyling: false, 
      confirmButtonColor: this.colorPrimario, 
      iconColor: this.colorPrimario, 
      color: this.colorTextoPrincipal, 
      background: this.colorSecundario,
    });
  }


  crearMensajeExito(mensaje: string, titulo: string = '¡Bien hecho!') {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      confirmButtonText: 'Aceptar',
      timer: 3000, 
      timerProgressBar: true,
  
      customClass: {
        popup: 'swal2-popup-exito',
        confirmButton: 'swal2-confirm-button-exito',
      },

      buttonsStyling: false,
      confirmButtonColor: this.colorPrimario,
      iconColor: this.colorPrimario,
      color: this.colorTextoPrincipal,
      background: this.colorSecundario,
    });
  }


  crearAlertaConfirmacion(mensaje: string, titulo: string = '¿Estás seguro?'): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡adelante!',
      cancelButtonText: 'No, cancelar',

      customClass: {
        popup: 'swal2-popup-confirmacion',
        confirmButton: 'swal2-confirm-button-confirmacion',
        cancelButton: 'swal2-cancel-button-confirmacion',
      },

      buttonsStyling: false,
      confirmButtonColor: this.colorPrimario, 
      cancelButtonColor: this.colorTextoSecundario, 
      iconColor: this.colorPrimario,
      color: this.colorTextoPrincipal,
      background: this.colorSecundario, 
      reverseButtons: true, 
    }).then(resultado => {
      return resultado.isConfirmed;
    });
  }

}
