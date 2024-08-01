import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategorySeederService } from './category-seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const categorySeederService = app.get(CategorySeederService);

  try {
    await categorySeederService.seedCategories();
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
