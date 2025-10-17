import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS first
  app.enableCors({
    origin: true, // Aceita qualquer origem para desenvolvimento
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
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
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  
  console.log(`✅ NestJS Application is running on: http://0.0.0.0:${process.env.PORT ?? 3000}`);
  console.log(`✅ CORS enabled for all origins`);
}
bootstrap();