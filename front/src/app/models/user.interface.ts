export interface User {
    _id?: string;
    nombre: string,
    apellido: string,
    correo:string,
    nombreUsuario: string,
    fechaNacimiento: Date,
    descripcion:string,
    perfil: string,
    perfilImgUrl: string,
    cloudinaryPublicId?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export interface CreateUserDto {
    _id?: string;
    nombre: string,
    apellido: string,
    correo:string,
    nombreUsuario: string,
    password: string;
    fechaNacimiento: Date,
    descripcion:string,
    perfilImg: File,
    createdAt?: Date,
    updatedAt?: Date
}

export interface LoginDto {
  identificador: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: User;
}