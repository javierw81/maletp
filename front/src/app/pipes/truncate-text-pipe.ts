import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(valor: string | null | undefined, limite: number = 20, acortarContenido: boolean = true): string {
    if (!valor) {
      return '';
    }
  
    if (!acortarContenido) {
      return valor;
    }
  
    if (valor.length > limite) {
      return valor.substring(0, limite) + '...';
    }
  
    return valor;
  }
}
