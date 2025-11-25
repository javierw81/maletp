import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePostDto  {
    @IsString({ message: 'El comentario debe ser una cadena de texto.' })
    @MaxLength(80, { message: 'El comentario no puede exceder los 80 caracteres.' })
    @MinLength(1, { message: 'El comentario debe tener al menos 1 caracter.' })
    mensaje: string;
    }
