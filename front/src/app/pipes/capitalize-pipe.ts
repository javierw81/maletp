import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizePipe'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {

    if (!value) return "";
  
    return value.charAt(0).toLocaleUpperCase() + value.slice(1).toLocaleLowerCase();
  }

}
