import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IdValidationGuard } from './middlewares/idValidation.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PUX - CMS')
    .setDescription('The cms API description')
    .setVersion('1.0')
    .addTag('cms')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false, //! Null veya undefined olan özellikleri atlamaz
    }),
  );
  app.enableCors();
  app.useGlobalGuards(new IdValidationGuard());
  await app.listen(3000);
}
bootstrap();
