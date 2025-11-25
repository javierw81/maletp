import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const FrontUrls = process.env.FRONTEND_URLS;
  
  const permitirCors = FrontUrls ? FrontUrls.split(',').map(s => s.trim()) : [];

  app.use(cookieParser());

  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      transform: true,
    })
  )

  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();
