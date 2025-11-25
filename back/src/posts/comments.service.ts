import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario, Post, PostDocument } from './entities/post.entity';
import { Model, Types } from 'mongoose';
import { CommentsQueryDto } from './dto/query-comments.dto';

@Injectable()
export class CommentsService {
  
   constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {}

  
  /**
   * Crear un comentario
   *
   * @async
   * @param {string} postId 
   * @param {CreateCommentDto} createCommentDto 
   * @param {string} usuarioId 
   * @returns {Promise<null| Comentario>} 
   */
  async create(postId: string, createCommentDto: CreateCommentDto, usuarioId: string): Promise<any> {
    
    try {

      const post = await this.postModel.findById(postId);

      if (!post) throw new NotFoundException('Publicación no encontrada');

      const nuevoComentario = {
        _id: new Types.ObjectId(),
        ...createCommentDto,
        usuarioId: new Types.ObjectId(usuarioId),
        createdAt: new Date()
      };

      post.comentarios.push(nuevoComentario);

      await post.save();

      const comentarioPopulado = await this.postModel.populate(nuevoComentario, {
        path: 'usuarioId',
        select: 'nombre perfilImgUrl nombreUsuario'
      });

      return comentarioPopulado;

    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      
      throw new InternalServerErrorException('Ocurrió un error al intentar añadir un comentario a la publicación');
    }
    
  }

  
  /**
   * Encontrar comentarios filtrados
   *
   * @async
   * @param {string} postId 
   * @param {CommentsQueryDto} query 
   * @returns {Promise<Comentario[]>} 
   */
  async findAll(postId: string, query: CommentsQueryDto): Promise<Comentario[]>{
     try {
      
      const post = await this.postModel
      .findById(postId)
      .populate('comentarios.usuarioId', 'nombre perfilImgUrl nombreUsuario')
      .exec();

      if (!post)
      throw new NotFoundException('Publicación no encontrada');

      const { limit, offset } = query;

      return post.comentarios
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(Number(offset), Number(offset) + Number(limit));

    } catch (error) {

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Ocurrió un error al intentar buscar con la base de datos');
    }
  }

  
  /**
   * Modificar mensaje de  comentarios 
   *
   * @async
   * @param {string} postId 
   * @param {string} comentarioId 
   * @param {UpdateCommentDto} updateCommentDto 
   * @param {string} usuarioId 
   * @returns {Promise <any>} comentario modificado con datos principales del usuario
   */
  async update( postId: string, comentarioId: string, updateCommentDto: UpdateCommentDto, usuarioId: string): Promise <any> {
    try {
      const post = await this.postModel.findById(postId);

      if (!post)
        throw new NotFoundException('Publicación no encontrada');

      const comentario = post.comentarios
      .find((c: any) => c._id.toString() === comentarioId) as Comentario;

      if (!comentario) throw new NotFoundException('Comentario no encontrado');

      if (comentario.usuarioId.toString() !== usuarioId) {
        throw new UnauthorizedException('Solo podés modificar tus propios comentarios.');
      }
      if (updateCommentDto.mensaje === undefined) {
        throw new BadRequestException('El mensaje es obligatorio.');
      }
      comentario.mensaje = updateCommentDto.mensaje;
      comentario.modificado = true;

      await post.save();

      const comentarioPopulado = await this.postModel.populate(comentario, {
        path: 'usuarioId',
        select: 'nombre perfilImgUrl nombreUsuario'
      });

      return comentarioPopulado;
      
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error al actualizar el comentario');
    }
  }

}
