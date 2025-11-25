import { Directive, ElementRef, Input, Renderer2, SimpleChange } from '@angular/core';

@Directive({
  selector: '[appTypeTagDirective]'
})
export class TypeTagDirective {


  @Input('appTipoTag') tipoPublicacion: string = '';

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.tipoPublicacion) {
      const tipo = this.tipoPublicacion.toLowerCase();
      this.aplicarEstilo(tipo);
    }
  }

  /** Aplica el estilo basado en el tipo de publicacion */
  private aplicarEstilo(tipo: string): void {
    let backgroundColor: string;
    let color: string = '#212529'; 
    let hoverTransform: string;

    switch (tipo) {
      case 'logro':
        backgroundColor = '#FFD700'; 
        color = '#333333';
        hoverTransform = 'scale(1.1)';
        break;
      case 'consulta':
        backgroundColor = '#28a745'; 
        color = '#ffffff';
        hoverTransform = 'translateX(8px)'
        break;
      case 'partido':
        backgroundColor = '#dc3545'; 
        color = '#ffffff';
        hoverTransform = 'translateY(-5px)';
        break;
      default:
        backgroundColor = '#6c757d'; 
        color = '#ffffff';
        hoverTransform = 'scale(1.05)';
        break;
    }

    this.renderer.setStyle(this.el.nativeElement, 'background-color', backgroundColor);
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => {
      this.renderer.setStyle(this.el.nativeElement, 'transform', hoverTransform); 
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)'); 
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    });

    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1) translate(0, 0)');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
    });
 }
}
