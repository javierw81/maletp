import { Directive, effect, ElementRef, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTimerColor]'
})
export class TimerColor {
  
  tiempo = input.required<number>();

  constructor(private el: ElementRef, private r: Renderer2) {

    this.r.setStyle(this.el.nativeElement, 'transition', 'background-color 0.5s ease-in-out, border-color 0.5s ease-in-out');
    
    // El 'effect' llama a la función de estilo cada vez que 'tiempo()' cambia
    effect(() => {
      this.aplicarEstilos(this.tiempo());
    });
  }

  /** Aplica los estilos al elemento basado en el tiempo restante */
  private aplicarEstilos(currentTiempo: number) {
    const nativeEl = this.el.nativeElement;
    
    // --- Valores para un mejor estilado ---
    let backgroundColor = 'transparent';
    let textColor = 'inherit';
    let borderColor = 'transparent';
    
    // Mayor a 10 minutos (600 segundos)
    if (currentTiempo > 10 * 60) {
      backgroundColor = '#e6ffe6'; 
      textColor = '#006600'; 
      borderColor = '#4CAF50';
    } 
    // Mayor a 5 minutos (300 segundos)
    else if (currentTiempo > 5 * 60) {
      backgroundColor = '#fff8e1';
      textColor = '#ff9800'; 
      borderColor = '#FFC107';
    } 
    // Menor o igual a 5 minutos
    else {
      backgroundColor = '#ffe0e0';
      textColor = '#D32F2F';
      borderColor = '#F44336';
    }

    // --- Aplicación de Estilos ---
    this.r.setStyle(nativeEl, 'background-color', backgroundColor);
    this.r.setStyle(nativeEl, 'color', textColor);
    this.r.setStyle(nativeEl, 'border-radius', '4px');
    this.r.setStyle(nativeEl, 'border', `2px solid ${borderColor}`);
    this.r.setStyle(nativeEl, 'padding', '4px 8px');
    this.r.setStyle(nativeEl, 'display', 'inline-block');
}
}
