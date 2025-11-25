import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PostService } from '../../services/post-service';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { QueryParams, DEPORTES, TIPOS_PUBLICACION, Post} from '../../models/post.interface';
import { AuthService } from '../../services/auth-service';
import { PublicacionesCardComponent } from '../../components/publicaciones-card-component/publicaciones-card-component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-publicaciones',
  imports: [PublicacionesCardComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements OnInit, OnDestroy{
  

  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);

  public readonly DEPORTES = DEPORTES;
  public readonly TIPOS_PUBLICACION = TIPOS_PUBLICACION;

  publicaciones= signal<Post[]>([]); 
  cargando = signal(false); 
  private subscription = new Subscription();
  usuarioActual = this.authService.usuarioActual;

  sugerencias = signal<any[]>([]);
  private fb = inject(FormBuilder);

  queryParams: QueryParams = {
    limit: 10,
    offset: 0,
    sortBy: 'fecha',
  };

  constructor(private postService: PostService, 
    private userService: UserService){
  }

  formBusqueda = this.fb.nonNullable.group({
    nombreUsuario: ['']
  });

  ngOnInit(): void {
    if (this.usuarioActual()) {
      this.cargarPublicaciones();
    }
  }


  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  /** Carga las publicaciones */
  cargarPublicaciones(): void {
    this.cargando.set(true); 
    this.subscription.add(this.postService.getPosts(this.queryParams).subscribe({
      next: (response) => {
        this.publicaciones.set(response); 
        this.cargando.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.sweetAlertService.crearMensajeError('Error al cargar los post', '¡Disculpe!' );
        console.error(error.error.message); 
        this.cargando.set(false);
      }
    }))
  }

  
  /**
   * Maneja el ordenamiento de las publicaciones
   *
   * @param {string} newSortBy 
   */
  cambiarOrdenamiento(key: keyof QueryParams, value: any): void {
    this.sugerencias.set([]);
    const finalValue = (value === '' || value === 'undefined' ) ? undefined : value;

    this.queryParams = {
      ...this.queryParams,
      [key]: finalValue,
      offset: 0, 
    };
    this.cargarPublicaciones();
    this.formBusqueda.get('nombreUsuario')?.setValue('');
  }

  
  /** Maneja la paginación de la vista */
  cambiarPagina(): void {

    if (this.publicaciones().length < 10) {
      this.sweetAlertService.crearMensajeError("No hay más publicaciones", "¡Que lastima!");
      return;
    }
    const limit = this.queryParams.limit ?? 10; 
    const offset = this.queryParams.offset ?? 0;

    this.queryParams.offset = offset + limit;
    this.cargarPublicaciones();
  }

  
  /** Lleva a la pagina anterior */
  paginaAnterior(): void {
    const limit = this.queryParams.limit ?? 10;
    const offset = this.queryParams.offset ?? 0;

    if (offset > 0) {
      this.queryParams.offset = Math.max(0, offset - limit); 
      this.cargarPublicaciones();
    } else {
      this.sweetAlertService.crearMensajeError("No se puede ir para atrás", "¡Que lastima!");
      return;
    }
  }
  
  /**
   * Maneja la eliminacion en la vista
   *
   * @param {string} postId 
   */
  borrarPublicacion(postId: string): void {
    this.publicaciones.update(pubs => pubs.filter(p => p._id !== postId))

    this.cargarPublicaciones();
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
        })
    );

  }

  /** Busca el usuario y muestra sugerencias */
  buscarUsuario () {
    const valor = this.formBusqueda.get('nombreUsuario')?.value?.trim();
    if (!valor) {
      this.sugerencias.set([]);
      return;
    }

    this.userService.buscarUsuarioPorNombre(valor).subscribe({
      next: (res) => {
        this.sugerencias.set(res) 

        console.log(res)

        if (res.length === 0) {
          this.sweetAlertService.crearMensajeError("No se encontraron usuarios con ese nombre", "¡Oh no!");
        }
      },
      error: (err) => console.error(err)
    });
  }

}

