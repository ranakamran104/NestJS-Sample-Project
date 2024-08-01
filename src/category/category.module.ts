import * as AutoIncrementFactory from 'mongoose-sequence';
import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Connection } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CategorySeederService } from 'src/seeders/category-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: async (connection: Connection) => {
          const schema = CategorySchema;
          const AutoIncrement = AutoIncrementFactory(connection as any);
          schema.plugin(AutoIncrement as any, { inc_field: 'id' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  // imports: [
  //   MongooseModule.forFeature([
  //     { name: Category.name, schema: CategorySchema },
  //   ]),
  // ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtAuthGuard, JwtService, CategorySeederService],
  exports: [CategoryService],
})
export class CategoryModule {}
