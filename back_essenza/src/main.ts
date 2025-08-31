import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS first
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });

  // Configure global pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true 
  }));

  // Start listening
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`✅ NestJS Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`✅ CORS enabled for: http://localhost:4200`);
}
bootstrap();