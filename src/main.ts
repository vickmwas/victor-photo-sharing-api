import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Incourage - Photo Sharing API')
    .setDescription('REST API for the Photo Sharing App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Ensure the ./docs directory exists
  const docsDir = path.resolve(__dirname, '../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }

  // Save the Swagger document as swagger.yaml
  fs.writeFileSync(
    path.join(docsDir, 'swagger.yaml'),
    JSON.stringify(document, null, 2),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
