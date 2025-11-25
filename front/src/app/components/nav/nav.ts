import { Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { CapitalizePipe } from '../../pipes/capitalize-pipe';
import { AuthService } from '../../services/auth-service';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { SessionService } from '../../services/session-service';
import { TimerFormatPipe } from '../../pipes/timer-format-pipe';
import { TimerColor } from '../../directives/timer-color';
import { TruncateTextPipe } from '../../pipes/truncate-text-pipe';


@Component({
  selector: 'app-nav',
  imports: [RouterLink, CapitalizePipe, TimerFormatPipe, TimerColor, TruncateTextPipe],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);
  private sessionService = inject(SessionService)

  usuario = this.authService.usuarioActual; 
  tiempoRestante = computed(() => this.sessionService.tiempoRestante());;
  cargando = signal(false);

  ngOnInit(): void {
  }


  async cerrarSesion() {
    
    try {
      await this.authService.logout()
      this.sessionService.cancelarContador();
      this.sweetAlertService.crearMensajeExito("", "¡Sesión cerrada con exito!")
      this.router.navigate(['/login'])

    } catch (error: any) {
      this.sweetAlertService.crearMensajeError("", "¡Ocurrio un error al cerrar sesión!")
      console.error("Ocurrio un problema al cerrar sesion")
    }
    
  }

}
