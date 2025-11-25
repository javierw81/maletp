import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerFormat'
})
export class TimerFormatPipe implements PipeTransform {

  transform(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

}
