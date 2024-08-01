import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mini Blog API')
    .setDescription(
      'API endpoints for a mini blog services documented on swagger',
    )
    .setVersion('1.0')
    // .addTag('cats')
    .addSecurity('api_key', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // app.listen(port, () => {
  //   console.log(`App listening at http://localhost:${port}`);
  // });
}
bootstrap();
