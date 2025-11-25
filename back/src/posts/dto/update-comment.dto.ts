import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from '../../posts/dto/create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
