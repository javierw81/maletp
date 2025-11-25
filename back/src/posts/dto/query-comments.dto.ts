import { Type } from 'class-transformer';
import { IsOptional, Min, IsNumber } from 'class-validator';

export class CommentsQueryDto {
  
  @Type(() => Number) 
  @IsNumber()
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @IsOptional()
  limit: number = 5;

  @Type(() => Number) 
  @IsNumber()
  @Min(0, { message: 'El offset debe ser 0 o mayor' })
  @IsOptional()
  offset: number = 0; 

}