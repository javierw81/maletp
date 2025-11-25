import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { loginDTO } from './dto/login.dto';
import { UserService } from 'src/user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';


@Injectable()
export class AuthService { 

    constructor( 
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    
    /**
     * Busca al usuario por email o nombre de usuario, verifica la contraseña y
     * genera un JSON Web Token (JWT) que se establece como una cookie HttpOnly.
     *
     * @async
     * @param {loginDTO} credenciales 
     * @param {Response} res 
     * @returns {Promise<{ usuario: null | any }>} 
     */
    async login(credenciales: loginDTO, res: Response): Promise<{ usuario: null | any }> {

        try {

            const { identificador, password } = credenciales; 

            const esCorreo =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);

            const usuario = esCorreo 
            ? await this.userService.findByEmail(identificador) 
            : await this.userService.findByUsername(identificador)  


            if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
                throw new UnauthorizedException('Credenciales otorgadas inválidas');
            }

            const payload = { sub: usuario._id.toString(), perfil: usuario.perfil};

            const { passwordHash, ...userObject } = usuario.toObject();

            const access_token = await this.jwtService.signAsync(payload);

            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge:  60 * 1000 * 15,
                path: '/'
            })

            return {usuario: userObject}
        
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            console.error('Error en login:', error);
            throw new InternalServerErrorException('Ocurrió un error al intentar iniciar sesión.');
        }

    }

    
    /**
     * 
     * Realiza una validación de unicidad, hashea la contraseña, sube la imagen de perfil
     * y persiste el nuevo registro en la base de datos.
     * 
     * @async
     * @param {RegisterDto} nuevoUsuario 
     * @param {Express.Multer.File} file 
     * @returns {Promise<null | any>} 
     */
    async register(nuevoUsuario: RegisterDto, file: Express.Multer.File): Promise<null | any> {
       
        try { 
            
            if (await this.userService.findByEmail(nuevoUsuario.correo) ) {
                throw new ConflictException('El correo ya está registrado');
            }

            if (await this.userService.findByUsername(nuevoUsuario.nombreUsuario)) {
                throw new ConflictException('El nombre de usuario ya está registrado');
            }

            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(nuevoUsuario.password, saltRounds);

            const { secure_url, public_id } = await this.userService.uploadUserImageToCloudinary(file); 

            const usuarioCreado = await this.userService.create({...nuevoUsuario, passwordHash: hashedPassword, perfilImgUrl: secure_url, cloudinaryPublicId: public_id});

            const { passwordHash, ...userObject } = usuarioCreado.toObject();
            
            return userObject;

        } catch (error) {

            if ( error instanceof ConflictException) {
                throw error; 
            }

            if (error.code === 11000) {
                throw new BadRequestException('El nombre de usuario o correo ya existe (error al guardar).');
            }

            console.error("Error al guardar usuario:", error);
   
            throw new InternalServerErrorException('Error al registrar el usuario.');
        }
    }

    
    /**
     * Autorizar el token
     *
     * @async
     * @param {Request} req 
     * @returns {unknown} 
     */
    async autorizar(req: Request): Promise<null | any> {
        const token = req.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('No se posee un token.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);

            const usuario = await this.userService.findById(payload.sub);

            if (!usuario) throw new UnauthorizedException('No se encontro al usuario dentro del token.');

            const { passwordHash, ...userObject } = usuario.toObject();

            return {usuario: userObject};

        } catch (error) {
            throw new UnauthorizedException('Token inválido o vencido');
        }
    }

    
    /**
     * Refrescar el token
     *
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {unknown} 
     */
    async refrescar(req: Request, res: Response) : Promise<null | any> {
        const token = req.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('No se posee el token.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);

            const nuevoPayload = { sub: payload.sub, perfil: payload.perfil }

            const nuevoToken = await this.jwtService.signAsync(nuevoPayload);

            res.cookie('access_token', nuevoToken, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                path: '/'
            });

            return { message: 'Sesión extendida correctamente' };

        } catch (error) {
            throw new UnauthorizedException('El token ya venció, debe iniciar sesión de nuevo');
        }
    }

    /**
     * Elimina la cookie de autenticación del cliente forzando su expiración.
     *
     * @param {Response} res 
     * @returns {{ message: string }} 
     */
    logout(res: Response): { message: string } {
    
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 0,
            path: '/'
        });

        return { message: 'Sesión cerrada correctamente.' };
    }
}
