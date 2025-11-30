import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

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

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3001}`,
  );
}
bootstrap();
