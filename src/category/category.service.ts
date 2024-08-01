import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll() {
    return this.categoryModel.find().exec();
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findOne({ id }).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoryModel
      .findOneAndUpdate({ id }, updateCategoryDto, { new: true })
      .exec();
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return existingCategory;
  }

  async remove(id: number) {
    const result = await this.categoryModel.findOneAndDelete({ id }).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
