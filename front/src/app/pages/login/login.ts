import { Component, inject, OnDestroy, signal} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SweetAlertService } from '../../modals/sweet-alert-service';
import { AuthService } from '../../services/auth-service';
import { LoginDto } from '../../models/user.interface';
import { Subscription } from 'rxjs';
import { RedInvalidInput } from '../../directives/red-invalid-input';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, RouterLink, RedInvalidInput
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login  {

  mensajeDeError = signal("");
  cargando = signal(false) ;

  private fb = inject(FormBuilder); 

  constructor (
    private sweetAlert: SweetAlertService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService
  ) {}


  loginForm = this.fb.nonNullable.group({
    identificador: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async realizarLogin() {
    this.cargando.set(true);

    if(!this.loginForm.valid) {
      this.mensajeDeError.set("Formulario invalido");
      return; 
    }

    this.cargando.set(true);
    this.mensajeDeError.set(""); 

    const credenciales = this.loginForm.value as LoginDto
    
    try {
      await this.authService.login(credenciales); 
        
      this.cargando.set(false);
      this.sweetAlert.crearMensajeExito("¡Iniciaste sesión con éxito!", "¡Bienvenido/a!");
      this.sessionService.iniciarContador(); 
      this.router.navigate(['/publicaciones']);
    
    } catch (err: any) {
      this.cargando.set(false);
      const httpError = err as HttpErrorResponse;
        
      // Mensaje por defecto
      let mensaje = "Ocurrió un error inesperado con el inicio de sesión."; 

      // Manejo de códigos de estado específicos (409, 429)
      if (httpError.status === 401) {
        mensaje = httpError.error?.message || "Credenciales inválidas. Inténtelo nuevamente";
      } else if (httpError.status === 429) {
        mensaje = httpError.error?.message || "Demasiados intentos de logueo, por favor intente después de 5 min";
      } 
      
      this.sweetAlert.crearMensajeError(mensaje, "¡Oh no!");
      this.mensajeDeError.set(`${mensaje}`); // Asignar al estado local si lo usas
      console.error(httpError);
    }

  }
    
  }

