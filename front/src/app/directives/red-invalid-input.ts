import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRedInvalidInput]'
})

export class RedInvalidInput {

  constructor(
    private el: ElementRef, 
    @Self() private control: NgControl
  ) {}

  @HostListener('input') onInput() {
    this.updateStyle();
  }
  
  @HostListener('blur') onBlur() {
    this.updateStyle();
  }

  /**
   * Cambiamos el estilado teniendo en cuenta 
   *  si es invalido o no el control del input
   *
   * @private
   */
  private updateStyle() {

    const isInvalid = this.control.invalid;
    const isTouched = this.control.touched;

    const nativeElement = this.el.nativeElement as HTMLInputElement;

    if (isInvalid && isTouched) {
      nativeElement.style.border = '2px solid #ff4d4f'; 
      nativeElement.style.boxShadow = '0 0 5px rgba(255, 77, 79, 0.5)';
    } else {

      nativeElement.style.border = '';
      nativeElement.style.boxShadow = '';
    }
  }

}
