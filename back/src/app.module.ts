import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostsModule } from './posts/posts.module';
import { rateLimiterMiddleware } from './middlewares/rate-limiter/rate-limiter.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), 
   UserModule, AuthModule, DatabaseModule, CloudinaryModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    
    consumer
      .apply(rateLimiterMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST})
  }
}
