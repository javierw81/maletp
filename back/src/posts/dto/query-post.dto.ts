import { Type } from 'class-transformer';
import { IsOptional, IsIn, IsString, IsMongoId, Min, IsNumber } from 'class-validator';
import { DEPORTES, TIPOS_PUBLICACION } from './create-post.dto';

export class PostQueryDto {
  
  @Type(() => Number) 
  @IsNumber()
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @IsOptional()
  limit: number = 10;

  @Type(() => Number) 
  @IsNumber()
  @Min(0, { message: 'El offset debe ser 0 o mayor' })
  @IsOptional()
  offset: number = 0; 

  @IsOptional()
  @IsString({ message: 'El parámetro de ordenamiento debe ser una cadena de texto.' })
  @IsIn(['fecha', 'likes', 'deporte', 'tipoPublicacion'], { 
    message: 'El ordenamiento solo puede ser por "fecha", "likes".',
  })
  sortBy: 'fecha' | 'likes' = 'fecha';

  @IsOptional()
  @IsMongoId({ message: 'El ID de usuario para filtrar debe ser un ID de MongoDB válido.' })
  usuarioId: string; 

  @IsOptional()
  @IsString( { message: "El deporte debe ser un string " })
  @IsIn(DEPORTES as unknown as string[], {
    message: `El deporte debe ser uno de los siguientes: ${DEPORTES.join(', ')}.`,
  })
  deporte?: typeof DEPORTES[number];
    
  @IsOptional()
  @IsString( { message: "El tipo de publicación debe ser un string" })
  @IsIn(TIPOS_PUBLICACION as unknown as string[], { 
    message: `El tipo de publicación debe ser uno de los siguientes: ${TIPOS_PUBLICACION.join(', ')}.`,
  })
  tipoPublicacion?: typeof TIPOS_PUBLICACION[number];

}