import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,           // ลบ fields ที่ไม่ได้ระบุใน DTO ทิ้ง
      forbidNonWhitelisted: true, // ถ้าส่ง fields แปลกๆ มา ให้ throw error
      transform: true,           // แปลง types ให้ตรงกับ DTO
    }
  )); // Enable validation globally
  // app.setGlobalPrefix('api'); // Set global prefix to 'api'
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
