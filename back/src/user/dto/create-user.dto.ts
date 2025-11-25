import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: 'El nombre del usuario no puede estar vacío.' })
    @IsString({ message: 'El nombre del usuario debe ser una cadena de texto.' })
    nombre: string;

    @IsNotEmpty({ message: 'El apellido del usuario no puede estar vacío.' })
    @IsString({ message: 'El apellido del usuario debe ser una cadena de texto.' })
    apellido: string;

    @IsEmail( {}, { message: 'El correo debe tener su debido formato.'})
    @IsNotEmpty({ message: 'El correo del usuario no puede estar vacío.' })
    @IsString({ message: 'El correo del usuario debe ser una cadena de texto.' })
    correo: string;

    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío.' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
    @Matches(/^[^@]+$/, { message: 'El nombre de usuario no puede contener el carácter @' })
    nombreUsuario: string;

    @IsNotEmpty({ message: 'La contaseña del usuario no puede estar vacío.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.'})
    password: string;

    @IsNotEmpty({ message: 'La fecha de nacimiento del usuario no puede estar vacía.' })
    @Type(() => Date) 
    @IsDate({ message: 'La fecha de nacimiento del usuario debe ser una fecha valida.' })
    fechaNacimiento: Date;

    @IsNotEmpty({ message: 'La descripción del usuario no puede estar vacía.' })
    @IsString({ message: 'La descripción del usuario debe ser una cadena de texto.' })
    descripcion?: string;

}
