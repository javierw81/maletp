import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDecorator } from 'src/decorators/user/user';
import { CommentsQueryDto } from './dto/query-comments.dto';

@Controller('posts/:postId/comentarios')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post()
  create(@Param('postId') postId: string, @Body() createCommentDto: CreateCommentDto, @UserDecorator('sub') userId: string) {
    return this.commentsService.create(postId, createCommentDto, userId);
  }
  
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Param('postId') postId: string, @Query() query: CommentsQueryDto) {
    return this.commentsService.findAll(postId, query);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':comentarioId')
  update( @Param('postId') postId: string, @Param('comentarioId') comentarioId: string,
    @Body() dto: UpdateCommentDto, @UserDecorator('sub') userId: string) {
    return this.commentsService.update(postId, comentarioId, dto, userId);
  }
  
}
