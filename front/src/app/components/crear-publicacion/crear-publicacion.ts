import { Component, inject, signal } from '@angular/core';
import { CreatePostPayload, DEPORTES, TIPOS_PUBLICACION } from '../../models/post.interface';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { PostService } from '../../services/post-service';
import { Router } from '@angular/router';
import { RedInvalidInput } from '../../directives/red-invalid-input';

@Component({
  selector: 'app-crear-publicacion',
  imports: [ReactiveFormsModule, RedInvalidInput],
  templateUrl: './crear-publicacion.html',
  styleUrl: './crear-publicacion.css',
})
export class CrearPublicacion {

  private fb = inject(FormBuilder);
  cargando = signal(false);

  imagenURL= signal<string | ArrayBuffer | null>(null);

  constructor(private sweetAlertService: SweetAlertService, private postService: PostService, private router: Router) {}

  public tiposPublicacion = TIPOS_PUBLICACION;
  public deportes = DEPORTES;

  public postForm: FormGroup = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(50), this.noSoloEspacios()]], 
    mensaje: ['', [Validators.required, Validators.maxLength(150), this.noSoloEspacios()]], 
    tipoPublicacion: ['', [
      Validators.required, 
    ]],
    deporte: ['', [
      Validators.required, 
    ]],
    imagenPost: [null as File | null], 
  });

  private noSoloEspacios(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value || '';
      return valor.trim().length === 0 ? { soloEspacios: true } : null;
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.postForm.get('imagenPost')?.setValue(input.files[0]);

      const reader = new FileReader();

      reader.onload = () => {
      this.imagenURL.set(reader.result);
      };

       reader.readAsDataURL(input.files[0]);
    } else {
      this.postForm.get('imagenPost')?.setValue(null);
    }
    this.postForm.get('imagenPost')?.markAsTouched();
  }


  /** Maneja el envio del formulario de creacion de publicacion */
  onSubmit(): void {
    this.cargando.set(true);
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.sweetAlertService.crearMensajeError('El formulario no es válido.', 'Opss')
      return;
    }

    const file = this.postForm.get('imagenPost')?.value as File;
    const data: CreatePostPayload = this.postForm.getRawValue();

    const formData = new FormData();

    if (file) {
      formData.append('imagenPost', file, file.name); 
    }

    formData.append('titulo', data.titulo);
    formData.append('mensaje', data.mensaje);
    formData.append('tipoPublicacion', data.tipoPublicacion);
    formData.append('deporte', data.deporte);

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.sweetAlertService.crearMensajeExito("Publicacion creada con exito!", "¡Creaste una publicacion con exito!")

        this.cargando.set(false);
        this.router.navigate(['/publicaciones']);
       
      },
      error: (error:any) => {
        
        let mensaje = "Ocurrió un error creando la publicacion.";
        this.cargando.set(false);
        this.sweetAlertService.crearMensajeError(mensaje, "¡Oh no!")
        console.error(error); 
        }
    })
    
  }
}
