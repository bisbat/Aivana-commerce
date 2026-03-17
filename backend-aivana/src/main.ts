import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Custom middleware ที่ฉลาดขึ้น
  app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';

    // ถ้าเป็น multipart ให้ skip ทันที
    if (contentType.startsWith('multipart/form-data')) {
      return next();
    }

    // ถ้าเป็น JSON ให้ parse
    if (contentType.includes('application/json')) {
      return json({ limit: '100mb' })(req, res, next);
    }

    // ถ้าเป็น urlencoded
    if (contentType.includes('application/x-www-form-urlencoded')) {
      return urlencoded({ extended: true, limit: '100mb' })(req, res, next);
    }

    // อื่นๆ ให้ผ่านไป
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Aivana Commerce API')
    .setDescription('The API documentation for Aivana Commerce')
    .setVersion('1.0')
    .addTag('aivana-commerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3001}`,
  );
}
bootstrap();
