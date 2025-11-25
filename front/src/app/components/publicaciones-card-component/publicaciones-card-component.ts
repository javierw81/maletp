import { Component, input, Input, Output, signal } from '@angular/core';
import { Post } from '../../models/post.interface';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post-service';
import { SweetAlertService } from '../../modals/sweet-alert-service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { User } from '../../models/user.interface';
import { Router } from "@angular/router";
import { TruncateTextPipe } from '../../pipes/truncate-text-pipe';
import { TypeTagDirective } from '../../directives/type-tag-directive';

@Component({
  selector: 'app-publicaciones-card-component',
  imports: [DatePipe, TitleCasePipe, TruncateTextPipe, TypeTagDirective],
  templateUrl: './publicaciones-card-component.html',
  styleUrl: './publicaciones-card-component.css',
})
export class PublicacionesCardComponent {
  publicacion = input.required<Post>();
  usuarioActual = input.required<User>(); 
  acortarContenido = input.required<boolean>(); 

  @Output() publicacionBorrada : EventEmitter<any> = new EventEmitter();; 
  @Output() publicacionActualizada = new EventEmitter<Post>();


  private subscripcion = new Subscription(); 

  publicacionVistaActualizada = signal<Post | null>(null);

  constructor(
    private postService: PostService, 
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {}

  verificarMeGusta() {

    const idUsuario = this.usuarioActual()?._id;

    if (idUsuario) {
      return this.publicacion().meGusta.includes(idUsuario);
    }

    return false;
  }

  verificarPoderEliminarPublicacion() {

    const idCreador = this.publicacion().usuarioId?._id;
    return (idCreador === this.usuarioActual()?._id && this.usuarioActual()?.perfil);
  }

  agregarOEliminarLike() {
    const metodo: 'POST' | 'DELETE' = this.verificarMeGusta() ? 'DELETE' : 'POST'; 

    this.subscripcion.add(this.postService.addAndDeleteLike(this.publicacion()._id, metodo).subscribe({
      next: (publicacionModificada: Post) => {
         this.publicacionActualizada.emit(publicacionModificada); 
      },
      error: (error) => {
        this.sweetAlertService.crearMensajeError("No se pudo actualizar el me gusta", "¡ERROR!"); 
        console.error(error.error.message);
      }
    }))
  }

  async preguntarBorrarPublicacion (): Promise<void> {
    const respuesta = await this.sweetAlertService.crearAlertaConfirmacion(
      '¿Estás seguro?',
      'Esta acción eliminará la publicación.',
    )

    return respuesta ? this.borrarPublicacion() : await this.sweetAlertService.crearMensajeExito("No se borro la publicacion", "¡Tranquilo!");
  }

  async borrarPublicacion (): Promise<void> {
    this.subscripcion.add(this.postService.deletePost(this.publicacion()._id).subscribe({
      next: () => {
        this.sweetAlertService.crearMensajeExito('Publicación eliminada.', '¡Éxito!');
        this.publicacionBorrada.emit(this.publicacion()._id);
      },
      error: (error) => {
        this.sweetAlertService.crearMensajeError('No tienes permiso para eliminar este post.', 'Error de Eliminación');
        console.error(error.error.message);
      }
    }));

  }

  verDetalle(id: string) {
    this.router.navigate(['/publicacionDetalle/', id]);

  }

  ngOnDestroy():void {
    this.subscripcion.unsubscribe();
  }

}
