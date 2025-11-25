import { Component, computed, inject, Signal, signal } from '@angular/core';
import { PostService } from '../../services/post-service';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { AuthService } from '../../services/auth-service';
import { Comment, Post, QueryParamsComments } from '../../models/post.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesCardComponent } from '../publicaciones-card-component/publicaciones-card-component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RedInvalidInput } from '../../directives/red-invalid-input';

@Component({
  selector: 'app-publicacion-detalle-component',
  imports: [PublicacionesCardComponent, ReactiveFormsModule, DatePipe, RedInvalidInput],
  templateUrl: './publicacion-detalle-component.html',
  styleUrl: './publicacion-detalle-component.css',
})
export class PublicacionDetalleComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);
  private fb = inject(FormBuilder);

  publicacion = signal<Post | null>(null); 
  
  cargando = signal(false); 
  maximoComentarios = signal(false); 

  comentarios = signal<Comment[]>([]);

  comentarioAEditar = signal<Comment | null>(null);
  cargandoComentarios = signal(false);

  private subscription = new Subscription();

  postId = signal<string | null>(null);;

  usuarioActual = this.authService.usuarioActual;
  
  queryParams: QueryParamsComments = {
    limit: 5,
    offset: 0
  };

  public commentForm: FormGroup = this.fb.nonNullable.group({
    mensaje: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(80), this.noSoloEspacios()]], 
  });

  constructor(
    private postService: PostService, 
    private route: ActivatedRoute,
  ){}

  
  /**
   * Validar que no sean solo espacios
   *
   * @private
   * @returns {ValidatorFn} 
   */
  private noSoloEspacios(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value || '';
      return valor.trim().length === 0 ? { soloEspacios: true } : null;
    };
  }
  
  ngOnInit(): void {

    this.subscription = this.route.paramMap.subscribe(params => {
      const postId = params.get('id');

      if (postId) {
        this.postId.set(postId);
        this.obtenerPublicacion(postId);
        this.obtenerComentarios(postId);
      }
    });

  }

  // PUBLICACIONES 
  /** Obtiene una publicacion por su id */
  /**
   * 
   *
   * @param {string} postId 
   */
  obtenerPublicacion(postId: string) {
    
    this.postService.getPost(postId).subscribe({
      next: (data) => {
        this.publicacion.set(data)
      },
      error: (err) => console.error('Error al cargar la publicación', err)
    });

  }

  
  /**
   * Actualiza la publicacion en la vista
   *
   * @param {Post} publicacionActualizada 
   */
  actualizarPublicacion(publicacionActualizada: Post): void {
    this.publicacion.update((pubActual) => {
    if (!pubActual) return null;

    return {
      ...pubActual,
      meGusta: publicacionActualizada.meGusta
    };
  });
  }

  
  /** actualiza la vista de una publicacion borrada */
  borrarPublicacion(): void {
    this.sweetAlertService.crearMensajeExito('Publicacion borrada', 'Publicion borrada con exito')
    this.router.navigate(['/publicaciones']); 
  }

  // COMENTARIOS 

  
  /**
   * Manejo los estados de edicion, iniciar
   *
   * @param {Comment} comentario 
   */
  iniciarEdicion(comentario: Comment): void {

    if (!this.verificarPoderModificarComentario(comentario)) {

      return this.sweetAlertService.crearMensajeError("Used no puede modificar este comentario", "¡Error!");
    }

    this.comentarioAEditar.set(comentario);
    this.commentForm.controls['mensaje'].setValue(comentario.mensaje);
  }
  
  /** Manejo los estados de edicion, cancelar */
  cancelarEdicion(): void {
    this.comentarioAEditar.set(null);
    this.commentForm.reset({ mensaje: '' });
  }

  
  /**
   * Verifica si el usuario puede modificar el comentario
   *
   * @param {Comment} comentario 
   * @returns {boolean} 
   */
  verificarPoderModificarComentario(comentario: Comment): boolean {
    const idCreador = comentario.usuarioId?._id;
    return (idCreador === this.usuarioActual()?._id);
  }

  
  /** Guarda un comentario y llama a modificar o crear segun corresponda */
  guardarComentario(): void {
    const postId = this.postId();
    
    if (!this.commentForm.valid || !postId) {
      this.commentForm.markAllAsTouched();
      this.sweetAlertService.crearMensajeError('Advertencia', 'Por favor, escribe un mensaje válido.');
      return;
    }

    const mensaje = this.commentForm.get('mensaje')!.value; 
    const comentarioEditando = this.comentarioAEditar();

    if (comentarioEditando) {

      if (comentarioEditando.mensaje !== mensaje) {
        this.editarComentario(postId, comentarioEditando._id, mensaje);
      } else {
        this.cancelarEdicion();
      }

    } else {

      this.crearComentario(postId, mensaje);
    }
  }

  
  /**
   * Obtiene los comentarios en detalle de una publicacion
   *
   * @param {string} postId 
   * @param {boolean} [agregar=false] 
   */
  obtenerComentarios(postId: string, agregar: boolean = false) {

    this.cargandoComentarios.set(true);

    this.postService.getComments(this.queryParams, postId).subscribe({
      next: (data) => {

        if (agregar) {
          this.comentarios.update(prev => [...prev, ...data]);
        } else {
          this.comentarios.set(data);
        }
        
        if (data.length < this.queryParams.limit) {
          this.maximoComentarios.set(true);
        }

        this.cargandoComentarios.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargandoComentarios.set(false);
        this.sweetAlertService.crearMensajeError("Ocurrio un error al cargar los comentarios", "¡Error!")
      }
    });
  }

  
  /** Llama a obtener comentarios para cargar más */
  obtenerMasComentarios () {

    if (this.cargandoComentarios() ||this.maximoComentarios()) return;

    this.queryParams.offset += this.queryParams.limit;

    const id = this.postId();
    if (id) {
      this.obtenerComentarios(id, true);
    }

  }

  
  /**
   * Realiza la peticion para crear un comentario
   *
   * @param {string} postId 
   * @param {string} mensaje 
   */
  crearComentario(postId: string, mensaje: string) {
    if (!mensaje.trim()) return;

    this.postService.createComment(postId, { mensaje }).subscribe({
      next: (nuevoComentario) => {
        this.comentarios.update(prev => [nuevoComentario, ...prev]);
        this.commentForm.reset({ mensaje: '' });
        this.sweetAlertService.crearMensajeExito(
          'Comentario añadido',
          'Tu comentario fue publicado.'
        );
        this.obtenerPublicacion(postId);
      },
      error: (err) => {
        this.commentForm.reset({ mensaje: '' });
        this.sweetAlertService.crearMensajeError(
          'Error',
          'No se pudo crear el comentario.'
        );
        console.error(err)
      }
    });
  }

  
  /**
   * Realiza la peticion de editar un comentario
   *
   * @param {string} postId 
   * @param {string} comentarioId 
   * @param {string} mensaje 
   */
  editarComentario(postId: string, comentarioId: string, mensaje: string) {

    this.postService.updateComment(postId, comentarioId, { mensaje }).subscribe({
      next: (comentarioActualizado) => {
        this.comentarios.update(prev =>
          prev.map(c => (c._id === comentarioId ? comentarioActualizado : c))
        );
        this.cancelarEdicion();
        this.sweetAlertService.crearMensajeExito(
          'Comentario actualizado',
          'Cambios guardados.'
        );
      },
      error: (err) => {
        this.sweetAlertService.crearMensajeError(
          'Error',
          'No se pudo actualizar el comentario.'
        );
        console.error(err);
      }
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}
