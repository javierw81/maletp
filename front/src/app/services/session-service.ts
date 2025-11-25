import { inject, Injectable, signal } from '@angular/core';
import {interval, Subscription } from 'rxjs';
import { AuthService } from './auth-service';
import { SweetAlertService } from '../modals/sweet-alert-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // Utilización de observables para manejar el tiempo de session 
  private timerSub?: Subscription;
  tiempoRestante = signal<number>(0);

  private intervaloSegundos = 1;
  private sesionMinutos = 15;
  private avisoMinutos = 5;

  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private router = inject(Router)

  iniciarContador() {
    this.cancelarContador();

    this.tiempoRestante.set(this.sesionMinutos * 60);

    this.timerSub = interval(this.intervaloSegundos * 1000)
    .subscribe(() => this.tick());
  }

  private async tick() {
    
    this.tiempoRestante.set(this.tiempoRestante() -1);


    if (this.tiempoRestante() === this.avisoMinutos * 60) {
      await this.manejarExtenderSesion();
    }

    if (this.tiempoRestante() <= 0) {
      await this.cerrarSesion();
    }
  }

  async manejarExtenderSesion() {
    const deseaExtender = await this.sweetAlertService.crearAlertaConfirmacion(
      "Sesión pronto a expirar",
      `Tu sesión expira en ${this.avisoMinutos} minutos. ¿Querés extenderla?`
    );

    if (!deseaExtender) return;

    this.cancelarContador();

    try {
      const mensaje = await this.authService.refrescar();
      this.iniciarContador();   

      this.sweetAlertService.crearMensajeExito("", mensaje)
    } catch (err: any) {
      this.sweetAlertService.crearMensajeError("", "Ocurrio un error, cerrando sesión");
      await this.authService.logout();
    }
    
  }
  

  async cerrarSesion() {
    const estabaLogueado = this.authService.cerrarSesionExpirada();
      if (estabaLogueado) {
        this.sweetAlertService.crearMensajeError("Sesión expirada", "Volvé a iniciar sesión");
        await this.authService.logout();
        this.router.navigate(['login'])
      }
      this.cancelarContador();
  }

  cancelarContador() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = undefined;
    }
  }
}
