import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Query, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostQueryDto } from './dto/query-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDecorator } from '../decorators/user/user';
import type { jwtPayload } from 'src/auth/jwtPayload';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  // POST /posts
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imagenPost'))
  create( @Body() createPostDto: CreatePostDto, @UserDecorator('sub') userId: string, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
    ], fileIsRequired: false
    })
  ) file?: Express.Multer.File) {

    return this.postsService.create(createPostDto, userId, file);
  }

  // GET /posts?limit=...&offset=...&sortBy=...&usuarioId=...
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(id); 
  }

   // DELETE /posts/:id
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async softDelete(@Param('id') postId: string,  @UserDecorator() userPayload: jwtPayload ) {

    return this.postsService.softDelete(postId, userPayload);
  }

  // POST /posts/:id/like
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post(':id/like')
  async addLike(@Param('id') postId: string,  @UserDecorator('sub') userId: string) {
  
    return this.postsService.addLike(postId, userId);
  }

  // DELETE /posts/:id/like
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id/like')
  async removeLike(@Param('id') postId: string,  @UserDecorator('sub') userId: string) {
  
    return this.postsService.removeLike(postId, userId);
  }

}
