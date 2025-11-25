import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import {RouterLink } from '@angular/router';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post-service';
import { Post, QueryParams } from '../../models/post.interface';
import { DatePipe } from '@angular/common';
import { PublicacionesCardComponent } from '../../components/publicaciones-card-component/publicaciones-card-component';

@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe, PublicacionesCardComponent, RouterLink],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {

  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);

  cargando = signal(false); 
  private subscription = new Subscription();
  publicaciones= signal<Post[]>([]); 

  usuarioActual = this.authService.usuarioActual;

  edad = signal(0);

  queryParams: QueryParams = {
    limit: 3,
    sortBy: 'fecha',
  };

  constructor(
    private postService: PostService
  ) {}

  ngOnInit() {

    if (this.usuarioActual()) {
      this.establecerEdad();
      this.cargarPublicaciones();
    }
  }

  /** Calcula y establece la edad del usuario */
  establecerEdad () {
    const fechaNacimiento = this.usuarioActual()?.fechaNacimiento;
    const hoy = new Date();

    if (!fechaNacimiento) {
      this.edad.set(0);
      return;
    }

    const fechaNac = new Date(fechaNacimiento);

    if (isNaN(fechaNac.getTime())) {
      this.edad.set(0);
      return ; 
    }
  
    let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNac = fechaNac.getMonth();

    if (mesActual < mesNac || (mesActual === mesNac && hoy.getDate() < fechaNac.getDate())) {
      this.edad.set(edadCalculada--);
    }

    this.edad.set(edadCalculada--);
  }
  
  /** Carga las publicaciones del usuario */
  cargarPublicaciones(): void {

    this.queryParams = {
      ...this.queryParams,
      usuarioId: this.usuarioActual()?._id,
      offset: 0, 
    };

    this.cargando.set(true); 
    this.subscription.add(this.postService.getPosts(this.queryParams).subscribe({
      next: (response) => {
        this.publicaciones.set(response); 
        this.cargando.set(false);
      },
      error: (error) => {
        this.sweetAlertService.crearMensajeError('Error al cargar tus publicaciones', 'Oh no!' );
        console.error(error.error.message); 
        this.cargando.set(false);
      }
    }))
  }

  /**
   * Maneja los likes desde la vista 
   *
   * @param {Post} postActualizada 
   */
  actualizarPublicacion(postActualizada: Post) {
    this.publicaciones.update(posts => 
      posts.map(p => {
        if (p._id === postActualizada._id) {
            return {
                ...p, 
                meGusta: postActualizada.meGusta 
            };
        }
        return p;
    }));
  }

  /**
   * Maneja la eliminacion en la vista
   *
   * @param {string} postId 
   */
  borrarPublicacion(postId: string): void {
    this.publicaciones.update(pubs => pubs.filter(p => p._id !== postId))
  }
 
}

