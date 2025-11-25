import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export const TIPOS_PUBLICACION = ['consulta', 'partido', 'logro'] as const;
export const DEPORTES = [
  'Fútbol', 'Básquet', 'Vóley', 'Tenis', 'Running', 'Ciclismo', 
  'Natación', 'Baseball', 'Béisbol', 'Bádminton', 'Pádel', 
  'Rugby', 'Judo', 'Hockey', 'Otro'
] as const;

export class CreatePostDto {
    
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @MaxLength(50, { message: 'El título no puede exceder los 20 caracteres.' })
  titulo: string;

  @IsString({ message: 'El mensaje debe ser una cadena de texto.' })
  @MaxLength(150, { message: 'El mensaje no puede exceder los 150 caracteres.' })
  mensaje: string; 

  @IsString({ message: 'El tipo de publicación debe ser una cadena de texto.' })
  @IsIn(TIPOS_PUBLICACION as unknown as string[], { 
    message: `El tipo de publicación debe ser uno de los siguientes: ${TIPOS_PUBLICACION.join(', ')}.`,
  })
  tipoPublicacion: typeof TIPOS_PUBLICACION[number];

  @IsString({ message: 'El campo deporte debe ser una cadena de texto.' })
  @IsIn(DEPORTES as unknown as string[], {
    message: `El deporte debe ser uno de los siguientes: ${DEPORTES.join(', ')}.`,
  })
  deporte: typeof DEPORTES[number];

  @IsOptional()
  @IsUrl({}, { message: 'postImgUrl debe ser una URL válida si se proporciona.' })
  postImgUrl?: string;

  @IsOptional()
  @IsString({ message: 'El ID público de Cloudinary debe ser una cadena de texto.' })
  cloudinaryPublicId?: string;
}
