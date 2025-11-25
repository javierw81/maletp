import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './dto/query-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model, PipelineStage, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { jwtPayload } from 'src/auth/jwtPayload';
import { UserService } from 'src/user/users.service';


@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Crear una publicacion con imagen (file)
   * opcional
   * 
   * @async
   * @param {CreatePostDto} createPostDto 
   * @param {string} userId 
   * @param {?Express.Multer.File} [file] 
   * @returns {Promise<Post>} 
   */
  async create(createPostDto: CreatePostDto, userId: string, file?: Express.Multer.File): Promise<Post> {

    let postData = { ...createPostDto }; 

    try {
      if (file) {

      const imagenCargada = await this.cloudinaryService.uploadImagePost(file); 

      postData = {
        ...postData,
        postImgUrl: imagenCargada.secure_url,
        cloudinaryPublicId: imagenCargada.public_id
        };
      }

    } catch (error) {
      throw new InternalServerErrorException('Error al subir la imagen a Cloudinary')
    }
    
    const publicacionCreada = new this.postModel({
      ...postData,
      usuarioId: new Types.ObjectId(userId)
    });

    return publicacionCreada.save();
  }

  
  /**
   * Utilizo mongoose query builder y aggregation pipeline 
   * para la busqueda optimizada de posts
   *
   * @param {PostQueryDto} query 
   * @returns {Promise<Post[]>} 
   */
  async findAll(query: PostQueryDto): Promise<Post[]>{

    try {
    

      const { sortBy, usuarioId, limit, offset, tipoPublicacion, deporte } = query; 

      const match: any = { borradoLogico: false };
      
      if (usuarioId) {
        match.usuarioId = new Types.ObjectId(usuarioId); 
      }

      if (deporte) {
        match.deporte = deporte; 
      }
    
      if (tipoPublicacion) {
        match.tipoPublicacion = tipoPublicacion; 
      }

      let sort: any = {}; 
      let useAgreggation = false; 

      switch (sortBy) {
        case 'likes':
          useAgreggation = true;
          break;
        default: 
          sort = { createdAt: -1}
      }

      if (useAgreggation) {
        return this.findLikesSort(match, offset, limit);
      } 

      return this.findSimpleSort(match, sort, limit, offset);
    } catch (error) {

      throw new InternalServerErrorException('Ocurrió un error al intentar buscar con la base de datos');
    }
    
  }

  
  /**
   * Encontrar por criterio de busqueda general
   * mediante mongoose query
   *
   * @private
   * @param {*} match 
   * @param {string} sort 
   * @param {number} limit 
   * @param {number} offset 
   * @returns {Promise<Post[]>} 
   */
  private findSimpleSort (match: any, sort: string, limit: number, offset: number): Promise<Post[]> {
    return this.postModel
        .find(match)
        .sort(sort)
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('usuarioId', 'nombre perfilImgUrl nombreUsuario')
  }

  
  /**
   * Encontrar por likes mediante 
   * aggregation pipeline
   *
   * @private
   * @param {*} match 
   * @param {number} offset 
   * @param {number} limit 
   * @returns {Promise<Post[]>} 
   */
  private findLikesSort (match: any, offset: number, limit:number): Promise<Post[]> {
    const aggregationPipeLine: PipelineStage[] = [
      { $match: match },
      { $addFields: { contadorMeGusta: { $size: '$meGusta'} } },
      { $sort: { contadorMeGusta: -1 } }, 
      { $skip: Number(offset)},
      { $limit: Number(limit)},
      // simulación de populate del mongoose query builder
      { $lookup: { from: 'users', localField: 'usuarioId', foreignField: '_id', as:'usuario' }},
      {  $unwind: { path: '$usuario' }} , 
      {  $project: { "_id": 1,
        "titulo": 1,
        "mensaje": 1,
        "tipoPublicacion": 1,
        "deporte": 1,
        "postImgUrl": 1,
        "cloudinaryPublicId": 1,
        "meGusta": 1,
        "comentarios": 1,
        "borradoLogico": 1,
        "createdAt": 1,
        "updatedAt": 1,
        usuarioId: {
        _id: '$usuario._id',
        nombre: '$usuario.nombre',
        perfilImgUrl: '$usuario.perfilImgUrl',
        nombreUsuario: '$usuario.nombreUsuario',
        }}}]; 

    return this.postModel.aggregate(aggregationPipeLine).exec();
  }

  
  /**
   * Realizo borrado logico de la publicación
   * unicamente si el usuario es admin o el creador
   *
   * @async
   * @param {string} postId 
   * @param {jwtPayload} user 
   * @returns {Promise<Post>} 
   */
  async softDelete(postId: string, user: jwtPayload): Promise<Post> {
    try {
      const post = await this.postModel.findById(postId).exec();

      if (!post) {
        throw new NotFoundException(`Publicación con id: ${postId} no encontrada.`);
      }
      
      const creador = post.usuarioId.toString() === user.sub; 
      const admin = user.perfil === 'administrador'; 

      if (!creador && !admin ) {
        throw new UnauthorizedException('Solo el creador o un administrados pueden eliminar esta publicacion')
      }

      post.borradoLogico = true;
      return post.save();

    } catch (error) {

      if (error instanceof NotFoundException) throw error;

      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException('Ocurrió un error al intentar borrar la publicación');
    }
    
  }

  
  /**
   * Encontrar post por id
   *
   * @private
   * @param {string} id 
   * @returns {*} 
   */
  findById(id: string) {
    return this.postModel.findById(id).populate('usuarioId', 'nombre perfilImgUrl nombreUsuario').exec();
  }

  
  /**
   * Añadir un like a la publicación
   *
   * @async
   * @param {string} postId 
   * @param {string} userId 
   * @returns {Promise<Post>} 
   */
  async addLike(postId: string, userId: string): Promise<Post> {
    try {
      const resultado = await this.postModel.findByIdAndUpdate(
        postId, 
        { $addToSet: { meGusta: new Types.ObjectId(userId)} }, // solo si el valor no existe ya
        { new: true }
      ).select('meGusta').exec();

      if (!resultado) {
        throw new NotFoundException(`Publicación con id: ${postId} no encontrada.`)
      }

      return resultado;

    } catch ( error ){

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Ocurrió un error al intentar añadir un like a la publicación');

    }
  }

  
  /**
   * Eliminar un like de la publicación
   *
   * @async
   * @param {string} postId 
   * @param {string} userId 
   * @returns {unknown} 
   */
  async removeLike(postId: string, userId: string) {
    try {
      const result = await this.postModel.findByIdAndUpdate(
      postId,
      { $pull: { meGusta: new Types.ObjectId(userId) } }, // solo si el valor no existe ya
      { new: true },
      ).select('meGusta').exec();

      if (!result) {
        throw new NotFoundException(`Publicación con ID "${postId}" no encontrada.`);
      }
      
      return result;
    } catch (error) {

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Ocurrió un error al intentar borrar un like a la publicación');

    }
  }

}
