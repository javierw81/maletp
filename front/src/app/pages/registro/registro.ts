import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Subscription } from 'rxjs';
import { RedInvalidInput } from '../../directives/red-invalid-input';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, RedInvalidInput],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnDestroy{

  mensajeDeError = signal("");
  cargando = signal(false) ;
  imagenTocada = signal(false); 
  pasoActual = signal(1); 

  private subscription = new Subscription();

  imagenURL= signal<string | ArrayBuffer | null>(null);
  maxSize = 5 * 1024 * 1024;
  tiposImagenPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  private timeout: any;

  private fb = inject(FormBuilder); 

  descripcionLength = signal(0);
  readonly MAX_DESCRIPCION_LENGTH = 80;

  constructor (
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.subscription.add(
        this.registroForm.get('descripcion')?.valueChanges.subscribe(value => {
            const valorActual = value ? value.length : 0;
            
            this.descripcionLength.set(valorActual);
        })
      );
  }

  ngOnDestroy(): void {
    if (this.timeout) {
    clearTimeout(this.timeout);
    }

    this.subscription.unsubscribe();
  }
  
  registroForm = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, this.noSoloEspacios(), Validators.maxLength(50), Validators.pattern(/^[^\@]+$/)]],
    correo: ['', [Validators.required, Validators.email,this.noSoloEspacios()]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmarPassword: ['', [Validators.required]],
    nombre: ['', [Validators.required, this.noSoloEspacios(), Validators.maxLength(50)]],
    apellido: ['', [Validators.required ,this.noSoloEspacios(), Validators.maxLength(50)]],
    fechaNacimiento: ["", [this.fechaValida(), this.fechaNacimientoValida()]],
    descripcion: ['', [Validators.required ,this.noSoloEspacios(), Validators.maxLength(this.MAX_DESCRIPCION_LENGTH)]],
    perfilImg: [null as File | null, [this.archivoRequerido()]],
  }, { validators: this.passwordsIgualesValidador() });

  private noSoloEspacios(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value || '';
      return valor.trim().length === 0 ? { soloEspacios: true } : null;
    };
  }

  private passwordsIgualesValidador(): ValidatorFn {

    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password'); 
      const confirmar = group.get('confirmarPassword'); 

      if ( password?.value && confirmar?.value && password.value !== confirmar.value) {
        return { passwordsNoCoinciden: true };
      }
      return null
    }
  }

  private archivoRequerido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value ? null : { archivoRequerido: true };
    };
  }

  private fechaValida(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;

      if (!valor) return { fechaInvalida: true }; 

      const fecha = new Date(valor);
      const hoy = new Date();

      if (isNaN(fecha.getTime())) {
        return { fechaInvalida: true };
      }

      const fechaMinima = new Date(hoy.getFullYear() - 16, hoy.getMonth(), hoy.getDate());
      
      if (fecha > fechaMinima) {
        return { menorDeEdad: true, edadMinima: 16 };
      }

      return null;
    };
  }

  private fechaNacimientoValida(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return { fechaInvalida: true };

      const fecha = new Date(valor);
      const hoy = new Date();

      if (isNaN(fecha.getTime()) || fecha > hoy) {
        return { fechaInvalida: true };
      }

      return null;
    };
  }

  async realizarRegistro() {
    
    this.cargando.set(true);

    if(!this.registroForm.valid) {
      this.mensajeDeError.set("¡Datos invalidos! Llenelos correctamente por favor");
      return; 
    }


    this.mensajeDeError.set("");

    const { nombreUsuario, correo, password, nombre, apellido, descripcion, perfilImg, fechaNacimiento } = this.registroForm.value;

    const formData = new FormData();
    formData.append("nombreUsuario", nombreUsuario!);
    formData.append("correo", correo!);
    formData.append("password", password!);
    formData.append("nombre", nombre!);
    formData.append("apellido", apellido!);
    formData.append("descripcion", descripcion!);
    formData.append("fechaNacimiento", new Date(fechaNacimiento!).toISOString());
    formData.append("perfilImagen", perfilImg!);


    try {
      await this.authService.register(formData); 
        
      this.sweetAlert.crearMensajeExito("¡Registro Exitoso!", "¡Creaste una cuenta con exito!")
      this.cargando.set(false);

      this.timeout = setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    
    } catch (err: any) {
      this.cargando.set(false);
      const httpError = err as HttpErrorResponse;
        
      let mensaje = "Ocurrió un error inesperado con el registro.";

        mensaje = httpError.error.message || mensaje;

        if (httpError.status === 409) {
        
          mensaje = httpError.error.message || "El nombre de usuario o correo ya está en uso.";
      
          if (mensaje.includes('usuario')) {
            this.registroForm.get('nombreUsuario')?.setErrors({ conflict: true });
          } else if (mensaje.includes('correo')) {
            this.registroForm.get('correo')?.setErrors({ conflict: true });
          }

        } 

        this.sweetAlert.crearMensajeError(mensaje, "¡Oh no!")
        this.mensajeDeError.set(`${mensaje}`);
        console.error(httpError); 

        this.cargando.set(false);
    
      
    }

  }

  seleccionarFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imagenTocada.set(true);

    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];

      if (!this.tiposImagenPermitidos.includes(archivo.type)) {
        this.mensajeDeError.set('Solo se permiten imagenes JPG, JPEG, PNG o GIF')
        this.registroForm.get('perfilImg')?.setValue(null);
        return;
      }

      if (archivo.size > this.maxSize) {
        this.mensajeDeError.set('La imagen supera el tamaño máximo permitido (5 MB)');
        this.registroForm.get('perfilImg')?.setValue(null);
        return;
      }

      this.registroForm.get('perfilImg')?.setValue(archivo as any); 
      const reader = new FileReader();
      
      reader.onload = () => {
        this.imagenURL.set(reader.result);
      };
      
      reader.readAsDataURL(archivo);
      this.mensajeDeError.set('');
  
    } else {
      this.registroForm.get('perfilImg')?.setValue(null);
      this.imagenURL.set(null);
    }
  }

  }




