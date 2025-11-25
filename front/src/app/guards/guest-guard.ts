import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { SweetAlertService } from '../modals/sweet-alert-service';

export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sweetAlertService = inject(SweetAlertService);

  return await authService.verificarAutenticado() ? (sweetAlertService.crearMensajeError("¡Ya inicio sesión!", "Usted no puede ingresar"), router.createUrlTree(['/publicaciones']) ) : true;

};
