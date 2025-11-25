import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { SweetAlertService } from '../modals/sweet-alert-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sweetAlertService = inject(SweetAlertService);


  //console.log("llamando a autorizar desde el guard");

  return  await authService.verificarAutenticado() ? true : ( sweetAlertService.crearMensajeError("No puede ingresar sin iniciar sesión", "¡Oh no!"), (router.createUrlTree(['/login']))); 

};
