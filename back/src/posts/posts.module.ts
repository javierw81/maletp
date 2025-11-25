import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/users.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [MongooseModule.forFeature([ 
      {name: Post.name, schema: PostSchema},
      {name: User.name, schema: UserSchema}
    ]), CloudinaryModule, AuthModule],
  controllers: [PostsController, CommentsController],
  providers: [PostsService, UserService, CommentsService]
})
export class PostsModule {}
