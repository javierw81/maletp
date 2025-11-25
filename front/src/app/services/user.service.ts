import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private urlBase = environment.apiUrl;
  private usersUrl = `${this.urlBase}/users`;

  constructor(private http: HttpClient) {}

  buscarUsuarioPorNombre(nombre: string): Observable<any[]> {
    if (!nombre.trim()) return new Observable((observer) => observer.next([]));
    return this.http.get<any[]>(`${this.usersUrl}`, { params: { nombreUsuario: nombre }, withCredentials: true});
  }

}
