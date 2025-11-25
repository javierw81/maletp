import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, firstValueFrom, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, LoginDto, User } from '../models/user.interface';
import { environment } from '../../environments/environment';

const HTTP_OPTIONS = { withCredentials: true };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  usuarioActual = signal<User | null>(null); 

  constructor(private http: HttpClient) {
  }  

  
  // POST /auth/login 
  /**
   * Realiza el logueo de un usuario
   *
   * @param {LoginDto} credentials 
   * @returns {Observable<AuthResponse>} 
   */
  async login(credentials: LoginDto): Promise<void> {

    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials, HTTP_OPTIONS)
    );

    this.usuarioActual.set(res.usuario);
  }

  // POST auth/registro
  /**
   * Realiza el registro mediante una peticion al backend
   *
   * @param {FormData} userData 
   * @returns {Promise<User>} 
   */
  async register(userData: FormData): Promise<User> {
    return await firstValueFrom(
      this.http.post<User>(`${this.apiUrl}/auth/registro`, userData, { withCredentials: true })
    );
  }

  // POST /auth/logout 
  /**
   * Cierra la sesión del usuario 
   * mediante un post al backend
   *
   * @returns {Observable<any>} 
   */
  async logout(): Promise<any> {

    await firstValueFrom(
      this.http.post(`${this.apiUrl}/auth/logout`, {}, HTTP_OPTIONS)
        .pipe(
          catchError(() => of(null))
        )
    );

    this.usuarioActual.set(null);
  }

  /**
   * actualiza el estado del usuario actual
   *
   * @private
   */
  async cargarPerfilUsuario(): Promise<User | null> {
    
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/autorizar`, {}, HTTP_OPTIONS)
      .pipe(catchError(() => of(null)))
    );

    if (!res?.usuario) {
      this.usuarioActual.set(null);
      return null;
    }

    this.usuarioActual.set(res.usuario);

    return res.usuario;
  };

  /**
   * Permite obtener el usuario actual con Promesas para mejor manejo
   * de los guards
   *
   * @async
   * @returns {Promise<boolean>} 
   */
  async verificarAutenticado(): Promise<boolean> {

    if (this.usuarioActual()) return true;

    const cargado = await this.cargarPerfilUsuario();
    return !!cargado;
  }

  /**
   * Obtiene el usuario actual
   *
   * @returns {(User | null)} 
   */
  getUsuarioActual(): User | null {
    return this.usuarioActual();
  }

  borrarUsuarioActual(): void {
    this.usuarioActual.set(null);
  }

  async refrescar(): Promise<any> {
    console.log("refresco")
    const res = await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/auth/refrescar`, {}, HTTP_OPTIONS)
    );

    return res.message;
  }


  cerrarSesionExpirada() {
    const estabaLogueado = !!this.usuarioActual();
    if (estabaLogueado) {
      this.usuarioActual.set(null);
    }
    return estabaLogueado;
  }
}
