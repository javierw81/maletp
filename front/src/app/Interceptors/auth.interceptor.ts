import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { SweetAlertService } from "../modals/sweet-alert-service";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth-service";


/**
 * Posible interceptor para el sprint 3
 *
 * @param {*} req 
 * @param {*} next 
 * @returns {*} 
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router); 
    const request = req.clone({ withCredentials: true });
    const authService = inject(AuthService); 
    const sweetAlertService = inject(SweetAlertService)

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                const estabaLogueado = authService.cerrarSesionExpirada();

                if (estabaLogueado) {
                    sweetAlertService.crearMensajeError("Ya expiró tu sesión.", "Vuelve a iniciar sesión para ingresar.")
                    router.navigate(['/login']);
                }
            }

            return throwError(() => error)
        }
    )
    )
}