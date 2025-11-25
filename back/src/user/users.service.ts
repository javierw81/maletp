import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {

  constructor(
  @InjectModel(User.name) private userModel: Model<User>,
  private cloudinaryService: CloudinaryService) {}

  
  /**
   * Guardar un nuevo usuario en la base de datos
   *
   * @async
   * @param {Partial<CreateUserDto & { passwordHash: string, perfilImgUrl: string, cloudinaryPublicId: string}>} createUserDto 
   * @returns {Promise<UserDocument>} 
   */
  async create(createUserDto: Partial<CreateUserDto & { passwordHash: string, perfilImgUrl: string, cloudinaryPublicId: string}>): Promise<UserDocument> {

    const usuario = new this.userModel(createUserDto);


    const guardarUsuario = await usuario.save();

    return guardarUsuario;
  }

  
  /**
   * Encontrar un usuario por su Email
   * con contraseña hasheada
   * 
   * @param {string} correo 
   * @returns {Promise<UserDocument | null>} 
   */
  findByEmail(correo: string): Promise<UserDocument | null>  {
    return this.userModel.findOne({ correo: correo.toLocaleLowerCase().trim() }).select('+passwordHash').exec();
  }

  
  /**
   * Encontrar un usuario por su nombre 
   * de usuario con contraseña hasheada
   *
   * @param {string} nombreUsuario 
   * @returns {Promise<UserDocument | null>} 
   */
  findByUsername(nombreUsuario: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ nombreUsuario: nombreUsuario.trim()}).select('+passwordHash').exec();
  }

  async searchByUsername(nombreUsuario: string): Promise<UserDocument[]> {
  return this.userModel
    .find({
      nombreUsuario: { $regex: nombreUsuario.trim(), $options: 'i' } 
    }).limit(5)
    .select('nombreUsuario _id') 
    .exec();
}


  /**
   * Encontrar un usuario por su id
   *
   * @param {string} id 
   * @returns {Promise<UserDocument | null>} 
   */
  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
  
  
  /**
   * Encuentra a todos los usuarios logueados 
   *
   * @returns {Promise<UserDocument[] | null>} 
   */
  findAll() : Promise<UserDocument[] | null> { 
    return this.userModel.find().exec();
  }

  
  /**
   * Sube la imagen de perfil 
   * a cloudinary llamando a 
   * cloudinaryService
   *
   * @async
   * @param {Express.Multer.File} file 
   * @returns {Promise<{ secure_url: string, public_id: string }>} 
   */
  async uploadUserImageToCloudinary( file: Express.Multer.File): Promise<{ secure_url: string, public_id: string }> {

    const imagenCargada = await this.cloudinaryService.uploadImage(file); 

    return { secure_url: imagenCargada.secure_url, public_id: imagenCargada.public_id};

  }
  
  remove(id: string) {

    return `This action removes a #${id} user`;
  }

  /*
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  
  */
}
