import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-pantalla-carga',
  imports: [],
  templateUrl: './pantalla-carga.html',
  styleUrl: './pantalla-carga.css',
})
export class PantallaCarga {

  cargando = signal<boolean>(false);

  private timeout: any;

  private subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router, private sessionService: SessionService ) {}

  
  /**
   * Al inicializar el componente decide a donde ir
   *
   * @async
   * @returns {*} 
   */
  async ngOnInit() {

    this.cargando.set(true);

    try {
      const usuario = await this.authService.cargarPerfilUsuario();


      if (usuario) {

        this.timeout = setTimeout(() => {
        this.sessionService.iniciarContador();
        this.router.navigate(['/publicaciones']);
        }, 1500);
      } else {
        this.timeout = setTimeout(() => {
        this.router.navigate(['/login']);
        }, 1500);
      }
    
    } catch (err: any) {
  
      this.router.navigate(['/login']);

    } finally {
      this.cargando.set(false);
    }

  }

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.subscription.unsubscribe();
  }
}
