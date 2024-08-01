import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';

@Injectable()
export class CategorySeederService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    // console.log('Seeding categories...');
    // await this.seedCategories();
  }

  public async seedCategories() {
    const categories = [
      { name: 'Electronics', description: 'Devices and gadgets' },
      { name: 'Books', description: 'Fiction and non-fiction' },
      { name: 'Clothing', description: 'Apparel and accessories' },
    ];

    for (const category of categories) {
      const exists = await this.categoryModel
        .findOne({ name: category.name })
        .exec();
      if (!exists) {
        await this.categoryModel.create(category);
        console.log('Category added:', category.name);
      } else console.log('Category already exist');
    }
  }
}
